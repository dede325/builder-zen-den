import { RequestHandler } from "express";
import { portalStorage } from "../portal-storage";
import { UpdateProfileRequest, ApiResponse } from "@shared/portal";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos").optional(),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres").optional()
});

export const getProfile: RequestHandler = async (req, res) => {
  try {
    const patient = (req as any).patient;
    
    res.json({
      success: true,
      data: patient
    });

  } catch (error) {
    console.error("Error getting profile:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao buscar perfil"
    });
  }
};

export const updateProfile: RequestHandler = async (req, res) => {
  try {
    const patient = (req as any).patient;
    
    const validationResult = UpdateProfileSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: validationResult.error.flatten().fieldErrors
      });
    }

    const updatedPatient = portalStorage.updatePatient(patient.id, validationResult.data);
    
    if (!updatedPatient) {
      return res.status(404).json({
        success: false,
        message: "Paciente não encontrado"
      });
    }

    res.json({
      success: true,
      data: updatedPatient,
      message: "Perfil atualizado com sucesso"
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar perfil"
    });
  }
};

export const getNotificationSettings: RequestHandler = async (req, res) => {
  try {
    const patient = (req as any).patient;
    const settings = portalStorage.getNotificationSettings(patient.id);
    
    res.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error("Error getting notification settings:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao buscar configurações"
    });
  }
};

export const updateNotificationSettings: RequestHandler = async (req, res) => {
  try {
    const patient = (req as any).patient;
    const { emailReminders, smsReminders, examNotifications } = req.body;
    
    const settings = portalStorage.updateNotificationSettings(patient.id, {
      emailReminders: Boolean(emailReminders),
      smsReminders: Boolean(smsReminders),
      examNotifications: Boolean(examNotifications)
    });
    
    res.json({
      success: true,
      data: settings,
      message: "Configurações atualizadas com sucesso"
    });

  } catch (error) {
    console.error("Error updating notification settings:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar configurações"
    });
  }
};
