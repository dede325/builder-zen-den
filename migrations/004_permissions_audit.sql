-- =====================================================
-- Migração 004: Sistema de Permissões e Auditoria
-- Sistema da Clínica Bem Cuidar
-- Desenvolvido por: Kaijhe Morose
-- Data: 2025-01-15
-- =====================================================

-- =====================================================
-- TABELA: Recursos do Sistema
-- =====================================================
CREATE TABLE system_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50), -- Ex: 'appointments', 'exams', 'patients'
    resource_type VARCHAR(30) DEFAULT 'endpoint' CHECK (resource_type IN ('endpoint', 'feature', 'data', 'action')),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_system_resources_module ON system_resources(module);
CREATE INDEX idx_system_resources_type ON system_resources(resource_type);
CREATE INDEX idx_system_resources_active ON system_resources(active);

-- =====================================================
-- TABELA: Permissões
-- =====================================================
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource_id UUID REFERENCES system_resources(id),
    action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'execute'
    conditions JSONB, -- Condições específicas para a permissão
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_permissions_resource_id ON permissions(resource_id);
CREATE INDEX idx_permissions_action ON permissions(action);
CREATE INDEX idx_permissions_active ON permissions(active);

-- =====================================================
-- TABELA: Papéis (Roles)
-- =====================================================
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    level INTEGER DEFAULT 0, -- Nível hierárquico do papel
    is_default BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_roles_level ON roles(level);
CREATE INDEX idx_roles_default ON roles(is_default) WHERE is_default = true;
CREATE INDEX idx_roles_active ON roles(active);

-- =====================================================
-- TABELA: Permissões por Papel
-- =====================================================
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted BOOLEAN DEFAULT true,
    conditions_override JSONB, -- Sobrescrever condições específicas
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(role_id, permission_id)
);

-- Índices
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX idx_role_permissions_granted ON role_permissions(granted);

-- =====================================================
-- TABELA: Papéis dos Usuários
-- =====================================================
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT true,
    
    UNIQUE(user_id, role_id)
);

-- Índices
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_user_roles_active ON user_roles(active);
CREATE INDEX idx_user_roles_expires ON user_roles(expires_at);

-- =====================================================
-- TABELA: Permissões Específicas de Usuários
-- =====================================================
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted BOOLEAN DEFAULT true,
    conditions_override JSONB,
    granted_by UUID REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    reason TEXT,
    
    UNIQUE(user_id, permission_id)
);

-- Índices
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_permission_id ON user_permissions(permission_id);
CREATE INDEX idx_user_permissions_granted ON user_permissions(granted);
CREATE INDEX idx_user_permissions_expires ON user_permissions(expires_at);

-- =====================================================
-- TABELA: Log de Auditoria
-- =====================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    session_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    execution_time INTEGER, -- em milissegundos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance de consultas de auditoria
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_success ON audit_logs(success);

-- Particionamento por mês (opcional para grandes volumes)
-- CREATE INDEX idx_audit_logs_created_monthly ON audit_logs(created_at) WHERE created_at >= date_trunc('month', NOW());

-- =====================================================
-- TABELA: Sessões de Usuários
-- =====================================================
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    location_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    active BOOLEAN DEFAULT true,
    ended_at TIMESTAMP WITH TIME ZONE,
    end_reason VARCHAR(50) -- 'logout', 'timeout', 'force_logout', 'expired'
);

-- Índices
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_active ON user_sessions(active);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_activity ON user_sessions(last_activity);

-- =====================================================
-- TABELA: Tentativas de Login
-- =====================================================
CREATE TABLE login_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255),
    ip_address INET NOT NULL,
    user_agent TEXT,
    success BOOLEAN DEFAULT false,
    failure_reason VARCHAR(100),
    user_id UUID REFERENCES users(id), -- NULL se falhou
    session_id UUID REFERENCES user_sessions(id),
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_success ON login_attempts(success);
CREATE INDEX idx_login_attempts_attempted ON login_attempts(attempted_at);

-- =====================================================
-- TRIGGERS: Atualização automática de timestamps
-- =====================================================
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNÇÃO: Verificar Permissão
-- =====================================================
CREATE OR REPLACE FUNCTION check_user_permission(
    p_user_id UUID,
    p_permission_name VARCHAR(100),
    p_resource_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    has_permission BOOLEAN := false;
    user_record RECORD;
    permission_record RECORD;
BEGIN
    -- Verificar se o usuário está ativo
    SELECT * INTO user_record FROM users WHERE id = p_user_id AND active = true;
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Buscar a permissão
    SELECT * INTO permission_record FROM permissions WHERE name = p_permission_name AND active = true;
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Verificar permissão específica do usuário
    IF EXISTS (
        SELECT 1 FROM user_permissions up
        WHERE up.user_id = p_user_id
        AND up.permission_id = permission_record.id
        AND up.granted = true
        AND up.active = true
        AND (up.expires_at IS NULL OR up.expires_at > NOW())
    ) THEN
        RETURN true;
    END IF;
    
    -- Verificar permissão através dos papéis
    IF EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        WHERE ur.user_id = p_user_id
        AND rp.permission_id = permission_record.id
        AND ur.active = true
        AND rp.granted = true
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    ) THEN
        RETURN true;
    END IF;
    
    RETURN false;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO: Registrar Ação de Auditoria
-- =====================================================
CREATE OR REPLACE FUNCTION log_audit_action(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_resource_type VARCHAR(100),
    p_resource_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_success BOOLEAN DEFAULT true,
    p_error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO audit_logs (
        user_id, action, resource_type, resource_id,
        old_values, new_values, success, error_message
    ) VALUES (
        p_user_id, p_action, p_resource_type, p_resource_id,
        p_old_values, p_new_values, p_success, p_error_message
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO: Limpar Logs de Auditoria Antigos
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(
    p_days_to_keep INTEGER DEFAULT 365
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs
    WHERE created_at < NOW() - INTERVAL '1 day' * p_days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- FUNÇÃO: Verificar Tentativas de Login Suspeitas
-- =====================================================
CREATE OR REPLACE FUNCTION check_suspicious_login_attempts(
    p_ip_address INET,
    p_email VARCHAR(255),
    p_time_window_minutes INTEGER DEFAULT 15,
    p_max_attempts INTEGER DEFAULT 5
)
RETURNS BOOLEAN AS $$
DECLARE
    attempt_count INTEGER;
BEGIN
    -- Contar tentativas falhadas no período
    SELECT COUNT(*) INTO attempt_count
    FROM login_attempts
    WHERE (ip_address = p_ip_address OR email = p_email)
    AND success = false
    AND attempted_at > NOW() - INTERVAL '1 minute' * p_time_window_minutes;
    
    RETURN attempt_count >= p_max_attempts;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- DADOS INICIAIS: Recursos do Sistema
-- =====================================================
INSERT INTO system_resources (name, description, module, resource_type) VALUES
-- Módulo de Usuários
('users.create', 'Criar novos usuários', 'users', 'action'),
('users.read', 'Visualizar usuários', 'users', 'data'),
('users.update', 'Atualizar dados de usuários', 'users', 'action'),
('users.delete', 'Excluir usuários', 'users', 'action'),

-- Módulo de Agendamentos
('appointments.create', 'Criar agendamentos', 'appointments', 'action'),
('appointments.read', 'Visualizar agendamentos', 'appointments', 'data'),
('appointments.update', 'Atualizar agendamentos', 'appointments', 'action'),
('appointments.cancel', 'Cancelar agendamentos', 'appointments', 'action'),
('appointments.schedule_others', 'Agendar para outros pacientes', 'appointments', 'action'),

-- Módulo de Exames
('exams.request', 'Solicitar exames', 'exams', 'action'),
('exams.view_results', 'Visualizar resultados de exames', 'exams', 'data'),
('exams.input_results', 'Inserir resultados de exames', 'exams', 'action'),
('exams.approve_results', 'Aprovar resultados de exames', 'exams', 'action'),

-- Módulo Administrativo
('admin.dashboard', 'Acessar dashboard administrativo', 'admin', 'feature'),
('admin.reports', 'Gerar relatórios', 'admin', 'action'),
('admin.system_settings', 'Configurar sistema', 'admin', 'action'),

-- Módulo de Contato
('contact.read', 'Visualizar mensagens de contato', 'contact', 'data'),
('contact.respond', 'Responder mensagens de contato', 'contact', 'action');

-- =====================================================
-- DADOS INICIAIS: Permissões
-- =====================================================
INSERT INTO permissions (name, description, resource_id, action) 
SELECT 
    sr.name,
    sr.description,
    sr.id,
    CASE 
        WHEN sr.resource_type = 'action' THEN 'execute'
        WHEN sr.resource_type = 'data' THEN 'read'
        WHEN sr.resource_type = 'feature' THEN 'access'
        ELSE 'use'
    END
FROM system_resources sr;

-- =====================================================
-- DADOS INICIAIS: Papéis
-- =====================================================
INSERT INTO roles (name, description, level, is_default) VALUES
('admin', 'Administrador do sistema com acesso total', 100, false),
('doctor', 'Médico com acesso a pacientes e exames', 80, false),
('receptionist', 'Recepcionista com acesso a agendamentos', 60, false),
('technician', 'Técnico com acesso a exames', 50, false),
('patient', 'Paciente com acesso limitado aos próprios dados', 10, true);

-- =====================================================
-- DADOS INICIAIS: Permissões por Papel
-- =====================================================

-- Permissões do Administrador (acesso total)
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.name = 'admin';

-- Permissões do Médico
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.name = 'doctor'
AND p.name IN (
    'appointments.read', 'appointments.update',
    'exams.request', 'exams.view_results', 'exams.approve_results',
    'users.read'
);

-- Permissões do Recepcionista
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.name = 'receptionist'
AND p.name IN (
    'appointments.create', 'appointments.read', 'appointments.update', 'appointments.cancel',
    'appointments.schedule_others',
    'users.read', 'users.update',
    'contact.read', 'contact.respond'
);

-- Permissões do Técnico
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.name = 'technician'
AND p.name IN (
    'exams.view_results', 'exams.input_results'
);

-- Permissões do Paciente
INSERT INTO role_permissions (role_id, permission_id, granted)
SELECT r.id, p.id, true
FROM roles r, permissions p
WHERE r.name = 'patient'
AND p.name IN (
    'appointments.create', 'appointments.read', 'appointments.update',
    'exams.view_results'
);

-- =====================================================
-- VIEWS ÚTEIS
-- =====================================================

-- View para permissões efetivas dos usuários
CREATE VIEW v_user_effective_permissions AS
SELECT DISTINCT
    u.id as user_id,
    u.name as user_name,
    u.email,
    p.name as permission_name,
    p.description as permission_description,
    'role' as source_type,
    r.name as source_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id AND ur.active = true
JOIN roles r ON ur.role_id = r.id AND r.active = true
JOIN role_permissions rp ON r.id = rp.role_id AND rp.granted = true
JOIN permissions p ON rp.permission_id = p.id AND p.active = true

UNION ALL

SELECT DISTINCT
    u.id as user_id,
    u.name as user_name,
    u.email,
    p.name as permission_name,
    p.description as permission_description,
    'direct' as source_type,
    'user_permission' as source_name
FROM users u
JOIN user_permissions up ON u.id = up.user_id AND up.granted = true
JOIN permissions p ON up.permission_id = p.id AND p.active = true
WHERE up.expires_at IS NULL OR up.expires_at > NOW();

-- View para auditoria simplificada
CREATE VIEW v_audit_summary AS
SELECT 
    DATE(created_at) as audit_date,
    action,
    resource_type,
    COUNT(*) as total_actions,
    COUNT(*) FILTER (WHERE success = true) as successful_actions,
    COUNT(*) FILTER (WHERE success = false) as failed_actions,
    COUNT(DISTINCT user_id) as unique_users
FROM audit_logs
GROUP BY DATE(created_at), action, resource_type
ORDER BY audit_date DESC, total_actions DESC;

-- =====================================================
-- COMENTÁRIOS FINAIS
-- =====================================================
COMMENT ON TABLE system_resources IS 'Recursos disponíveis no sistema';
COMMENT ON TABLE permissions IS 'Permissões específicas para recursos';
COMMENT ON TABLE roles IS 'Papéis/funções dos usuários';
COMMENT ON TABLE role_permissions IS 'Permissões associadas a cada papel';
COMMENT ON TABLE user_roles IS 'Papéis atribuídos aos usuários';
COMMENT ON TABLE user_permissions IS 'Permissões específicas dos usuários';
COMMENT ON TABLE audit_logs IS 'Log de auditoria de todas as ações do sistema';
COMMENT ON TABLE user_sessions IS 'Sessões ativas dos usuários';
COMMENT ON TABLE login_attempts IS 'Tentativas de login (sucesso e falha)';

-- Mensagem de conclusão
SELECT 'Migração 004 executada com sucesso! Sistema de permissões e auditoria criado.' as status;
