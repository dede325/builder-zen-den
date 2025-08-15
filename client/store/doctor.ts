import { create } from 'zustand';

export interface Patient {
  id: string;
  name: string;
  processNumber: string;
  birthDate: string;
  phone?: string;
  email?: string;
  lastConsultation?: string;
  clinicalStatus: 'stable' | 'monitoring' | 'critical' | 'recovered';
  assignedDoctorId: string;
  bloodType?: string;
  allergies?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorConsultation {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  type: 'consultation' | 'follow_up' | 'emergency' | 'procedure';
  chiefComplaint?: string;
  clinicalNotes?: string;
  diagnosis?: string;
  treatment?: string;
  prescriptions?: string;
  followUpDate?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MedicalExam {
  id: string;
  consultationId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  examType: string;
  category: string;
  requestDate: string;
  scheduledDate?: string;
  resultDate?: string;
  status: 'requested' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'stat';
  instructions?: string;
  results?: string;
  interpretation?: string;
  recommendations?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InternalMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'doctor' | 'nurse' | 'receptionist' | 'admin';
  recipientId: string;
  recipientName: string;
  recipientRole: 'doctor' | 'nurse' | 'receptionist' | 'admin';
  subject: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  type: 'general' | 'patient_update' | 'schedule_change' | 'urgent_care' | 'administrative';
  read: boolean;
  readAt?: string;
  replied: boolean;
  repliedAt?: string;
  important: boolean;
  patientId?: string;
  patientName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialty: string;
  registrationNumber: string;
  phone?: string;
  avatar?: string;
  qualifications: string[];
  experience: number;
  languages: string[];
  consultationHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    urgentAlertsOnly: boolean;
    consultationReminders: boolean;
  };
}

interface DoctorState {
  // Data
  patients: Patient[];
  consultations: DoctorConsultation[];
  exams: MedicalExam[];
  messages: InternalMessage[];
  profile: DoctorProfile | null;
  
  // Loading states
  isLoading: boolean;
  
  // Patients
  fetchPatients: (doctorId: string) => Promise<void>;
  searchPatients: (query: string, doctorId: string) => Patient[];
  getPatientById: (patientId: string) => Patient | null;
  
  // Consultations
  fetchConsultations: (doctorId: string) => Promise<void>;
  createConsultation: (consultation: Omit<DoctorConsultation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateConsultation: (consultationId: string, updates: Partial<DoctorConsultation>) => Promise<void>;
  deleteConsultation: (consultationId: string) => Promise<void>;
  
  // Exams
  fetchExams: (doctorId: string) => Promise<void>;
  requestExam: (exam: Omit<MedicalExam, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateExamResults: (examId: string, results: string, interpretation: string, recommendations?: string) => Promise<void>;
  uploadExamFile: (examId: string, file: File) => Promise<string>;
  
  // Messages
  fetchMessages: (doctorId: string) => Promise<void>;
  sendMessage: (message: Omit<InternalMessage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  markMessageAsRead: (messageId: string) => void;
  markMessageAsImportant: (messageId: string, important: boolean) => void;
  
  // Profile
  fetchProfile: (doctorId: string) => Promise<void>;
  updateProfile: (updates: Partial<DoctorProfile>) => Promise<void>;
  
  setLoading: (loading: boolean) => void;
}

// Mock data
const mockPatients: Patient[] = [
  {
    id: 'patient-1',
    name: 'Maria Silva Santos',
    processNumber: 'CBC-001234',
    birthDate: '1985-06-15',
    phone: '+244 912 345 678',
    email: 'maria.santos@email.com',
    lastConsultation: '2024-12-18',
    clinicalStatus: 'stable',
    assignedDoctorId: 'doctor-1',
    bloodType: 'A+',
    allergies: 'Penicilina',
    emergencyContact: 'João Santos - +244 923 456 789',
    insuranceProvider: 'SAÚDE ANGOLA',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-12-18T15:30:00Z'
  },
  {
    id: 'patient-3',
    name: 'Ana Paula Costa',
    processNumber: 'CBC-001235',
    birthDate: '1992-03-22',
    phone: '+244 934 567 890',
    email: 'ana.costa@email.com',
    lastConsultation: '2024-12-20',
    clinicalStatus: 'monitoring',
    assignedDoctorId: 'doctor-1',
    bloodType: 'O-',
    allergies: 'Nenhuma conhecida',
    emergencyContact: 'Pedro Costa - +244 945 678 901',
    insuranceProvider: 'MEDICLÍNICA',
    createdAt: '2023-03-10T14:20:00Z',
    updatedAt: '2024-12-20T09:15:00Z'
  },
  {
    id: 'patient-4',
    name: 'José Fernando Mendes',
    processNumber: 'CBC-001236',
    birthDate: '1978-09-10',
    phone: '+244 956 789 012',
    email: 'jose.mendes@email.com',
    lastConsultation: '2024-12-15',
    clinicalStatus: 'stable',
    assignedDoctorId: 'doctor-1',
    bloodType: 'B+',
    allergies: 'Aspirina',
    emergencyContact: 'Luísa Mendes - +244 967 890 123',
    insuranceProvider: 'GLOBAL SAÚDE',
    createdAt: '2023-05-22T11:30:00Z',
    updatedAt: '2024-12-15T16:45:00Z'
  }
];

const mockConsultations: DoctorConsultation[] = [
  {
    id: 'consult-1',
    doctorId: 'doctor-1',
    patientId: 'patient-1',
    patientName: 'Maria Silva Santos',
    date: '2024-12-25',
    time: '09:00',
    duration: 30,
    status: 'scheduled',
    type: 'consultation',
    chiefComplaint: 'Dor no peito ocasional',
    clinicalNotes: 'Paciente relata dor torácica esporádica há 2 semanas',
    vitalSigns: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 36.5,
      weight: 65,
      height: 165
    },
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z'
  },
  {
    id: 'consult-2',
    doctorId: 'doctor-1',
    patientId: 'patient-3',
    patientName: 'Ana Paula Costa',
    date: '2024-12-18',
    time: '14:30',
    duration: 45,
    status: 'completed',
    type: 'follow_up',
    chiefComplaint: 'Seguimento pós-cirúrgico',
    clinicalNotes: 'Paciente em boa evolução pós-operatória',
    diagnosis: 'Pós-operatório de colecistectomia sem complicações',
    treatment: 'Manter medicação atual, repouso relativo',
    prescriptions: 'Paracetamol 500mg 8/8h se dor',
    followUpDate: '2025-01-15',
    vitalSigns: {
      bloodPressure: '110/70',
      heartRate: 68,
      temperature: 36.2,
      weight: 58,
      height: 160
    },
    createdAt: '2024-12-15T09:00:00Z',
    updatedAt: '2024-12-18T15:15:00Z'
  },
  {
    id: 'consult-3',
    doctorId: 'doctor-1',
    patientId: 'patient-4',
    patientName: 'José Fernando Mendes',
    date: '2024-12-26',
    time: '10:30',
    duration: 30,
    status: 'scheduled',
    type: 'consultation',
    chiefComplaint: 'Check-up cardiológico de rotina',
    clinicalNotes: 'Consulta de rotina para acompanhamento cardiológico',
    createdAt: '2024-12-20T15:00:00Z',
    updatedAt: '2024-12-20T15:00:00Z'
  }
];

const mockExams: MedicalExam[] = [
  {
    id: 'exam-1',
    consultationId: 'consult-1',
    patientId: 'patient-1',
    patientName: 'Maria Silva Santos',
    doctorId: 'doctor-1',
    examType: 'Eletrocardiograma',
    category: 'Cardiologia',
    requestDate: '2024-12-20',
    scheduledDate: '2024-12-23',
    status: 'scheduled',
    priority: 'routine',
    instructions: 'Jejum não necessário. Trazer exames anteriores.',
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z'
  },
  {
    id: 'exam-2',
    consultationId: 'consult-2',
    patientId: 'patient-3',
    patientName: 'Ana Paula Costa',
    doctorId: 'doctor-1',
    examType: 'Ultrassom Abdominal',
    category: 'Radiologia',
    requestDate: '2024-12-18',
    scheduledDate: '2024-12-19',
    resultDate: '2024-12-19',
    status: 'completed',
    priority: 'routine',
    instructions: 'Jejum de 8 horas.',
    results: 'Abdome normal, sem alterações significativas.',
    interpretation: 'Exame dentro dos parâmetros normais.',
    recommendations: 'Manter acompanhamento de rotina.',
    fileUrl: '/exams/ultrassom-ana-20241219.pdf',
    createdAt: '2024-12-18T15:00:00Z',
    updatedAt: '2024-12-19T16:30:00Z'
  },
  {
    id: 'exam-3',
    consultationId: 'consult-1',
    patientId: 'patient-1',
    patientName: 'Maria Silva Santos',
    doctorId: 'doctor-1',
    examType: 'Hemograma Completo',
    category: 'Laboratório',
    requestDate: '2024-12-20',
    status: 'requested',
    priority: 'routine',
    instructions: 'Coleta em jejum de 12 horas.',
    createdAt: '2024-12-20T10:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z'
  }
];

const mockMessages: InternalMessage[] = [
  {
    id: 'msg-1',
    senderId: 'nurse-1',
    senderName: 'Enfermeira Ana',
    senderRole: 'nurse',
    recipientId: 'doctor-1',
    recipientName: 'Dr. António Silva',
    recipientRole: 'doctor',
    subject: 'Paciente Maria Santos - Sintomas Urgentes',
    content: 'Dr. António, a paciente Maria Santos chegou com dor torácica intensa. Está na sala 3 aguardando avaliação urgente.',
    priority: 'urgent',
    type: 'urgent_care',
    read: false,
    replied: false,
    important: true,
    patientId: 'patient-1',
    patientName: 'Maria Silva Santos',
    createdAt: '2024-12-22T14:30:00Z',
    updatedAt: '2024-12-22T14:30:00Z'
  },
  {
    id: 'msg-2',
    senderId: 'receptionist-1',
    senderName: 'Recepção - Carla',
    senderRole: 'receptionist',
    recipientId: 'doctor-1',
    recipientName: 'Dr. António Silva',
    recipientRole: 'doctor',
    subject: 'Alteração na Agenda de Amanhã',
    content: 'Dr. António, o paciente José Mendes solicitou reagendamento da consulta das 10:30 de amanhã para 15:00. Podemos confirmar?',
    priority: 'normal',
    type: 'schedule_change',
    read: true,
    readAt: '2024-12-22T15:00:00Z',
    replied: false,
    important: false,
    patientId: 'patient-4',
    patientName: 'José Fernando Mendes',
    createdAt: '2024-12-22T13:45:00Z',
    updatedAt: '2024-12-22T15:00:00Z'
  },
  {
    id: 'msg-3',
    senderId: 'doctor-2',
    senderName: 'Dra. Maria Santos',
    senderRole: 'doctor',
    recipientId: 'doctor-1',
    recipientName: 'Dr. António Silva',
    recipientRole: 'doctor',
    subject: 'Interconsulta - Ana Paula Costa',
    content: 'Colega, paciente Ana Paula apresentou alterações no pós-operatório que gostaria de discutir. Podemos conversar hoje?',
    priority: 'high',
    type: 'patient_update',
    read: false,
    replied: false,
    important: false,
    patientId: 'patient-3',
    patientName: 'Ana Paula Costa',
    createdAt: '2024-12-22T09:15:00Z',
    updatedAt: '2024-12-22T09:15:00Z'
  }
];

const mockProfile: DoctorProfile = {
  id: 'doctor-1',
  name: 'Dr. António Silva',
  email: 'medico@bemcuidar.co.ao',
  specialty: 'Cardiologia',
  registrationNumber: 'CRM-AO-12345',
  phone: '+244 923 456 789',
  avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
  qualifications: [
    'Medicina - Universidade Agostinho Neto (2005)',
    'Residência em Cardiologia - Hospital Central de Luanda (2010)',
    'Fellowship em Cardiologia Intervencionista - Instituto do Coração, Brasil (2012)',
    'Mestrado em Cardiologia Clínica - Universidade de Coimbra (2015)'
  ],
  experience: 15,
  languages: ['Português', 'Inglês', 'Francês'],
  consultationHours: {
    monday: { start: '08:00', end: '17:00', available: true },
    tuesday: { start: '08:00', end: '17:00', available: true },
    wednesday: { start: '08:00', end: '17:00', available: true },
    thursday: { start: '08:00', end: '17:00', available: true },
    friday: { start: '08:00', end: '17:00', available: true },
    saturday: { start: '08:00', end: '12:00', available: true },
    sunday: { start: '00:00', end: '00:00', available: false }
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: true,
    urgentAlertsOnly: false,
    consultationReminders: true
  }
};

export const useDoctorStore = create<DoctorState>((set, get) => ({
  // Initial state
  patients: [],
  consultations: [],
  exams: [],
  messages: [],
  profile: null,
  isLoading: false,

  // Patients
  fetchPatients: async (doctorId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const doctorPatients = mockPatients.filter(patient => patient.assignedDoctorId === doctorId);
    set({ patients: doctorPatients, isLoading: false });
  },

  searchPatients: (query: string, doctorId: string) => {
    const patients = get().patients;
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(query.toLowerCase()) ||
      patient.processNumber.toLowerCase().includes(query.toLowerCase())
    );
  },

  getPatientById: (patientId: string) => {
    const patients = get().patients;
    return patients.find(patient => patient.id === patientId) || null;
  },

  // Consultations
  fetchConsultations: async (doctorId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const doctorConsultations = mockConsultations.filter(consultation => consultation.doctorId === doctorId);
    set({ consultations: doctorConsultations, isLoading: false });
  },

  createConsultation: async (consultationData) => {
    const newConsultation: DoctorConsultation = {
      ...consultationData,
      id: `consult-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const currentConsultations = get().consultations;
    set({ consultations: [...currentConsultations, newConsultation] });
    
    return newConsultation.id;
  },

  updateConsultation: async (consultationId: string, updates: Partial<DoctorConsultation>) => {
    const currentConsultations = get().consultations;
    const updatedConsultations = currentConsultations.map(consultation =>
      consultation.id === consultationId
        ? { ...consultation, ...updates, updatedAt: new Date().toISOString() }
        : consultation
    );
    
    set({ consultations: updatedConsultations });
  },

  deleteConsultation: async (consultationId: string) => {
    const currentConsultations = get().consultations;
    const filteredConsultations = currentConsultations.filter(consultation => consultation.id !== consultationId);
    
    set({ consultations: filteredConsultations });
  },

  // Exams
  fetchExams: async (doctorId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const doctorExams = mockExams.filter(exam => exam.doctorId === doctorId);
    set({ exams: doctorExams, isLoading: false });
  },

  requestExam: async (examData) => {
    const newExam: MedicalExam = {
      ...examData,
      id: `exam-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const currentExams = get().exams;
    set({ exams: [...currentExams, newExam] });
    
    return newExam.id;
  },

  updateExamResults: async (examId: string, results: string, interpretation: string, recommendations?: string) => {
    const currentExams = get().exams;
    const updatedExams = currentExams.map(exam =>
      exam.id === examId
        ? {
            ...exam,
            results,
            interpretation,
            recommendations,
            resultDate: new Date().toISOString().split('T')[0],
            status: 'completed' as const,
            updatedAt: new Date().toISOString()
          }
        : exam
    );
    
    set({ exams: updatedExams });
  },

  uploadExamFile: async (examId: string, file: File) => {
    // Mock file upload
    const fileUrl = `/exams/${file.name}`;
    
    const currentExams = get().exams;
    const updatedExams = currentExams.map(exam =>
      exam.id === examId
        ? { ...exam, fileUrl, updatedAt: new Date().toISOString() }
        : exam
    );
    
    set({ exams: updatedExams });
    return fileUrl;
  },

  // Messages
  fetchMessages: async (doctorId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const doctorMessages = mockMessages.filter(message => 
      message.recipientId === doctorId || message.senderId === doctorId
    );
    set({ messages: doctorMessages, isLoading: false });
  },

  sendMessage: async (messageData) => {
    const newMessage: InternalMessage = {
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
    const updatedMessages = currentMessages.map(message =>
      message.id === messageId
        ? {
            ...message,
            read: true,
            readAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        : message
    );
    
    set({ messages: updatedMessages });
  },

  markMessageAsImportant: (messageId: string, important: boolean) => {
    const currentMessages = get().messages;
    const updatedMessages = currentMessages.map(message =>
      message.id === messageId
        ? { ...message, important, updatedAt: new Date().toISOString() }
        : message
    );
    
    set({ messages: updatedMessages });
  },

  // Profile
  fetchProfile: async (doctorId: string) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 200));
    
    if (doctorId === 'doctor-1') {
      set({ profile: mockProfile, isLoading: false });
    } else {
      set({ profile: null, isLoading: false });
    }
  },

  updateProfile: async (updates: Partial<DoctorProfile>) => {
    const currentProfile = get().profile;
    if (currentProfile) {
      const updatedProfile = { ...currentProfile, ...updates };
      set({ profile: updatedProfile });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  }
}));
