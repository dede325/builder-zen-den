import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  User, 
  Settings, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Edit,
  Download,
  Plus,
  Eye,
  Bell,
  Lock,
  LogOut,
  Loader2
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  address: string;
}

interface Appointment {
  id: string;
  patientId: string;
  specialty: string;
  doctor: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface ExamResult {
  id: string;
  patientId: string;
  name: string;
  type: string;
  date: string;
  status: 'pending' | 'ready' | 'viewed';
  resultUrl?: string;
  notes?: string;
}

interface NotificationSettings {
  emailReminders: boolean;
  smsReminders: boolean;
  examNotifications: boolean;
}

export default function Portal() {
  const { toast } = useToast();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Patient | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // Data state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<Patient | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailReminders: true,
    smsReminders: false,
    examNotifications: true
  });
  const [loginHints, setLoginHints] = useState<any[]>([]);
  
  // Loading states
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Load login hints on component mount
  useEffect(() => {
    const loadLoginHints = async () => {
      try {
        const response = await fetch('/api/portal/auth/login-hints');
        const result = await response.json();
        if (result.success) {
          setLoginHints(result.data);
        }
      } catch (error) {
        console.error('Error loading login hints:', error);
      }
    };

    loadLoginHints();
  }, []);

  // API Helper
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // Authentication
  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Erro",
        description: "Preencha e-mail e senha",
        variant: "destructive",
      });
      return;
    }

    setIsLoggingIn(true);
    
    try {
      const response = await apiCall('/api/portal/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      });

      if (response.success) {
        setCurrentUser(response.patient);
        setAuthToken(response.token);
        setProfileData(response.patient);
        setIsAuthenticated(true);
        
        toast({
          title: "Sucesso",
          description: "Login realizado com sucesso",
        });

        // Load initial data
        loadData();
      } else {
        toast({
          title: "Erro",
          description: response.message || "Erro ao fazer login",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erro",
        description: "Erro de conexão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiCall('/api/portal/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthToken(null);
    setAppointments([]);
    setExamResults([]);
    setActiveTab('dashboard');
    setProfileData(null);
  };

  // Data loading
  const loadData = async () => {
    await Promise.all([
      loadAppointments(),
      loadExamResults(),
      loadNotificationSettings()
    ]);
  };

  const loadAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const response = await apiCall('/api/portal/appointments');
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar consultas",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const loadExamResults = async () => {
    setIsLoadingExams(true);
    try {
      const response = await apiCall('/api/portal/exams');
      if (response.success) {
        setExamResults(response.data);
      }
    } catch (error) {
      console.error('Error loading exams:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar exames",
        variant: "destructive",
      });
    } finally {
      setIsLoadingExams(false);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const response = await apiCall('/api/portal/notifications');
      if (response.success) {
        setNotificationSettings(response.data);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  // Profile management
  const saveProfile = async () => {
    if (!profileData) return;

    setIsSavingProfile(true);
    try {
      const response = await apiCall('/api/portal/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
        }),
      });

      if (response.success) {
        setCurrentUser(response.data);
        setIsEditingProfile(false);
        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso",
        });
      } else {
        toast({
          title: "Erro",
          description: response.message || "Erro ao salvar perfil",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar perfil",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Appointment management
  const createAppointment = async (appointmentData: { specialty: string; preferredDate: string; notes?: string }) => {
    try {
      const response = await apiCall('/api/portal/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      });

      if (response.success) {
        setAppointments(prev => [...prev, response.data]);
        toast({
          title: "Sucesso",
          description: response.message || "Consulta agendada com sucesso",
        });
        return true;
      } else {
        toast({
          title: "Erro",
          description: response.message || "Erro ao agendar consulta",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao agendar consulta",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      const response = await apiCall(`/api/portal/appointments/${appointmentId}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setAppointments(prev => 
          prev.map(app => 
            app.id === appointmentId 
              ? { ...app, status: 'cancelled' as const }
              : app
          )
        );
        toast({
          title: "Sucesso",
          description: "Consulta cancelada com sucesso",
        });
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast({
        title: "Erro",
        description: "Erro ao cancelar consulta",
        variant: "destructive",
      });
    }
  };

  // Exam management
  const markExamAsViewed = async (examId: string) => {
    try {
      const response = await apiCall(`/api/portal/exams/${examId}/viewed`, {
        method: 'PATCH',
      });

      if (response.success) {
        setExamResults(prev =>
          prev.map(exam =>
            exam.id === examId
              ? { ...exam, status: 'viewed' as const }
              : exam
          )
        );
      }
    } catch (error) {
      console.error('Error marking exam as viewed:', error);
    }
  };

  const downloadExam = async (examId: string) => {
    try {
      const response = await apiCall(`/api/portal/exams/${examId}/download-file`);
      
      // For demo, we'll show a success message
      // In production, this would trigger an actual file download
      await markExamAsViewed(examId);
      toast({
        title: "Sucesso",
        description: "Download iniciado com sucesso",
      });
    } catch (error) {
      console.error('Error downloading exam:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer download do exame",
        variant: "destructive",
      });
    }
  };

  // Dashboard statistics
  const getDashboardStats = () => {
    const scheduledAppointments = appointments.filter(a => a.status === 'scheduled');
    const readyExams = examResults.filter(e => e.status === 'ready');
    const thisMonthAppointments = appointments.filter(a => {
      const appointmentDate = new Date(a.date);
      const now = new Date();
      return appointmentDate.getMonth() === now.getMonth() && 
             appointmentDate.getFullYear() === now.getFullYear();
    });

    return {
      nextAppointment: scheduledAppointments[0]?.date ? new Date(scheduledAppointments[0].date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) : '-',
      pendingExams: readyExams.length,
      thisMonthAppointments: thisMonthAppointments.length,
      notifications: readyExams.length + scheduledAppointments.length
    };
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
                  alt="Clínica Bem Cuidar Logo"
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-primary">Portal do Paciente</h1>
                  <p className="text-xs text-muted-foreground">Cuidar é Amar</p>
                </div>
              </div>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Site
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Login Form */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
                  alt="Clínica Bem Cuidar Logo"
                  className="w-16 h-16 object-contain mx-auto mb-4"
                />
                <CardTitle>Acesso ao Portal</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar seus dados médicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({...prev, email: e.target.value}))}
                    placeholder="seu@email.com"
                    disabled={isLoggingIn}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({...prev, password: e.target.value}))}
                    placeholder="••••••••"
                    disabled={isLoggingIn}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
                <Button 
                  onClick={handleLogin} 
                  className="w-full bg-clinic-gradient hover:opacity-90"
                  disabled={!loginData.email || !loginData.password || isLoggingIn}
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Entrar'
                  )}
                </Button>
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-semibold mb-4 text-center">Usuários para Teste</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {loginHints.map((hint, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => setLoginData({ email: hint.email, password: hint.password })}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{hint.displayName}</p>
                            <p className="text-xs text-muted-foreground mb-1">{hint.description}</p>
                            <div className="flex space-x-4 text-xs">
                              <span className="text-blue-600">📧 {hint.email}</span>
                              <span className="text-green-600">🔑 {hint.password}</span>
                            </div>
                          </div>
                          <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded capitalize">
                            {hint.role}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    Clique em qualquer usuário para preencher automaticamente
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const stats = getDashboardStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fc711f463c22d41959919669aa4ee5149%2F512ad61a260e4819863aa241ea5d9cd5?format=webp&width=800"
                alt="Clínica Bem Cuidar Logo"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-primary">Portal do Paciente</h1>
                <p className="text-xs text-muted-foreground">Bem-vindo, {currentUser?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Site
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Consultas</TabsTrigger>
            <TabsTrigger value="exams">Exames</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Notifications Banner */}
            {examResults.filter(e => e.status === 'ready').length > 0 && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800">
                        Você tem {examResults.filter(e => e.status === 'ready').length} resultado(s) de exame disponível(is)!
                      </h4>
                      <p className="text-sm text-green-700">
                        Clique em "Ver Exames" para acessar seus resultados.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setActiveTab('exams')}
                    >
                      Ver Exames
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {appointments.filter(a => a.status === 'scheduled').length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800">
                        Você tem {appointments.filter(a => a.status === 'scheduled').length} consulta(s) agendada(s)
                      </h4>
                      <p className="text-sm text-blue-700">
                        Próxima consulta: {appointments.filter(a => a.status === 'scheduled')[0] &&
                          `${appointments.filter(a => a.status === 'scheduled')[0].specialty} em ${new Date(appointments.filter(a => a.status === 'scheduled')[0].date).toLocaleDateString('pt-BR')}`
                        }
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setActiveTab('appointments')}
                    >
                      Ver Consultas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('appointments')}>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Agendar Consulta</h3>
                  <p className="text-sm text-muted-foreground">Agende sua próxima consulta rapidamente</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('exams')}>
                <CardContent className="p-6 text-center">
                  <FileText className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Ver Exames</h3>
                  <p className="text-sm text-muted-foreground">Acesse seus resultados de exames</p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('profile')}>
                <CardContent className="p-6 text-center">
                  <User className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Atualizar Dados</h3>
                  <p className="text-sm text-muted-foreground">Mantenha suas informações atualizadas</p>
                </CardContent>
              </Card>
            </div>

            {/* Statistics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Próxima Consulta</p>
                      <p className="text-2xl font-bold">{stats.nextAppointment}</p>
                      {appointments.filter(a => a.status === 'scheduled')[0] && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {appointments.filter(a => a.status === 'scheduled')[0].specialty}
                        </p>
                      )}
                    </div>
                    <Calendar className="w-8 h-8 text-clinic-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Exames Disponíveis</p>
                      <p className="text-2xl font-bold">{stats.pendingExams}</p>
                      <p className="text-xs text-muted-foreground mt-1">Prontos para download</p>
                    </div>
                    <FileText className="w-8 h-8 text-clinic-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Consultas Este Mês</p>
                      <p className="text-2xl font-bold">{stats.thisMonthAppointments}</p>
                      <p className="text-xs text-muted-foreground mt-1">Realizadas/Agendadas</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-clinic-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Exames</p>
                      <p className="text-2xl font-bold">{examResults.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">No histórico</p>
                    </div>
                    <Bell className="w-8 h-8 text-clinic-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Próximas Consultas
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('appointments')}
                    >
                      Ver Todas
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointments.filter(a => a.status === 'scheduled').slice(0, 3).map(appointment => (
                      <div key={appointment.id} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                        <Calendar className="w-8 h-8 text-blue-500" />
                        <div className="flex-1">
                          <p className="font-medium">{appointment.specialty}</p>
                          <p className="text-sm text-muted-foreground">{appointment.doctor}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    {appointments.filter(a => a.status === 'scheduled').length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        Nenhuma consulta agendada
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Exames Recentes
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('exams')}
                    >
                      Ver Todos
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {examResults.filter(e => e.status === 'ready').slice(0, 3).map(exam => (
                      <div key={exam.id} className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                        <FileText className="w-8 h-8 text-green-500" />
                        <div className="flex-1">
                          <p className="font-medium">{exam.name}</p>
                          <p className="text-sm text-muted-foreground">{exam.type}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(exam.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadExam(exam.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {examResults.filter(e => e.status === 'ready').length === 0 && (
                      <p className="text-muted-foreground text-center py-4">
                        Nenhum exame disponível
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Saúde</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700">Última Consulta</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {appointments.filter(a => a.status === 'completed')[0] ?
                        new Date(appointments.filter(a => a.status === 'completed')[0].date).toLocaleDateString('pt-BR') :
                        'Nenhuma consulta realizada'
                      }
                    </p>
                  </div>

                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-700">Exames Realizados</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {examResults.filter(e => e.status !== 'pending').length} exames completos
                    </p>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-700">Histórico</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Membro desde 2024
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Continue with other tabs... Due to length constraints, I'll implement the key functionality here */}
          
          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Minhas Consultas</h2>
              <AppointmentDialog onAppointmentCreated={(data) => createAppointment(data)} />
            </div>

            {isLoadingAppointments ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{appointment.specialty}</h3>
                            <Badge variant={
                              appointment.status === 'scheduled' ? 'default' :
                              appointment.status === 'completed' ? 'secondary' : 'destructive'
                            }>
                              {appointment.status === 'scheduled' ? 'Agendada' :
                               appointment.status === 'completed' ? 'Realizada' : 'Cancelada'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{appointment.doctor}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>📅 {new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                            <span>🕐 {appointment.time}</span>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm bg-gray-50 p-2 rounded">{appointment.notes}</p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          {appointment.status === 'scheduled' && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => cancelAppointment(appointment.id)}
                            >
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {appointments.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">Nenhuma consulta encontrada</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-6">
            <h2 className="text-2xl font-bold">Meus Exames</h2>

            {isLoadingExams ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {examResults.map((exam) => (
                  <Card key={exam.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{exam.name}</h3>
                            <Badge variant={
                              exam.status === 'ready' ? 'default' :
                              exam.status === 'viewed' ? 'secondary' : 'outline'
                            }>
                              {exam.status === 'ready' ? 'Disponível' :
                               exam.status === 'viewed' ? 'Visualizado' : 'Pendente'}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground">{exam.type}</p>
                          <p className="text-sm text-muted-foreground">
                            📅 {new Date(exam.date).toLocaleDateString('pt-BR')}
                          </p>
                          {exam.notes && (
                            <p className="text-sm bg-gray-50 p-2 rounded">{exam.notes}</p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          {exam.status === 'ready' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-clinic-gradient hover:opacity-90"
                                onClick={() => markExamAsViewed(exam.id)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Visualizar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadExam(exam.id)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Baixar PDF
                              </Button>
                            </>
                          )}
                          {exam.status === 'viewed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadExam(exam.id)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Baixar PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {examResults.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">Nenhum exame encontrado</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Meu Perfil</h2>
              <Button
                variant="outline"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                disabled={isSavingProfile}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isEditingProfile ? 'Cancelar' : 'Editar'}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditingProfile ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome Completo</Label>
                        <Input
                          value={profileData?.name || ''}
                          onChange={(e) => setProfileData(prev => prev ? {...prev, name: e.target.value} : null)}
                          disabled={isSavingProfile}
                        />
                      </div>
                      <div>
                        <Label>E-mail</Label>
                        <Input
                          value={profileData?.email || ''}
                          disabled={true}
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">E-mail não pode ser alterado</p>
                      </div>
                      <div>
                        <Label>Telefone</Label>
                        <Input
                          value={profileData?.phone || ''}
                          onChange={(e) => setProfileData(prev => prev ? {...prev, phone: e.target.value} : null)}
                          disabled={isSavingProfile}
                        />
                      </div>
                      <div>
                        <Label>Data de Nascimento</Label>
                        <Input
                          type="date"
                          value={profileData?.birthDate || ''}
                          disabled={true}
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Data de nascimento não pode ser alterada</p>
                      </div>
                      <div>
                        <Label>CPF</Label>
                        <Input
                          value={profileData?.cpf || ''}
                          disabled={true}
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">CPF não pode ser alterado</p>
                      </div>
                    </div>
                    <div>
                      <Label>Endereço</Label>
                      <Textarea
                        value={profileData?.address || ''}
                        onChange={(e) => setProfileData(prev => prev ? {...prev, address: e.target.value} : null)}
                        disabled={isSavingProfile}
                      />
                    </div>
                    <Button
                      onClick={saveProfile}
                      className="bg-clinic-gradient hover:opacity-90"
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        'Salvar Alterações'
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Nome Completo</Label>
                      <p className="font-medium">{currentUser?.name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">E-mail</Label>
                      <p className="font-medium">{currentUser?.email}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Telefone</Label>
                      <p className="font-medium">{currentUser?.phone}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Data de Nascimento</Label>
                      <p className="font-medium">{currentUser?.birthDate ? new Date(currentUser.birthDate).toLocaleDateString('pt-BR') : '-'}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">CPF</Label>
                      <p className="font-medium">{currentUser?.cpf}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-muted-foreground">Endereço</Label>
                      <p className="font-medium">{currentUser?.address}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Configurações</h2>

            <Card>
              <CardHeader>
                <CardTitle>Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">E-mail de lembrete</p>
                    <p className="text-sm text-muted-foreground">Receber lembretes de consultas por e-mail</p>
                  </div>
                  <Button
                    variant={notificationSettings.emailReminders ? "default" : "outline"}
                    size="sm"
                    onClick={async () => {
                      const newSettings = { ...notificationSettings, emailReminders: !notificationSettings.emailReminders };
                      try {
                        await apiCall('/api/portal/notifications', {
                          method: 'PATCH',
                          body: JSON.stringify(newSettings),
                        });
                        setNotificationSettings(newSettings);
                        toast({
                          title: "Sucesso",
                          description: "Configuração atualizada",
                        });
                      } catch (error) {
                        toast({
                          title: "Erro",
                          description: "Erro ao atualizar configuração",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    {notificationSettings.emailReminders ? 'Ativado' : 'Desativado'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS de lembrete</p>
                    <p className="text-sm text-muted-foreground">Receber lembretes de consultas por SMS</p>
                  </div>
                  <Button
                    variant={notificationSettings.smsReminders ? "default" : "outline"}
                    size="sm"
                    onClick={async () => {
                      const newSettings = { ...notificationSettings, smsReminders: !notificationSettings.smsReminders };
                      try {
                        await apiCall('/api/portal/notifications', {
                          method: 'PATCH',
                          body: JSON.stringify(newSettings),
                        });
                        setNotificationSettings(newSettings);
                        toast({
                          title: "Sucesso",
                          description: "Configuração atualizada",
                        });
                      } catch (error) {
                        toast({
                          title: "Erro",
                          description: "Erro ao atualizar configuração",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    {notificationSettings.smsReminders ? 'Ativado' : 'Desativado'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Resultados de exames</p>
                    <p className="text-sm text-muted-foreground">Notificar quando resultados estiverem disponíveis</p>
                  </div>
                  <Button
                    variant={notificationSettings.examNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={async () => {
                      const newSettings = { ...notificationSettings, examNotifications: !notificationSettings.examNotifications };
                      try {
                        await apiCall('/api/portal/notifications', {
                          method: 'PATCH',
                          body: JSON.stringify(newSettings),
                        });
                        setNotificationSettings(newSettings);
                        toast({
                          title: "Sucesso",
                          description: "Configuração atualizada",
                        });
                      } catch (error) {
                        toast({
                          title: "Erro",
                          description: "Erro ao atualizar configuração",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    {notificationSettings.examNotifications ? 'Ativado' : 'Desativado'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Lock className="w-4 h-4 mr-2" />
                  Alterar Senha
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Baixar Dados Pessoais
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Excluir Conta
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

// Appointment Dialog Component
function AppointmentDialog({ onAppointmentCreated }: { onAppointmentCreated: (data: any) => Promise<boolean> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    specialty: '',
    preferredDate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.specialty || !formData.preferredDate) return;

    setIsSubmitting(true);
    const success = await onAppointmentCreated(formData);
    if (success) {
      setIsOpen(false);
      setFormData({ specialty: '', preferredDate: '', notes: '' });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-clinic-gradient hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Nova Consulta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Nova Consulta</DialogTitle>
          <DialogDescription>
            Preencha os dados para agendar sua consulta
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Especialidade</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={formData.specialty}
              onChange={(e) => setFormData(prev => ({...prev, specialty: e.target.value}))}
              required
            >
              <option value="">Selecione uma especialidade</option>
              <option value="Cardiologia">Cardiologia</option>
              <option value="Clínica Geral">Clínica Geral</option>
              <option value="Dermatologia">Dermatologia</option>
              <option value="Pediatria">Pediatria</option>
              <option value="Neurologia">Neurologia</option>
              <option value="Ortopedia">Ortopedia</option>
            </select>
          </div>
          <div>
            <Label>Data Preferida</Label>
            <Input 
              type="date" 
              value={formData.preferredDate}
              onChange={(e) => setFormData(prev => ({...prev, preferredDate: e.target.value}))}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <div>
            <Label>Observações</Label>
            <Textarea 
              placeholder="Descreva o motivo da consulta..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({...prev, notes: e.target.value}))}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-clinic-gradient hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Agendando...
              </>
            ) : (
              'Solicitar Agendamento'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
