/**
 * Sistema de Localização para Angola (pt-AO)
 * Clínica Bem Cuidar
 * 
 * Implementa formatação específica para:
 * - Datas e horários
 * - Números de telefone (+244)
 * - Moeda (Kwanza - Kz)
 * - Endereços angolanos
 * - Feriados nacionais
 * - Nomenclatura médica local
 */

// Configurações base do locale
export const LOCALE_CONFIG = {
  locale: 'pt-AO',
  country: 'AO',
  currency: 'AOA',
  timezone: 'Africa/Luanda',
  phoneCountryCode: '+244',
  language: 'pt',
  region: 'AO'
} as const;

// Províncias de Angola
export const PROVINCES = [
  'Bengo',
  'Benguela',
  'Bié',
  'Cabinda',
  'Cuando Cubango',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cunene',
  'Huambo',
  'Huíla',
  'Luanda',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Namibe',
  'Uíge',
  'Zaire'
] as const;

// Municípios principais de Luanda
export const LUANDA_MUNICIPALITIES = [
  'Belas',
  'Cacuaco',
  'Cazenga',
  'Icolo e Bengo',
  'Luanda',
  'Quiçama',
  'Talatona',
  'Viana'
] as const;

// Feriados nacionais de Angola (2024/2025)
export const NATIONAL_HOLIDAYS = [
  { date: '2024-01-01', name: 'Ano Novo', type: 'national' },
  { date: '2024-02-04', name: 'Dia do Início da Luta Armada', type: 'national' },
  { date: '2024-03-08', name: 'Dia Internacional da Mulher', type: 'national' },
  { date: '2024-03-29', name: 'Sexta-feira Santa', type: 'religious' },
  { date: '2024-04-04', name: 'Dia da Paz', type: 'national' },
  { date: '2024-05-01', name: 'Dia do Trabalhador', type: 'national' },
  { date: '2024-09-17', name: 'Dia do Herói Nacional', type: 'national' },
  { date: '2024-11-02', name: 'Dia dos Finados', type: 'religious' },
  { date: '2024-11-11', name: 'Dia da Independência', type: 'national' },
  { date: '2024-12-25', name: 'Dia de Natal', type: 'religious' },
  // 2025
  { date: '2025-01-01', name: 'Ano Novo', type: 'national' },
  { date: '2025-02-04', name: 'Dia do Início da Luta Armada', type: 'national' },
  { date: '2025-03-08', name: 'Dia Internacional da Mulher', type: 'national' },
  { date: '2025-04-18', name: 'Sexta-feira Santa', type: 'religious' },
  { date: '2025-04-04', name: 'Dia da Paz', type: 'national' },
  { date: '2025-05-01', name: 'Dia do Trabalhador', type: 'national' },
  { date: '2025-09-17', name: 'Dia do Herói Nacional', type: 'national' },
  { date: '2025-11-02', name: 'Dia dos Finados', type: 'religious' },
  { date: '2025-11-11', name: 'Dia da Independência', type: 'national' },
  { date: '2025-12-25', name: 'Dia de Natal', type: 'religious' },
] as const;

// Nomenclatura médica específica de Angola
export const MEDICAL_TERMINOLOGY = {
  // Especialidades
  cardiology: 'Cardiologia',
  pediatrics: 'Pediatria',
  gynecology: 'Ginecologia e Obstetrícia',
  orthopedics: 'Ortopedia e Traumatologia',
  dermatology: 'Dermatologia',
  neurology: 'Neurologia',
  psychiatry: 'Psiquiatria',
  urology: 'Urologia',
  ophthalmology: 'Oftalmologia',
  otolaryngology: 'Otorrinolaringologia',
  endocrinology: 'Endocrinologia',
  gastroenterology: 'Gastroenterologia',
  pulmonology: 'Pneumologia',
  nephrology: 'Nefrologia',
  oncology: 'Oncologia',
  anesthesiology: 'Anestesiologia',
  radiology: 'Radiologia',
  pathology: 'Anatomia Patológica',
  
  // Termos gerais
  appointment: 'Marcação',
  consultation: 'Consulta',
  examination: 'Exame',
  diagnosis: 'Diagnóstico',
  treatment: 'Tratamento',
  prescription: 'Receita Médica',
  vaccine: 'Vacina',
  surgery: 'Cirurgia',
  emergency: 'Urgência',
  hospitalization: 'Internamento',
  discharge: 'Alta Médica',
  referral: 'Referenciação',
  
  // Profissionais
  doctor: 'Médico',
  nurse: 'Enfermeiro/a',
  pharmacist: 'Farmacêutico',
  technician: 'Técnico de Saúde',
  receptionist: 'Recepcionista',
  
  // Documentos
  medical_record: 'Processo Clínico',
  health_card: 'Cartão de Saúde',
  insurance_card: 'Cartão de Seguro',
  identity_document: 'Bilhete de Identidade',
  birth_certificate: 'Certidão de Nascimento',
} as const;

/**
 * Formatar data no padrão angolano (dd/MM/yyyy)
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: LOCALE_CONFIG.timezone
  }).format(dateObj);
}

/**
 * Formatar data e hora no padrão angolano
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-AO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: LOCALE_CONFIG.timezone
  }).format(dateObj);
}

/**
 * Formatar apenas hora no padrão angolano (24h)
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-AO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: LOCALE_CONFIG.timezone
  }).format(dateObj);
}

/**
 * Formatar moeda angolana (Kwanza)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace('AOA', 'Kz');
}

/**
 * Formatar número no padrão angolano
 */
export function formatNumber(number: number): string {
  return new Intl.NumberFormat('pt-AO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(number);
}

/**
 * Validar e formatar número de telefone angolano
 */
export function formatPhoneNumber(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Verifica se começa com 244 (código do país)
  if (cleaned.startsWith('244')) {
    const number = cleaned.substring(3);
    if (number.length === 9) {
      return `+244 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
  }
  
  // Se tem 9 dígitos, assume que é número nacional
  if (cleaned.length === 9) {
    return `+244 ${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  
  return phone; // Retorna original se não conseguir formatar
}

/**
 * Validar número de telefone angolano
 */
export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  
  // Verifica se tem 9 dígitos (nacional) ou 12 dígitos (com código 244)
  if (cleaned.length === 9) {
    // Números móveis começam com 9
    // Números fixos começam com 2
    return /^[29]/.test(cleaned);
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('244')) {
    const number = cleaned.substring(3);
    return /^[29]/.test(number);
  }
  
  return false;
}

/**
 * Verificar se uma data é feriado nacional
 */
export function isNationalHoliday(date: Date | string): { isHoliday: boolean; holiday?: typeof NATIONAL_HOLIDAYS[0] } {
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  const holiday = NATIONAL_HOLIDAYS.find(h => h.date === dateStr);
  
  return {
    isHoliday: !!holiday,
    holiday
  };
}

/**
 * Obter próximos feriados
 */
export function getUpcomingHolidays(limit: number = 3): typeof NATIONAL_HOLIDAYS {
  const today = new Date().toISOString().split('T')[0];
  
  return NATIONAL_HOLIDAYS
    .filter(holiday => holiday.date >= today)
    .slice(0, limit);
}

/**
 * Formatar endereço angolano
 */
export function formatAddress(address: {
  street?: string;
  number?: string;
  neighborhood?: string;
  municipality?: string;
  province?: string;
  postalCode?: string;
}): string {
  const parts = [];
  
  if (address.street && address.number) {
    parts.push(`${address.street}, Nº ${address.number}`);
  } else if (address.street) {
    parts.push(address.street);
  }
  
  if (address.neighborhood) {
    parts.push(address.neighborhood);
  }
  
  if (address.municipality) {
    parts.push(address.municipality);
  }
  
  if (address.province) {
    parts.push(address.province);
  }
  
  if (address.postalCode) {
    parts.push(address.postalCode);
  }
  
  return parts.join(', ');
}

/**
 * Obter horário de funcionamento localizado
 */
export function getWorkingHours(): {
  weekdays: string;
  saturday: string;
  sunday: string;
  emergency: string;
} {
  return {
    weekdays: 'Segunda a Sexta: 07:00 - 19:00',
    saturday: 'Sábado: 07:00 - 13:00',
    sunday: 'Domingo: Fechado',
    emergency: 'Urgências: 24 horas'
  };
}

/**
 * Obter saudação baseada no horário local
 */
export function getLocalGreeting(): string {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour < 12) {
    return 'Bom dia';
  } else if (hour < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
}

/**
 * Verificar se está em horário comercial
 */
export function isBusinessHours(): boolean {
  const now = new Date();
  const day = now.getDay(); // 0 = domingo, 6 = sábado
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;
  
  // Domingo - fechado
  if (day === 0) return false;
  
  // Sábado - 07:00 às 13:00
  if (day === 6) {
    return currentTime >= 7 * 60 && currentTime < 13 * 60;
  }
  
  // Segunda a sexta - 07:00 às 19:00
  return currentTime >= 7 * 60 && currentTime < 19 * 60;
}

/**
 * Obter próximo horário de funcionamento
 */
export function getNextBusinessHour(): { date: Date; message: string } {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  
  // Se está em horário comercial
  if (isBusinessHours()) {
    return {
      date: now,
      message: 'Estamos abertos agora!'
    };
  }
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(7, 0, 0, 0);
  
  const nextMonday = new Date(now);
  nextMonday.setDate(nextMonday.getDate() + (8 - day) % 7);
  nextMonday.setHours(7, 0, 0, 0);
  
  // Domingo ou após horário de sábado
  if (day === 0 || (day === 6 && hour >= 13)) {
    return {
      date: nextMonday,
      message: `Abrimos na ${formatDateTime(nextMonday)}`
    };
  }
  
  // Após horário comercial em dia útil
  if (day >= 1 && day <= 5 && hour >= 19) {
    return {
      date: tomorrow,
      message: `Abrimos amanhã às ${formatTime(tomorrow)}`
    };
  }
  
  // Antes do horário comercial
  const today = new Date(now);
  today.setHours(7, 0, 0, 0);
  
  return {
    date: today,
    message: `Abrimos hoje às ${formatTime(today)}`
  };
}

// Exportar tipos para TypeScript
export type Province = typeof PROVINCES[number];
export type LuandaMunicipality = typeof LUANDA_MUNICIPALITIES[number];
export type MedicalTerm = keyof typeof MEDICAL_TERMINOLOGY;
export type Holiday = typeof NATIONAL_HOLIDAYS[number];
