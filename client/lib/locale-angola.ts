// Angola Locale Utilities for Clínica Bem Cuidar
// Comprehensive localization for pt-AO with legal compliance

export const ANGOLA_LOCALE = "pt-AO";
export const ANGOLA_TIMEZONE = "Africa/Luanda";
export const ANGOLA_CURRENCY = "AOA";
export const ANGOLA_PHONE_PREFIX = "+244";

// Angola provinces and municipalities for address validation
export const ANGOLA_PROVINCES = [
  "Bengo",
  "Benguela",
  "Bié",
  "Cabinda",
  "Cuando Cubango",
  "Cuanza Norte",
  "Cuanza Sul",
  "Cunene",
  "Huambo",
  "Huíla",
  "Luanda",
  "Lunda Norte",
  "Lunda Sul",
  "Malanje",
  "Moxico",
  "Namibe",
  "Uíge",
  "Zaire",
];

export const MAJOR_MUNICIPALITIES = {
  Luanda: [
    "Belas",
    "Cacuaco",
    "Cazenga",
    "Ingombota",
    "Kilamba Kiaxi",
    "Maianga",
    "Rangel",
    "Sambizanga",
    "Samba",
    "Viana",
  ],
  Benguela: [
    "Benguela",
    "Baía Farta",
    "Bocoio",
    "Caimbambo",
    "Catumbela",
    "Chongorói",
    "Cubal",
    "Ganda",
    "Lobito",
    "Balombo",
  ],
  Huambo: [
    "Huambo",
    "Bailundo",
    "Cachiungo",
    "Caála",
    "Ecunha",
    "Londuimbali",
    "Longonjo",
    "Mungo",
    "Tchicala-Tcholoanga",
    "Tchindjenje",
    "Ukuma",
  ],
  Huíla: [
    "Lubango",
    "Caconda",
    "Cacula",
    "Caluquembe",
    "Chiange",
    "Chibia",
    "Chicomba",
    "Chipindo",
    "Cuvango",
    "Humpata",
    "Jamba",
    "Matala",
    "Quilengues",
    "Quipungo",
  ],
};

// Medical terminology in Portuguese (Angola)
export const MEDICAL_TERMS = {
  // Specialties
  cardiology: "Cardiologia",
  pediatrics: "Pediatria",
  general_surgery: "Cirurgia Geral",
  dermatology: "Dermatologia",
  neurology: "Neurologia",
  gynecology: "Ginecologia-Obstetrícia",
  orthopedics: "Ortopedia",
  otolaryngology: "Otorrinolaringologia",
  urology: "Urologia",
  endocrinology: "Endocrinologia",
  gastroenterology: "Gastroenterologia",
  occupational_medicine: "Medicina do Trabalho",

  // Common terms
  appointment: "Marcação",
  consultation: "Consulta",
  examination: "Exame",
  prescription: "Receita",
  diagnosis: "Diagnóstico",
  treatment: "Tratamento",
  surgery: "Cirurgia",
  emergency: "Urgência",
  patient: "Paciente",
  doctor: "Médico",
  nurse: "Enfermeiro/a",
  clinic: "Clínica",
  hospital: "Hospital",
  pharmacy: "Farmácia",

  // Time-related
  morning: "Manhã",
  afternoon: "Tarde",
  evening: "Noite",
  today: "Hoje",
  tomorrow: "Amanhã",
  yesterday: "Ontem",
  this_week: "Esta Semana",
  next_week: "Próxima Semana",
  schedule: "Horário",
  available: "Disponível",
  busy: "Ocupado",
  closed: "Fechado",
};

// Angola public holidays (for appointment scheduling)
export const ANGOLA_HOLIDAYS = [
  { date: "01-01", name: "Ano Novo" },
  {
    date: "01-04",
    name: "Dia do Início da Luta Armada de Libertação Nacional",
  },
  { date: "04-04", name: "Dia da Paz e Reconciliação Nacional" },
  { date: "05-01", name: "Dia do Trabalhador" },
  { date: "09-17", name: "Dia do Fundador da Nação e do Herói Nacional" },
  { date: "11-02", name: "Dia dos Finados" },
  { date: "11-11", name: "Dia da Independência Nacional" },
  { date: "12-25", name: "Natal" },
  // Note: Some holidays vary by year (Easter-related)
];

// Business configuration for Angola
export const BUSINESS_CONFIG = {
  weekdays: {
    monday: { start: "07:00", end: "19:00" },
    tuesday: { start: "07:00", end: "19:00" },
    wednesday: { start: "07:00", end: "19:00" },
    thursday: { start: "07:00", end: "19:00" },
    friday: { start: "07:00", end: "19:00" },
  },
  saturday: { start: "07:00", end: "13:00" },
  sunday: "closed",
  lunch_break: { start: "12:00", end: "13:00" },
  emergency_24h: true,
};

export class AngolaLocaleFormatter {
  private locale = ANGOLA_LOCALE;
  private timezone = ANGOLA_TIMEZONE;

  // Date formatting
  formatDate(
    date: Date | string,
    options?: Intl.DateTimeFormatOptions,
  ): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: this.timezone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    return new Intl.DateTimeFormat(this.locale, {
      ...defaultOptions,
      ...options,
    }).format(dateObj);
  }

  // Time formatting (24h format for Angola)
  formatTime(
    date: Date | string,
    options?: Intl.DateTimeFormatOptions,
  ): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    const defaultOptions: Intl.DateTimeFormatOptions = {
      timeZone: this.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    return new Intl.DateTimeFormat(this.locale, {
      ...defaultOptions,
      ...options,
    }).format(dateObj);
  }

  // DateTime formatting
  formatDateTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    return new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timezone,
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(dateObj);
  }

  // Relative time formatting (pt-AO)
  formatRelativeTime(date: Date | string): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - dateObj.getTime()) / 1000,
    );

    if (diffInSeconds < 60) return "Agora mesmo";
    if (diffInSeconds < 3600)
      return `Há ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400)
      return `Há ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 604800)
      return `Há ${Math.floor(diffInSeconds / 86400)} dias`;

    return this.formatDate(dateObj);
  }

  // Phone number formatting for Angola
  formatPhone(phone: string): string {
    if (!phone) return "";

    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, "");

    // Handle different input formats
    if (cleaned.length === 9) {
      // Local format: 923 123 456
      return `${ANGOLA_PHONE_PREFIX} ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith("244")) {
      // International format: 244923123456
      const localNumber = cleaned.slice(3);
      return `${ANGOLA_PHONE_PREFIX} ${localNumber.slice(0, 3)} ${localNumber.slice(3, 6)} ${localNumber.slice(6)}`;
    } else if (cleaned.length === 13 && cleaned.startsWith("244")) {
      // Extended format
      const localNumber = cleaned.slice(3);
      return `${ANGOLA_PHONE_PREFIX} ${localNumber.slice(0, 3)} ${localNumber.slice(3, 6)} ${localNumber.slice(6)}`;
    }

    return phone; // Return original if no pattern matches
  }

  // Validate Angola phone number
  isValidAngolaPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, "");

    // Valid patterns:
    // 9 digits: local mobile
    // 12 digits starting with 244: international
    return (
      (cleaned.length === 9 && cleaned[0] === "9") ||
      (cleaned.length === 12 && cleaned.startsWith("244"))
    );
  }

  // Currency formatting for Angola (Kwanza)
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat(this.locale, {
      style: "currency",
      currency: ANGOLA_CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  // Alternative currency formatting with Kz symbol
  formatKwanza(amount: number): string {
    const formatted = new Intl.NumberFormat(this.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `Kz ${formatted}`;
  }

  // Number formatting for Angola
  formatNumber(number: number): string {
    return new Intl.NumberFormat(this.locale).format(number);
  }

  // Address formatting for Angola
  formatAddress(address: {
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

    parts.push("Angola");

    return parts.join(", ");
  }

  // Day of week names in Portuguese
  getDayNames(): string[] {
    return [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
  }

  // Month names in Portuguese
  getMonthNames(): string[] {
    return [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
  }

  // Get current Angola time
  getCurrentAngolaTime(): Date {
    return new Date(
      new Date().toLocaleString("en-US", { timeZone: this.timezone }),
    );
  }

  // Check if date is Angola holiday
  isAngolaHoliday(date: Date): boolean {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${month}-${day}`;

    return ANGOLA_HOLIDAYS.some((holiday) => holiday.date === dateString);
  }

  // Get holiday name if date is holiday
  getHolidayName(date: Date): string | null {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${month}-${day}`;

    const holiday = ANGOLA_HOLIDAYS.find(
      (holiday) => holiday.date === dateString,
    );
    return holiday ? holiday.name : null;
  }

  // Business hours utilities
  isBusinessDay(date: Date): boolean {
    const day = date.getDay();
    return day >= 1 && day <= 6; // Monday to Saturday
  }

  isBusinessHours(date: Date = new Date()): boolean {
    const angolaTime = new Date(
      date.toLocaleString("en-US", { timeZone: this.timezone }),
    );
    const day = angolaTime.getDay();
    const timeString = this.formatTime(angolaTime);

    if (day === 0) return false; // Sunday
    if (this.isAngolaHoliday(angolaTime)) return false;

    if (day === 6) {
      // Saturday
      return (
        timeString >= BUSINESS_CONFIG.saturday.start &&
        timeString <= BUSINESS_CONFIG.saturday.end
      );
    }

    // Weekdays (Monday-Friday)
    const mondayConfig = BUSINESS_CONFIG.weekdays.monday;
    return timeString >= mondayConfig.start && timeString <= mondayConfig.end;
  }

  // Get business status message
  getBusinessStatus(): string {
    const now = this.getCurrentAngolaTime();

    if (this.isAngolaHoliday(now)) {
      const holidayName = this.getHolidayName(now);
      return `Fechado - ${holidayName}`;
    }

    if (this.isBusinessHours(now)) {
      return "Aberto";
    }

    const day = now.getDay();
    if (day === 0) return "Fechado - Domingo";

    return "Fechado";
  }

  // Format appointment time slots
  formatTimeSlot(startTime: string, endTime: string): string {
    return `${startTime} - ${endTime}`;
  }

  // Generate time slots for appointments
  generateTimeSlots(
    startHour: number = 7,
    endHour: number = 19,
    intervalMinutes: number = 30,
  ): string[] {
    const slots: string[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

        // Skip lunch break
        if (
          time >= BUSINESS_CONFIG.lunch_break.start &&
          time < BUSINESS_CONFIG.lunch_break.end
        ) {
          continue;
        }

        slots.push(time);
      }
    }

    return slots;
  }

  // Validate Angola postal code (if applicable)
  isValidPostalCode(code: string): boolean {
    // Angola doesn't have a standardized postal code system yet
    // This can be updated when system is implemented
    return true;
  }

  // Emergency contact formatting
  formatEmergencyContact(service: "police" | "fire" | "medical"): string {
    const numbers = {
      police: "112",
      fire: "115",
      medical: "113",
    };

    return numbers[service] || "112";
  }
}

// Export singleton instance
export const angolaFormatter = new AngolaLocaleFormatter();

// Utility functions for form validation
export const AngolaValidation = {
  phone: (phone: string): boolean => angolaFormatter.isValidAngolaPhone(phone),

  province: (province: string): boolean => ANGOLA_PROVINCES.includes(province),

  municipality: (municipality: string, province?: string): boolean => {
    if (!province)
      return Object.values(MAJOR_MUNICIPALITIES).flat().includes(municipality);
    return MAJOR_MUNICIPALITIES[province]?.includes(municipality) || false;
  },

  businessHours: (date: Date): boolean => angolaFormatter.isBusinessHours(date),

  workingDay: (date: Date): boolean =>
    angolaFormatter.isBusinessDay(date) &&
    !angolaFormatter.isAngolaHoliday(date),
};

// Input masks for Angola-specific formats
export const AngolaInputMasks = {
  phone: "+244 ### ### ###",
  date: "DD/MM/AAAA",
  currency: "Kz #.###,##",
};

// Form field labels in Portuguese (Angola)
export const FormLabels = {
  name: "Nome Completo",
  firstName: "Primeiro Nome",
  lastName: "Apelido",
  email: "Endereço de E-mail",
  phone: "Número de Telefone",
  mobile: "Telemóvel",
  address: "Endereço",
  street: "Rua/Avenida",
  number: "Número",
  neighborhood: "Bairro",
  municipality: "Município",
  province: "Província",
  postalCode: "Código Postal",
  birthDate: "Data de Nascimento",
  gender: "Sexo",
  maritalStatus: "Estado Civil",
  occupation: "Profissão",
  idNumber: "Número do Bilhete de Identidade",
  insurance: "Seguro de Saúde",
  emergencyContact: "Contacto de Emergência",
  appointment: "Marcação",
  specialty: "Especialidade",
  preferredTime: "Horário Preferido",
  symptoms: "Sintomas",
  message: "Mensagem",
  notes: "Observações",
};

export default angolaFormatter;

console.log("[Locale] Angola locale utilities loaded");
