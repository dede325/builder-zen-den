import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'patient' | 'doctor' | 'admin' | 'nurse' | 'receptionist';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  speciality?: string; // For doctors
  license_number?: string; // For medical professionals
  patient_id?: string; // For patients
  department?: string;
  permissions: string[];
  last_login?: string;
  is_active: boolean;
  requires_2fa?: boolean;
  preferences: {
    language: 'pt-AO' | 'pt-BR' | 'en';
    timezone: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    theme: 'light' | 'dark' | 'system';
  };
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

interface AuthState {
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  
  // Utils
  isAuthenticated: () => boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole) => boolean;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: null,
      loading: false,
      error: null,

      login: async (email: string, password: string, role?: UserRole) => {
        set({ loading: true, error: null });
        
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Falha na autenticação');
          }

          const session: AuthSession = await response.json();
          
          // Validate session
          if (!session.access_token || !session.user) {
            throw new Error('Sessão inválida recebida do servidor');
          }

          set({ session, loading: false });
          
          // Store last login
          localStorage.setItem('last_login', new Date().toISOString());
          
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erro desconhecido',
            loading: false 
          });
          throw error;
        }
      },

      logout: () => {
        const { session } = get();
        
        if (session?.refresh_token) {
          // Notify server of logout
          fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: session.refresh_token }),
          }).catch(console.error);
        }

        set({ session: null, error: null });
        localStorage.removeItem('last_login');
      },

      refreshToken: async () => {
        const { session } = get();
        
        if (!session?.refresh_token) {
          throw new Error('Nenhum refresh token disponível');
        }

        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: session.refresh_token }),
          });

          if (!response.ok) {
            throw new Error('Falha ao renovar token');
          }

          const newSession: AuthSession = await response.json();
          set({ session: newSession });
          
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        const { session } = get();
        
        if (!session) {
          throw new Error('Usuário não autenticado');
        }

        const response = await fetch('/api/auth/profile', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error('Falha ao atualizar perfil');
        }

        const updatedUser = await response.json();
        set({
          session: {
            ...session,
            user: { ...session.user, ...updatedUser },
          },
        });
      },

      verify2FA: async (code: string) => {
        const { session } = get();
        
        if (!session) {
          throw new Error('Usuário não autenticado');
        }

        const response = await fetch('/api/auth/verify-2fa', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Código 2FA inválido');
        }
      },

      resetPassword: async (email: string) => {
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error('Falha ao enviar e-mail de recuperação');
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        const { session } = get();
        
        if (!session) {
          throw new Error('Usuário não autenticado');
        }

        const response = await fetch('/api/auth/change-password', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
        });

        if (!response.ok) {
          throw new Error('Falha ao alterar senha');
        }
      },

      // Utility functions
      isAuthenticated: () => {
        const { session } = get();
        return !!(session?.access_token && session.expires_at > Date.now());
      },

      hasPermission: (permission: string) => {
        const { session } = get();
        return session?.user.permissions.includes(permission) || false;
      },

      hasRole: (role: UserRole) => {
        const { session } = get();
        return session?.user.role === role;
      },

      getToken: () => {
        const { session } = get();
        return session?.access_token || null;
      },
    }),
    {
      name: 'bem-cuidar-auth',
      partialize: (state) => ({ session: state.session }),
    }
  )
);

// Auto refresh token before expiry
let refreshTimeout: NodeJS.Timeout;

useAuthStore.subscribe((state) => {
  if (refreshTimeout) {
    clearTimeout(refreshTimeout);
  }

  if (state.session?.expires_at) {
    const timeUntilExpiry = state.session.expires_at - Date.now();
    const refreshTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 0); // Refresh 5 minutes before expiry

    refreshTimeout = setTimeout(() => {
      state.refreshToken().catch(() => {
        // If refresh fails, logout will be called automatically
      });
    }, refreshTime);
  }
});
