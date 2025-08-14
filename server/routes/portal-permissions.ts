import { RequestHandler } from "express";
import { PermissionManager, Permission, UserRole } from "@shared/permissions";

export const checkPermissions: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { permission, resource, action } = req.query;
    
    let hasPermission = false;
    
    if (permission) {
      hasPermission = PermissionManager.hasPermission(user, permission as Permission);
    } else if (resource && action) {
      hasPermission = PermissionManager.canAccessResource(user, resource as string, action as string);
    }
    
    res.json({
      success: true,
      data: {
        hasPermission,
        userRole: user.role,
        userPermissions: user.permissions
      }
    });

  } catch (error) {
    console.error("Error checking permissions:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao verificar permissões"
    });
  }
};

export const getUserPermissions: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    
    res.json({
      success: true,
      data: {
        role: user.role,
        permissions: user.permissions,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error("Error getting user permissions:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao buscar permissões do usuário"
    });
  }
};

export const getRolePermissions: RequestHandler = async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({
        success: false,
        message: "Tipo de usuário inválido"
      });
    }
    
    const permissions = PermissionManager.getPermissionsForRole(role as UserRole);
    
    res.json({
      success: true,
      data: {
        role,
        permissions
      }
    });

  } catch (error) {
    console.error("Error getting role permissions:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao buscar permissões do tipo de usuário"
    });
  }
};

export const validateAction: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { resource, action, targetUserId } = req.body;
    
    // Basic access control
    let canPerformAction = PermissionManager.canAccessResource(user, resource, action);
    
    // Additional checks for accessing other users' data
    if (targetUserId && targetUserId !== user.id) {
      // Only allow if user has appropriate permissions
      if (user.role === UserRole.PATIENT) {
        canPerformAction = false; // Patients can only access their own data
      }
    }
    
    res.json({
      success: true,
      data: {
        canPerformAction,
        reason: canPerformAction ? 'Ação permitida' : 'Permissão insuficiente'
      }
    });

  } catch (error) {
    console.error("Error validating action:", error);
    
    res.status(500).json({
      success: false,
      message: "Erro ao validar ação"
    });
  }
};
