/**
 * © 2025 B&S Best Services Angola & Alegria Matoso Investimentos.
 * Tutelado por Kaijhe Morose.
 * Todos os direitos reservados.
 * Proibida a cópia, modificação, distribuição ou uso sem autorização escrita.
 */

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
  Stethoscope,
  Users,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Plus,
  Edit,
  Eye,
  Loader2,
} from "lucide-react";

interface DoctorDashboardProps {
  currentUser: any;
  appointments: any[];
  examResults: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoadingAppointments: boolean;
  isLoadingExams: boolean;
}

export default function DoctorDashboard({
  currentUser,
  appointments,
  examResults,
  activeTab,
  setActiveTab,
  isLoadingAppointments,
  isLoadingExams,
}: DoctorDashboardProps) {
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [myPatients, setMyPatients] = useState<any[]>([]);

  // Filter appointments for today and this doctor
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const doctorAppointments = appointments.filter(
      (apt) =>
        apt.doctor === currentUser?.name && apt.date.split("T")[0] === today,
    );
    setTodayAppointments(doctorAppointments);
  }, [appointments, currentUser]);

  // Mock patient data - in real app, this would come from API
  useEffect(() => {
    // This would be filtered by doctor's patients
    setMyPatients([
      {
        id: "1",
        name: "João Silva",
        lastVisit: "2024-12-10",
        condition: "Hipertensão",
        nextAppointment: "2024-12-20",
      },
      {
        id: "2",
        name: "Maria Santos",
        lastVisit: "2024-12-08",
        condition: "Diabetes",
        nextAppointment: "2024-12-18",
      },
    ]);
  }, []);

  const getDoctorStats = () => {
    const myAppointments = appointments.filter(
      (apt) => apt.doctor === currentUser?.name,
    );
    const todayCount = todayAppointments.length;
    const weeklyCount = myAppointments.filter((apt) => {
      const appointmentDate = new Date(apt.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return appointmentDate >= weekAgo && appointmentDate <= today;
    }).length;

    return {
      todayAppointments: todayCount,
      weeklyAppointments: weeklyCount,
      totalPatients: myPatients.length,
      pendingExams: examResults.filter((exam) => exam.status === "pending")
        .length,
    };
  };

  const stats = getDoctorStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          Bem-vindo, Dr. {currentUser?.name?.split(" ")[1]}
        </h1>
        <p className="text-muted-foreground">
          Painel médico - Cardiologia Especializada
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="agenda">Agenda Médica</TabsTrigger>
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="exams">Exames</TabsTrigger>
          <TabsTrigger value="records">Registos</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Today's Schedule Alert */}
          {todayAppointments.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800">
                      Você tem {todayAppointments.length} consulta(s) hoje
                    </h4>
                    <p className="text-sm text-blue-700">
                      Próxima consulta:{" "}
                      {todayAppointments[0] &&
                        `${todayAppointments[0].time} - ${todayAppointments[0].specialty}`}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab("agenda")}
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
              onClick={() => setActiveTab("agenda")}
            >
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Agenda do Dia</h3>
                <p className="text-sm text-muted-foreground">
                  Visualizar consultas de hoje
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("patients")}
            >
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Meus Pacientes</h3>
                <p className="text-sm text-muted-foreground">
                  Gerenciar histórico clínico
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("exams")}
            >
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Resultados</h3>
                <p className="text-sm text-muted-foreground">
                  Analisar exames e laudos
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("records")}
            >
              <CardContent className="p-6 text-center">
                <ClipboardList className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Registos</h3>
                <p className="text-sm text-muted-foreground">
                  Inserir diagnósticos
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
                    <p className="text-2xl font-bold">
                      {stats.todayAppointments}
                    </p>
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
                    <p className="text-sm text-muted-foreground">Esta Semana</p>
                    <p className="text-2xl font-bold">
                      {stats.weeklyAppointments}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Consultas realizadas
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-clinic-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Meus Pacientes
                    </p>
                    <p className="text-2xl font-bold">{stats.totalPatients}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ativos em tratamento
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-clinic-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Exames Pendentes
                    </p>
                    <p className="text-2xl font-bold">{stats.pendingExams}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Aguardando análise
                    </p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Agenda de Hoje
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("agenda")}
                  >
                    Ver Completa
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
                          Paciente: João Silva
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.specialty}
                        </p>
                      </div>
                      <Badge
                        variant={
                          appointment.status === "scheduled"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {appointment.status === "scheduled"
                          ? "Agendada"
                          : "Realizada"}
                      </Badge>
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
                  Pacientes Recentes
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("patients")}
                  >
                    Ver Todos
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myPatients.slice(0, 3).map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <User className="w-8 h-8 text-gray-500" />
                      <div className="flex-1">
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.condition}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Última consulta:{" "}
                          {new Date(patient.lastVisit).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Medical Schedule Tab */}
        <TabsContent value="agenda" className="space-y-6">
          <h2 className="text-2xl font-bold">Agenda Médica</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Agenda Médica</h3>
              <p className="text-muted-foreground mb-4">
                Visualize e gerencie suas consultas por dia, semana ou mês.
                Funcionalidade completa em desenvolvimento.
              </p>
              <Button variant="outline">Gerenciar Agenda</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-6">
          <h2 className="text-2xl font-bold">Meus Pacientes</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Lista de Pacientes</h3>
              <p className="text-muted-foreground mb-4">
                Acesse o histórico clínico completo dos seus pacientes, incluindo
                consultas anteriores, exames e tratamentos.
              </p>
              <Button variant="outline">Ver Lista Completa</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical Records Tab */}
        <TabsContent value="records" className="space-y-6">
          <h2 className="text-2xl font-bold">Registos Clínicos</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <ClipboardList className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Sistema de Registos
              </h3>
              <p className="text-muted-foreground mb-4">
                Insira diagnósticos, prescreva exames e medicamentos, e mantenha
                o histórico clínico atualizado.
              </p>
              <Button variant="outline">Novo Registo</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <h2 className="text-2xl font-bold">Relatórios Clínicos</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Relatórios Pessoais
              </h3>
              <p className="text-muted-foreground mb-4">
                Visualize estatísticas pessoais: número de consultas, exames
                solicitados, e indicadores de produtividade.
              </p>
              <Button variant="outline">Gerar Relatório</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
