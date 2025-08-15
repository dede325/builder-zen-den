import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'patient' | 'doctor' | 'receptionist' | 'admin';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirecionar para login preservando a rota desejada
    return <Navigate to="/portal" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Usuário não tem permissão para acessar esta rota
    return <Navigate to="/portal/dashboard" replace />;
  }

  return <>{children}</>;
}
