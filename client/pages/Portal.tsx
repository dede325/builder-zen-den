import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Dashboard from '@/components/dashboard/Dashboard';
import AppointmentsPage from '@/components/dashboard/AppointmentsPage';
import DoctorLayout from '@/components/dashboard/DoctorLayout';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Heart,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
  Stethoscope
} from 'lucide-react';

// Placeholder components para as páginas do dashboard

function ExamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Exames</h2>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Página de exames em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function MessagesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mensagens</h2>
        <Button>Nova Mensagem</Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Página de mensagens em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Faturas</h2>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Página de faturas em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Perfil</h2>
        <Button>Editar Perfil</Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Página de perfil em desenvolvimento...</p>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente de Login
function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login, isLoading } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validação básica
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await login(formData.email, formData.password);
    
    if (success) {
      toast({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo ao Portal do Paciente.',
      });
      
      // Redirecionar para o dashboard apropriado baseado no role do usuário
      const user = useAuthStore.getState().user;
      let redirectPath = '/portal/dashboard';

      if (user?.role === 'doctor') {
        redirectPath = '/portal/doctor/dashboard';
      } else if (user?.role === 'admin') {
        redirectPath = '/portal/admin/dashboard';
      }

      const from = (location.state as any)?.from?.pathname || redirectPath;
      navigate(from, { replace: true });
    } else {
      toast({
        title: 'Erro no login',
        description: 'E-mail ou senha incorretos.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-clinic-gradient rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Portal do Paciente</h2>
          <p className="mt-2 text-gray-600">
            Acesse sua conta para gerenciar suas consultas e exames
          </p>
        </div>

        {/* Demo Accounts Info */}
        <Alert>
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            <strong>Contas de demonstração:</strong><br />
            <strong>Pacientes:</strong><br />
            <code>paciente@example.com</code> / <code>123456</code><br />
            <code>carlos@example.com</code> / <code>123456</code><br />
            <strong>Médico:</strong><br />
            <code>medico@bemcuidar.co.ao</code> / <code>medico123</code>
          </AlertDescription>
        </Alert>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Lock className="w-5 h-5 mr-2" />
              Fazer Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? 'border-red-500' : ''}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    placeholder="Sua senha"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-clinic-gradient hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Info */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Conexão segura e protegida</span>
          </div>
        </div>

        {/* Back to Site */}
        <div className="text-center">
          <Link 
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar ao site principal
          </Link>
        </div>
      </div>
    </div>
  );
}

// Componente principal do Portal
export default function Portal() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Rota de login */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to="/portal/dashboard" replace /> : 
            <LoginForm />
        } 
      />
      
      {/* Rotas protegidas do dashboard */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        {/* Redirecionar rotas desconhecidas para dashboard */}
        <Route path="*" element={<Navigate to="/portal/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
