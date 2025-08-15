import { create } from 'zustand';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId?: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  type: 'consultation' | 'follow_up' | 'emergency' | 'procedure';
  reason?: string;
  symptoms?: string;
  notes?: string;
  doctorNotes?: string;
  paymentStatus: 'pending' | 'paid' | 'partial' | 'cancelled';
  paymentAmount?: number;
  location?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamResult {
  id: string;
  patientId: string;
  requestId?: string;
  name: string;
  type: string;
  category?: string;
  requestDate?: string;
  collectionDate?: string;
  examDate: string;
  resultDate?: string;
  status: 'pending' | 'in_progress' | 'final' | 'cancelled';
  viewed: boolean;
  viewedAt?: string;
  doctorName?: string;
  results?: any;
  normalRanges?: any;
  interpretation?: string;
  recommendations?: string;
  fileUrl?: string;
  downloadCount: number;
  lastDownloaded?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  patientId: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: 'patient' | 'doctor' | 'receptionist' | 'admin';
  toUserId?: string;
  toUserName?: string;
  toUserRole?: 'patient' | 'doctor' | 'receptionist' | 'admin';
  subject: string;
  content: string;
  type: 'general' | 'appointment' | 'exam' | 'billing' | 'emergency';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  readAt?: string;
  replied: boolean;
  repliedAt?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  appointmentId?: string;
  examId?: string;
  invoiceNumber: string;
  description: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidAt?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface MedicalState {
  appointments: Appointment[];
  examResults: ExamResult[];
  messages: Message[];
  invoices: Invoice[];
  isLoading: boolean;
  
  // Appointments
  fetchAppointments: (patientId: string) => Promise<void>;
  scheduleAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  cancelAppointment: (appointmentId: string, reason: string) => Promise<void>;
  
  // Exams
  fetchExamResults: (patientId: string) => Promise<void>;
  markExamAsViewed: (examId: string) => void;
  downloadExam: (examId: string) => Promise<void>;
  
  // Messages
  fetchMessages: (patientId: string) => Promise<void>;
  sendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  markMessageAsRead: (messageId: string) => void;
  
  // Invoices
  fetchInvoices: (patientId: string) => Promise<void>;
  downloadInvoice: (invoiceId: string) => Promise<void>;
  
  setLoading: (loading: boolean) => void;
}

// Mock data para desenvolvimento
const mockAppointments: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'patient-1',
    doctorId: 'doc-1',
    doctorName: 'Dr. António Silva',
    specialty: 'Cardiologia',
    date: '2024-12-25',
    time: '09:00',
    duration: 30,
    status: 'scheduled',
    type: 'consultation',
    reason: 'Consulta de rotina',
    symptoms: 'Dor no peito ocasional',
    notes: 'Primeira consulta',
    paymentStatus: 'pending',
    paymentAmount: 15000,
    location: 'Consultório 1A',
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z'
  },
  {
    id: 'apt-2',
    patientId: 'patient-1',
    doctorId: 'doc-2',
    doctorName: 'Dra. Maria Santos',
    specialty: 'Clínica Geral',
    date: '2024-12-18',
    time: '14:30',
    duration: 30,
    status: 'completed',
    type: 'consultation',
    reason: 'Check-up anual',
    symptoms: 'Nenhum sintoma específico',
    notes: 'Paciente em bom estado geral',
    doctorNotes: 'Exames de rotina solicitados. Retorno em 3 meses.',
    paymentStatus: 'paid',
    paymentAmount: 12000,
    location: 'Consultório 2B',
    completedAt: '2024-12-18T15:00:00Z',
    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-18T15:00:00Z'
  }
];

const mockExamResults: ExamResult[] = [
  {
    id: 'exam-1',
    patientId: 'patient-1',
    requestId: 'req-1',
    name: 'Hemograma Completo',
    type: 'Análise Clínica',
    category: 'Sangue',
    requestDate: '2024-12-18',
    collectionDate: '2024-12-19',
    examDate: '2024-12-19',
    resultDate: '2024-12-20',
    status: 'final',
    viewed: false,
    doctorName: 'Dra. Maria Santos',
    results: {
      hemoglobina: { value: 14.2, unit: 'g/dL', status: 'normal' },
      hematocrito: { value: 42.1, unit: '%', status: 'normal' },
      leucocitos: { value: 6800, unit: '/mm³', status: 'normal' },
      plaquetas: { value: 280000, unit: '/mm³', status: 'normal' }
    },
    normalRanges: {
      hemoglobina: { min: 12.0, max: 15.5, unit: 'g/dL' },
      hematocrito: { min: 36.0, max: 46.0, unit: '%' },
      leucocitos: { min: 4000, max: 11000, unit: '/mm³' },
      plaquetas: { min: 150000, max: 400000, unit: '/mm³' }
    },
    interpretation: 'Resultados dentro dos parâmetros normais.',
    recommendations: 'Manter hábitos saudáveis. Repetir em 6 meses.',
    fileUrl: '/exam-results/hemograma-patient1-20241220.pdf',
    downloadCount: 0,
    createdAt: '2024-12-20T08:00:00Z',
    updatedAt: '2024-12-20T08:00:00Z'
  },
  {
    id: 'exam-2',
    patientId: 'patient-1',
    requestId: 'req-2',
    name: 'Eletrocardiograma',
    type: 'Exame Cardiovascular',
    category: 'Cardiologia',
    requestDate: '2024-12-18',
    examDate: '2024-12-20',
    resultDate: '2024-12-20',
    status: 'final',
    viewed: true,
    viewedAt: '2024-12-20T16:30:00Z',
    doctorName: 'Dr. António Silva',
    interpretation: 'Ritmo sinusal normal. Frequência cardíaca: 72 bpm.',
    recommendations: 'Coração funcionando normalmente. Manter atividade física regular.',
    fileUrl: '/exam-results/ecg-patient1-20241220.pdf',
    downloadCount: 1,
    lastDownloaded: '2024-12-20T16:35:00Z',
    createdAt: '2024-12-20T14:00:00Z',
    updatedAt: '2024-12-20T16:35:00Z'
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    patientId: 'patient-1',
    fromUserId: 'receptionist-1',
    fromUserName: 'Recepção CBC',
    fromUserRole: 'receptionist',
    toUserId: 'patient-1',
    toUserName: 'Maria Silva Santos',
    toUserRole: 'patient',
    subject: 'Confirmação de Consulta',
    content: 'Olá Maria! Sua consulta com Dr. António Silva está confirmada para 25/12/2024 às 09:00. Por favor, chegue 15 minutos antes. Lembre-se de trazer seu cartão do plano de saúde.',
    type: 'appointment',
    priority: 'normal',
    read: false,
    replied: false,
    createdAt: '2024-12-22T10:00:00Z',
    updatedAt: '2024-12-22T10:00:00Z'
  },
  {
    id: 'msg-2',
    patientId: 'patient-1',
    fromUserId: 'doc-1',
    fromUserName: 'Dr. António Silva',
    fromUserRole: 'doctor',
    toUserId: 'patient-1',
    toUserName: 'Maria Silva Santos',
    toUserRole: 'patient',
    subject: 'Resultados de Exames',
    content: 'Olá Maria! Seus resultados de exames já estão disponíveis no portal. Tudo está normal. Caso tenha dúvidas, não hesite em entrar em contato.',
    type: 'exam',
    priority: 'normal',
    read: true,
    readAt: '2024-12-20T17:00:00Z',
    replied: false,
    createdAt: '2024-12-20T16:45:00Z',
    updatedAt: '2024-12-20T17:00:00Z'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    patientId: 'patient-1',
    appointmentId: 'apt-1',
    invoiceNumber: 'CBC-2024-001234',
    description: 'Consulta Cardiologia - Dr. António Silva',
    items: [
      {
        id: 'item-1',
        description: 'Consulta Cardiologia',
        quantity: 1,
        unitPrice: 15000,
        total: 15000
      }
    ],
    subtotal: 15000,
    tax: 0,
    discount: 0,
    total: 15000,
    currency: 'AOA',
    status: 'sent',
    dueDate: '2024-12-30',
    notes: 'Pagamento pode ser efetuado na recepção ou via transferência bancária.',
    fileUrl: '/invoices/CBC-2024-001234.pdf',
    createdAt: '2024-12-20T15:00:00Z',
    updatedAt: '2024-12-20T15:00:00Z'
  },
  {
    id: 'inv-2',
    patientId: 'patient-1',
    appointmentId: 'apt-2',
    examId: 'exam-1',
    invoiceNumber: 'CBC-2024-001235',
    description: 'Consulta + Exames - Dra. Maria Santos',
    items: [
      {
        id: 'item-2',
        description: 'Consulta Clínica Geral',
        quantity: 1,
        unitPrice: 12000,
        total: 12000
      },
      {
        id: 'item-3',
        description: 'Hemograma Completo',
        quantity: 1,
        unitPrice: 8000,
        total: 8000
      }
    ],
    subtotal: 20000,
    tax: 0,
    discount: 2000,
    total: 18000,
    currency: 'AOA',
    status: 'paid',
    dueDate: '2024-12-25',
    paidAt: '2024-12-19T10:30:00Z',
    paymentMethod: 'transfer',
    paymentReference: 'TRF123456789',
    notes: 'Desconto de 10% aplicado por fidelidade.',
    fileUrl: '/invoices/CBC-2024-001235.pdf',
    createdAt: '2024-12-18T16:00:00Z',
    updatedAt: '2024-12-19T10:30:00Z'
  }
];

export const useMedicalStore = create<MedicalState>((set, get) => ({
  appointments: [],
  examResults: [],
  messages: [],
  invoices: [],
  isLoading: false,

  fetchAppointments: async (patientId: string) => {
    set({ isLoading: true });
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userAppointments = mockAppointments.filter(apt => apt.patientId === patientId);
    set({ appointments: userAppointments, isLoading: false });
  },

  scheduleAppointment: async (appointmentData) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const currentAppointments = get().appointments;
    set({ appointments: [...currentAppointments, newAppointment] });
    
    return newAppointment.id;
  },

  cancelAppointment: async (appointmentId: string, reason: string) => {
    const currentAppointments = get().appointments;
    const updatedAppointments = currentAppointments.map(apt => 
      apt.id === appointmentId 
        ? { 
            ...apt, 
            status: 'cancelled' as const,
            cancelledAt: new Date().toISOString(),
            cancellationReason: reason,
            updatedAt: new Date().toISOString()
          }
        : apt
    );
    
    set({ appointments: updatedAppointments });
  },

  fetchExamResults: async (patientId: string) => {
    set({ isLoading: true });
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const userExams = mockExamResults.filter(exam => exam.patientId === patientId);
    set({ examResults: userExams, isLoading: false });
  },

  markExamAsViewed: (examId: string) => {
    const currentExams = get().examResults;
    const updatedExams = currentExams.map(exam =>
      exam.id === examId
        ? {
            ...exam,
            viewed: true,
            viewedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : exam
    );
    
    set({ examResults: updatedExams });
  },

  downloadExam: async (examId: string) => {
    const currentExams = get().examResults;
    const updatedExams = currentExams.map(exam =>
      exam.id === examId
        ? {
            ...exam,
            downloadCount: exam.downloadCount + 1,
            lastDownloaded: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : exam
    );
    
    set({ examResults: updatedExams });
  },

  fetchMessages: async (patientId: string) => {
    set({ isLoading: true });
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const userMessages = mockMessages.filter(msg => msg.patientId === patientId);
    set({ messages: userMessages, isLoading: false });
  },

  sendMessage: async (messageData) => {
    const newMessage: Message = {
      ...messageData,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const currentMessages = get().messages;
    set({ messages: [...currentMessages, newMessage] });
    
    return newMessage.id;
  },

  markMessageAsRead: (messageId: string) => {
    const currentMessages = get().messages;
    const updatedMessages = currentMessages.map(msg =>
      msg.id === messageId
        ? {
            ...msg,
            read: true,
            readAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : msg
    );
    
    set({ messages: updatedMessages });
  },

  fetchInvoices: async (patientId: string) => {
    set({ isLoading: true });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userInvoices = mockInvoices.filter(inv => inv.patientId === patientId);
    set({ invoices: userInvoices, isLoading: false });
  },

  downloadInvoice: async (invoiceId: string) => {
    // Simular download
    console.log(`Downloading invoice ${invoiceId}`);
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  }
}));
