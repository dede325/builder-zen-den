import { RequestHandler } from "express";
import { portalStorage } from "../portal-storage";
import { CreateAppointmentRequest, ApiResponse } from "@shared/portal";
import { z } from "zod";

const CreateAppointmentSchema = z.object({
  specialty: z.string().min(1, "Especialidade é obrigatória"),
  preferredDate: z.string().min(1, "Data preferida é obrigatória"),
  notes: z.string().optional()
});

const UpdateAppointmentSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'cancelled']).optional(),
  notes: z.string().optional()
});

export const getAppointments: RequestHandler = async (req, res) => {
  try {
    const patient = (req as any).patient;
    const appointments = portalStorage.getPatientAppointments(patient.id);
    
    res.json({
      success: true,
      data: appointments
    });

  } catch (error) {
    console.error("Error getting appointments:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao buscar consultas"
    });
  }
};

export const createAppointment: RequestHandler = async (req, res) => {
  try {
    const patient = (req as any).patient;
    
    const validationResult = CreateAppointmentSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: validationResult.error.flatten().fieldErrors
      });
    }

    const { specialty, preferredDate, notes } = validationResult.data;

    // In a real app, you would have a more complex scheduling system
    const appointmentData = {
      specialty,
      doctor: getDoctorBySpecialty(specialty),
      date: preferredDate,
      time: "14:00", // Default time - in real app, would be selected by patient
      status: 'scheduled' as const,
      notes
    };

    const appointment = portalStorage.createAppointment(patient.id, appointmentData);
    
    res.json({
      success: true,
      data: appointment,
      message: "Solicitação de consulta enviada com sucesso. Entraremos em contato para confirmação."
    });

  } catch (error) {
    console.error("Error creating appointment:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao agendar consulta"
    });
  }
};

export const updateAppointment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = (req as any).patient;
    
    const validationResult = UpdateAppointmentSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: validationResult.error.flatten().fieldErrors
      });
    }

    // Verify appointment belongs to patient
    const appointments = portalStorage.getPatientAppointments(patient.id);
    const appointmentExists = appointments.some(a => a.id === id);
    
    if (!appointmentExists) {
      return res.status(404).json({
        success: false,
        message: "Consulta não encontrada"
      });
    }

    const updatedAppointment = portalStorage.updateAppointment(id, validationResult.data);
    
    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Consulta não encontrada"
      });
    }

    res.json({
      success: true,
      data: updatedAppointment,
      message: "Consulta atualizada com sucesso"
    });

  } catch (error) {
    console.error("Error updating appointment:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar consulta"
    });
  }
};

export const cancelAppointment: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = (req as any).patient;
    
    // Verify appointment belongs to patient
    const appointments = portalStorage.getPatientAppointments(patient.id);
    const appointment = appointments.find(a => a.id === id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Consulta não encontrada"
      });
    }

    if (appointment.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: "Apenas consultas agendadas podem ser canceladas"
      });
    }

    const updatedAppointment = portalStorage.updateAppointment(id, { status: 'cancelled' });
    
    res.json({
      success: true,
      data: updatedAppointment,
      message: "Consulta cancelada com sucesso"
    });

  } catch (error) {
    console.error("Error cancelling appointment:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao cancelar consulta"
    });
  }
};

// Helper function to assign doctors by specialty
function getDoctorBySpecialty(specialty: string): string {
  const doctors = {
    'Cardiologia': 'Dr. António Silva',
    'Clínica Geral': 'Dra. Maria Santos',
    'Dermatologia': 'Dr. João Pereira',
    'Pediatria': 'Dra. Ana Costa',
    'Neurologia': 'Dr. Paulo Mendes',
    'Ortopedia': 'Dr. Carlos Lima'
  };
  
  return doctors[specialty as keyof typeof doctors] || 'Dr. Médico Especialista';
}
