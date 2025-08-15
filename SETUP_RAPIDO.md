# 🚀 Setup Rápido - Clínica Bem Cuidar

**Desenvolvido por Kaijhe Morose**

## ⚡ Início Rápido (3 minutos)

### 1. Instalar Dependências
```bash
pnpm install
```

### 2. Configurar Banco SQLite
```bash
pnpm run db:setup
```

### 3. Iniciar Servidor
```bash
pnpm dev
```

### 4. Acessar Sistema
- **Frontend**: http://localhost:8080
- **Portal**: http://localhost:8080/portal

---

## 🔐 Contas de Teste

| Email | Senha | Papel | Acesso |
|-------|-------|-------|--------|
| `paciente@example.com` | `123456` | Paciente | Portal básico |
| `admin@bemcuidar.co.ao` | `admin123` | Admin | Acesso total |
| `medico@bemcuidar.co.ao` | `medico123` | Médico | Consultas/Exames |
| `recepcao@bemcuidar.co.ao` | `recepcao123` | Recepcionista | Agendamentos |

---

## 📁 Estrutura Principal

```
projeto/
├── client/          # Frontend React
├── server/          # Backend Express  
├── data/           # Dados mock SQLite
├── migrations/     # SQL para PostgreSQL
└── docs/          # Documentação
```

---

## 🛠️ Scripts Úteis

```bash
# Desenvolvimento
pnpm dev              # Iniciar servidor
pnpm test             # Executar testes
pnpm typecheck        # Verificar tipos

# Banco de Dados
pnpm run db:setup     # Configurar SQLite
pnpm run db:reset     # Reset completo
pnpm run db:backup    # Backup SQLite

# Build
pnpm build            # Build produção
pnpm start            # Servidor produção
```

---

## 🌟 Funcionalidades

### ✅ Website Institucional
- Página inicial com slider
- 12+ Especialidades médicas
- Formulário de contato
- Design responsivo

### ✅ Portal do Paciente
- Dashboard personalizado
- Agendamento de consultas
- Resultados de exames
- Histórico médico

### ✅ Sistema Administrativo
- Gestão de pacientes
- Controle de agendamentos
- Relatórios e estatísticas
- Sistema de permissões

---

## 🗄️ Banco de Dados

### Desenvolvimento (SQLite)
- Arquivo: `data/clinic.db`
- Dados mock incluídos
- Zero configuração

### Produção (PostgreSQL)
- Migrações em `migrations/`
- Compatível com Supabase
- Scripts prontos

---

## 📋 Deploy

### Netlify/Vercel
1. `pnpm build`
2. Deploy pasta `dist/`
3. Configure variáveis de ambiente

### Supabase (Banco)
1. Execute migrações SQL
2. Configure `DATABASE_URL`
3. Ajuste variáveis de ambiente

---

## 🆘 Problemas Comuns

### Erro de Porta
```bash
# Mudar porta no .env
PORT=3000
```

### Banco Corrompido
```bash
pnpm run db:reset
```

### Dependências
```bash
rm -rf node_modules
pnpm install
```

---

## 📞 Suporte

**Desenvolvedor**: Kaijhe Morose  
**Email**: kaijhe@bestservices.ao  
**Website**: https://bestservices.ao

**Cliente**: Clínica Bem Cuidar  
**Email**: recepcao@bemcuidar.co.ao  
**Telefone**: +244 945 344 650

---

> **"Cuidar é Amar"** - Sistema completo e funcional em menos de 5 minutos! 🎉
