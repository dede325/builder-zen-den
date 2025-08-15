import { RequestHandler } from "express";
import { portalStorage } from "../portal-storage";
import { LoginRequest, LoginResponse, ApiResponse, UserRole, PermissionManager } from "../types";
import { validateUserCredentials, getUserRole, getUserPermissions } from "../user-types";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória")
});

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const validationResult = LoginSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Dados inválidos",
        errors: validationResult.error.flatten().fieldErrors
      });
    }

    const { email, password } = validationResult.data;

    // Validate user credentials with proper role-based authentication
    const isValidCredentials = validateUserCredentials(email, password);

    if (!isValidCredentials) {
      return res.status(401).json({
        success: false,
        message: "E-mail ou senha incorretos"
      });
    }

    // Get user data
    const patient = portalStorage.authenticatePatient(email, password);

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "Usuário não encontrado"
      });
    }

    const response: LoginResponse = {
      success: true,
      patient,
      token: `mock-token-${patient.id}`, // In production, use JWT
      message: "Login realizado com sucesso"
    };

    res.json(response);

  } catch (error) {
    console.error("Error during login:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor"
    });
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  // In a real app, you would invalidate the token here
  res.json({
    success: true,
    message: "Logout realizado com sucesso"
  });
};

// Middleware para verificar autenticação (simplificado)
export const requireAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: "Token de acesso obrigatório"
    });
  }
  
  const token = authHeader.substring(7);
  
  // Simple token validation - in production, use JWT verification
  if (!token.startsWith('mock-token-')) {
    return res.status(401).json({
      success: false,
      message: "Token inválido"
    });
  }
  
  const patientId = token.replace('mock-token-', '');
  const patient = portalStorage.getPatient(patientId);
  
  if (!patient) {
    return res.status(401).json({
      success: false,
      message: "Paciente não encontrado"
    });
  }
  
  // Create user object with permissions for patients
  const user = {
    id: patient.id,
    name: patient.name,
    email: patient.email,
    role: UserRole.PATIENT,
    permissions: PermissionManager.getPermissionsForRole(UserRole.PATIENT),
    isActive: true,
    createdAt: patient.createdAt || new Date().toISOString(),
    updatedAt: patient.updatedAt || new Date().toISOString()
  };

  // Attach both patient and user objects to request
  (req as any).patient = patient;
  (req as any).user = user;
  next();
};
