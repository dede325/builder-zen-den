# 🏥 Sistema de Clínica Médica Bem Cuidar

> **Desenvolvido por Kaijhe Morose** | Sistema completo de gestão clínica com portal do paciente

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades](#funcionalidades)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Portal do Paciente](#portal-do-paciente)
- [Dados Mock e SQLite](#dados-mock-e-sqlite)
- [Migrações PostgreSQL/Supabase](#migrações-postgresqlsupabase)
- [Deploy e Produção](#deploy-e-produção)
- [Contribuição](#contribuição)
- [Licença](#licença)

## 🎯 Sobre o Projeto

O **Sistema de Clínica Médica Bem Cuidar** é uma aplicação web completa desenvolvida para gestão de clínicas médicas, com foco em atendimento humanizado e tecnologia moderna. O sistema oferece um website institucional e um portal completo para pacientes.

### Características Principais

- ✅ **Website Institucional** - Apresentação da clínica, especialidades e serviços
- 👥 **Portal do Paciente** - Área restrita para pacientes com funcionalidades completas
- 📱 **Design Responsivo** - Compatível com desktop, tablet e mobile
- 🔐 **Sistema de Autenticação** - Login seguro com diferentes níveis de acesso
- 📊 **Dashboard Administrativo** - Gestão completa de dados e relatórios
- 💌 **Sistema de Contato** - Formulário inteligente com validações
- 📧 **Notificações por Email** - Sistema automatizado de comunicação
- 🏥 **Gestão de Especialidades** - Catálogo completo de serviços médicos

## 🚀 Tecnologias Utilizadas

### Frontend

- **React 18** - Biblioteca principal para interface de usuário
- **TypeScript** - Tipagem estática para maior segurança
- **React Router 6** - Roteamento SPA (Single Page Application)
- **TailwindCSS 3** - Framework de estilos utilitários
- **Radix UI** - Componentes acessíveis e modernos
- **Lucide React** - Biblioteca de ícones SVG
- **Vite** - Build tool e servidor de desenvolvimento

### Backend

- **Express.js** - Framework web para Node.js
- **TypeScript** - Tipagem para o servidor
- **Zod** - Validação de schemas
- **Nodemailer** - Envio de emails
- **SQLite** - Banco de dados local para desenvolvimento
- **PostgreSQL** - Banco de dados para produção (via Supabase)

### Ferramentas de Desenvolvimento

- **PNPM** - Gerenciador de pacotes eficiente
- **Vitest** - Framework de testes
- **Prettier** - Formatação de código
- **ESLint** - Análise estática de código

## ⚡ Funcionalidades

### Website Institucional

#### 🏠 Página Principal

- Slider de imagens com controles interativos
- Seções de especialidades médicas
- Informações sobre a clínica
- Formulário de contato integrado
- Horários de funcionamento

#### 🩺 Especialidades Médicas

O sistema inclui as seguintes especialidades com informações detalhadas:

1. **Cardiologia** - Cuidados especializados do coração
2. **Pediatria** - Atendimento dedicado às crianças
3. **Cirurgia Geral** - Procedimentos cirúrgicos seguros
4. **Dermatologia** - Saúde e beleza da pele
5. **Neurologia** - Cuidados do sistema nervoso
6. **Ginecologia-Obstetrícia** - Saúde da mulher
7. **Ortopedia** - Saúde dos ossos e articulações
8. **Otorrinolaringologia** - Ouvido, nariz e garganta
9. **Urologia** - Sistema urinário e reprodutor
10. **Endocrinologia** - Hormônios e metabolismo
11. **Gastroenterologia** - Sistema digestivo
12. **Medicina do Trabalho** - Saúde ocupacional

#### 📋 Sistema de Exames

- Catálogo completo de exames disponíveis
- Informações detalhadas sobre procedimentos
- Orientações para pacientes

### Portal do Paciente

#### 🔐 Sistema de Autenticação

- Login seguro com validação
- Diferentes níveis de acesso (paciente, admin)
- Sistema de permissões granular
- Logout automático por segurança

#### 👤 Perfil do Paciente

- Dados pessoais editáveis
- Histórico médico
- Configurações de notificações
- Preferências de comunicação

#### 📅 Agendamento de Consultas

- Interface intuitiva para agendamentos
- Visualização de horários disponíveis
- Histórico de consultas
- Reagendamento e cancelamento
- Notificações automáticas

#### 🔬 Resultados de Exames

- Acesso seguro aos resultados
- Download de arquivos PDF
- Histórico completo de exames
- Status de visualização
- Estatísticas pessoais

#### 📊 Dashboard Personalizado

- Resumo de atividades
- Próximos compromissos
- Alertas importantes
- Métricas de saúde

## 📁 Estrutura do Projeto

```
projeto/
├── client/                   # Frontend React
│   ├── components/          # Componentes React
│   │   ├── ui/             # Biblioteca de componentes UI
│   │   ├── SpecialtyModal.tsx
│   │   └── SpecialtyTemplate.tsx
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # Utilitários e funções
│   ├── pages/              # Páginas da aplicação
│   │   ├── specialties/    # Páginas de especialidades
│   │   ├── Admin.tsx       # Dashboard administrativo
│   │   ├── Contato.tsx     # Página de contato
│   │   ├── Exames.tsx      # Página de exames
│   │   ├── Index.tsx       # Página inicial
│   │   ├── Portal.tsx      # Portal do paciente
│   │   └── Sobre.tsx       # Página sobre
│   ├── App.tsx             # Componente principal
│   └── global.css          # Estilos globais
├── server/                  # Backend Express
│   ├── routes/             # Handlers das rotas API
│   │   ├── contact.ts      # Rotas de contato
│   │   ├── portal-auth.ts  # Autenticação do portal
│   │   ├── portal-patients.ts # Dados de pacientes
│   │   ├── portal-appointments.ts # Agendamentos
│   │   ├── portal-exams.ts # Resultados de exames
│   │   └── ...
│   ├── email.ts            # Sistema de emails
│   ├── index.ts            # Servidor principal
│   ���── storage.ts          # Armazenamento de dados
│   └── types.ts            # Tipos TypeScript
├── shared/                  # Código compartilhado
│   ├── api.ts              # Interfaces de API
│   ├── permissions.ts      # Sistema de permissões
│   └── portal.ts           # Tipos do portal
├── data/                   # Dados mock para desenvolvimento
│   ├── contact-submissions.json
│   └── portal-data.json
├── migrations/             # Arquivos de migração SQL
│   ├── 001_initial_setup.sql
│   ├── 002_users_and_auth.sql
│   └── ...
└── docs/                   # Documentação adicional
    └── api.md              # Documentação da API
```

## 🔧 Instalação e Configuração

### Pré-requisitos

- **Node.js** 18+
- **PNPM** (recomendado) ou npm
- **Git**

### Passos de Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/clinica-bem-cuidar.git
cd clinica-bem-cuidar
```

2. **Instale as dependências**

```bash
pnpm install
# ou
npm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do servidor
PORT=8080
NODE_ENV=development

# Configurações de email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
EMAIL_FROM=seu-email@gmail.com

# Configurações do banco de dados
DATABASE_URL=file:./dev.db  # Para SQLite local
# DATABASE_URL=postgresql://user:pass@host:5432/db  # Para PostgreSQL

# Chaves de segurança
JWT_SECRET=sua-chave-secreta-muito-segura
SESSION_SECRET=outra-chave-secreta

# Configurações específicas
PING_MESSAGE=pong
```

4. **Execute as migrações do banco de dados**

```bash
# Para SQLite (desenvolvimento)
pnpm run db:migrate

# Para PostgreSQL/Supabase (produção)
pnpm run db:migrate:prod
```

5. **Inicie o servidor de desenvolvimento**

```bash
pnpm dev
```

6. **Acesse a aplicação**

- Frontend: http://localhost:8080
- API: http://localhost:8080/api

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
pnpm dev          # Inicia servidor de desenvolvimento
pnpm dev:client   # Apenas frontend
pnpm dev:server   # Apenas backend
```

### Build e Produção

```bash
pnpm build        # Build completo (cliente + servidor)
pnpm build:client # Build apenas do frontend
pnpm build:server # Build apenas do backend
pnpm start        # Inicia servidor de produção
```

### Testes

```bash
pnpm test         # Executa todos os testes
pnpm test:watch   # Testes em modo watch
pnpm test:ui      # Interface gráfica dos testes
```

### Banco de Dados

```bash
pnpm db:migrate     # Executa migrações SQLite
pnpm db:migrate:prod # Executa migrações PostgreSQL
pnpm db:seed        # Popula banco com dados mock
pnpm db:reset       # Reseta banco de dados
```

### Qualidade de Código

```bash
pnpm typecheck    # Verificação de tipos TypeScript
pnpm format       # Formatar código com Prettier
pnpm format:fix   # Corrigir formatação automaticamente
pnpm lint         # Verificar código com ESLint
pnpm lint:fix     # Corrigir problemas do ESLint
```

## 👥 Portal do Paciente

### Credenciais de Teste

Para testar o portal do paciente, utilize:

```
Email: paciente@example.com
Senha: 123456

Email: admin@bemcuidar.co.ao
Senha: admin123
```

### Funcionalidades do Portal

#### Área do Paciente

- **Dashboard** - Visão geral das atividades
- **Perfil** - Gerenciamento de dados pessoais
- **Consultas** - Agendamento e histórico
- **Exames** - Resultados e downloads
- **Notificações** - Configurações de comunicação

#### Área Administrativa

- **Gestão de Pacientes** - CRUD completo
- **Agendamentos** - Controle de consultas
- **Relatórios** - Estatísticas e métricas
- **Configurações** - Parâmetros do sistema

### Níveis de Permissão

1. **Paciente** - Acesso limitado aos próprios dados
2. **Recepcionista** - Gestão de agendamentos
3. **Médico** - Acesso a pacientes e resultados
4. **Administrador** - Acesso completo ao sistema

## 🗄️ Dados Mock e SQLite

### Estrutura de Dados Mock

O sistema utiliza arquivos JSON para simular dados em desenvolvimento:

#### `data/portal-data.json`

```json
{
  "users": [
    {
      "id": 1,
      "email": "paciente@example.com",
      "name": "João Silva",
      "role": "patient",
      "phone": "+244 912 345 678"
    }
  ],
  "appointments": [
    {
      "id": 1,
      "patientId": 1,
      "doctor": "Dra. Maria Santos",
      "specialty": "Cardiologia",
      "date": "2025-01-20T10:00:00Z",
      "status": "scheduled"
    }
  ],
  "examResults": [
    {
      "id": 1,
      "patientId": 1,
      "type": "Hemograma Completo",
      "date": "2025-01-15T09:00:00Z",
      "status": "completed",
      "fileUrl": "/files/exams/hemograma_123.pdf"
    }
  ]
}
```

#### `data/contact-submissions.json`

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
      "submitted_at": "2025-01-10T14:30:00Z",
      "status": "pending"
    }
  ]
}
```

### Configuração SQLite

Para desenvolvimento local, o sistema usa SQLite:

```typescript
// server/storage.ts
import Database from "better-sqlite3";

const db = new Database("data/clinic.db");

// Criação de tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'patient',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
```

## 🐘 Migrações PostgreSQL/Supabase

### Estrutura das Migrações

As migrações estão organizadas em arquivos SQL numerados:

#### `migrations/001_initial_setup.sql`

```sql
-- Criação das tabelas principais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'patient',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de especialidades
CREATE TABLE specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de médicos
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    crm VARCHAR(20) UNIQUE NOT NULL,
    specialty_id UUID REFERENCES specialties(id),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `migrations/002_appointments.sql`

```sql
-- Tabela de agendamentos
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
    specialty_id UUID REFERENCES specialties(id),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(scheduled_date);
CREATE INDEX idx_appointments_status ON appointments(status);
```

#### `migrations/003_exams.sql`

```sql
-- Tabela de tipos de exames
CREATE TABLE exam_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    preparation_instructions TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de resultados de exames
CREATE TABLE exam_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    exam_type_id UUID REFERENCES exam_types(id),
    doctor_id UUID REFERENCES doctors(id),
    exam_date TIMESTAMP WITH TIME ZONE NOT NULL,
    result_file_url TEXT,
    result_text TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    viewed_by_patient BOOLEAN DEFAULT false,
    viewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Como Executar as Migrações

#### Para Supabase

1. Acesse o dashboard do Supabase
2. Vá para SQL Editor
3. Execute cada arquivo de migração em ordem
4. Verifique a criação das tabelas

#### Via CLI (se configurado)

```bash
# Instalar Supabase CLI
npm install -g @supabase/cli

# Login no Supabase
supabase login

# Executar migrações
supabase db push
```

## 🚀 Deploy e Produção

### Opções de Deploy

#### 1. Netlify (Recomendado)

```bash
# Build para produção
pnpm build

# Deploy via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### 2. Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### 3. Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
EXPOSE 8080

CMD ["node", "dist/server/index.js"]
```

### Configurações de Produção

#### Variáveis de Ambiente

```env
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://user:pass@host:5432/clinic_db
JWT_SECRET=chave-super-secreta-produção
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=sua-api-key-sendgrid
```

#### Otimizações

- Compressão gzip habilitada
- Cache de assets estáticos
- Minificação de CSS/JS
- Otimização de imagens
- CDN para assets

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Padrões de Código

- Use **TypeScript** para type safety
- Siga as convenções do **Prettier**
- Mantenha **cobertura de testes** acima de 80%
- Documente APIs com **JSDoc**
- Use **commits semânticos**

### Issues e Bug Reports

Ao reportar bugs, inclua:

- Descrição detalhada do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots se aplicável
- Informações do ambiente (OS, browser, etc.)

## 📄 Licença

Este projeto foi desenvolvido por **Kaijhe Morose** para a **Clínica Bem Cuidar**.

```
Copyright (c) 2025 Kaijhe Morose & Clínica Bem Cuidar
Todos os direitos reservados.

Este software é proprietário e confidencial.
Não é permitida a reprodução, distribuição ou
uso sem autorização expressa do autor.
```

## 📞 Suporte e Contato

### Desenvolvedor

- **Nome**: Kaijhe Morose
- **Email**: kaijhe@bestservices.ao
- **Website**: https://bestservices.ao
- **LinkedIn**: [Kaijhe Morose](https://linkedin.com/in/kaijhe)

### Clínica Bem Cuidar

- **Endereço**: Av. 21 de Janeiro, Nº 351, Benfica, Luanda
- **Telefone**: +244 945 344 650
- **Email**: recepcao@bemcuidar.co.ao
- **Website**: https://bemcuidar.co.ao

---

> **"Cuidar é Amar"** - Clínica Bem Cuidar

_Sistema desenvolvido com ❤️ por Kaijhe Morose usando tecnologias modernas e boas práticas de desenvolvimento._
