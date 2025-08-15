import { UserRole, Permission, PermissionManager } from "./types";
import { Patient } from "./types";

export interface UserTypeInfo {
  role: UserRole;
  permissions: Permission[];
  password: string;
  description: string;
  displayName: string;
}

export const USER_SEEDS: Record<string, UserTypeInfo> = {
  "paciente@bemcuidar.co.ao": {
    role: UserRole.PATIENT,
    permissions: PermissionManager.getPermissionsForRole(UserRole.PATIENT),
    password: "123456",
    description: "Acesso completo ao portal do paciente",
    displayName: "Paciente (João Silva)",
  },
  "medico@bemcuidar.co.ao": {
    role: UserRole.DOCTOR,
    permissions: PermissionManager.getPermissionsForRole(UserRole.DOCTOR),
    password: "medico123",
    description: "Acesso médico com visualização de pacientes",
    displayName: "Médico (Dr. António Silva)",
  },
  "enfermeira@bemcuidar.co.ao": {
    role: UserRole.NURSE,
    permissions: PermissionManager.getPermissionsForRole(UserRole.NURSE),
    password: "enfermeira123",
    description: "Acesso de enfermagem com funções limitadas",
    displayName: "Enfermeira (Ana Costa)",
  },
  "admin@bemcuidar.co.ao": {
    role: UserRole.ADMIN,
    permissions: PermissionManager.getPermissionsForRole(UserRole.ADMIN),
    password: "admin123",
    description: "Acesso total ao sistema",
    displayName: "Administrador (Carlos Mendes)",
  },
  "recepcao@bemcuidar.co.ao": {
    role: UserRole.RECEPTIONIST,
    permissions: PermissionManager.getPermissionsForRole(UserRole.RECEPTIONIST),
    password: "recepcao123",
    description: "Acesso de recepção para agendamentos",
    displayName: "Recepcionista (Sofia Lima)",
  },
};

export function getUserTypeByEmail(email: string): UserTypeInfo | null {
  return USER_SEEDS[email] || null;
}

export function validateUserCredentials(
  email: string,
  password: string,
): boolean {
  const userType = getUserTypeByEmail(email);
  return userType ? userType.password === password : false;
}

export function getUserPermissions(email: string): Permission[] {
  const userType = getUserTypeByEmail(email);
  return userType ? userType.permissions : [];
}

export function getUserRole(email: string): UserRole | null {
  const userType = getUserTypeByEmail(email);
  return userType ? userType.role : null;
}

// Dados para exibição na tela de login
export interface LoginHint {
  email: string;
  password: string;
  role: string;
  description: string;
  displayName: string;
}

export function getLoginHints(): LoginHint[] {
  return Object.entries(USER_SEEDS).map(([email, info]) => ({
    email,
    password: info.password,
    role: info.role,
    description: info.description,
    displayName: info.displayName,
  }));
}
