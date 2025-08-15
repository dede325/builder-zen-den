/**
 * © 2025 B&S Best Services Angola & Alegria Matoso Investimentos.
 * Tutelado por Kaijhe Morose.
 * Todos os direitos reservados.
 * Proibida a cópia, modificação, distribuição ou uso sem autorização escrita.
 */

export enum UserRole {
  PATIENT = "patient",
  DOCTOR = "doctor",
  NURSE = "nurse",
  ADMIN = "admin",
  RECEPTIONIST = "receptionist",
}

export enum Permission {
  // Patient permissions
  VIEW_OWN_PROFILE = "view_own_profile",
  EDIT_OWN_PROFILE = "edit_own_profile",
  VIEW_OWN_APPOINTMENTS = "view_own_appointments",
  CREATE_APPOINTMENT = "create_appointment",
  CANCEL_OWN_APPOINTMENT = "cancel_own_appointment",
  VIEW_OWN_EXAMS = "view_own_exams",
  DOWNLOAD_OWN_EXAMS = "download_own_exams",

  // Doctor permissions
  VIEW_PATIENT_PROFILES = "view_patient_profiles",
  EDIT_PATIENT_PROFILES = "edit_patient_profiles",
  VIEW_ALL_APPOINTMENTS = "view_all_appointments",
  MANAGE_APPOINTMENTS = "manage_appointments",
  VIEW_PATIENT_EXAMS = "view_patient_exams",
  CREATE_EXAM_RESULTS = "create_exam_results",
  EDIT_EXAM_RESULTS = "edit_exam_results",

  // Nurse permissions
  VIEW_PATIENT_BASIC_INFO = "view_patient_basic_info",
  SCHEDULE_APPOINTMENTS = "schedule_appointments",
  UPLOAD_EXAM_RESULTS = "upload_exam_results",

  // Admin permissions
  MANAGE_USERS = "manage_users",
  VIEW_ALL_DATA = "view_all_data",
  MANAGE_SYSTEM_SETTINGS = "manage_system_settings",
  ACCESS_REPORTS = "access_reports",

  // Receptionist permissions
  MANAGE_PATIENT_REGISTRATION = "manage_patient_registration",
  SCHEDULE_ALL_APPOINTMENTS = "schedule_all_appointments",
  VIEW_SCHEDULE = "view_schedule",
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.PATIENT]: [
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
    Permission.VIEW_OWN_APPOINTMENTS,
    Permission.CREATE_APPOINTMENT,
    Permission.CANCEL_OWN_APPOINTMENT,
    Permission.VIEW_OWN_EXAMS,
    Permission.DOWNLOAD_OWN_EXAMS,
  ],

  [UserRole.DOCTOR]: [
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
    Permission.VIEW_PATIENT_PROFILES,
    Permission.EDIT_PATIENT_PROFILES,
    Permission.VIEW_ALL_APPOINTMENTS,
    Permission.MANAGE_APPOINTMENTS,
    Permission.VIEW_PATIENT_EXAMS,
    Permission.CREATE_EXAM_RESULTS,
    Permission.EDIT_EXAM_RESULTS,
  ],

  [UserRole.NURSE]: [
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
    Permission.VIEW_PATIENT_BASIC_INFO,
    Permission.SCHEDULE_APPOINTMENTS,
    Permission.UPLOAD_EXAM_RESULTS,
    Permission.VIEW_SCHEDULE,
  ],

  [UserRole.RECEPTIONIST]: [
    Permission.VIEW_OWN_PROFILE,
    Permission.EDIT_OWN_PROFILE,
    Permission.MANAGE_PATIENT_REGISTRATION,
    Permission.SCHEDULE_ALL_APPOINTMENTS,
    Permission.VIEW_SCHEDULE,
    Permission.VIEW_PATIENT_BASIC_INFO,
  ],

  [UserRole.ADMIN]: Object.values(Permission),
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export class PermissionManager {
  static hasPermission(user: User, permission: Permission): boolean {
    return user.permissions.includes(permission) && user.isActive;
  }

  static hasAnyPermission(user: User, permissions: Permission[]): boolean {
    return permissions.some((permission) =>
      this.hasPermission(user, permission),
    );
  }

  static hasAllPermissions(user: User, permissions: Permission[]): boolean {
    return permissions.every((permission) =>
      this.hasPermission(user, permission),
    );
  }

  static canAccessResource(
    user: User,
    resource: string,
    action: string,
  ): boolean {
    const permissionMap: Record<string, Record<string, Permission>> = {
      profile: {
        view: Permission.VIEW_OWN_PROFILE,
        edit: Permission.EDIT_OWN_PROFILE,
      },
      appointments: {
        view: Permission.VIEW_OWN_APPOINTMENTS,
        create: Permission.CREATE_APPOINTMENT,
        cancel: Permission.CANCEL_OWN_APPOINTMENT,
      },
      exams: {
        view: Permission.VIEW_OWN_EXAMS,
        download: Permission.DOWNLOAD_OWN_EXAMS,
      },
    };

    const permission = permissionMap[resource]?.[action];
    return permission ? this.hasPermission(user, permission) : false;
  }

  static getPermissionsForRole(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  }
}

export interface PermissionCheck {
  success: boolean;
  message?: string;
}

export function requirePermission(permission: Permission) {
  return (req: any, res: any, next: any) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    if (!PermissionManager.hasPermission(user, permission)) {
      return res.status(403).json({
        success: false,
        message: "Permissão insuficiente para realizar esta ação",
      });
    }

    next();
  };
}

export function requireAnyPermission(permissions: Permission[]) {
  return (req: any, res: any, next: any) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    if (!PermissionManager.hasAnyPermission(user, permissions)) {
      return res.status(403).json({
        success: false,
        message: "Permissão insuficiente para realizar esta ação",
      });
    }

    next();
  };
}
