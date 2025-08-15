# 🗄️ Configuração SQLite e Dados Mock

Este documento explica como o sistema utiliza SQLite para desenvolvimento local e como os dados mock estão organizados.

## 📋 Índice

- [Sobre o SQLite](#sobre-o-sqlite)
- [Estrutura de Dados Mock](#estrutura-de-dados-mock)
- [Configuração Local](#configuração-local)
- [Migrações](#migrações)
- [Dados de Teste](#dados-de-teste)
- [Scripts Úteis](#scripts-úteis)

## 🎯 Sobre o SQLite

O sistema da **Clínica Bem Cuidar** utiliza SQLite como banco de dados local para desenvolvimento, oferecendo:

### ✅ Vantagens do SQLite

- **Zero configuração** - Não requer instalação de servidor
- **Arquivo único** - Todo o banco em um arquivo `.db`
- **Compatibilidade** - Funciona em qualquer sistema operacional
- **Performance** - Rápido para desenvolvimento e testes
- **Portabilidade** - Fácil backup e compartilhamento

### 🔄 Migração para Produção

- **Desenvolvimento**: SQLite (local)
- **Produção**: PostgreSQL via Supabase
- **Scripts de migração** disponíveis em `/migrations/`

## 📁 Estrutura de Dados Mock

### Arquivos de Dados Mock

```
data/
├── portal-data.json      # Dados do portal do paciente
├── contact-submissions.json  # Submissões de contato
└── clinic.db            # Banco SQLite (gerado automaticamente)
```

### Portal Data (`portal-data.json`)

#### Estrutura Principal

```json
{
  "patients": [], // Pacientes cadastrados
  "appointments": [], // Agendamentos
  "examResults": [], // Resultados de exames
  "notificationSettings": {}, // Configurações de notificação
  "systemStats": {}, // Estatísticas do sistema
  "loginHints": [] // Dicas de login para desenvolvimento
}
```

#### Dados de Pacientes

```json
{
  "id": "1",
  "name": "João Silva",
  "email": "paciente@example.com",
  "phone": "+244 945 123 456",
  "birthDate": "1985-06-15",
  "document": "123456789BA",
  "documentType": "BI",
  "address": "Avenida 21 de Janeiro, 123, Benfica, Luanda",
  "bloodType": "O+",
  "allergies": "Penicilina",
  "emergencyContact": "Maria Silva - +244 945 654 321",
  "insuranceProvider": "SAUDE MAIS",
  "insuranceNumber": "SM123456",
  "role": "patient",
  "active": true,
  "createdAt": "2024-12-01T08:30:00.000Z",
  "updatedAt": "2025-01-15T10:15:00.000Z"
}
```

#### Dados de Agendamentos

```json
{
  "id": "1",
  "patientId": "1",
  "doctorId": "3",
  "specialty": "Cardiologia",
  "doctor": "Dr. António Silva",
  "date": "2025-01-25",
  "time": "14:30",
  "duration": 30,
  "status": "scheduled",
  "type": "consultation",
  "reason": "Consulta de rotina cardiológica",
  "symptoms": "Dor no peito ocasional",
  "paymentStatus": "pending",
  "paymentAmount": 150.0
}
```

#### Dados de Exames

```json
{
  "id": "1",
  "patientId": "1",
  "name": "Hemograma Completo",
  "type": "Análise Clínica",
  "category": "laboratorio",
  "status": "final",
  "viewed": true,
  "results": {
    "hemoglobina": "14.5 g/dL",
    "leucocitos": "7.200/mm³"
  },
  "normalRanges": {
    "hemoglobina": "12-16 g/dL",
    "leucocitos": "4.000-11.000/mm³"
  },
  "interpretation": "Resultado dentro dos parâmetros normais"
}
```

### Contact Submissions (`contact-submissions.json`)

```json
{
  "submissions": [
    {
      "id": 1,
      "name": "Ana Costa",
      "email": "ana@example.com",
      "phone": "+244 923 456 789",
      "subject": "consulta",
      "message": "Gostaria de agendar uma consulta de cardiologia",
      "status": "pending",
      "submitted_at": "2025-01-10T14:30:00Z"
    }
  ]
}
```

## ⚙️ Configuração Local

### 1. Instalação de Dependências

```bash
# Instalar dependências do projeto
pnpm install

# SQLite já está incluído nas dependências
```

### 2. Configuração do Banco SQLite

O sistema cria automaticamente o banco SQLite quando necessário:

```typescript
// server/storage.ts
import Database from "better-sqlite3";

const db = new Database("data/clinic.db");

// Criação automática de tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'patient',
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
```

### 3. Variáveis de Ambiente

```env
# .env
NODE_ENV=development
DATABASE_URL=file:./data/clinic.db  # SQLite local
PORT=8080

# Para produção (PostgreSQL/Supabase)
# DATABASE_URL=postgresql://user:pass@host:5432/clinic_db
```

## 🔄 Migrações

### Scripts de Migração

```bash
# Executar migrações SQLite (desenvolvimento)
pnpm run db:migrate

# Executar migrações PostgreSQL (produção)
pnpm run db:migrate:prod

# Reset do banco (desenvolvimento)
pnpm run db:reset

# Seed com dados mock
pnpm run db:seed
```

### Arquivo de Migração SQLite

```sql
-- migrations/sqlite/001_initial.sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    document TEXT,
    role TEXT DEFAULT 'patient',
    active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER REFERENCES users(id),
    doctor_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exam_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER REFERENCES users(id),
    exam_name TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    exam_date DATE NOT NULL,
    status TEXT DEFAULT 'pending',
    results TEXT, -- JSON string
    file_path TEXT,
    viewed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dados iniciais
INSERT OR IGNORE INTO users (email, password_hash, name, phone, role) VALUES
('paciente@example.com', '$2b$10$dummy', 'João Silva', '+244 945 123 456', 'patient'),
('admin@bemcuidar.co.ao', '$2b$10$dummy', 'Administrador', '+244 945 000 001', 'admin'),
('medico@bemcuidar.co.ao', '$2b$10$dummy', 'Dr. António Silva', '+244 945 111 333', 'doctor');
```

## 📊 Dados de Teste

### Contas de Login para Desenvolvimento

| Email                      | Senha         | Papel        | Descrição         |
| -------------------------- | ------------- | ------------ | ----------------- |
| `paciente@example.com`     | `123456`      | Patient      | Conta de paciente |
| `admin@bemcuidar.co.ao`    | `admin123`    | Admin        | Administrador     |
| `medico@bemcuidar.co.ao`   | `medico123`   | Doctor       | Médico            |
| `recepcao@bemcuidar.co.ao` | `recepcao123` | Receptionist | Recepcionista     |

### Dados de Exemplo

#### Pacientes Mock

- **João Silva** - Paciente com histórico médico completo
- **Maria Santos** - Paciente pediátrico

#### Agendamentos Mock

- Consultas agendadas, completadas e canceladas
- Diferentes especialidades e status
- Histórico de pagamentos

#### Exames Mock

- Hemograma completo com resultados normais
- ECG com interpretação
- Exames visualizados e não visualizados
- Arquivos PDF simulados

## 🛠️ Scripts Úteis

### Package.json Scripts

```json
{
  "scripts": {
    "db:migrate": "node scripts/migrate-sqlite.js",
    "db:migrate:prod": "node scripts/migrate-postgres.js",
    "db:seed": "node scripts/seed-data.js",
    "db:reset": "node scripts/reset-db.js",
    "db:backup": "node scripts/backup-sqlite.js",
    "db:inspect": "sqlite3 data/clinic.db"
  }
}
```

### Script de Migração SQLite

```javascript
// scripts/migrate-sqlite.js
const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const db = new Database("data/clinic.db");

// Executar migrações
const migrationDir = path.join(__dirname, "../migrations/sqlite");
const migrations = fs.readdirSync(migrationDir).sort();

console.log("🚀 Executando migrações SQLite...");

migrations.forEach((file) => {
  if (file.endsWith(".sql")) {
    console.log(`📄 Executando ${file}...`);
    const sql = fs.readFileSync(path.join(migrationDir, file), "utf8");
    db.exec(sql);
    console.log(`✅ ${file} executado com sucesso`);
  }
});

console.log("🎉 Migrações concluídas!");
db.close();
```

### Script de Seed

```javascript
// scripts/seed-data.js
const Database = require("better-sqlite3");
const portalData = require("../data/portal-data.json");

const db = new Database("data/clinic.db");

console.log("🌱 Populando banco com dados mock...");

// Inserir pacientes
const insertUser = db.prepare(`
  INSERT OR REPLACE INTO users 
  (id, email, name, phone, document, role, active) 
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

portalData.patients.forEach((patient) => {
  insertUser.run(
    patient.id,
    patient.email,
    patient.name,
    patient.phone,
    patient.document,
    patient.role,
    patient.active ? 1 : 0,
  );
});

console.log(`✅ ${portalData.patients.length} pacientes inseridos`);

// Inserir agendamentos
const insertAppointment = db.prepare(`
  INSERT OR REPLACE INTO appointments 
  (id, patient_id, doctor_name, specialty, appointment_date, appointment_time, status) 
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

portalData.appointments.forEach((appointment) => {
  insertAppointment.run(
    appointment.id,
    appointment.patientId,
    appointment.doctor,
    appointment.specialty,
    appointment.date,
    appointment.time,
    appointment.status,
  );
});

console.log(`✅ ${portalData.appointments.length} agendamentos inseridos`);

console.log("🎉 Dados mock carregados com sucesso!");
db.close();
```

### Comandos de Desenvolvimento

```bash
# Verificar estrutura do banco
sqlite3 data/clinic.db ".schema"

# Consultar dados
sqlite3 data/clinic.db "SELECT * FROM users;"

# Backup do banco
cp data/clinic.db data/clinic-backup-$(date +%Y%m%d).db

# Reset completo
rm data/clinic.db && pnpm run db:migrate && pnpm run db:seed
```

## 🔧 Troubleshooting

### Problemas Comuns

#### Erro: "Database locked"

```bash
# Verificar processos usando o banco
lsof data/clinic.db

# Forçar fechamento e reiniciar
pkill -f clinic.db
pnpm dev
```

#### Banco corrompido

```bash
# Verificar integridade
sqlite3 data/clinic.db "PRAGMA integrity_check;"

# Reparar se necessário
sqlite3 data/clinic.db ".recover" | sqlite3 data/clinic-recovered.db
```

#### Reset completo

```bash
# Remover banco e recriar
rm -f data/clinic.db
pnpm run db:migrate
pnpm run db:seed
```

## 📈 Performance

### Otimizações SQLite

```sql
-- Configurações de performance
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = 1000000;
PRAGMA foreign_keys = ON;
PRAGMA temp_store = MEMORY;

-- Índices importantes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_exams_patient ON exam_results(patient_id);
```

---

> **Desenvolvido por Kaijhe Morose para a Clínica Bem Cuidar**  
> Sistema completo de gestão clínica com SQLite para desenvolvimento e PostgreSQL para produção.
