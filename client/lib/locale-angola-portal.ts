/**
 * Localizações específicas para Angola - Portal Médico
 * Inclui formatação de datas, moeda, terminologia médica e compliance legal
 */

// Configuração de localização
export const ANGOLA_LOCALE = 'pt-AO';
export const ANGOLA_TIMEZONE = 'Africa/Luanda';
export const ANGOLA_CURRENCY = 'AOA';

// Formatadores de data para Angola (dd/mm/yyyy)
export const angolaDateFormatters = {
  // Formato padrão: dd/mm/yyyy
  short: new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: ANGOLA_TIMEZONE,
  }),
  
  // Formato longo: Segunda-feira, 15 de Janeiro de 2025
  long: new Intl.DateTimeFormat('pt-AO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: ANGOLA_TIMEZONE,
  }),
  
  // Formato médio: 15 Jan 2025
  medium: new Intl.DateTimeFormat('pt-AO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: ANGOLA_TIMEZONE,
  }),
  
  // Apenas data: 15/01
  dayMonth: new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    timeZone: ANGOLA_TIMEZONE,
  }),
  
  // Data e hora: 15/01/2025 14:30
  dateTime: new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: ANGOLA_TIMEZONE,
  }),
  
  // Apenas hora: 14:30
  time: new Intl.DateTimeFormat('pt-AO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: ANGOLA_TIMEZONE,
  }),
};

// Formatador de moeda Kwanza
export const angolaMoneyFormatter = new Intl.NumberFormat('pt-AO', {
  style: 'currency',
  currency: ANGOLA_CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Formatador de números para Angola
export const angolaNumberFormatter = new Intl.NumberFormat('pt-AO', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

// Funções auxiliares de formatação
export const formatDate = (date: Date | string | number, format: keyof typeof angolaDateFormatters = 'short'): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Data inválida';
  
  return angolaDateFormatters[format].format(dateObj);
};

export const formatMoney = (amount: number): string => {
  return angolaMoneyFormatter.format(amount);
};

export const formatNumber = (num: number): string => {
  return angolaNumberFormatter.format(num);
};

// Funções de parsing de data para o formato dd/mm/yyyy
export const parseAngolaDate = (dateString: string): Date | null => {
  // Suporta formatos: dd/mm/yyyy, dd-mm-yyyy, dd.mm.yyyy
  const patterns = [
    /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/,
    /^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/, // yyyy/mm/dd fallback
  ];
  
  for (const pattern of patterns) {
    const match = dateString.match(pattern);
    if (match) {
      const [, day, month, year] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      
      // Validar se a data é válida
      if (date.getFullYear() == parseInt(year) && 
          date.getMonth() == parseInt(month) - 1 && 
          date.getDate() == parseInt(day)) {
        return date;
      }
    }
  }
  
  return null;
};

// Terminologia médica específica para Angola
export const medicalTerminology = {
  // Especialidades médicas
  specialties: {
    cardiologia: 'Cardiologia',
    pediatria: 'Pediatria',
    ginecologia: 'Ginecologia e Obstetrícia',
    dermatologia: 'Dermatologia',
    oftalmologia: 'Oftalmologia',
    ortopedia: 'Ortopedia e Traumatologia',
    neurologia: 'Neurologia',
    psiquiatria: 'Psiquiatria',
    urologia: 'Urologia',
    otorrinolaringologia: 'Otorrinolaringologia',
    gastroenterologia: 'Gastroenterologia',
    endocrinologia: 'Endocrinologia',
    pneumologia: 'Pneumologia',
    reumatologia: 'Reumatologia',
    hematologia: 'Hematologia',
    infectologia: 'Infectologia',
    medicina_geral: 'Medicina Geral e Familiar',
    medicina_interna: 'Medicina Interna',
    cirurgia_geral: 'Cirurgia Geral',
    anestesiologia: 'Anestesiologia',
  },
  
  // Tipos de exames
  examTypes: {
    sangue: 'Análises Sanguíneas',
    urina: 'Análises de Urina',
    fezes: 'Análises de Fezes',
    radiologia: 'Exames Radiológicos',
    ecografia: 'Ecografia',
    tomografia: 'Tomografia Computadorizada',
    ressonancia: 'Ressonância Magnética',
    electrocardiograma: 'Electrocardiograma (ECG)',
    ecocardiograma: 'Ecocardiograma',
    endoscopia: 'Endoscopia',
    colonoscopia: 'Colonoscopia',
    mamografia: 'Mamografia',
    densitometria: 'Densitometria Óssea',
    holter: 'Holter 24h',
    espirometria: 'Espirometria',
  },
  
  // Status de consultas/exames
  status: {
    agendado: 'Agendado',
    confirmado: 'Confirmado',
    em_andamento: 'Em Andamento',
    concluido: 'Concluído',
    cancelado: 'Cancelado',
    faltou: 'Paciente Faltou',
    reagendado: 'Reagendado',
    pendente: 'Pendente',
    aprovado: 'Aprovado',
    rejeitado: 'Rejeitado',
  },
  
  // Tipos de documentos
  documentTypes: {
    bi: 'Bilhete de Identidade',
    passaporte: 'Passaporte',
    cedula: 'Cédula Pessoal',
    carta_conducao: 'Carta de Condução',
    certidao_nascimento: 'Certidão de Nascimento',
    atestado_medico: 'Atestado Médico',
    receita_medica: 'Receita Médica',
    resultado_exame: 'Resultado de Exame',
    relatorio_medico: 'Relatório Médico',
    cartao_vacina: 'Cartão de Vacinação',
  },
  
  // Prioridades
  priorities: {
    baixa: 'Baixa',
    normal: 'Normal',
    alta: 'Alta',
    urgente: 'Urgente',
    emergencia: 'Emergência',
  },
  
  // Métodos de pagamento comuns em Angola
  paymentMethods: {
    dinheiro: 'Dinheiro',
    multicaixa: 'Multicaixa Express',
    transferencia: 'Transferência Bancária',
    bai_directo: 'BAI Directo',
    bpc_net: 'BPC Net',
    cartao_credito: 'Cartão de Crédito',
    cartao_debito: 'Cartão de Débito',
    atlantico_directo: 'Atlântico Directo',
    unitel_money: 'Unitel Money',
  },
};

// Configurações regionais específicas
export const angolaConfig = {
  // Horários de funcionamento típicos
  businessHours: {
    weekdays: { start: '07:00', end: '18:00' },
    saturday: { start: '08:00', end: '14:00' },
    sunday: 'closed',
  },
  
  // Feriados nacionais de Angola (datas fixas)
  nationalHolidays: [
    { date: '01/01', name: 'Ano Novo' },
    { date: '04/02', name: 'Dia do Início da Luta Armada' },
    { date: '08/03', name: 'Dia Internacional da Mulher' },
    { date: '04/04', name: 'Dia da Paz e Reconciliação Nacional' },
    { date: '01/05', name: 'Dia do Trabalhador' },
    { date: '25/05', name: 'Dia de África' },
    { date: '01/06', name: 'Dia Internacional da Criança' },
    { date: '17/09', name: 'Dia do Fundador da Nação e do Herói Nacional' },
    { date: '11/11', name: 'Dia da Independência Nacional' },
    { date: '25/12', name: 'Dia de Natal e da Família' },
  ],
  
  // Códigos telefónicos
  phoneCodes: {
    country: '+244',
    landline: ['222', '223', '224', '225', '226', '227', '228', '229'],
    mobile: ['91', '92', '93', '94', '95', '96', '97', '98', '99'],
  },
  
  // Provincias de Angola
  provinces: [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cunene', 'Huambo',
    'Huíla', 'Kwando Kubango', 'Kwanza Norte', 'Kwanza Sul',
    'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico',
    'Namibe', 'Uíge', 'Zaire'
  ],
};

// Validadores específicos para Angola
export const angolaValidators = {
  // Validar número de telefone angolano
  validatePhone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s+/g, '').replace(/[-()]/g, '');
    
    // Formato: +244XXXXXXXXX ou 244XXXXXXXXX ou 9XXXXXXXX
    const patterns = [
      /^\+244[0-9]{9}$/, // +244XXXXXXXXX
      /^244[0-9]{9}$/, // 244XXXXXXXXX
      /^[0-9]{9}$/, // XXXXXXXXX
    ];
    
    return patterns.some(pattern => pattern.test(cleanPhone));
  },
  
  // Validar formato de BI angolano (simplificado)
  validateBI: (bi: string): boolean => {
    const cleanBI = bi.replace(/\s+/g, '').replace(/[-]/g, '');
    
    // Formato básico: 9 dígitos + 2 letras (ex: 123456789AB)
    return /^[0-9]{9}[A-Z]{2}$/.test(cleanBI.toUpperCase());
  },
  
  // Validar formato de data dd/mm/yyyy
  validateDate: (date: string): boolean => {
    return parseAngolaDate(date) !== null;
  },
  
  // Validar valor monetário em Kwanzas
  validateMoney: (amount: string): boolean => {
    const cleanAmount = amount.replace(/\s+/g, '').replace(/[Kz,]/g, '');
    const num = parseFloat(cleanAmount);
    return !isNaN(num) && num >= 0;
  },
};

// Utilitários para compliance legal
export const legalCompliance = {
  // Lei n.º 22/11 de Proteção de Dados Pessoais
  dataProtection: {
    consentText: `De acordo com a Lei n.º 22/11 de Proteção de Dados Pessoais de Angola, 
    os seus dados pessoais serão tratados com confidencialidade e utilizados exclusivamente 
    para fins médicos e administrativos da Clínica Bem Cuidar.`,
    
    retentionPeriod: 'Os dados médicos são conservados por um período mínimo de 10 anos, conforme determinado pela legislação sanit��ria nacional.',
    
    patientRights: [
      'Direito de acesso aos seus dados pessoais',
      'Direito de rectificação de dados incorrectos',
      'Direito de cancelamento (nos termos legais)',
      'Direito de portabilidade dos dados',
      'Direito de oposição ao tratamento',
    ],
  },
  
  // Conformidade com normas sanitárias
  healthRegulations: {
    licenseText: 'Clínica licenciada pelo Ministério da Saúde de Angola',
    professionalBodies: [
      'Ordem dos Médicos de Angola',
      'Ordem dos Enfermeiros de Angola',
      'Ministério da Saúde',
    ],
  },
  
  // Terminologia legal
  legalTerms: {
    informed_consent: 'Consentimento Informado',
    medical_record: 'Processo Clínico',
    medical_certificate: 'Atestado Médico',
    prescription: 'Prescrição Médica',
    referral: 'Referenciação Médica',
    medical_report: 'Relatório Médico',
    health_insurance: 'Seguro de Saúde',
    co_payment: 'Taxa Moderadora',
  },
};

// Exportar tudo como default para facilitar importação
export default {
  formatters: angolaDateFormatters,
  money: angolaMoneyFormatter,
  number: angolaNumberFormatter,
  formatDate,
  formatMoney,
  formatNumber,
  parseAngolaDate,
  terminology: medicalTerminology,
  config: angolaConfig,
  validators: angolaValidators,
  legal: legalCompliance,
  locale: ANGOLA_LOCALE,
  timezone: ANGOLA_TIMEZONE,
  currency: ANGOLA_CURRENCY,
};
