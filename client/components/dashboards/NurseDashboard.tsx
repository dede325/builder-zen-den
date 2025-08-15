import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  FileText,
  User,
  Settings,
  Clock,
  CheckCircle,
  Thermometer,
  Heart,
  Activity,
  MessageSquare,
  Upload,
  Stethoscope,
  ClipboardList,
  Users,
  AlertCircle,
  Plus,
  Edit,
  Eye,
  Loader2,
} from "lucide-react";

interface NurseDashboardProps {
  currentUser: any;
  appointments: any[];
  examResults: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoadingAppointments: boolean;
  isLoadingExams: boolean;
}

export default function NurseDashboard({
  currentUser,
  appointments,
  examResults,
  activeTab,
  setActiveTab,
  isLoadingAppointments,
  isLoadingExams,
}: NurseDashboardProps) {
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [vitalSigns, setVitalSigns] = useState<any[]>([]);

  // Filter appointments for today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayAppts = appointments.filter(
      (apt) => apt.date.split("T")[0] === today && apt.status === "scheduled",
    );
    setTodayAppointments(todayAppts);
  }, [appointments]);

  // Mock vital signs data
  useEffect(() => {
    setVitalSigns([
      {
        id: "1",
        patientName: "João Silva",
        appointmentTime: "09:00",
        status: "pending",
        vital: null,
      },
      {
        id: "2",
        patientName: "Maria Santos",
        appointmentTime: "10:30",
        status: "completed",
        vital: {
          bloodPressure: "120/80",
          temperature: "36.5°C",
          heartRate: "72 bpm",
          weight: "70kg",
        },
      },
    ]);
  }, []);

  const getNurseStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayAppts = appointments.filter(
      (apt) => apt.date.split("T")[0] === today,
    );
    const pendingVitals = vitalSigns.filter((v) => v.status === "pending");
    const completedVitals = vitalSigns.filter((v) => v.status === "completed");
    const pendingExamUploads = examResults.filter(
      (exam) => exam.status === "pending",
    );

    return {
      todayAppointments: todayAppts.length,
      pendingVitals: pendingVitals.length,
      completedVitals: completedVitals.length,
      pendingExams: pendingExamUploads.length,
    };
  };

  const stats = getNurseStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          Bem-vinda, Enfermeira {currentUser?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Painel de Enfermagem - Apoio ao Atendimento
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="schedule">Consultas do Dia</TabsTrigger>
          <TabsTrigger value="vitals">Sinais Vitais</TabsTrigger>
          <TabsTrigger value="exams">Gestão de Exames</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Today's Tasks Alert */}
          {stats.pendingVitals > 0 && (
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Thermometer className="w-6 h-6 text-orange-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800">
                      {stats.pendingVitals} paciente(s) aguardando sinais vitais
                    </h4>
                    <p className="text-sm text-orange-700">
                      Consultas agendadas para hoje que precisam de preparação
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => setActiveTab("vitals")}
                  >
                    Ver Tarefas
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {todayAppointments.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800">
                      {todayAppointments.length} consulta(s) agendada(s) hoje
                    </h4>
                    <p className="text-sm text-blue-700">
                      Acompanhe o cronograma e prepare os pacientes
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab("schedule")}
                  >
                    Ver Agenda
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("schedule")}
            >
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Agenda do Dia</h3>
                <p className="text-sm text-muted-foreground">
                  Ver consultas agendadas
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("vitals")}
            >
              <CardContent className="p-6 text-center">
                <Stethoscope className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Sinais Vitais</h3>
                <p className="text-sm text-muted-foreground">
                  Registrar medições
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("exams")}
            >
              <CardContent className="p-6 text-center">
                <Upload className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Gestão de Exames</h3>
                <p className="text-sm text-muted-foreground">
                  Marcar e acompanhar
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("messages")}
            >
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Mensagens</h3>
                <p className="text-sm text-muted-foreground">
                  Comunicação interna
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Hoje</p>
                    <p className="text-2xl font-bold">{stats.todayAppointments}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Consultas agendadas
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-clinic-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Sinais Vitais
                    </p>
                    <p className="text-2xl font-bold">{stats.completedVitals}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Registrados hoje
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold">{stats.pendingVitals}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Aguardando medição
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Exames</p>
                    <p className="text-2xl font-bold">{stats.pendingExams}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Para acompanhar
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-clinic-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Tasks */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Próximas Consultas
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("schedule")}
                  >
                    Ver Todas
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg"
                    >
                      <Clock className="w-8 h-8 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium">{appointment.time}</p>
                        <p className="text-sm text-muted-foreground">
                          {appointment.specialty}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Dr. {appointment.doctor}
                        </p>
                      </div>
                      <Badge variant="outline">Agendada</Badge>
                    </div>
                  ))}
                  {todayAppointments.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhuma consulta agendada para hoje
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Sinais Vitais Pendentes
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("vitals")}
                  >
                    Ver Todos
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vitalSigns
                    .filter((v) => v.status === "pending")
                    .map((vital) => (
                      <div
                        key={vital.id}
                        className="flex items-center space-x-4 p-3 bg-orange-50 rounded-lg"
                      >
                        <Thermometer className="w-8 h-8 text-orange-500" />
                        <div className="flex-1">
                          <p className="font-medium">{vital.patientName}</p>
                          <p className="text-sm text-muted-foreground">
                            Consulta às {vital.appointmentTime}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Aguardando medições
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Registrar
                        </Button>
                      </div>
                    ))}
                  {vitalSigns.filter((v) => v.status === "pending").length ===
                    0 && (
                    <p className="text-muted-foreground text-center py-4">
                      Todos os sinais vitais foram registrados
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <h2 className="text-2xl font-bold">Consultas do Dia</h2>
          
          {isLoadingAppointments ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4">
              {todayAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{appointment.time}</h3>
                          <Badge variant="outline">{appointment.specialty}</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Dr. {appointment.doctor}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Paciente: João Silva
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" variant="outline">
                          <Stethoscope className="w-4 h-4 mr-2" />
                          Preparar Paciente
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {todayAppointments.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground">
                      Nenhuma consulta agendada para hoje
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Vital Signs Tab */}
        <TabsContent value="vitals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Registo de Sinais Vitais</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Registo
            </Button>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <Thermometer className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Sistema de Sinais Vitais
              </h3>
              <p className="text-muted-foreground mb-4">
                Registre pressão arterial, temperatura, frequência cardíaca e
                outros sinais vitais antes das consultas.
              </p>
              <Button variant="outline">Registrar Sinais Vitais</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exams Management Tab */}
        <TabsContent value="exams" className="space-y-6">
          <h2 className="text-2xl font-bold">Gestão de Exames</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Sistema de Gestão de Exames
              </h3>
              <p className="text-muted-foreground mb-4">
                Marque exames, acompanhe o status e organize a logística para
                os procedimentos diagnósticos.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">Marcar Exame</Button>
                <Button>Acompanhar Status</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <h2 className="text-2xl font-bold">Mensagens Internas</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Comunicação Interna
              </h3>
              <p className="text-muted-foreground mb-4">
                Comunique-se com médicos, recepção e outros membros da equipe
                para coordenar o atendimento aos pacientes.
              </p>
              <Button variant="outline">Abrir Mensagens</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
