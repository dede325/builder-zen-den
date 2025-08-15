#!/usr/bin/env node

/**
 * Script de Configuração SQLite
 * Sistema da Clínica Bem Cuidar
 * Desenvolvido por: Kaijhe Morose
 */

const fs = require('fs');
const path = require('path');

// Verificar se better-sqlite3 está disponível
let Database;
try {
  Database = require('better-sqlite3');
} catch (error) {
  console.error('❌ better-sqlite3 não encontrado. Instalando...');
  const { execSync } = require('child_process');
  execSync('pnpm add better-sqlite3', { stdio: 'inherit' });
  Database = require('better-sqlite3');
}

const portalDataPath = path.join(__dirname, '../data/portal-data.json');
const contactDataPath = path.join(__dirname, '../data/contact-submissions.json');
const dbPath = path.join(__dirname, '../data/clinic.db');

// Criar diretório data se não existir
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Diretório data/ criado');
}

// Inicializar banco SQLite
console.log('🚀 Configurando banco SQLite...');
const db = new Database(dbPath);

// Configurações de performance
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('cache_size = 1000000');
db.pragma('foreign_keys = ON');

console.log('⚙️ Configurações de performance aplicadas');

// Criar tabelas
console.log('📋 Criando estrutura de tabelas...');

const createTables = `
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    birth_date DATE,
    document TEXT,
    document_type TEXT DEFAULT 'BI',
    address TEXT,
    blood_type TEXT,
    allergies TEXT,
    emergency_contact TEXT,
    insurance_provider TEXT,
    insurance_number TEXT,
    role TEXT DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'receptionist', 'admin')),
    active BOOLEAN DEFAULT 1,
    email_verified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    doctor_id TEXT,
    doctor_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER DEFAULT 30,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    type TEXT DEFAULT 'consultation' CHECK (type IN ('consultation', 'follow_up', 'emergency', 'procedure')),
    reason TEXT,
    symptoms TEXT,
    notes TEXT,
    doctor_notes TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'cancelled')),
    payment_amount DECIMAL(10,2),
    cancelled_at DATETIME,
    cancellation_reason TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id)
);

-- Tabela de resultados de exames
CREATE TABLE IF NOT EXISTS exam_results (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    request_id TEXT,
    exam_name TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    category TEXT,
    request_date DATE,
    collection_date DATE,
    exam_date DATE,
    result_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'final', 'cancelled')),
    viewed BOOLEAN DEFAULT 0,
    viewed_at DATETIME,
    doctor_name TEXT,
    results TEXT, -- JSON string
    normal_ranges TEXT, -- JSON string
    interpretation TEXT,
    recommendations TEXT,
    file_url TEXT,
    download_count INTEGER DEFAULT 0,
    last_downloaded_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id)
);

-- Tabela de configurações de notificação
CREATE TABLE IF NOT EXISTS notification_settings (
    user_id TEXT PRIMARY KEY,
    email_reminders BOOLEAN DEFAULT 1,
    sms_reminders BOOLEAN DEFAULT 0,
    exam_notifications BOOLEAN DEFAULT 1,
    appointment_reminders BOOLEAN DEFAULT 1,
    health_tips BOOLEAN DEFAULT 0,
    marketing_emails BOOLEAN DEFAULT 0,
    emergency_alerts BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de submissões de contato
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT CHECK (subject IN ('consulta', 'duvida', 'sugestao', 'reclamacao')),
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'responded', 'archived')),
    response TEXT,
    responded_by TEXT,
    responded_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de sessões
CREATE TABLE IF NOT EXISTS user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    session_token TEXT UNIQUE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    active BOOLEAN DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de log de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id TEXT,
    old_values TEXT, -- JSON string
    new_values TEXT, -- JSON string
    ip_address TEXT,
    success BOOLEAN DEFAULT 1,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

db.exec(createTables);
console.log('✅ Tabelas criadas com sucesso');

// Criar índices para performance
console.log('🔍 Criando índices...');

const createIndexes = `
-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(active);

-- Índices para appointments
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_datetime ON appointments(appointment_date, appointment_time);

-- Índices para exam_results
CREATE INDEX IF NOT EXISTS idx_exam_results_patient_id ON exam_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_exam_results_status ON exam_results(status);
CREATE INDEX IF NOT EXISTS idx_exam_results_date ON exam_results(result_date);
CREATE INDEX IF NOT EXISTS idx_exam_results_viewed ON exam_results(viewed);

-- Índices para contact_submissions
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Índices para user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_active ON user_sessions(active);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
`;

db.exec(createIndexes);
console.log('✅ Índices criados com sucesso');

// Inserir dados mock se disponíveis
if (fs.existsSync(portalDataPath)) {
  console.log('📊 Carregando dados mock do portal...');
  
  const portalData = JSON.parse(fs.readFileSync(portalDataPath, 'utf8'));
  
  // Preparar statements
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users 
    (id, email, password_hash, name, phone, birth_date, document, document_type, address, 
     blood_type, allergies, emergency_contact, insurance_provider, insurance_number, 
     role, active, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const insertAppointment = db.prepare(`
    INSERT OR REPLACE INTO appointments 
    (id, patient_id, doctor_id, doctor_name, specialty, appointment_date, appointment_time, 
     duration, status, type, reason, symptoms, notes, doctor_notes, payment_status, 
     payment_amount, cancelled_at, cancellation_reason, completed_at, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const insertExamResult = db.prepare(`
    INSERT OR REPLACE INTO exam_results 
    (id, patient_id, request_id, exam_name, exam_type, category, request_date, 
     collection_date, exam_date, result_date, status, viewed, viewed_at, doctor_name, 
     results, normal_ranges, interpretation, recommendations, file_url, download_count, 
     last_downloaded_at, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const insertNotificationSettings = db.prepare(`
    INSERT OR REPLACE INTO notification_settings 
    (user_id, email_reminders, sms_reminders, exam_notifications, appointment_reminders, 
     health_tips, marketing_emails, emergency_alerts) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Inserir pacientes
  portalData.patients.forEach(patient => {
    // Gerar hash de senha simples para desenvolvimento
    const passwordHash = '$2b$10$dummy.hash.for.development.only';
    
    insertUser.run(
      patient.id,
      patient.email,
      passwordHash,
      patient.name,
      patient.phone || null,
      patient.birthDate || null,
      patient.document || null,
      patient.documentType || 'BI',
      patient.address || null,
      patient.bloodType || null,
      patient.allergies || null,
      patient.emergencyContact || null,
      patient.insuranceProvider || null,
      patient.insuranceNumber || null,
      patient.role || 'patient',
      patient.active ? 1 : 0,
      patient.createdAt || new Date().toISOString(),
      patient.updatedAt || new Date().toISOString()
    );
  });
  
  console.log(`✅ ${portalData.patients.length} usuários inseridos`);
  
  // Inserir agendamentos
  portalData.appointments.forEach(appointment => {
    insertAppointment.run(
      appointment.id,
      appointment.patientId,
      appointment.doctorId || null,
      appointment.doctor,
      appointment.specialty,
      appointment.date,
      appointment.time,
      appointment.duration || 30,
      appointment.status || 'scheduled',
      appointment.type || 'consultation',
      appointment.reason || null,
      appointment.symptoms || null,
      appointment.notes || null,
      appointment.doctorNotes || null,
      appointment.paymentStatus || 'pending',
      appointment.paymentAmount || null,
      appointment.cancelledAt || null,
      appointment.cancellationReason || null,
      appointment.completedAt || null,
      appointment.createdAt || new Date().toISOString(),
      appointment.updatedAt || new Date().toISOString()
    );
  });
  
  console.log(`✅ ${portalData.appointments.length} agendamentos inseridos`);
  
  // Inserir resultados de exames
  portalData.examResults.forEach(exam => {
    insertExamResult.run(
      exam.id,
      exam.patientId,
      exam.requestId || null,
      exam.name,
      exam.type,
      exam.category || null,
      exam.requestDate || null,
      exam.collectionDate || null,
      exam.examDate || exam.date,
      exam.resultDate || exam.date,
      exam.status || 'final',
      exam.viewed ? 1 : 0,
      exam.viewedAt || null,
      exam.doctorName || null,
      exam.results ? JSON.stringify(exam.results) : null,
      exam.normalRanges ? JSON.stringify(exam.normalRanges) : null,
      exam.interpretation || null,
      exam.recommendations || null,
      exam.fileUrl || null,
      exam.downloadCount || 0,
      exam.lastDownloaded || null,
      exam.createdAt || new Date().toISOString(),
      exam.updatedAt || new Date().toISOString()
    );
  });
  
  console.log(`✅ ${portalData.examResults.length} resultados de exames inseridos`);
  
  // Inserir configurações de notificação
  Object.entries(portalData.notificationSettings || {}).forEach(([userId, settings]) => {
    insertNotificationSettings.run(
      userId,
      settings.emailReminders ? 1 : 0,
      settings.smsReminders ? 1 : 0,
      settings.examNotifications ? 1 : 0,
      settings.appointmentReminders ? 1 : 0,
      settings.healthTips ? 1 : 0,
      settings.marketingEmails ? 1 : 0,
      settings.emergencyAlerts ? 1 : 0
    );
  });
  
  console.log(`✅ Configurações de notificação inseridas`);
} else {
  console.log('⚠️ Arquivo portal-data.json não encontrado, pulando dados mock');
}

// Inserir dados de contato se disponíveis
if (fs.existsSync(contactDataPath)) {
  console.log('📮 Carregando submissões de contato...');
  
  const contactData = JSON.parse(fs.readFileSync(contactDataPath, 'utf8'));
  
  const insertContact = db.prepare(`
    INSERT OR REPLACE INTO contact_submissions 
    (id, name, email, phone, subject, message, status, response, responded_by, 
     responded_at, created_at, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  contactData.submissions.forEach(submission => {
    insertContact.run(
      submission.id,
      submission.name,
      submission.email,
      submission.phone || null,
      submission.subject,
      submission.message,
      submission.status || 'pending',
      submission.response || null,
      submission.responded_by || null,
      submission.responded_at || null,
      submission.submitted_at || submission.created_at || new Date().toISOString(),
      submission.updated_at || new Date().toISOString()
    );
  });
  
  console.log(`✅ ${contactData.submissions.length} submissões de contato inseridas`);
} else {
  console.log('⚠️ Arquivo contact-submissions.json não encontrado, pulando dados de contato');
}

// Verificar integridade do banco
console.log('🔍 Verificando integridade do banco...');

const checkIntegrity = db.prepare("PRAGMA integrity_check").get();
if (checkIntegrity.integrity_check === 'ok') {
  console.log('✅ Integridade do banco verificada');
} else {
  console.error('❌ Problemas de integridade encontrados:', checkIntegrity);
}

// Mostrar estatísticas
console.log('\n📈 Estatísticas do banco:');

const stats = {
  users: db.prepare("SELECT COUNT(*) as count FROM users").get().count,
  appointments: db.prepare("SELECT COUNT(*) as count FROM appointments").get().count,
  examResults: db.prepare("SELECT COUNT(*) as count FROM exam_results").get().count,
  contactSubmissions: db.prepare("SELECT COUNT(*) as count FROM contact_submissions").get().count
};

console.log(`👥 Usuários: ${stats.users}`);
console.log(`📅 Agendamentos: ${stats.appointments}`);
console.log(`🔬 Resultados de exames: ${stats.examResults}`);
console.log(`📧 Submissões de contato: ${stats.contactSubmissions}`);

// Fechar conexão
db.close();

console.log('\n🎉 Configuração SQLite concluída com sucesso!');
console.log(`📁 Banco criado em: ${dbPath}`);
console.log('🚀 Execute "pnpm dev" para iniciar o servidor');

// Mostrar dicas de login
console.log('\n🔐 Contas de teste disponíveis:');
console.log('   paciente@example.com / 123456 (Paciente)');
console.log('   admin@bemcuidar.co.ao / admin123 (Admin)');
console.log('   medico@bemcuidar.co.ao / medico123 (Médico)');
console.log('   recepcao@bemcuidar.co.ao / recepcao123 (Recepcionista)');
