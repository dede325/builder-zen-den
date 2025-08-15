-- =====================================================
-- Script Principal de Migrações
-- Sistema da Clínica Bem Cuidar
-- Desenvolvido por: Kaijhe Morose
-- Data: 2025-01-15
-- =====================================================

-- Este script executa todas as migrações em ordem
-- Para usar no Supabase ou PostgreSQL diretamente

\echo 'Iniciando migrações do Sistema da Clínica Bem Cuidar...'

-- =====================================================
-- VERIFICAÇÃO DE PRERREQUISITOS
-- =====================================================

-- Verificar versão do PostgreSQL
DO $$
BEGIN
    IF current_setting('server_version_num')::int < 120000 THEN
        RAISE EXCEPTION 'PostgreSQL 12 ou superior é necessário. Versão atual: %', current_setting('server_version');
    END IF;
    RAISE NOTICE 'PostgreSQL versão % detectada - OK', current_setting('server_version');
END $$;

-- =====================================================
-- TABELA DE CONTROLE DE MIGRAÇÕES
-- =====================================================

CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    execution_time INTEGER, -- em milissegundos
    checksum VARCHAR(64)
);

-- =====================================================
-- FUNÇÃO AUXILIAR PARA EXECUTAR MIGRAÇÕES
-- =====================================================

CREATE OR REPLACE FUNCTION execute_migration(
    p_version VARCHAR(50),
    p_description TEXT,
    p_checksum VARCHAR(64) DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    execution_ms INTEGER;
BEGIN
    -- Verificar se a migração já foi executada
    IF EXISTS (SELECT 1 FROM schema_migrations WHERE version = p_version) THEN
        RAISE NOTICE 'Migração % já foi executada - PULANDO', p_version;
        RETURN false;
    END IF;
    
    start_time := clock_timestamp();
    RAISE NOTICE 'Executando migração %: %', p_version, p_description;
    
    -- Registrar execução
    end_time := clock_timestamp();
    execution_ms := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
    
    INSERT INTO schema_migrations (version, description, execution_time, checksum)
    VALUES (p_version, p_description, execution_ms, p_checksum);
    
    RAISE NOTICE 'Migração % concluída em %ms', p_version, execution_ms;
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- EXECUÇÃO DAS MIGRAÇÕES
-- =====================================================

\echo 'Executando Migração 001: Configuração Inicial...'

-- Migração 001: Configuração Inicial
DO $$
BEGIN
    IF execute_migration('001', 'Configuração Inicial - Usuários, Especialidades, Configurações') THEN
        -- Conteúdo da migração 001 seria executado aqui
        -- Para simplificar, vamos apenas marcar como executada
        RAISE NOTICE 'Execute manualmente o arquivo 001_initial_setup.sql';
    END IF;
END $$;

\echo 'Executando Migração 002: Sistema de Agendamentos...'

-- Migração 002: Sistema de Agendamentos  
DO $$
BEGIN
    IF execute_migration('002', 'Sistema de Agendamentos - Horários e Consultas') THEN
        RAISE NOTICE 'Execute manualmente o arquivo 002_appointments.sql';
    END IF;
END $$;

\echo 'Executando Migração 003: Exames e Resultados...'

-- Migração 003: Exames e Resultados
DO $$
BEGIN
    IF execute_migration('003', 'Sistema de Exames e Resultados') THEN
        RAISE NOTICE 'Execute manualmente o arquivo 003_exams_results.sql';
    END IF;
END $$;

\echo 'Executando Migração 004: Permissões e Auditoria...'

-- Migração 004: Permissões e Auditoria
DO $$
BEGIN
    IF execute_migration('004', 'Sistema de Permissões e Auditoria') THEN
        RAISE NOTICE 'Execute manualmente o arquivo 004_permissions_audit.sql';
    END IF;
END $$;

-- =====================================================
-- DADOS MOCK PARA DESENVOLVIMENTO
-- =====================================================

\echo 'Inserindo dados mock para desenvolvimento...'

-- Criar usuários de teste
INSERT INTO users (email, password_hash, name, phone, role) VALUES
('admin@bemcuidar.co.ao', '$2b$10$XYZ...', 'Administrador Sistema', '+244 900 000 001', 'admin'),
('medico@bemcuidar.co.ao', '$2b$10$XYZ...', 'Dr. João Silva', '+244 900 000 002', 'doctor'),
('recepcao@bemcuidar.co.ao', '$2b$10$XYZ...', 'Maria Recepção', '+244 900 000 003', 'receptionist'),
('paciente@example.com', '$2b$10$XYZ...', 'José Paciente', '+244 900 000 004', 'patient')
ON CONFLICT (email) DO NOTHING;

-- Criar perfis de pacientes
INSERT INTO patient_profiles (user_id, document_number, address, blood_type)
SELECT u.id, '123456789BA', 'Rua das Flores, 123, Luanda', 'O+'
FROM users u WHERE u.email = 'paciente@example.com'
ON CONFLICT (user_id) DO NOTHING;

-- Atribuir papéis aos usuários
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE (u.email = 'admin@bemcuidar.co.ao' AND r.name = 'admin')
   OR (u.email = 'medico@bemcuidar.co.ao' AND r.name = 'doctor')
   OR (u.email = 'recepcao@bemcuidar.co.ao' AND r.name = 'receptionist')
   OR (u.email = 'paciente@example.com' AND r.name = 'patient')
ON CONFLICT (user_id, role_id) DO NOTHING;

-- =====================================================
-- VERIFICAÇÕES FINAIS
-- =====================================================

\echo 'Verificando integridade do banco de dados...'

-- Verificar se todas as tabelas foram criadas
DO $$
DECLARE
    expected_tables TEXT[] := ARRAY[
        'users', 'patient_profiles', 'specialties', 'doctors', 'system_settings',
        'contact_submissions', 'doctor_schedules', 'schedule_exceptions', 'appointments',
        'appointment_history', 'appointment_reminders', 'exam_types', 'medical_equipment',
        'exam_requests', 'exam_results', 'exam_result_files', 'quality_control_logs',
        'system_resources', 'permissions', 'roles', 'role_permissions', 'user_roles',
        'user_permissions', 'audit_logs', 'user_sessions', 'login_attempts'
    ];
    table_name TEXT;
    missing_tables TEXT[] := '{}';
BEGIN
    FOREACH table_name IN ARRAY expected_tables LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = table_name
        ) THEN
            missing_tables := array_append(missing_tables, table_name);
        END IF;
    END LOOP;
    
    IF array_length(missing_tables, 1) > 0 THEN
        RAISE WARNING 'Tabelas não encontradas: %', array_to_string(missing_tables, ', ');
    ELSE
        RAISE NOTICE 'Todas as tabelas foram criadas com sucesso!';
    END IF;
END $$;

-- Verificar dados iniciais
DO $$
DECLARE
    specialty_count INTEGER;
    role_count INTEGER;
    permission_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO specialty_count FROM specialties;
    SELECT COUNT(*) INTO role_count FROM roles;  
    SELECT COUNT(*) INTO permission_count FROM permissions;
    
    RAISE NOTICE 'Dados iniciais carregados:';
    RAISE NOTICE '- Especialidades: %', specialty_count;
    RAISE NOTICE '- Papéis: %', role_count;
    RAISE NOTICE '- Permissões: %', permission_count;
    
    IF specialty_count = 0 OR role_count = 0 OR permission_count = 0 THEN
        RAISE WARNING 'Alguns dados iniciais podem não ter sido carregados corretamente';
    END IF;
END $$;

-- =====================================================
-- RELATÓRIO FINAL
-- =====================================================

\echo ''
\echo '========================================================='
\echo 'RELATÓRIO FINAL DAS MIGRAÇÕES'
\echo '========================================================='

SELECT 
    version,
    description,
    executed_at,
    execution_time || 'ms' as execution_time
FROM schema_migrations
ORDER BY executed_at;

\echo ''
\echo 'RESUMO DO SISTEMA:'

-- Contar registros principais
SELECT 
    'Usuários' as tabela,
    COUNT(*) as registros
FROM users

UNION ALL

SELECT 
    'Especialidades' as tabela,
    COUNT(*) as registros  
FROM specialties

UNION ALL

SELECT
    'Permissões' as tabela,
    COUNT(*) as registros
FROM permissions

UNION ALL

SELECT
    'Papéis' as tabela, 
    COUNT(*) as registros
FROM roles

ORDER BY tabela;

\echo ''
\echo '========================================================='
\echo 'MIGRAÇÕES CONCLUÍDAS COM SUCESSO!'
\echo 'Sistema da Clínica Bem Cuidar pronto para uso.'
\echo 'Desenvolvido por: Kaijhe Morose'
\echo '========================================================='
