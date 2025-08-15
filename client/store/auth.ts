import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  birthDate?: string;
  document?: string;
  documentType?: string;
  address?: string;
  bloodType?: string;
  allergies?: string;
  emergencyContact?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  role: 'patient' | 'doctor' | 'receptionist' | 'admin';
  active: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

// Mock de usuários para desenvolvimento
const mockUsers: User[] = [
  {
    id: 'patient-1',
    email: 'paciente@example.com',
    name: 'Maria Silva Santos',
    phone: '+244 912 345 678',
    birthDate: '1985-06-15',
    document: '123456789BA001',
    documentType: 'BI',
    address: 'Rua da Esperança, 123, Maianga, Luanda',
    bloodType: 'A+',
    allergies: 'Penicilina, Pólen',
    emergencyContact: 'João Santos - +244 923 456 789',
    insuranceProvider: 'SAÚDE ANGOLA',
    insuranceNumber: 'SA123456789',
    role: 'patient',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b15ad0e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-12-20T15:30:00Z'
  },
  {
    id: 'patient-2',
    email: 'carlos@example.com',
    name: 'Carlos Alberto Mendes',
    phone: '+244 934 567 890',
    birthDate: '1978-03-22',
    document: '987654321BA002',
    documentType: 'BI',
    address: 'Avenida Marginal, 456, Ingombota, Luanda',
    bloodType: 'O-',
    allergies: 'Nenhuma conhecida',
    emergencyContact: 'Ana Mendes - +244 945 678 901',
    insuranceProvider: 'MEDICLÍNICA',
    insuranceNumber: 'MC987654321',
    role: 'patient',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    createdAt: '2023-03-10T14:20:00Z',
    updatedAt: '2024-12-19T09:15:00Z'
  },
  {
    id: 'doctor-1',
    email: 'medico@bemcuidar.co.ao',
    name: 'Dr. António Silva',
    phone: '+244 923 456 789',
    document: '456789123BA003',
    documentType: 'BI',
    role: 'doctor',
    active: true,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
    createdAt: '2023-02-01T08:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z'
  },
  {
    id: 'admin-1',
    email: 'admin@bemcuidar.co.ao',
    name: 'Administrador Sistema',
    role: 'admin',
    active: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z'
  }
];

// Simular autenticação
const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = mockUsers.find(u => u.email === email);
  
  // Senhas de desenvolvimento (em produção seria hash)
  const validPasswords: { [key: string]: string } = {
    'paciente@example.com': '123456',
    'carlos@example.com': '123456',
    'medico@bemcuidar.co.ao': 'medico123',
    'admin@bemcuidar.co.ao': 'admin123'
  };
  
  if (user && validPasswords[email] === password) {
    return user;
  }
  
  return null;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        try {
          const user = await authenticateUser(email, password);
          
          if (user) {
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error('Erro no login:', error);
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            ...userData,
            updatedAt: new Date().toISOString()
          };
          set({ user: updatedUser });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'clinic-auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
