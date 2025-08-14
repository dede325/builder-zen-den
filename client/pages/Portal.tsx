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
  LogOut
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

export default function Portal() {
  // Mock user authentication - in real app this would come from auth context
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<Patient | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
  // State for different sections
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<Patient | null>(null);

  // Mock login function
  const handleLogin = () => {
    if (loginData.email && loginData.password) {
      const mockUser: Patient = {
        id: '1',
        name: 'João Silva',
        email: loginData.email,
        phone: '+244 945 123 456',
        birthDate: '1985-06-15',
        cpf: '123.456.789-00',
        address: 'Av. 21 de Janeiro, 123, Luanda'
      };
      setCurrentUser(mockUser);
      setProfileData(mockUser);
      setIsAuthenticated(true);
      
      // Load mock data
      loadMockData(mockUser.id);
    }
  };

  const loadMockData = (patientId: string) => {
    // Mock appointments
    setAppointments([
      {
        id: '1',
        patientId,
        specialty: 'Cardiologia',
        doctor: 'Dr. António Silva',
        date: '2024-01-25',
        time: '14:30',
        status: 'scheduled'
      },
      {
        id: '2',
        patientId,
        specialty: 'Clinica Geral',
        doctor: 'Dra. Maria Santos',
        date: '2024-01-15',
        time: '10:00',
        status: 'completed',
        notes: 'Consulta de rotina realizada com sucesso'
      }
    ]);

    // Mock exam results
    setExamResults([
      {
        id: '1',
        patientId,
        name: 'Hemograma Completo',
        type: 'Análise Clínica',
        date: '2024-01-20',
        status: 'ready',
        resultUrl: '/mock-result.pdf'
      },
      {
        id: '2',
        patientId,
        name: 'Eletrocardiograma',
        type: 'Cardiologia',
        date: '2024-01-18',
        status: 'viewed',
        notes: 'Resultado normal'
      }
    ]);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAppointments([]);
    setExamResults([]);
    setActiveTab('dashboard');
  };

  const saveProfile = () => {
    if (profileData) {
      setCurrentUser(profileData);
      setIsEditingProfile(false);
      // In real app, would save to backend
    }
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
                  />
                </div>
                <Button 
                  onClick={handleLogin} 
                  className="w-full bg-clinic-gradient hover:opacity-90"
                  disabled={!loginData.email || !loginData.password}
                >
                  Entrar
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Para demo, use qualquer e-mail e senha
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Próxima Consulta</p>
                      <p className="text-2xl font-bold">25 Jan</p>
                    </div>
                    <Calendar className="w-8 h-8 text-clinic-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Exames Pendentes</p>
                      <p className="text-2xl font-bold">1</p>
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
                      <p className="text-2xl font-bold">2</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-clinic-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Notificações</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                    <Bell className="w-8 h-8 text-clinic-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Resultado de exame disponível</p>
                      <p className="text-sm text-muted-foreground">Hemograma Completo - 20 Jan 2024</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Consulta agendada</p>
                      <p className="text-sm text-muted-foreground">Cardiologia - 25 Jan 2024</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appointments */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Minhas Consultas</h2>
              <Dialog>
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
                  <div className="space-y-4">
                    <div>
                      <Label>Especialidade</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Cardiologia</option>
                        <option>Clínica Geral</option>
                        <option>Dermatologia</option>
                      </select>
                    </div>
                    <div>
                      <Label>Data Preferida</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Observações</Label>
                      <Textarea placeholder="Descreva o motivo da consulta..." />
                    </div>
                    <Button className="w-full bg-clinic-gradient hover:opacity-90">
                      Solicitar Agendamento
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

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
                          <>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-2" />
                              Reagendar
                            </Button>
                            <Button variant="destructive" size="sm">
                              Cancelar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Exams */}
          <TabsContent value="exams" className="space-y-6">
            <h2 className="text-2xl font-bold">Meus Exames</h2>
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
                            <Button size="sm" className="bg-clinic-gradient hover:opacity-90">
                              <Eye className="w-4 h-4 mr-2" />
                              Visualizar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Baixar PDF
                            </Button>
                          </>
                        )}
                        {exam.status === 'viewed' && (
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Baixar PDF
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Meu Perfil</h2>
              <Button 
                variant="outline" 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
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
                        />
                      </div>
                      <div>
                        <Label>E-mail</Label>
                        <Input 
                          value={profileData?.email || ''} 
                          onChange={(e) => setProfileData(prev => prev ? {...prev, email: e.target.value} : null)}
                        />
                      </div>
                      <div>
                        <Label>Telefone</Label>
                        <Input 
                          value={profileData?.phone || ''} 
                          onChange={(e) => setProfileData(prev => prev ? {...prev, phone: e.target.value} : null)}
                        />
                      </div>
                      <div>
                        <Label>Data de Nascimento</Label>
                        <Input 
                          type="date" 
                          value={profileData?.birthDate || ''} 
                          onChange={(e) => setProfileData(prev => prev ? {...prev, birthDate: e.target.value} : null)}
                        />
                      </div>
                      <div>
                        <Label>CPF</Label>
                        <Input 
                          value={profileData?.cpf || ''} 
                          onChange={(e) => setProfileData(prev => prev ? {...prev, cpf: e.target.value} : null)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Endereço</Label>
                      <Textarea 
                        value={profileData?.address || ''} 
                        onChange={(e) => setProfileData(prev => prev ? {...prev, address: e.target.value} : null)}
                      />
                    </div>
                    <Button onClick={saveProfile} className="bg-clinic-gradient hover:opacity-90">
                      Salvar Alterações
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

          {/* Settings */}
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
                  <Button variant="outline" size="sm">Ativado</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS de lembrete</p>
                    <p className="text-sm text-muted-foreground">Receber lembretes de consultas por SMS</p>
                  </div>
                  <Button variant="outline" size="sm">Desativado</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Resultados de exames</p>
                    <p className="text-sm text-muted-foreground">Notificar quando resultados estiverem disponíveis</p>
                  </div>
                  <Button variant="outline" size="sm">Ativado</Button>
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
