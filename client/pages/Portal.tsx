/**
 * © 2025 B&S Best Services Angola & Alegria Matoso Investimentos.
 * Tutelado por Kaijhe Morose.
 * Todos os direitos reservados.
 * Proibida a cópia, modificação, distribuição ou uso sem autorização escrita.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
  Loader2,
  Shield,
} from "lucide-react";

// Role-based dashboard components
import PatientDashboard from "@/components/dashboards/PatientDashboard";
import DoctorDashboard from "@/components/dashboards/DoctorDashboard";
import NurseDashboard from "@/components/dashboards/NurseDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";
import ReceptionistDashboard from "@/components/dashboards/ReceptionistDashboard";

// Import types from shared
import { UserRole, Permission, PermissionManager } from "@shared/permissions";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  cpf: string;
  address: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Appointment {
  id: string;
  patientId: string;
  specialty: string;
  doctor: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

interface ExamResult {
  id: string;
  patientId: string;
  name: string;
  type: string;
  date: string;
  status: "pending" | "ready" | "viewed";
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
  const [currentUserRole, setCurrentUserRole] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<Patient | null>(null);
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailReminders: true,
      smsReminders: false,
      examNotifications: true,
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
        const response = await fetch("/api/portal/auth/login-hints");
        const result = await response.json();
        if (result.success) {
          setLoginHints(result.data);
        }
      } catch (error) {
        console.error("Error loading login hints:", error);
      }
    };

    loadLoginHints();
  }, []);

  // API Helper
  const apiCall = async (
    url: string,
    options: RequestInit = {},
    token?: string,
  ) => {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const tokenToUse = token || authToken;
    if (tokenToUse) {
      headers["Authorization"] = `Bearer ${tokenToUse}`;
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
      const response = await apiCall("/api/portal/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
      });

      if (response.success) {
        setCurrentUser(response.patient);
        setCurrentUserRole(response.user);
        setAuthToken(response.token);
        setProfileData(response.patient);
        setIsAuthenticated(true);

        toast({
          title: "Sucesso",
          description: `Login realizado como ${getRoleDisplayName(response.user?.role)} - ${response.patient.name}`,
        });

        // Load initial data with the new token
        loadData(response.token);
      } else {
        toast({
          title: "Erro",
          description: response.message || "Erro ao fazer login",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
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
      await apiCall("/api/portal/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }

    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentUserRole(null);
    setAuthToken(null);
    setAppointments([]);
    setExamResults([]);
    setActiveTab("dashboard");
    setProfileData(null);
  };

  // Data loading
  const loadData = async (token?: string) => {
    await Promise.all([
      loadAppointments(token),
      loadExamResults(token),
      loadNotificationSettings(token),
    ]);
  };

  const loadAppointments = async (token?: string) => {
    setIsLoadingAppointments(true);
    try {
      const response = await apiCall("/api/portal/appointments", {}, token);
      if (response.success) {
        setAppointments(response.data);
      }
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar consultas",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const loadExamResults = async (token?: string) => {
    setIsLoadingExams(true);
    try {
      const response = await apiCall("/api/portal/exams", {}, token);
      if (response.success) {
        setExamResults(response.data);
      }
    } catch (error) {
      console.error("Error loading exams:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar exames",
        variant: "destructive",
      });
    } finally {
      setIsLoadingExams(false);
    }
  };

  const loadNotificationSettings = async (token?: string) => {
    try {
      const response = await apiCall("/api/portal/notifications", {}, token);
      if (response.success) {
        setNotificationSettings(response.data);
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  };

  // Profile management
  const saveProfile = async () => {
    if (!profileData) return;

    setIsSavingProfile(true);
    try {
      const response = await apiCall("/api/portal/profile", {
        method: "PATCH",
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
      console.error("Error saving profile:", error);
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
  const createAppointment = async (appointmentData: {
    specialty: string;
    preferredDate: string;
    notes?: string;
  }) => {
    try {
      const response = await apiCall("/api/portal/appointments", {
        method: "POST",
        body: JSON.stringify(appointmentData),
      });

      if (response.success) {
        setAppointments((prev) => [...prev, response.data]);
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
      console.error("Error creating appointment:", error);
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
      const response = await apiCall(
        `/api/portal/appointments/${appointmentId}`,
        {
          method: "DELETE",
        },
      );

      if (response.success) {
        setAppointments((prev) =>
          prev.map((app) =>
            app.id === appointmentId
              ? { ...app, status: "cancelled" as const }
              : app,
          ),
        );
        toast({
          title: "Sucesso",
          description: "Consulta cancelada com sucesso",
        });
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
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
        method: "PATCH",
      });

      if (response.success) {
        setExamResults((prev) =>
          prev.map((exam) =>
            exam.id === examId ? { ...exam, status: "viewed" as const } : exam,
          ),
        );
      }
    } catch (error) {
      console.error("Error marking exam as viewed:", error);
    }
  };

  const downloadExam = async (examId: string) => {
    try {
      const response = await apiCall(
        `/api/portal/exams/${examId}/download-file`,
      );

      // For demo, we'll show a success message
      // In production, this would trigger an actual file download
      await markExamAsViewed(examId);
      toast({
        title: "Sucesso",
        description: "Download iniciado com sucesso",
      });
    } catch (error) {
      console.error("Error downloading exam:", error);
      toast({
        title: "Erro",
        description: "Erro ao fazer download do exame",
        variant: "destructive",
      });
    }
  };

  // Dashboard statistics
  // Helper functions
  const getRoleDisplayName = (role?: UserRole): string => {
    const roleNames = {
      [UserRole.PATIENT]: "Paciente",
      [UserRole.DOCTOR]: "Médico",
      [UserRole.NURSE]: "Enfermeira",
      [UserRole.ADMIN]: "Administrador",
      [UserRole.RECEPTIONIST]: "Recepcionista",
    };
    return role ? roleNames[role] : "Usuário";
  };

  const hasPermission = (permission: Permission): boolean => {
    return currentUserRole
      ? PermissionManager.hasPermission(currentUserRole, permission)
      : false;
  };

  const canAccessResource = (resource: string, action: string): boolean => {
    return currentUserRole
      ? PermissionManager.canAccessResource(currentUserRole, resource, action)
      : false;
  };

  const getDashboardStats = () => {
    const scheduledAppointments = appointments.filter(
      (a) => a.status === "scheduled",
    );
    const readyExams = examResults.filter((e) => e.status === "ready");
    const thisMonthAppointments = appointments.filter((a) => {
      const appointmentDate = new Date(a.date);
      const now = new Date();
      return (
        appointmentDate.getMonth() === now.getMonth() &&
        appointmentDate.getFullYear() === now.getFullYear()
      );
    });

    return {
      nextAppointment: scheduledAppointments[0]?.date
        ? new Date(scheduledAppointments[0].date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          })
        : "-",
      pendingExams: readyExams.length,
      thisMonthAppointments: thisMonthAppointments.length,
      notifications: readyExams.length + scheduledAppointments.length,
    };
  };

  // Role-based dashboard renderer
  const renderRoleBasedDashboard = () => {
    if (!currentUserRole) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Carregando Permissões
              </h3>
              <p className="text-muted-foreground">
                Verificando suas permissões de acesso...
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    const commonProps = {
      currentUser,
      appointments,
      examResults,
      notificationSettings,
      isLoadingAppointments,
      isLoadingExams,
      activeTab,
      setActiveTab,
      onCreateAppointment: createAppointment,
      onCancelAppointment: cancelAppointment,
      onMarkExamAsViewed: markExamAsViewed,
      onDownloadExam: downloadExam,
      onUpdateProfile: () => setIsEditingProfile(true),
      onUpdateNotifications: (settings: any) => {
        // Handle notification updates
        setNotificationSettings(settings);
      },
    };

    switch (currentUserRole.role) {
      case UserRole.PATIENT:
        return <PatientDashboard {...commonProps} />;

      case UserRole.DOCTOR:
        return (
          <DoctorDashboard
            currentUser={currentUser}
            appointments={appointments}
            examResults={examResults}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoadingAppointments={isLoadingAppointments}
            isLoadingExams={isLoadingExams}
          />
        );

      case UserRole.NURSE:
        return (
          <NurseDashboard
            currentUser={currentUser}
            appointments={appointments}
            examResults={examResults}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoadingAppointments={isLoadingAppointments}
            isLoadingExams={isLoadingExams}
          />
        );

      case UserRole.ADMIN:
        return (
          <AdminDashboard
            currentUser={currentUser}
            appointments={appointments}
            examResults={examResults}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        );

      case UserRole.RECEPTIONIST:
        return (
          <ReceptionistDashboard
            currentUser={currentUser}
            appointments={appointments}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isLoadingAppointments={isLoadingAppointments}
            onCreateAppointment={createAppointment}
            onCancelAppointment={cancelAppointment}
          />
        );

      default:
        return (
          <div className="container mx-auto px-4 py-8">
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Acesso Negado</h3>
                <p className="text-muted-foreground">
                  Seu perfil não tem permissões para acessar este sistema.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={handleLogout}
                >
                  Fazer Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        );
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
                  <h1 className="text-xl font-bold text-primary">
                    Portal do Paciente
                  </h1>
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
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
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
                    onChange={(e) =>
                      setLoginData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="••••••••"
                    disabled={isLoggingIn}
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
                <Button
                  onClick={handleLogin}
                  className="w-full bg-clinic-gradient hover:opacity-90"
                  disabled={
                    !loginData.email || !loginData.password || isLoggingIn
                  }
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-semibold mb-4 text-center">
                    Usuários para Teste
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {loginHints.map((hint, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          setLoginData({
                            email: hint.email,
                            password: hint.password,
                          })
                        }
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-semibold text-sm">
                              {hint.displayName}
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              {hint.description}
                            </p>
                            <div className="flex space-x-4 text-xs">
                              <span className="text-blue-600">
                                📧 {hint.email}
                              </span>
                              <span className="text-green-600">
                                🔑 {hint.password}
                              </span>
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
                <h1 className="text-xl font-bold text-primary">
                  Portal da Clínica Bem Cuidar
                </h1>
                <p className="text-xs text-muted-foreground">
                  {getRoleDisplayName(currentUserRole?.role)} -{" "}
                  {currentUser?.name}
                </p>
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

      {/* Main Content - Role-based Dashboard */}
      {renderRoleBasedDashboard()}

      {/* Profile Edit Dialog - Shared across all roles */}
      {isEditingProfile && (
        <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Editar Perfil</DialogTitle>
              <DialogDescription>
                Atualize suas informações pessoais
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome Completo</Label>
                  <Input
                    value={profileData?.name || ""}
                    onChange={(e) =>
                      setProfileData((prev) =>
                        prev ? { ...prev, name: e.target.value } : null,
                      )
                    }
                    disabled={isSavingProfile}
                  />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input
                    value={profileData?.email || ""}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    E-mail não pode ser alterado
                  </p>
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={profileData?.phone || ""}
                    onChange={(e) =>
                      setProfileData((prev) =>
                        prev ? { ...prev, phone: e.target.value } : null,
                      )
                    }
                    disabled={isSavingProfile}
                  />
                </div>
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={profileData?.birthDate || ""}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Data de nascimento não pode ser alterada
                  </p>
                </div>
                <div>
                  <Label>CPF</Label>
                  <Input
                    value={profileData?.cpf || ""}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    CPF não pode ser alterado
                  </p>
                </div>
              </div>
              <div>
                <Label>Endereço</Label>
                <Textarea
                  value={profileData?.address || ""}
                  onChange={(e) =>
                    setProfileData((prev) =>
                      prev ? { ...prev, address: e.target.value } : null,
                    )
                  }
                  disabled={isSavingProfile}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingProfile(false)}
                  disabled={isSavingProfile}
                >
                  Cancelar
                </Button>
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
                    "Salvar Alterações"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Appointment Dialog Component
function AppointmentDialog({
  onAppointmentCreated,
}: {
  onAppointmentCreated: (data: any) => Promise<boolean>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    specialty: "",
    preferredDate: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.specialty || !formData.preferredDate) return;

    setIsSubmitting(true);
    const success = await onAppointmentCreated(formData);
    if (success) {
      setIsOpen(false);
      setFormData({ specialty: "", preferredDate: "", notes: "" });
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, specialty: e.target.value }))
              }
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
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  preferredDate: e.target.value,
                }))
              }
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div>
            <Label>Observações</Label>
            <Textarea
              placeholder="Descreva o motivo da consulta..."
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
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
              "Solicitar Agendamento"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
