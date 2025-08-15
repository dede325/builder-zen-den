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
  Users,
  User,
  Clock,
  CheckCircle,
  UserPlus,
  MessageSquare,
  Phone,
  FileText,
  ClipboardList,
  CalendarPlus,
  CalendarX,
  AlertCircle,
  Plus,
  Edit,
  Eye,
  Loader2,
  Search,
} from "lucide-react";

interface ReceptionistDashboardProps {
  currentUser: any;
  appointments: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoadingAppointments: boolean;
  onCreateAppointment: (data: any) => Promise<boolean>;
  onCancelAppointment: (id: string) => void;
}

export default function ReceptionistDashboard({
  currentUser,
  appointments,
  activeTab,
  setActiveTab,
  isLoadingAppointments,
  onCreateAppointment,
  onCancelAppointment,
}: ReceptionistDashboardProps) {
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [patientsToday, setPatientsToday] = useState<any[]>([]);
  const [newPatients, setNewPatients] = useState<any[]>([]);

  // Filter appointments for today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayAppts = appointments.filter(
      (apt) => apt.date.split("T")[0] === today,
    );
    setTodayAppointments(todayAppts);

    // Mock patients data for today's check-in
    setPatientsToday([
      {
        id: "1",
        name: "João Silva",
        appointmentTime: "09:00",
        doctor: "Dr. António Silva",
        specialty: "Cardiologia",
        status: "waiting",
        checkedIn: false,
      },
      {
        id: "2",
        name: "Maria Santos",
        appointmentTime: "10:30",
        doctor: "Dra. Ana Costa",
        specialty: "Pediatria",
        status: "checked-in",
        checkedIn: true,
      },
      {
        id: "3",
        name: "Pedro Oliveira",
        appointmentTime: "14:00",
        doctor: "Dr. António Silva",
        specialty: "Cardiologia",
        status: "waiting",
        checkedIn: false,
      },
    ]);

    // Mock new patients awaiting registration
    setNewPatients([
      {
        id: "pending-1",
        name: "Ana Ferreira",
        phone: "+244 912 345 678",
        email: "ana.ferreira@email.com",
        appointmentRequested: "Dermatologia",
        status: "pending",
      },
    ]);
  }, [appointments]);

  const getReceptionStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayAppts = appointments.filter(
      (apt) => apt.date.split("T")[0] === today,
    );
    const checkedInPatients = patientsToday.filter((p) => p.checkedIn);
    const waitingPatients = patientsToday.filter((p) => !p.checkedIn);
    const pendingRegistrations = newPatients.filter(
      (p) => p.status === "pending",
    );

    return {
      todayAppointments: todayAppts.length,
      checkedInPatients: checkedInPatients.length,
      waitingPatients: waitingPatients.length,
      pendingRegistrations: pendingRegistrations.length,
    };
  };

  const stats = getReceptionStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          Bem-vinda, {currentUser?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Painel de Recepção - Gestão de Atendimento
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="schedule">Agendamentos</TabsTrigger>
          <TabsTrigger value="checkin">Check-in</TabsTrigger>
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Reception Alerts */}
          {stats.waitingPatients > 0 && (
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-800">
                      {stats.waitingPatients} paciente(s) aguardando check-in
                    </h4>
                    <p className="text-sm text-orange-700">
                      Pacientes com consultas agendadas para hoje
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => setActiveTab("checkin")}
                  >
                    Fazer Check-in
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {stats.pendingRegistrations > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800">
                      {stats.pendingRegistrations} novo(s) paciente(s) para
                      registrar
                    </h4>
                    <p className="text-sm text-blue-700">
                      Solicitações de cadastro aguardando processamento
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab("patients")}
                  >
                    Processar
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
                <CalendarPlus className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Agendar Consulta</h3>
                <p className="text-sm text-muted-foreground">
                  Criar novos agendamentos
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("checkin")}
            >
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Check-in</h3>
                <p className="text-sm text-muted-foreground">
                  Registrar chegada de pacientes
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("patients")}
            >
              <CardContent className="p-6 text-center">
                <UserPlus className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Novo Paciente</h3>
                <p className="text-sm text-muted-foreground">
                  Cadastrar novo paciente
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("messages")}
            >
              <CardContent className="p-6 text-center">
                <Phone className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Contato</h3>
                <p className="text-sm text-muted-foreground">
                  Comunicação com equipe
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
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="text-2xl font-bold">
                      {stats.checkedInPatients}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pacientes atendidos
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Aguardando</p>
                    <p className="text-2xl font-bold">
                      {stats.waitingPatients}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Para check-in
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold">
                      {stats.pendingRegistrations}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Novos registros
                    </p>
                  </div>
                  <UserPlus className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule and Check-in */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Agenda de Hoje
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("schedule")}
                  >
                    Ver Completa
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.slice(0, 4).map((appointment) => (
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
                  Lista de Check-in
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("checkin")}
                  >
                    Ver Todos
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientsToday.slice(0, 4).map((patient) => (
                    <div
                      key={patient.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg ${
                        patient.checkedIn ? "bg-green-50" : "bg-orange-50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          patient.checkedIn
                            ? "bg-green-500 text-white"
                            : "bg-orange-500 text-white"
                        }`}
                      >
                        {patient.checkedIn ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Clock className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.appointmentTime} - {patient.specialty}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {patient.doctor}
                        </p>
                      </div>
                      {!patient.checkedIn && (
                        <Button size="sm" variant="outline">
                          Check-in
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scheduling Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Agendamento de Consultas</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Sistema de Agendamento
              </h3>
              <p className="text-muted-foreground mb-4">
                Crie, reagende e cancele consultas. Gerencie a disponibilidade
                dos médicos e organize os horários de atendimento.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">Ver Agenda Semanal</Button>
                <Button>Agendar Nova Consulta</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Check-in Tab */}
        <TabsContent value="checkin" className="space-y-6">
          <h2 className="text-2xl font-bold">Lista de Pacientes do Dia</h2>

          <div className="grid gap-4">
            {patientsToday.map((patient) => (
              <Card key={patient.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{patient.name}</h3>
                        <Badge
                          variant={patient.checkedIn ? "default" : "outline"}
                          className={
                            patient.checkedIn
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }
                        >
                          {patient.checkedIn
                            ? "Check-in Realizado"
                            : "Aguardando"}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">
                        {patient.appointmentTime} - {patient.specialty}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {patient.doctor}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {!patient.checkedIn && (
                        <Button size="sm">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Fazer Check-in
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Dados
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Registo de Pacientes</h2>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </div>

          {/* Pending Registrations */}
          {newPatients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Registros Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg"
                    >
                      <UserPlus className="w-8 h-8 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {patient.phone} • {patient.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Solicitou: {patient.appointmentRequested}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Rejeitar
                        </Button>
                        <Button size="sm">Aprovar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sistema de Registo</h3>
              <p className="text-muted-foreground mb-4">
                Crie perfis para novos pacientes, atualize informações de
                contato e gerencie os dados básicos dos utentes.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Buscar Paciente
                </Button>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Cadastrar Novo
                </Button>
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
                Comunique-se com médicos, enfermeiros e outros membros da equipe
                para coordenar o atendimento e resolver questões
                administrativas.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Contatar Médico
                </Button>
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Nova Mensagem
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
