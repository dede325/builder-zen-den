-- =====================================================
-- Migração 001: Configuração Inicial
-- Sistema da Clínica Bem Cuidar
-- Desenvolvido por: Kaijhe Morose
-- Data: 2025-01-15
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELA: Usuários
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('masculino', 'feminino', 'outro')),
    role VARCHAR(50) DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'receptionist', 'admin')),
    active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);

-- =====================================================
-- TABELA: Perfis de Pacientes
-- =====================================================
CREATE TABLE patient_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_number VARCHAR(50) UNIQUE,
    document_type VARCHAR(20) DEFAULT 'BI' CHECK (document_type IN ('BI', 'passaporte', 'outro')),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    allergies TEXT,
    chronic_conditions TEXT,
    medications TEXT,
    insurance_provider VARCHAR(255),
    insurance_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_patient_profiles_user_id ON patient_profiles(user_id);
CREATE INDEX idx_patient_profiles_document ON patient_profiles(document_number);

-- =====================================================
-- TABELA: Especialidades Médicas
-- =====================================================
CREATE TABLE specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    detailed_description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color
    image_url TEXT,
    conditions TEXT[], -- Array de condições tratadas
    procedures TEXT[], -- Array de procedimentos
    active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_specialties_slug ON specialties(slug);
CREATE INDEX idx_specialties_active ON specialties(active);
CREATE INDEX idx_specialties_order ON specialties(display_order);

-- =====================================================
-- TABELA: Médicos
-- =====================================================
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    crm VARCHAR(20) UNIQUE NOT NULL,
    specialty_id UUID REFERENCES specialties(id),
    bio TEXT,
    education TEXT,
    experience_years INTEGER DEFAULT 0,
    languages TEXT[], -- Idiomas falados
    consultation_fee DECIMAL(10,2),
    schedule_notes TEXT,
    available_for_online BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_doctors_user_id ON doctors(user_id);
CREATE INDEX idx_doctors_specialty_id ON doctors(specialty_id);
CREATE INDEX idx_doctors_crm ON doctors(crm);
CREATE INDEX idx_doctors_active ON doctors(active);

-- =====================================================
-- TABELA: Configurações do Sistema
-- =====================================================
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    data_type VARCHAR(20) DEFAULT 'string' CHECK (data_type IN ('string', 'number', 'boolean', 'json')),
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_settings_public ON system_settings(is_public);

-- =====================================================
-- TABELA: Submissões de Contato
-- =====================================================
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(50) CHECK (subject IN ('consulta', 'duvida', 'sugestao', 'reclamacao')),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'responded', 'archived')),
    response TEXT,
    responded_by UUID REFERENCES users(id),
    responded_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);

-- =====================================================
-- FUNÇÃO: Atualizar timestamp automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGERS: Atualização automática de timestamps
-- =====================================================
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patient_profiles_updated_at BEFORE UPDATE ON patient_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_specialties_updated_at BEFORE UPDATE ON specialties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON contact_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DADOS INICIAIS: Especialidades
-- =====================================================
INSERT INTO specialties (name, slug, description, detailed_description, icon, color, conditions, procedures) VALUES
('Cardiologia', 'cardiologia', 'Cuidados especializados do coração', 'A cardiologia é a especialidade médica que se dedica ao diagnóstico e tratamento das doenças que acometem o coração e o sistema cardiovascular.', 'Heart', '#e74c3c', 
ARRAY['Hipertensão arterial', 'Insuficiência cardíaca', 'Arritmias cardíacas', 'Infarto do miocárdio', 'Angina', 'Doenças das válvulas cardíacas'],
ARRAY['Eletrocardiograma', 'Ecocardiograma', 'Holter 24h', 'Teste ergométrico', 'Cateterismo cardíaco', 'Angioplastia']),

('Pediatria', 'pediatria', 'Atendimento dedicado às crianças', 'A pediatria é a especialidade médica dedicada à assistência de crianças, adolescentes e jovens até os 18 anos.', 'Baby', '#3498db',
ARRAY['Infecções respiratórias', 'Diarreias e gastroenterites', 'Alergias', 'Distúrbios do crescimento', 'Vacinação', 'Desenvolvimento neuropsicomotor'],
ARRAY['Consultas de rotina', 'Vacinação', 'Testes de desenvolvimento', 'Orientação nutricional', 'Puericultura', 'Nebulização']),

('Dermatologia', 'dermatologia', 'Saúde e beleza da pele', 'A dermatologia é a especialidade que cuida da saúde da pele, cabelos e unhas.', 'Shield', '#2ecc71',
ARRAY['Acne', 'Dermatite', 'Psoríase', 'Câncer de pele', 'Alopecia', 'Micoses'],
ARRAY['Consulta dermatológica', 'Mapeamento de pintas', 'Biópsias de pele', 'Crioterapia', 'Procedimentos estéticos', 'Laser terapêutico']),

('Neurologia', 'neurologia', 'Cuidados do sistema nervoso', 'A neurologia trata das doenças do sistema nervoso central e periférico.', 'Brain', '#9b59b6',
ARRAY['Enxaqueca', 'Epilepsia', 'AVC', 'Doença de Parkinson', 'Alzheimer', 'Esclerose múltipla'],
ARRAY['Eletroencefalograma', 'Eletroneuromiografia', 'Punção lombar', 'Doppler transcraniano', 'Consulta neurológica', 'Testes cognitivos']);

-- =====================================================
-- DADOS INICIAIS: Configurações do Sistema
-- =====================================================
INSERT INTO system_settings (key, value, description, data_type, is_public) VALUES
('clinic_name', 'Clínica Bem Cuidar', 'Nome da clínica', 'string', true),
('clinic_motto', 'Cuidar é Amar', 'Lema da clínica', 'string', true),
('clinic_phone', '+244 945 344 650', 'Telefone principal', 'string', true),
('clinic_email', 'recepcao@bemcuidar.co.ao', 'Email principal', 'string', true),
('clinic_address', 'Avenida 21 de Janeiro, Nº 351, Benfica, Luanda', 'Endereço completo', 'string', true),
('working_hours', '{"monday": "07:00-19:00", "tuesday": "07:00-19:00", "wednesday": "07:00-19:00", "thursday": "07:00-19:00", "friday": "07:00-19:00", "saturday": "07:00-13:00", "sunday": "closed"}', 'Horários de funcionamento', 'json', true),
('emergency_24h', 'true', 'Atendimento de emergência 24h', 'boolean', true),
('developer_name', 'Kaijhe Morose', 'Nome do desenvolvedor', 'string', true),
('developer_website', 'https://bestservices.ao', 'Website do desenvolvedor', 'string', true),
('current_year', '2025', 'Ano atual do sistema', 'string', true);

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================
COMMENT ON TABLE users IS 'Tabela principal de usuários do sistema';
COMMENT ON TABLE patient_profiles IS 'Perfis detalhados dos pacientes';
COMMENT ON TABLE specialties IS 'Especialidades médicas disponíveis';
COMMENT ON TABLE doctors IS 'Informações dos médicos';
COMMENT ON TABLE system_settings IS 'Configurações gerais do sistema';
COMMENT ON TABLE contact_submissions IS 'Submissões do formulário de contato';

-- Mensagem de conclusão
SELECT 'Migração 001 executada com sucesso! Estrutura básica criada.' as status;
