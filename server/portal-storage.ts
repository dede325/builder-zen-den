import { readFileSync, writeFileSync, existsSync } from "fs";
import {
  Patient,
  Appointment,
  ExamResult,
  NotificationSettings,
} from "./types";

interface PortalData {
  patients: Patient[];
  appointments: Appointment[];
  examResults: ExamResult[];
  notificationSettings: Record<string, NotificationSettings>;
}

class PortalStorage {
  private dataFile = "data/portal-data.json";

  private loadData(): PortalData {
    try {
      if (!existsSync(this.dataFile)) {
        return this.createInitialData();
      }

      const data = readFileSync(this.dataFile, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error loading portal data:", error);
      return this.createInitialData();
    }
  }

  private saveData(data: PortalData): void {
    try {
      writeFileSync(this.dataFile, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error saving portal data:", error);
      throw new Error("Failed to save data");
    }
  }

  private createInitialData(): PortalData {
    const initialData: PortalData = {
      patients: [
        {
          id: "1",
          name: "João Silva",
          email: "paciente@bemcuidar.co.ao",
          phone: "+244 945 123 456",
          birthDate: "1985-06-15",
          cpf: "123.456.789-00",
          address: "Av. 21 de Janeiro, 123, Luanda",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Maria Santos",
          email: "maria@email.com",
          phone: "+244 945 987 654",
          birthDate: "1990-03-22",
          cpf: "987.654.321-00",
          address: "Rua das Flores, 456, Luanda",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Dr. António Silva",
          email: "medico@bemcuidar.co.ao",
          phone: "+244 945 111 222",
          birthDate: "1978-03-10",
          cpf: "111.222.333-44",
          address: "Rua dos Médicos, 789, Luanda",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Ana Costa",
          email: "enfermeira@bemcuidar.co.ao",
          phone: "+244 945 333 444",
          birthDate: "1988-07-22",
          cpf: "222.333.444-55",
          address: "Av. dos Enfermeiros, 456, Luanda",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "5",
          name: "Carlos Mendes",
          email: "admin@bemcuidar.co.ao",
          phone: "+244 945 555 666",
          birthDate: "1975-12-08",
          cpf: "333.444.555-66",
          address: "Rua da Administração, 321, Luanda",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "6",
          name: "Sofia Lima",
          email: "recepcao@bemcuidar.co.ao",
          phone: "+244 945 777 888",
          birthDate: "1992-04-18",
          cpf: "444.555.666-77",
          address: "Av. da Recepção, 654, Luanda",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      appointments: [
        {
          id: "1",
          patientId: "1",
          specialty: "Cardiologia",
          doctor: "Dr. António Silva",
          date: "2024-01-25",
          time: "14:30",
          status: "scheduled",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          patientId: "1",
          specialty: "Clínica Geral",
          doctor: "Dra. Maria Santos",
          date: "2024-01-15",
          time: "10:00",
          status: "completed",
          notes: "Consulta de rotina realizada com sucesso",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      examResults: [
        {
          id: "1",
          patientId: "1",
          name: "Hemograma Completo",
          type: "Análise Clínica",
          date: "2024-01-20",
          status: "ready",
          resultUrl: "/exam-result-1.pdf",
          notes:
            "Valores dentro da normalidade. Hemoglobina: 14.2 g/dL, Leucócitos: 6.800/mm³, Plaquetas: 285.000/mm³",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          patientId: "1",
          name: "Eletrocardiograma (ECG)",
          type: "Cardiologia",
          date: "2024-01-18",
          status: "viewed",
          resultUrl: "/exam-result-2.pdf",
          notes:
            "Ritmo sinusal regular. Frequência cardíaca: 72 bpm. Eixo elétrico normal. Ausência de alterações significativas.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          patientId: "1",
          name: "Perfil Lipídico",
          type: "Análise Clínica",
          date: "2024-01-15",
          status: "ready",
          resultUrl: "/exam-result-3.pdf",
          notes:
            "Colesterol Total: 180 mg/dL, LDL: 110 mg/dL, HDL: 55 mg/dL, Triglicerídeos: 95 mg/dL. Valores adequados.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          patientId: "1",
          name: "Glicemia de Jejum",
          type: "Análise Clínica",
          date: "2024-01-15",
          status: "viewed",
          resultUrl: "/exam-result-4.pdf",
          notes: "Glicose: 92 mg/dL. Valor normal em jejum.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "5",
          patientId: "1",
          name: "TSH e T4 Livre",
          type: "Endocrinologia",
          date: "2024-01-12",
          status: "ready",
          resultUrl: "/exam-result-5.pdf",
          notes:
            "TSH: 2.1 mUI/L, T4 Livre: 1.3 ng/dL. Função tireoidiana normal.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "6",
          patientId: "1",
          name: "Raio-X de Tórax",
          type: "Radiologia",
          date: "2024-01-10",
          status: "viewed",
          resultUrl: "/exam-result-6.pdf",
          notes:
            "Campos pulmonares livres. Silhueta cardíaca normal. Ausência de alterações pleuropulmonares.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "7",
          patientId: "1",
          name: "Urina Tipo I",
          type: "Análise Clínica",
          date: "2024-01-08",
          status: "pending",
          notes: "Exame em processamento.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "8",
          patientId: "2",
          name: "Hemograma Completo",
          type: "Análise Clínica",
          date: "2024-01-19",
          status: "ready",
          resultUrl: "/exam-result-8.pdf",
          notes:
            "Hemoglobina: 13.8 g/dL, Leucócitos: 7.200/mm³, Plaquetas: 295.000/mm³. Valores normais.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      notificationSettings: {
        "1": {
          emailReminders: true,
          smsReminders: false,
          examNotifications: true,
        },
      },
    };

    this.saveData(initialData);
    return initialData;
  }

  // Patient methods
  authenticatePatient(email: string, password: string): Patient | null {
    const data = this.loadData();
    // Simple authentication for demo - accepts any email/password combination
    // In production, use proper password hashing and verification
    let patient = data.patients.find((p) => p.email === email);

    // If patient not found, create a demo patient
    if (!patient && email && password) {
      patient = {
        id: Date.now().toString(),
        name:
          email
            .split("@")[0]
            .replace(/[^a-zA-Z]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()) || "Usuário Demo",
        email: email,
        phone: "+244 945 123 456",
        birthDate: "1990-01-01",
        cpf: "000.000.000-00",
        address: "Endereço demo, Luanda",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to patients list
      data.patients.push(patient);
      this.saveData(data);
    }

    return patient || null;
  }

  getPatient(id: string): Patient | null {
    const data = this.loadData();
    return data.patients.find((p) => p.id === id) || null;
  }

  updatePatient(id: string, updates: Partial<Patient>): Patient | null {
    const data = this.loadData();
    const patientIndex = data.patients.findIndex((p) => p.id === id);

    if (patientIndex === -1) return null;

    data.patients[patientIndex] = {
      ...data.patients[patientIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveData(data);
    return data.patients[patientIndex];
  }

  // Appointment methods
  getPatientAppointments(patientId: string): Appointment[] {
    const data = this.loadData();
    return data.appointments.filter((a) => a.patientId === patientId);
  }

  createAppointment(
    patientId: string,
    appointmentData: Omit<
      Appointment,
      "id" | "patientId" | "createdAt" | "updatedAt"
    >,
  ): Appointment {
    const data = this.loadData();
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientId,
      ...appointmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.appointments.push(newAppointment);
    this.saveData(data);
    return newAppointment;
  }

  updateAppointment(
    id: string,
    updates: Partial<Appointment>,
  ): Appointment | null {
    const data = this.loadData();
    const appointmentIndex = data.appointments.findIndex((a) => a.id === id);

    if (appointmentIndex === -1) return null;

    data.appointments[appointmentIndex] = {
      ...data.appointments[appointmentIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveData(data);
    return data.appointments[appointmentIndex];
  }

  deleteAppointment(id: string): boolean {
    const data = this.loadData();
    const initialLength = data.appointments.length;
    data.appointments = data.appointments.filter((a) => a.id !== id);

    if (data.appointments.length < initialLength) {
      this.saveData(data);
      return true;
    }
    return false;
  }

  // Exam methods
  getPatientExamResults(patientId: string): ExamResult[] {
    const data = this.loadData();
    return data.examResults.filter((e) => e.patientId === patientId);
  }

  updateExamResult(
    id: string,
    updates: Partial<ExamResult>,
  ): ExamResult | null {
    const data = this.loadData();
    const examIndex = data.examResults.findIndex((e) => e.id === id);

    if (examIndex === -1) return null;

    data.examResults[examIndex] = {
      ...data.examResults[examIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveData(data);
    return data.examResults[examIndex];
  }

  // Notification settings
  getNotificationSettings(patientId: string): NotificationSettings {
    const data = this.loadData();
    return (
      data.notificationSettings[patientId] || {
        emailReminders: true,
        smsReminders: false,
        examNotifications: true,
      }
    );
  }

  updateNotificationSettings(
    patientId: string,
    settings: NotificationSettings,
  ): NotificationSettings {
    const data = this.loadData();
    data.notificationSettings[patientId] = settings;
    this.saveData(data);
    return settings;
  }
}

export const portalStorage = new PortalStorage();
