-- Clínica Bem Cuidar - Database Schema
-- Angola Medical Portal System
-- Compliant with Angola data protection laws (Lei 22/11)

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'nurse', 'admin', 'receptionist');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE appointment_type AS ENUM ('consultation', 'follow_up', 'emergency', 'telemedicine', 'second_opinion');
CREATE TYPE exam_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'results_pending', 'results_available');
CREATE TYPE document_category AS ENUM ('medical_record', 'exam_result', 'prescription', 'identity', 'insurance', 'consent');
CREATE TYPE message_type AS ENUM ('text', 'file', 'image', 'voice', 'system');
CREATE TYPE notification_type AS ENUM ('appointment_reminder', 'exam_result', 'prescription_ready', 'message', 'emergency');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'cancelled', 'refunded', 'overdue');
CREATE TYPE payment_method AS ENUM ('cash', 'multicaixa', 'transfer', 'bai_directo', 'bpc_net', 'credit_card', 'unitel_money');

-- Users table (base for all user types)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret VARCHAR(255),
    last_login TIMESTAMP WITH TIME ZONE,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}',
    avatar_url VARCHAR(255),
    
    -- Angola compliance fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_retention_expires TIMESTAMP WITH TIME ZONE,
    consent_given_at TIMESTAMP WITH TIME ZONE,
    consent_version VARCHAR(50),
    
    -- Audit fields
    created_by UUID,
    updated_by UUID
);

-- Patients table (extends users)
CREATE TABLE patients (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    patient_number VARCHAR(50) UNIQUE NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10),
    address JSONB, -- Street, city, province, postal_code
    emergency_contact JSONB, -- Name, phone, relationship
    medical_history JSONB DEFAULT '[]',
    allergies JSONB DEFAULT '[]',
    current_medications JSONB DEFAULT '[]',
    insurance_provider VARCHAR(255),
    insurance_number VARCHAR(100),
    blood_type VARCHAR(5),
    marital_status VARCHAR(20),
    occupation VARCHAR(100),
    next_of_kin JSONB,
    
    -- Angola specific
    bi_number VARCHAR(20) UNIQUE, -- Bilhete de Identidade
    nif_number VARCHAR(20), -- Número de Identificação Fiscal
    birth_place VARCHAR(255),
    nationality VARCHAR(100) DEFAULT 'Angolana',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Doctors table (extends users)
CREATE TABLE doctors (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    license_number VARCHAR(50) UNIQUE NOT NULL,
    speciality VARCHAR(100) NOT NULL,
    sub_speciality VARCHAR(100),
    medical_school VARCHAR(255),
    graduation_year INTEGER,
    board_certifications JSONB DEFAULT '[]',
    languages JSONB DEFAULT '["português"]',
    consultation_fee DECIMAL(10,2),
    biography TEXT,
    years_experience INTEGER,
    
    -- Angola specific
    ordem_medicos_number VARCHAR(50), -- Ordem dos Médicos de Angola
    ministry_approval_number VARCHAR(50),
    
    -- Availability
    working_hours JSONB DEFAULT '{}', -- Day of week -> hours
    max_patients_per_day INTEGER DEFAULT 20,
    consultation_duration INTEGER DEFAULT 30, -- minutes
    
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Staff table (nurses, receptionists, admins)
CREATE TABLE staff (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    license_number VARCHAR(50), -- For nurses
    hire_date DATE NOT NULL,
    supervisor_id UUID REFERENCES staff(id),
    shift_pattern VARCHAR(50), -- morning, afternoon, night, rotating
    hourly_rate DECIMAL(8,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Specialities table
CREATE TABLE specialities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments table
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER DEFAULT 30, -- minutes
    type appointment_type NOT NULL DEFAULT 'consultation',
    status appointment_status DEFAULT 'scheduled',
    reason TEXT,
    notes TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    
    -- Telemedicine fields
    telemedicine_url VARCHAR(255),
    telemedicine_started_at TIMESTAMP WITH TIME ZONE,
    telemedicine_ended_at TIMESTAMP WITH TIME ZONE,
    recording_url VARCHAR(255),
    
    -- Payment
    consultation_fee DECIMAL(10,2),
    payment_status payment_status DEFAULT 'pending',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_by UUID REFERENCES users(id),
    cancellation_reason TEXT
);

-- Exams table
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    appointment_id UUID REFERENCES appointments(id),
    exam_type VARCHAR(100) NOT NULL,
    exam_category VARCHAR(50), -- laboratory, imaging, cardiology, etc.
    status exam_status DEFAULT 'scheduled',
    scheduled_date DATE,
    scheduled_time TIME,
    completed_at TIMESTAMP WITH TIME ZONE,
    instructions TEXT,
    preparation_required TEXT,
    fasting_required BOOLEAN DEFAULT false,
    estimated_duration INTEGER, -- minutes
    cost DECIMAL(10,2),
    
    -- Results
    results_available_at TIMESTAMP WITH TIME ZONE,
    results TEXT,
    results_summary TEXT,
    abnormal_findings JSONB DEFAULT '[]',
    reference_values JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescriptions table
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    appointment_id UUID REFERENCES appointments(id),
    prescription_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE,
    
    -- Digital signature (Angola compliance)
    digital_signature TEXT,
    signature_timestamp TIMESTAMP WITH TIME ZONE,
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescription items
CREATE TABLE prescription_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    medication_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    dosage VARCHAR(100), -- "500mg", "5ml", etc.
    strength VARCHAR(50),
    form VARCHAR(50), -- tablet, capsule, syrup, etc.
    quantity INTEGER NOT NULL,
    unit VARCHAR(20), -- units, boxes, bottles, etc.
    frequency VARCHAR(100), -- "2x por dia", "de 8 em 8 horas"
    duration VARCHAR(100), -- "7 dias", "até acabar"
    instructions TEXT,
    is_generic_allowed BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table (encrypted)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    uploaded_by UUID NOT NULL REFERENCES users(id),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    category document_category NOT NULL,
    
    -- Encryption metadata
    encryption_algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
    encryption_key_id VARCHAR(100),
    is_encrypted BOOLEAN DEFAULT true,
    
    -- File storage
    file_path VARCHAR(500),
    storage_provider VARCHAR(50) DEFAULT 'local',
    checksum VARCHAR(100),
    
    -- Access control
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_by UUID REFERENCES users(id),
    
    -- Retention and compliance
    retention_period INTEGER, -- days
    auto_delete_at TIMESTAMP WITH TIME ZONE,
    legal_basis VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document permissions
CREATE TABLE document_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    granted_by UUID NOT NULL REFERENCES users(id),
    can_view BOOLEAN DEFAULT false,
    can_download BOOLEAN DEFAULT false,
    can_share BOOLEAN DEFAULT false,
    can_delete BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, user_id)
);

-- Messages table (secure chat)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    message_type message_type DEFAULT 'text',
    
    -- Encryption
    is_encrypted BOOLEAN DEFAULT true,
    encryption_key_id VARCHAR(100),
    
    -- Attachments
    attachment_url VARCHAR(255),
    attachment_filename VARCHAR(255),
    attachment_size BIGINT,
    
    -- Status
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    is_urgent BOOLEAN DEFAULT false,
    
    -- Retention
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vital signs table
CREATE TABLE vital_signs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    recorded_by UUID REFERENCES users(id),
    appointment_id UUID REFERENCES appointments(id),
    
    -- Measurements
    height DECIMAL(5,2), -- cm
    weight DECIMAL(5,2), -- kg
    bmi DECIMAL(4,2),
    systolic_bp INTEGER,
    diastolic_bp INTEGER,
    heart_rate INTEGER,
    temperature DECIMAL(4,2), -- Celsius
    respiratory_rate INTEGER,
    oxygen_saturation INTEGER, -- %
    blood_glucose DECIMAL(5,2), -- mg/dL
    
    -- Additional measurements
    pain_scale INTEGER CHECK (pain_scale >= 0 AND pain_scale <= 10),
    notes TEXT,
    
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}', -- Additional notification data
    
    -- Delivery
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Channels
    email_sent BOOLEAN DEFAULT false,
    sms_sent BOOLEAN DEFAULT false,
    push_sent BOOLEAN DEFAULT false,
    
    -- Scheduling
    scheduled_for TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    appointment_id UUID REFERENCES appointments(id),
    exam_id UUID REFERENCES exams(id),
    
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'AOA',
    payment_method payment_method NOT NULL,
    status payment_status DEFAULT 'pending',
    
    -- Payment details
    reference_number VARCHAR(100) UNIQUE,
    transaction_id VARCHAR(255),
    provider_reference VARCHAR(255),
    
    -- Dates
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Angola tax compliance
    invoice_number VARCHAR(50),
    tax_amount DECIMAL(10,2),
    tax_rate DECIMAL(5,2) DEFAULT 14.00, -- IVA Angola
    
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log table (Angola compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100), -- table name or resource type
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    
    -- Compliance
    legal_basis VARCHAR(255),
    data_subject_id UUID, -- Usually patient_id
    processing_purpose VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings table
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    category VARCHAR(50),
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

CREATE INDEX idx_patients_number ON patients(patient_number);
CREATE INDEX idx_patients_bi ON patients(bi_number);

CREATE INDEX idx_doctors_license ON doctors(license_number);
CREATE INDEX idx_doctors_speciality ON doctors(speciality);
CREATE INDEX idx_doctors_available ON doctors(is_available);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date_doctor ON appointments(appointment_date, doctor_id);

CREATE INDEX idx_exams_patient ON exams(patient_id);
CREATE INDEX idx_exams_doctor ON exams(doctor_id);
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exams_date ON exams(scheduled_date);

CREATE INDEX idx_documents_patient ON documents(patient_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_created ON documents(created_at);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created ON messages(created_at);

CREATE INDEX idx_vital_signs_patient ON vital_signs(patient_id);
CREATE INDEX idx_vital_signs_recorded ON vital_signs(recorded_at);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_sent ON notifications(sent_at);

CREATE INDEX idx_payments_patient ON payments(patient_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_reference ON payments(reference_number);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Create full-text search indexes
CREATE INDEX idx_patients_search ON patients USING gin(to_tsvector('portuguese', name || ' ' || COALESCE(bi_number, '')));
CREATE INDEX idx_doctors_search ON doctors USING gin(to_tsvector('portuguese', name || ' ' || speciality));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    user_id_val UUID;
BEGIN
    -- Get current user from application context
    user_id_val := current_setting('app.current_user_id', true)::UUID;
    
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values)
        VALUES (user_id_val, 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values)
        VALUES (user_id_val, 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values)
        VALUES (user_id_val, 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_patients AFTER INSERT OR UPDATE OR DELETE ON patients FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_appointments AFTER INSERT OR UPDATE OR DELETE ON appointments FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_exams AFTER INSERT OR UPDATE OR DELETE ON exams FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_prescriptions AFTER INSERT OR UPDATE OR DELETE ON prescriptions FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_documents AFTER INSERT OR UPDATE OR DELETE ON documents FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Row Level Security (RLS) for patient data protection
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;

-- RLS policies will be defined based on user roles and data access patterns
-- This ensures patients can only see their own data, doctors can see their patients' data, etc.

-- Insert default system settings
INSERT INTO system_settings (key, value, category, description, is_public) VALUES
('clinic_name', '"Clínica Bem Cuidar"', 'general', 'Nome da clínica', true),
('clinic_address', '{"street": "Avenida 21 de Janeiro, Nº 351", "city": "Luanda", "province": "Luanda", "country": "Angola", "postal_code": ""}', 'general', 'Endereço da clínica', true),
('clinic_phone', '"+244 222 123 456"', 'general', 'Telefone principal', true),
('clinic_email', '"info@clinicabemcuidar.ao"', 'general', 'Email principal', true),
('business_hours', '{"monday": {"start": "07:00", "end": "18:00"}, "tuesday": {"start": "07:00", "end": "18:00"}, "wednesday": {"start": "07:00", "end": "18:00"}, "thursday": {"start": "07:00", "end": "18:00"}, "friday": {"start": "07:00", "end": "18:00"}, "saturday": {"start": "08:00", "end": "14:00"}, "sunday": "closed"}', 'general', 'Horários de funcionamento', true),
('emergency_phone', '"+244 923 456 789"', 'general', 'Telefone de emergência', true),
('data_retention_days', '3650', 'compliance', 'Dias de retenção de dados médicos (10 anos)', false),
('consent_version', '"v1.0_2025"', 'compliance', 'Versão atual do termo de consentimento', false),
('encryption_enabled', 'true', 'security', 'Criptografia habilitada', false),
('audit_enabled', 'true', 'compliance', 'Auditoria habilitada', false);

-- Insert default specialities
INSERT INTO specialities (name, description, icon, color) VALUES
('Medicina Geral', 'Clínica geral e medicina familiar', 'heart', '#3B82F6'),
('Cardiologia', 'Especialidade do coração e sistema cardiovascular', 'heart-pulse', '#EF4444'),
('Pediatria', 'Cuidados médicos para crianças', 'baby', '#10B981'),
('Ginecologia', 'Saúde da mulher e sistema reprodutivo', 'user-heart', '#EC4899'),
('Dermatologia', 'Cuidados com a pele', 'scan-face', '#F59E0B'),
('Oftalmologia', 'Cuidados com os olhos', 'eye', '#8B5CF6'),
('Ortopedia', 'Ossos, músculos e articulações', 'bone', '#6B7280'),
('Neurologia', 'Sistema nervoso', 'brain', '#7C3AED'),
('Psiquiatria', 'Saúde mental', 'brain-circuit', '#06B6D4'),
('Medicina Interna', 'Medicina interna e doenças sistémicas', 'stethoscope', '#0EA5E9');

COMMENT ON DATABASE postgres IS 'Clínica Bem Cuidar - Sistema de Gestão Médica para Angola';
