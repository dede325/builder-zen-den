-- =====================================================
-- Migração 003: Sistema de Exames e Resultados
-- Sistema da Clínica Bem Cuidar
-- Desenvolvido por: Kaijhe Morose
-- Data: 2025-01-15
-- =====================================================

-- =====================================================
-- TABELA: Tipos de Exames
-- =====================================================
CREATE TABLE exam_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    category VARCHAR(100), -- Ex: 'laboratorio', 'imagem', 'cardiologia'
    description TEXT,
    preparation_instructions TEXT,
    duration_minutes INTEGER DEFAULT 30,
    requires_fasting BOOLEAN DEFAULT false,
    fasting_hours INTEGER,
    requires_appointment BOOLEAN DEFAULT true,
    price DECIMAL(10,2),
    active BOOLEAN DEFAULT true,
    result_delivery_days INTEGER DEFAULT 1,
    sample_types TEXT[], -- Ex: ['sangue', 'urina', 'fezes']
    normal_ranges JSONB, -- Valores de referência normais
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_exam_types_slug ON exam_types(slug);
CREATE INDEX idx_exam_types_category ON exam_types(category);
CREATE INDEX idx_exam_types_active ON exam_types(active);

-- =====================================================
-- TABELA: Equipamentos Médicos
-- =====================================================
CREATE TABLE medical_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    model VARCHAR(100),
    manufacturer VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    location VARCHAR(200),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive', 'retired')),
    last_maintenance DATE,
    next_maintenance DATE,
    calibration_date DATE,
    next_calibration DATE,
    notes TEXT,
    purchase_date DATE,
    warranty_end DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_medical_equipment_status ON medical_equipment(status);
CREATE INDEX idx_medical_equipment_location ON medical_equipment(location);
CREATE INDEX idx_medical_equipment_maintenance ON medical_equipment(next_maintenance);

-- =====================================================
-- TABELA: Solicitações de Exames
-- =====================================================
CREATE TABLE exam_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id),
    exam_type_id UUID REFERENCES exam_types(id),
    appointment_id UUID REFERENCES appointments(id),
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    scheduled_date DATE,
    scheduled_time TIME,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(30) DEFAULT 'requested' CHECK (status IN ('requested', 'scheduled', 'in_progress', 'completed', 'cancelled', 'resulted')),
    clinical_indication TEXT,
    observations TEXT,
    special_instructions TEXT,
    requires_contrast BOOLEAN DEFAULT false,
    contrast_type VARCHAR(100),
    allergies_notes TEXT,
    preparation_completed BOOLEAN DEFAULT false,
    equipment_id UUID REFERENCES medical_equipment(id),
    technician_id UUID REFERENCES users(id),
    estimated_duration INTEGER,
    actual_duration INTEGER,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES users(id),
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_exam_requests_patient_id ON exam_requests(patient_id);
CREATE INDEX idx_exam_requests_doctor_id ON exam_requests(doctor_id);
CREATE INDEX idx_exam_requests_exam_type_id ON exam_requests(exam_type_id);
CREATE INDEX idx_exam_requests_status ON exam_requests(status);
CREATE INDEX idx_exam_requests_scheduled ON exam_requests(scheduled_date, scheduled_time);
CREATE INDEX idx_exam_requests_priority ON exam_requests(priority);

-- =====================================================
-- TABELA: Resultados de Exames
-- =====================================================
CREATE TABLE exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_request_id UUID REFERENCES exam_requests(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exam_type_id UUID REFERENCES exam_types(id),
    result_date DATE NOT NULL DEFAULT CURRENT_DATE,
    result_values JSONB, -- Valores numéricos e textuais do resultado
    interpretation TEXT,
    conclusions TEXT,
    recommendations TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'preliminary', 'final', 'amended', 'cancelled')),
    abnormal_findings BOOLEAN DEFAULT false,
    critical_values BOOLEAN DEFAULT false,
    reference_ranges JSONB,
    units JSONB,
    method_used VARCHAR(200),
    equipment_used UUID REFERENCES medical_equipment(id),
    performed_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    released_at TIMESTAMP WITH TIME ZONE,
    viewed_by_patient BOOLEAN DEFAULT false,
    viewed_at TIMESTAMP WITH TIME ZONE,
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    quality_control JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_exam_results_request_id ON exam_results(exam_request_id);
CREATE INDEX idx_exam_results_patient_id ON exam_results(patient_id);
CREATE INDEX idx_exam_results_exam_type_id ON exam_results(exam_type_id);
CREATE INDEX idx_exam_results_status ON exam_results(status);
CREATE INDEX idx_exam_results_date ON exam_results(result_date);
CREATE INDEX idx_exam_results_viewed ON exam_results(viewed_by_patient);
CREATE INDEX idx_exam_results_critical ON exam_results(critical_values) WHERE critical_values = true;

-- =====================================================
-- TABELA: Arquivos de Resultados
-- =====================================================
CREATE TABLE exam_result_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_result_id UUID REFERENCES exam_results(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50), -- pdf, jpg, png, dicom, etc.
    file_size INTEGER, -- em bytes
    mime_type VARCHAR(100),
    description TEXT,
    is_primary BOOLEAN DEFAULT false,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES users(id),
    checksum VARCHAR(64), -- Para verificação de integridade
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_exam_result_files_result_id ON exam_result_files(exam_result_id);
CREATE INDEX idx_exam_result_files_type ON exam_result_files(file_type);
CREATE INDEX idx_exam_result_files_primary ON exam_result_files(is_primary) WHERE is_primary = true;

-- =====================================================
-- TABELA: Controle de Qualidade
-- =====================================================
CREATE TABLE quality_control_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_result_id UUID REFERENCES exam_results(id) ON DELETE CASCADE,
    control_type VARCHAR(50), -- 'accuracy', 'precision', 'calibration'
    control_value DECIMAL(15,6),
    expected_value DECIMAL(15,6),
    tolerance DECIMAL(15,6),
    passed BOOLEAN,
    performed_by UUID REFERENCES users(id),
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_quality_control_result_id ON quality_control_logs(exam_result_id);
CREATE INDEX idx_quality_control_type ON quality_control_logs(control_type);
CREATE INDEX idx_quality_control_date ON quality_control_logs(performed_at);

-- =====================================================
-- TRIGGERS: Atualização automática de timestamps
-- =====================================================
CREATE TRIGGER update_exam_types_updated_at BEFORE UPDATE ON exam_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_equipment_updated_at BEFORE UPDATE ON medical_equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_requests_updated_at BEFORE UPDATE ON exam_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exam_results_updated_at BEFORE UPDATE ON exam_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO: Marcar exame como visualizado pelo paciente
-- =====================================================
CREATE OR REPLACE FUNCTION mark_exam_viewed(
    p_exam_result_id UUID,
    p_patient_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    exam_record RECORD;
BEGIN
    -- Verificar se o exame pertence ao paciente
    SELECT * INTO exam_record
    FROM exam_results
    WHERE id = p_exam_result_id
    AND patient_id = p_patient_id
    AND status = 'final';
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Marcar como visualizado se ainda não foi
    IF NOT exam_record.viewed_by_patient THEN
        UPDATE exam_results
        SET viewed_by_patient = true,
            viewed_at = NOW()
        WHERE id = p_exam_result_id;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO: Registrar download de resultado
-- =====================================================
CREATE OR REPLACE FUNCTION register_exam_download(
    p_exam_result_id UUID,
    p_patient_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar se o exame pertence ao paciente
    IF NOT EXISTS (
        SELECT 1 FROM exam_results
        WHERE id = p_exam_result_id
        AND patient_id = p_patient_id
        AND status = 'final'
    ) THEN
        RETURN FALSE;
    END IF;
    
    -- Incrementar contador de downloads
    UPDATE exam_results
    SET download_count = download_count + 1,
        last_downloaded_at = NOW()
    WHERE id = p_exam_result_id;
    
    -- Marcar como visualizado se ainda não foi
    PERFORM mark_exam_viewed(p_exam_result_id, p_patient_id);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO: Estatísticas de exames por período
-- =====================================================
CREATE OR REPLACE FUNCTION get_exam_statistics(
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE(
    exam_type_name VARCHAR(150),
    total_requested INTEGER,
    total_completed INTEGER,
    total_resulted INTEGER,
    avg_turnaround_hours NUMERIC,
    completion_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        et.name,
        COUNT(er.id)::INTEGER as total_requested,
        COUNT(er.id) FILTER (WHERE er.status = 'completed')::INTEGER as total_completed,
        COUNT(res.id)::INTEGER as total_resulted,
        ROUND(AVG(EXTRACT(EPOCH FROM (er.completed_at - er.created_at))/3600)::NUMERIC, 2) as avg_turnaround_hours,
        ROUND((COUNT(er.id) FILTER (WHERE er.status = 'completed')::NUMERIC / NULLIF(COUNT(er.id), 0) * 100), 2) as completion_rate
    FROM exam_types et
    LEFT JOIN exam_requests er ON et.id = er.exam_type_id
        AND er.request_date BETWEEN p_start_date AND p_end_date
    LEFT JOIN exam_results res ON er.id = res.exam_request_id
        AND res.status = 'final'
    GROUP BY et.id, et.name
    ORDER BY total_requested DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DADOS INICIAIS: Tipos de Exames Comuns
-- =====================================================
INSERT INTO exam_types (name, slug, category, description, preparation_instructions, requires_fasting, fasting_hours, price, result_delivery_days) VALUES
('Hemograma Completo', 'hemograma-completo', 'laboratorio', 'Análise completa das células sanguíneas', 'Não é necessário jejum', false, 0, 25.00, 1),
('Glicemia em Jejum', 'glicemia-jejum', 'laboratorio', 'Dosagem da glicose no sangue em jejum', 'Jejum de 8 a 12 horas', true, 8, 15.00, 1),
('Colesterol Total e Frações', 'colesterol-total', 'laboratorio', 'Dosagem do colesterol total, HDL, LDL e triglicérides', 'Jejum de 12 horas', true, 12, 35.00, 1),
('Urina Tipo I', 'urina-tipo-1', 'laboratorio', 'Exame básico de urina', 'Colher a primeira urina da manhã', false, 0, 20.00, 1),
('Eletrocardiograma', 'eletrocardiograma', 'cardiologia', 'Avaliação da atividade elétrica do coração', 'Não fazer exercícios antes do exame', false, 0, 40.00, 0),
('Ecocardiograma', 'ecocardiograma', 'cardiologia', 'Ultrassom do coração', 'Não é necessário preparo especial', false, 0, 120.00, 1),
('Radiografia de Tórax', 'raio-x-torax', 'imagem', 'Raio-X do tórax para avaliação pulmonar', 'Retirar objetos metálicos', false, 0, 50.00, 0),
('Ultrassom Abdominal', 'ultrassom-abdominal', 'imagem', 'Ultrassom do abdome', 'Jejum de 8 horas e beber água antes do exame', true, 8, 80.00, 0),
('Mamografia', 'mamografia', 'imagem', 'Exame radiológico das mamas', 'Não usar desodorante ou talco', false, 0, 100.00, 1),
('Papanicolaou', 'papanicolaou', 'ginecologia', 'Exame preventivo do câncer de colo uterino', 'Não estar menstruada, sem relações 24h antes', false, 0, 45.00, 3);

-- =====================================================
-- DADOS INICIAIS: Equipamentos Médicos
-- =====================================================
INSERT INTO medical_equipment (name, model, manufacturer, location, status, last_maintenance, next_maintenance) VALUES
('Eletrocardiógrafo', 'ECG-1200', 'Nihon Kohden', 'Sala de Cardiologia 1', 'active', '2024-12-01', '2025-06-01'),
('Ecocardiógrafo', 'Vivid S70', 'GE Healthcare', 'Sala de Cardiologia 2', 'active', '2024-11-15', '2025-05-15'),
('Equipamento de Raio-X', 'DR-X1000', 'Canon Medical', 'Sala de Radiologia', 'active', '2024-10-20', '2025-04-20'),
('Ultrassom', 'LOGIQ P9', 'GE Healthcare', 'Sala de Ultrassom', 'active', '2024-12-10', '2025-06-10'),
('Mamógrafo', 'Senographe Essential', 'GE Healthcare', 'Sala de Mamografia', 'active', '2024-09-30', '2025-03-30');

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para exames com informações completas
CREATE VIEW v_exam_results_complete AS
SELECT 
    er.*,
    req.request_date,
    req.scheduled_date,
    req.clinical_indication,
    et.name as exam_type_name,
    et.category as exam_category,
    p.name as patient_name,
    p.email as patient_email,
    doc.name as doctor_name,
    pp.document_number as patient_document
FROM exam_results er
JOIN exam_requests req ON er.exam_request_id = req.id
JOIN exam_types et ON er.exam_type_id = et.id
JOIN users p ON er.patient_id = p.id
LEFT JOIN doctors d ON req.doctor_id = d.id
LEFT JOIN users doc ON d.user_id = doc.id
LEFT JOIN patient_profiles pp ON er.patient_id = pp.user_id;

-- View para dashboard de exames
CREATE VIEW v_exam_dashboard AS
SELECT 
    DATE(req.created_at) as date,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE req.status = 'completed') as completed,
    COUNT(*) FILTER (WHERE req.status = 'cancelled') as cancelled,
    COUNT(res.id) FILTER (WHERE res.status = 'final') as resulted,
    COUNT(res.id) FILTER (WHERE res.critical_values = true) as critical_results,
    COUNT(res.id) FILTER (WHERE res.viewed_by_patient = false AND res.status = 'final') as pending_view
FROM exam_requests req
LEFT JOIN exam_results res ON req.id = res.exam_request_id
GROUP BY DATE(req.created_at)
ORDER BY date DESC;

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================
COMMENT ON TABLE exam_types IS 'Tipos de exames disponíveis na clínica';
COMMENT ON TABLE medical_equipment IS 'Equipamentos médicos e seu status';
COMMENT ON TABLE exam_requests IS 'Solicitações de exames pelos médicos';
COMMENT ON TABLE exam_results IS 'Resultados dos exames realizados';
COMMENT ON TABLE exam_result_files IS 'Arquivos anexados aos resultados de exames';
COMMENT ON TABLE quality_control_logs IS 'Registros de controle de qualidade dos exames';

-- Mensagem de conclusão
SELECT 'Migração 003 executada com sucesso! Sistema de exames e resultados criado.' as status;
