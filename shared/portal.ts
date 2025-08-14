export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  patient?: Patient;
  token?: string;
  message?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  specialty: string;
  doctor: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  specialty: string;
  preferredDate: string;
  notes?: string;
}

export interface ExamResult {
  id: string;
  patientId: string;
  name: string;
  type: string;
  date: string;
  status: 'pending' | 'ready' | 'viewed';
  resultUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: string;
}

export interface NotificationSettings {
  emailReminders: boolean;
  smsReminders: boolean;
  examNotifications: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}
