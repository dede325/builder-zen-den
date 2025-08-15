import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth";
import { useDoctorStore } from "@/store/doctor";
import {
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Activity,
  Stethoscope,
  Phone,
  ArrowRight,
  Bell,
  User,
  Heart,
  AlertTriangle,
  Plus,
  Eye,
  Download,
} from "lucide-react";

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const {
    patients,
    consultations,
    exams,
    messages,
    fetchPatients,
    fetchConsultations,
    fetchExams,
    fetchMessages,
  } = useDoctorStore();

  useEffect(() => {
    if (user && user.role === "doctor") {
      fetchPatients(user.id);
      fetchConsultations(user.id);
      fetchExams(user.id);
      fetchMessages(user.id);
    }
  }, [user, fetchPatients, fetchConsultations, fetchExams, fetchMessages]);

  if (!user || user.role !== "doctor") {
    return null;
  }

  // Calcular estatísticas
  const today = new Date().toISOString().split("T")[0];
  const todayConsultations = consultations.filter(
    (consult) => consult.date === today,
  );
  const upcomingConsultations = consultations.filter(
    (consult) =>
      consult.status === "scheduled" && new Date(consult.date) >= new Date(),
  ).length;

  const unreadMessages = messages.filter(
    (msg) => !msg.read && msg.recipientId === user.id,
  ).length;
  const urgentMessages = messages.filter(
    (msg) =>
      !msg.read && msg.priority === "urgent" && msg.recipientId === user.id,
  ).length;

  const pendingExams = exams.filter(
    (exam) => exam.status === "requested" || exam.status === "scheduled",
  ).length;

  const completedExams = exams.filter(
    (exam) => exam.status === "completed" && !exam.resultDate,
  ).length;

  // Próximas consultas do dia
  const todayScheduled = consultations
    .filter(
      (consult) => consult.date === today && consult.status === "scheduled",
    )
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 3);

  // Exames pendentes
  const recentExams = exams
    .filter(
      (exam) =>
        exam.status === "requested" ||
        exam.status === "scheduled" ||
        (exam.status === "completed" && !exam.resultDate),
    )
    .sort(
      (a, b) =>
        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime(),
    )
    .slice(0, 3);

  // Mensagens urgentes
  const urgentMessagesList = messages
    .filter(
      (msg) =>
        !msg.read && msg.priority === "urgent" && msg.recipientId === user.id,
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  // Pacientes com status crítico/monitoramento
  const criticalPatients = patients
    .filter(
      (patient) =>
        patient.clinicalStatus === "critical" ||
        patient.clinicalStatus === "monitoring",
    )
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-AO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const getStatusBadge = (
    status: string,
    type: "consultation" | "exam" | "patient",
  ) => {
    const badges = {
      consultation: {
        scheduled: { label: "Agendada", variant: "default" as const },
        in_progress: { label: "Em Andamento", variant: "secondary" as const },
        completed: { label: "Concluída", variant: "secondary" as const },
      },
      exam: {
        requested: { label: "Solicitado", variant: "default" as const },
        scheduled: { label: "Agendado", variant: "default" as const },
        completed: { label: "Concluído", variant: "secondary" as const },
      },
      patient: {
        stable: { label: "Estável", variant: "secondary" as const },
        monitoring: { label: "Monitoramento", variant: "default" as const },
        critical: { label: "Crítico", variant: "destructive" as const },
        recovered: { label: "Recuperado", variant: "secondary" as const },
      },
    };

    const badge = badges[type]?.[status as keyof (typeof badges)[typeof type]];
    return badge || { label: status, variant: "outline" as const };
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: { label: "Baixa", variant: "outline" as const },
      normal: { label: "Normal", variant: "default" as const },
      high: { label: "Alta", variant: "secondary" as const },
      urgent: { label: "Urgente", variant: "destructive" as const },
    };

    return (
      badges[priority as keyof typeof badges] || {
        label: priority,
        variant: "outline" as const,
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Bom dia, Dr. {user.name.split(" ")[1]}!
            </h1>
            <p className="text-blue-100">
              Você tem {todayConsultations.length} consulta(s) agendada(s) para
              hoje.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Consultas Hoje
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {todayConsultations.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {upcomingConsultations} próximas agendadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Meus Pacientes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {patients.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {criticalPatients.length} em monitoramento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Exames Pendentes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {pendingExams}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            {completedExams > 0 && (
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                {completedExams} para laudar
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Mensagens
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {unreadMessages}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            {urgentMessages > 0 && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {urgentMessages} urgente(s)
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Consultas de Hoje */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Consultas de Hoje
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/portal/doctor/consultations">
                  Ver agenda
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {todayScheduled.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma consulta agendada para hoje</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to="/portal/doctor/consultations">
                    Gerenciar Agenda
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {todayScheduled.map((consultation) => {
                  const badge = getStatusBadge(
                    consultation.status,
                    "consultation",
                  );
                  return (
                    <div
                      key={consultation.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {consultation.patientName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatTime(consultation.time)} -{" "}
                            {consultation.type === "follow_up"
                              ? "Retorno"
                              : "Consulta"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {consultation.chiefComplaint}
                          </p>
                        </div>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exames Pendentes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-orange-600" />
                Exames Pendentes
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/portal/doctor/exams">
                  Ver todos
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentExams.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum exame pendente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentExams.map((exam) => {
                  const badge = getStatusBadge(exam.status, "exam");
                  return (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {exam.examType}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {exam.patientName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Solicitado em {formatDate(exam.requestDate)}
                          </p>
                        </div>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Messages and Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mensagens Urgentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-red-600" />
                Mensagens{" "}
                {urgentMessages > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {urgentMessages} urgente(s)
                  </Badge>
                )}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/portal/doctor/messages">
                  Ver todas
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {urgentMessagesList.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma mensagem urgente</p>
                <p className="text-sm mt-2">
                  {unreadMessages > 0
                    ? `${unreadMessages} mensagem(ns) não lida(s)`
                    : "Todas as mensagens foram lidas"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {urgentMessagesList.map((message) => {
                  const priorityBadge = getPriorityBadge(message.priority);
                  return (
                    <div
                      key={message.id}
                      className="p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <p className="font-medium text-gray-900 dark:text-white">
                            {message.senderName}
                          </p>
                          <Badge
                            variant={priorityBadge.variant}
                            className="text-xs"
                          >
                            {priorityBadge.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(message.createdAt).toLocaleTimeString(
                            "pt-AO",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                        {message.subject}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {message.content}
                      </p>
                      {message.patientName && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                          Paciente: {message.patientName}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pacientes em Monitoramento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              Pacientes Prioritários
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalPatients.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Heart className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <p className="text-sm">Todos os pacientes estáveis</p>
              </div>
            ) : (
              criticalPatients.map((patient) => {
                const statusBadge = getStatusBadge(
                  patient.clinicalStatus,
                  "patient",
                );
                return (
                  <div
                    key={patient.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm text-gray-900 dark:text-white">
                        {patient.name}
                      </p>
                      <Badge variant={statusBadge.variant} className="text-xs">
                        {statusBadge.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Processo: {patient.processNumber}
                    </p>
                    {patient.lastConsultation && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Última consulta: {formatDate(patient.lastConsultation)}
                      </p>
                    )}
                  </div>
                );
              })
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button size="sm" className="w-full" asChild>
                <Link to="/portal/doctor/patients">
                  <Users className="w-4 h-4 mr-2" />
                  Ver Todos os Pacientes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
