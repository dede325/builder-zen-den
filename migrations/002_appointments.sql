-- =====================================================
-- Migração 002: Sistema de Agendamentos
-- Sistema da Clínica Bem Cuidar
-- Desenvolvido por: Kaijhe Morose
-- Data: 2025-01-15
-- =====================================================

-- =====================================================
-- TABELA: Horários dos Médicos
-- =====================================================
CREATE TABLE doctor_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 6=Sábado
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start_time TIME,
    break_end_time TIME,
    consultation_duration INTEGER DEFAULT 30, -- Em minutos
    max_patients_per_slot INTEGER DEFAULT 1,
    active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_time_range CHECK (start_time < end_time),
    CONSTRAINT valid_break_time CHECK (
        (break_start_time IS NULL AND break_end_time IS NULL) OR
        (break_start_time IS NOT NULL AND break_end_time IS NOT NULL AND 
         break_start_time > start_time AND break_end_time < end_time AND
         break_start_time < break_end_time)
    )
);

-- Índices
CREATE INDEX idx_doctor_schedules_doctor_id ON doctor_schedules(doctor_id);
CREATE INDEX idx_doctor_schedules_day ON doctor_schedules(day_of_week);
CREATE INDEX idx_doctor_schedules_active ON doctor_schedules(active);

-- =====================================================
-- TABELA: Feriados e Dias de Folga
-- =====================================================
CREATE TABLE schedule_exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    exception_type VARCHAR(20) DEFAULT 'holiday' CHECK (exception_type IN ('holiday', 'vacation', 'sick_leave', 'training', 'other')),
    description TEXT,
    all_day BOOLEAN DEFAULT true,
    start_time TIME,
    end_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_exception_time CHECK (
        all_day = true OR (start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
    )
);

-- Índices
CREATE INDEX idx_schedule_exceptions_doctor_id ON schedule_exceptions(doctor_id);
CREATE INDEX idx_schedule_exceptions_date ON schedule_exceptions(exception_date);
CREATE INDEX idx_schedule_exceptions_type ON schedule_exceptions(exception_type);

-- =====================================================
-- TABELA: Agendamentos
-- =====================================================
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES specialties(id),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    appointment_type VARCHAR(30) DEFAULT 'consultation' CHECK (appointment_type IN ('consultation', 'follow_up', 'emergency', 'procedure', 'exam')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled')),
    reason_for_visit TEXT,
    symptoms TEXT,
    notes TEXT,
    patient_notes TEXT, -- Notas do paciente
    doctor_notes TEXT,  -- Notas do médico
    prescription TEXT,
    next_appointment_suggested BOOLEAN DEFAULT false,
    follow_up_date DATE,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'cancelled', 'refunded')),
    payment_amount DECIMAL(10,2),
    payment_method VARCHAR(30),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES users(id),
    cancellation_reason TEXT,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    reminder_sent BOOLEAN DEFAULT false,
    reminder_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_specialty_id ON appointments(specialty_id);
CREATE INDEX idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_payment ON appointments(payment_status);
CREATE INDEX idx_appointments_datetime ON appointments(scheduled_date, scheduled_time);

-- Índice único para evitar duplos agendamentos no mesmo horário
CREATE UNIQUE INDEX idx_appointments_unique_slot ON appointments(doctor_id, scheduled_date, scheduled_time)
WHERE status NOT IN ('cancelled', 'no_show', 'rescheduled');

-- =====================================================
-- TABELA: Histórico de Alterações de Agendamentos
-- =====================================================
CREATE TABLE appointment_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    changed_by UUID REFERENCES users(id),
    change_type VARCHAR(30) CHECK (change_type IN ('created', 'updated', 'cancelled', 'rescheduled', 'completed')),
    old_values JSONB,
    new_values JSONB,
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_appointment_history_appointment_id ON appointment_history(appointment_id);
CREATE INDEX idx_appointment_history_changed_by ON appointment_history(changed_by);
CREATE INDEX idx_appointment_history_type ON appointment_history(change_type);
CREATE INDEX idx_appointment_history_created ON appointment_history(created_at);

-- =====================================================
-- TABELA: Notificações e Lembretes
-- =====================================================
CREATE TABLE appointment_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
    reminder_type VARCHAR(20) CHECK (reminder_type IN ('sms', 'email', 'whatsapp', 'push')),
    send_at TIMESTAMP WITH TIME ZONE NOT NULL,
    sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed', 'cancelled')),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    template_used VARCHAR(100),
    recipient_contact VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_appointment_reminders_appointment_id ON appointment_reminders(appointment_id);
CREATE INDEX idx_appointment_reminders_send_at ON appointment_reminders(send_at);
CREATE INDEX idx_appointment_reminders_status ON appointment_reminders(delivery_status);
CREATE INDEX idx_appointment_reminders_pending ON appointment_reminders(sent, send_at) WHERE sent = false;

-- =====================================================
-- TRIGGERS: Atualização automática de timestamps
-- =====================================================
CREATE TRIGGER update_doctor_schedules_updated_at BEFORE UPDATE ON doctor_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO: Gerar horários disponíveis
-- =====================================================
CREATE OR REPLACE FUNCTION get_available_slots(
    p_doctor_id UUID,
    p_date DATE,
    p_duration INTEGER DEFAULT 30
)
RETURNS TABLE(
    start_time TIME,
    end_time TIME,
    available BOOLEAN
) AS $$
DECLARE
    schedule_record RECORD;
    slot_time TIME;
    slot_end TIME;
    appointment_count INTEGER;
BEGIN
    -- Buscar horário do médico para o dia da semana
    SELECT * INTO schedule_record
    FROM doctor_schedules
    WHERE doctor_id = p_doctor_id
    AND day_of_week = EXTRACT(DOW FROM p_date)
    AND active = true;
    
    IF NOT FOUND THEN
        RETURN; -- Não há horário definido para este dia
    END IF;
    
    -- Verificar se há exceção para esta data
    IF EXISTS (
        SELECT 1 FROM schedule_exceptions
        WHERE doctor_id = p_doctor_id
        AND exception_date = p_date
        AND all_day = true
    ) THEN
        RETURN; -- Médico não disponível nesta data
    END IF;
    
    -- Gerar slots disponíveis
    slot_time := schedule_record.start_time;
    
    WHILE slot_time < schedule_record.end_time LOOP
        slot_end := slot_time + (p_duration || ' minutes')::INTERVAL;
        
        -- Verificar se o slot não conflita com o intervalo
        IF NOT (
            schedule_record.break_start_time IS NOT NULL AND
            schedule_record.break_end_time IS NOT NULL AND
            slot_time < schedule_record.break_end_time AND
            slot_end > schedule_record.break_start_time
        ) THEN
            -- Contar agendamentos existentes neste horário
            SELECT COUNT(*) INTO appointment_count
            FROM appointments
            WHERE doctor_id = p_doctor_id
            AND scheduled_date = p_date
            AND scheduled_time = slot_time
            AND status NOT IN ('cancelled', 'no_show', 'rescheduled');
            
            -- Retornar o slot
            RETURN QUERY SELECT 
                slot_time,
                slot_end::TIME,
                (appointment_count < schedule_record.max_patients_per_slot);
        END IF;
        
        slot_time := slot_time + (schedule_record.consultation_duration || ' minutes')::INTERVAL;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO: Registrar histórico de alterações
-- =====================================================
CREATE OR REPLACE FUNCTION log_appointment_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO appointment_history (appointment_id, changed_by, change_type, new_values)
        VALUES (NEW.id, NEW.patient_id, 'created', to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO appointment_history (appointment_id, changed_by, change_type, old_values, new_values)
        VALUES (NEW.id, NEW.patient_id, 'updated', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para registrar histórico
CREATE TRIGGER log_appointment_changes_trigger
    AFTER INSERT OR UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION log_appointment_changes();

-- =====================================================
-- DADOS INICIAIS: Horários padrão dos médicos
-- =====================================================
-- Exemplo de horários (você pode personalizar conforme necessário)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, break_start_time, break_end_time, consultation_duration)
SELECT 
    d.id,
    generate_series(1, 5) as day_of_week, -- Segunda a sexta
    '08:00'::TIME,
    '17:00'::TIME,
    '12:00'::TIME,
    '13:00'::TIME,
    30
FROM doctors d;

-- Horários de sábado (meio período)
INSERT INTO doctor_schedules (doctor_id, day_of_week, start_time, end_time, consultation_duration)
SELECT 
    d.id,
    6 as day_of_week, -- Sábado
    '08:00'::TIME,
    '12:00'::TIME,
    30
FROM doctors d;

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para agendamentos com informações completas
CREATE VIEW v_appointments_complete AS
SELECT 
    a.*,
    p.name as patient_name,
    p.email as patient_email,
    p.phone as patient_phone,
    u_doc.name as doctor_name,
    d.crm as doctor_crm,
    s.name as specialty_name,
    pp.document_number as patient_document,
    pp.insurance_provider
FROM appointments a
JOIN users p ON a.patient_id = p.id
JOIN doctors d ON a.doctor_id = d.id
JOIN users u_doc ON d.user_id = u_doc.id
LEFT JOIN specialties s ON a.specialty_id = s.id
LEFT JOIN patient_profiles pp ON a.patient_id = pp.user_id;

-- View para estatísticas de agendamentos
CREATE VIEW v_appointment_stats AS
SELECT 
    scheduled_date,
    COUNT(*) as total_appointments,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
    COUNT(*) FILTER (WHERE status = 'no_show') as no_shows,
    AVG(duration_minutes) as avg_duration
FROM appointments
GROUP BY scheduled_date
ORDER BY scheduled_date DESC;

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================
COMMENT ON TABLE doctor_schedules IS 'Horários de trabalho dos médicos';
COMMENT ON TABLE schedule_exceptions IS 'Exceções nos horários (feriados, folgas, etc.)';
COMMENT ON TABLE appointments IS 'Agendamentos de consultas';
COMMENT ON TABLE appointment_history IS 'Histórico de alterações nos agendamentos';
COMMENT ON TABLE appointment_reminders IS 'Sistema de lembretes para agendamentos';

-- Mensagem de conclusão
SELECT 'Migração 002 executada com sucesso! Sistema de agendamentos criado.' as status;
