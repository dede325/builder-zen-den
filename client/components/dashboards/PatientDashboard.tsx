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
  Download,
  Plus,
  Eye,
  Bell,
  CreditCard,
  MessageSquare,
  Loader2,
} from "lucide-react";

interface PatientDashboardProps {
  currentUser: any;
  appointments: any[];
  examResults: any[];
  notificationSettings: any;
  isLoadingAppointments: boolean;
  isLoadingExams: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCreateAppointment: (data: any) => Promise<boolean>;
  onCancelAppointment: (id: string) => void;
  onMarkExamAsViewed: (id: string) => void;
  onDownloadExam: (id: string) => void;
  onUpdateProfile: () => void;
  onUpdateNotifications: (settings: any) => void;
}

export default function PatientDashboard({
  currentUser,
  appointments,
  examResults,
  notificationSettings,
  isLoadingAppointments,
  isLoadingExams,
  activeTab,
  setActiveTab,
  onCreateAppointment,
  onCancelAppointment,
  onMarkExamAsViewed,
  onDownloadExam,
  onUpdateProfile,
  onUpdateNotifications,
}: PatientDashboardProps) {
  // Dashboard statistics
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

  const stats = getDashboardStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="appointments">Consultas</TabsTrigger>
          <TabsTrigger value="exams">Exames</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
          <TabsTrigger value="billing">Faturas</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Notifications Banner */}
          {examResults.filter((e) => e.status === "ready").length > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800">
                      Você tem{" "}
                      {examResults.filter((e) => e.status === "ready").length}{" "}
                      resultado(s) de exame disponível(is)!
                    </h4>
                    <p className="text-sm text-green-700">
                      Clique em "Ver Exames" para acessar seus resultados.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => setActiveTab("exams")}
                  >
                    Ver Exames
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {appointments.filter((a) => a.status === "scheduled").length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-800">
                      Você tem{" "}
                      {
                        appointments.filter((a) => a.status === "scheduled")
                          .length
                      }{" "}
                      consulta(s) agendada(s)
                    </h4>
                    <p className="text-sm text-blue-700">
                      Próxima consulta:{" "}
                      {appointments.filter(
                        (a) => a.status === "scheduled",
                      )[0] &&
                        `${appointments.filter((a) => a.status === "scheduled")[0].specialty} em ${new Date(appointments.filter((a) => a.status === "scheduled")[0].date).toLocaleDateString("pt-BR")}`}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab("appointments")}
                  >
                    Ver Consultas
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("appointments")}
            >
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Agendar Consulta</h3>
                <p className="text-sm text-muted-foreground">
                  Agende sua próxima consulta rapidamente
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("exams")}
            >
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Ver Exames</h3>
                <p className="text-sm text-muted-foreground">
                  Acesse seus resultados de exames
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
                  Comunique-se com sua equipe médica
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("profile")}
            >
              <CardContent className="p-6 text-center">
                <User className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Atualizar Dados</h3>
                <p className="text-sm text-muted-foreground">
                  Mantenha suas informações atualizadas
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
                    <p className="text-sm text-muted-foreground">
                      Próxima Consulta
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.nextAppointment}
                    </p>
                    {appointments.filter(
                      (a) => a.status === "scheduled",
                    )[0] && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {
                          appointments.filter(
                            (a) => a.status === "scheduled",
                          )[0].specialty
                        }
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
                    <p className="text-sm text-muted-foreground">
                      Exames Disponíveis
                    </p>
                    <p className="text-2xl font-bold">{stats.pendingExams}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Prontos para download
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-clinic-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Consultas Este Mês
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.thisMonthAppointments}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Realizadas/Agendadas
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-clinic-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total de Exames
                    </p>
                    <p className="text-2xl font-bold">{examResults.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      No histórico
                    </p>
                  </div>
                  <Bell className="w-8 h-8 text-clinic-accent" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <h2 className="text-2xl font-bold">Mensagens</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Sistema de Mensagens
              </h3>
              <p className="text-muted-foreground mb-4">
                Em breve você poderá se comunicar diretamente com sua equipe
                médica através desta seção.
              </p>
              <Button variant="outline">Entrar em Contato</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <h2 className="text-2xl font-bold">Faturas e Pagamentos</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Sistema de Faturamento
              </h3>
              <p className="text-muted-foreground mb-4">
                Aqui você poderá visualizar e baixar seus comprovantes de
                pagamento, além de acompanhar o status das suas faturas.
              </p>
              <Button variant="outline">Ver Histórico de Pagamentos</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
