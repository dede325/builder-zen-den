import { readFileSync, writeFileSync, existsSync } from 'fs';
import { Patient, Appointment, ExamResult, NotificationSettings } from './types';

interface PortalData {
  patients: Patient[];
  appointments: Appointment[];
  examResults: ExamResult[];
  notificationSettings: Record<string, NotificationSettings>;
}

class PortalStorage {
  private dataFile = 'data/portal-data.json';
  
  private loadData(): PortalData {
    try {
      if (!existsSync(this.dataFile)) {
        return this.createInitialData();
      }
      
      const data = readFileSync(this.dataFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading portal data:', error);
      return this.createInitialData();
    }
  }
  
  private saveData(data: PortalData): void {
    try {
      writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving portal data:', error);
      throw new Error('Failed to save data');
    }
  }
  
  private createInitialData(): PortalData {
    const initialData: PortalData = {
      patients: [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '+244 945 123 456',
          birthDate: '1985-06-15',
          cpf: '123.456.789-00',
          address: 'Av. 21 de Janeiro, 123, Luanda',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          phone: '+244 945 987 654',
          birthDate: '1990-03-22',
          cpf: '987.654.321-00',
          address: 'Rua das Flores, 456, Luanda',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      appointments: [
        {
          id: '1',
          patientId: '1',
          specialty: 'Cardiologia',
          doctor: 'Dr. António Silva',
          date: '2024-01-25',
          time: '14:30',
          status: 'scheduled',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          patientId: '1',
          specialty: 'Clínica Geral',
          doctor: 'Dra. Maria Santos',
          date: '2024-01-15',
          time: '10:00',
          status: 'completed',
          notes: 'Consulta de rotina realizada com sucesso',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      examResults: [
        {
          id: '1',
          patientId: '1',
          name: 'Hemograma Completo',
          type: 'Análise Clínica',
          date: '2024-01-20',
          status: 'ready',
          resultUrl: '/mock-result.pdf',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          patientId: '1',
          name: 'Eletrocardiograma',
          type: 'Cardiologia',
          date: '2024-01-18',
          status: 'viewed',
          notes: 'Resultado normal',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],
      notificationSettings: {
        '1': {
          emailReminders: true,
          smsReminders: false,
          examNotifications: true
        }
      }
    };
    
    this.saveData(initialData);
    return initialData;
  }
  
  // Patient methods
  authenticatePatient(email: string, password: string): Patient | null {
    const data = this.loadData();
    // Simple authentication - in production, use proper password hashing
    const patient = data.patients.find(p => p.email === email);
    return patient || null;
  }
  
  getPatient(id: string): Patient | null {
    const data = this.loadData();
    return data.patients.find(p => p.id === id) || null;
  }
  
  updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const data = this.loadData();
    const patientIndex = data.patients.findIndex(p => p.id === id);
    
    if (patientIndex === -1) return null;
    
    data.patients[patientIndex] = {
      ...data.patients[patientIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveData(data);
    return data.patients[patientIndex];
  }
  
  // Appointment methods
  getPatientAppointments(patientId: string): Appointment[] {
    const data = this.loadData();
    return data.appointments.filter(a => a.patientId === patientId);
  }
  
  createAppointment(patientId: string, appointmentData: Omit<Appointment, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>): Appointment {
    const data = this.loadData();
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientId,
      ...appointmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    data.appointments.push(newAppointment);
    this.saveData(data);
    return newAppointment;
  }
  
  updateAppointment(id: string, updates: Partial<Appointment>): Appointment | null {
    const data = this.loadData();
    const appointmentIndex = data.appointments.findIndex(a => a.id === id);
    
    if (appointmentIndex === -1) return null;
    
    data.appointments[appointmentIndex] = {
      ...data.appointments[appointmentIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveData(data);
    return data.appointments[appointmentIndex];
  }
  
  deleteAppointment(id: string): boolean {
    const data = this.loadData();
    const initialLength = data.appointments.length;
    data.appointments = data.appointments.filter(a => a.id !== id);
    
    if (data.appointments.length < initialLength) {
      this.saveData(data);
      return true;
    }
    return false;
  }
  
  // Exam methods
  getPatientExamResults(patientId: string): ExamResult[] {
    const data = this.loadData();
    return data.examResults.filter(e => e.patientId === patientId);
  }
  
  updateExamResult(id: string, updates: Partial<ExamResult>): ExamResult | null {
    const data = this.loadData();
    const examIndex = data.examResults.findIndex(e => e.id === id);
    
    if (examIndex === -1) return null;
    
    data.examResults[examIndex] = {
      ...data.examResults[examIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.saveData(data);
    return data.examResults[examIndex];
  }
  
  // Notification settings
  getNotificationSettings(patientId: string): NotificationSettings {
    const data = this.loadData();
    return data.notificationSettings[patientId] || {
      emailReminders: true,
      smsReminders: false,
      examNotifications: true
    };
  }
  
  updateNotificationSettings(patientId: string, settings: NotificationSettings): NotificationSettings {
    const data = this.loadData();
    data.notificationSettings[patientId] = settings;
    this.saveData(data);
    return settings;
  }
}

export const portalStorage = new PortalStorage();
