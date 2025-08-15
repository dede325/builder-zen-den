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
  Settings,
  Users,
  Calendar,
  TrendingUp,
  Database,
  Shield,
  FileText,
  BarChart3,
  UserPlus,
  Cog,
  Activity,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

interface AdminDashboardProps {
  currentUser: any;
  appointments: any[];
  examResults: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminDashboard({
  currentUser,
  appointments,
  examResults,
  activeTab,
  setActiveTab,
}: AdminDashboardProps) {
  const [systemStats, setSystemStats] = useState({
    totalUsers: 15,
    activePatients: 8,
    totalDoctors: 3,
    monthlyRevenue: 45000,
    systemUptime: "99.9%",
    pendingApprovals: 2,
  });

  const getSystemStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = appointments.filter(
      (apt) => apt.date.split("T")[0] === today,
    );
    const thisMonth = new Date().getMonth();
    const monthlyAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate.getMonth() === thisMonth;
    });

    return {
      todayAppointments: todayAppointments.length,
      monthlyAppointments: monthlyAppointments.length,
      pendingExams: examResults.filter((exam) => exam.status === "pending")
        .length,
      readyExams: examResults.filter((exam) => exam.status === "ready").length,
    };
  };

  const stats = getSystemStats();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">
          Painel Administrativo
        </h1>
        <p className="text-muted-foreground">
          Controle total da plataforma - {currentUser?.name}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="schedule">Agenda Global</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="files">Arquivo</TabsTrigger>
        </TabsList>

        {/* Dashboard Overview */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* System Alerts */}
          <div className="grid gap-4">
            {systemStats.pendingApprovals > 0 && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-800">
                        {systemStats.pendingApprovals} aprovação(ões)
                        pendente(s)
                      </h4>
                      <p className="text-sm text-yellow-700">
                        Novos cadastros de usuários aguardando aprovação
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700"
                      onClick={() => setActiveTab("users")}
                    >
                      Revisar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-800">
                      Sistema Operacional
                    </h4>
                    <p className="text-sm text-green-700">
                      Uptime: {systemStats.systemUptime} - Todos os serviços
                      funcionando normalmente
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("users")}
            >
              <CardContent className="p-6 text-center">
                <UserPlus className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Gestão de Usuários</h3>
                <p className="text-sm text-muted-foreground">
                  Criar, editar e gerenciar contas
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("schedule")}
            >
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Agenda Global</h3>
                <p className="text-sm text-muted-foreground">
                  Visualizar todas as agendas
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("reports")}
            >
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Relatórios</h3>
                <p className="text-sm text-muted-foreground">
                  Financeiros e estatísticos
                </p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setActiveTab("settings")}
            >
              <CardContent className="p-6 text-center">
                <Cog className="w-12 h-12 text-clinic-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Configurações</h3>
                <p className="text-sm text-muted-foreground">
                  Alterar configurações do sistema
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total de Usuários
                    </p>
                    <p className="text-2xl font-bold">
                      {systemStats.totalUsers}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ativos no sistema
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
                      Consultas Hoje
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.todayAppointments}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Agendadas para hoje
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
                      Receita Mensal
                    </p>
                    <p className="text-2xl font-bold">
                      {systemStats.monthlyRevenue.toLocaleString("pt-AO", {
                        style: "currency",
                        currency: "AOA",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Este mês
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Uptime do Sistema
                    </p>
                    <p className="text-2xl font-bold">
                      {systemStats.systemUptime}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Últimos 30 dias
                    </p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                    <UserPlus className="w-8 h-8 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">Novo usuário registrado</p>
                      <p className="text-sm text-muted-foreground">
                        Dr. Maria Santos - Pediatria
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Há 2 horas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                    <Calendar className="w-8 h-8 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">25 consultas agendadas</p>
                      <p className="text-sm text-muted-foreground">
                        Para esta semana
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Há 4 horas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    <div className="flex-1">
                      <p className="font-medium">Backup automatico</p>
                      <p className="text-sm text-muted-foreground">
                        Realizado com sucesso
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Há 6 horas
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Serviços</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Servidor Web</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Base de Dados</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Email Service</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Backup Service</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Processando
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Sistema de Gestão de Usuários
              </h3>
              <p className="text-muted-foreground mb-4">
                Criar, editar e remover contas de usuários. Gerenciar permissões
                e roles para cada tipo de utilizador.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">Listar Usuários</Button>
                <Button>Adicionar Usuário</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Global Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <h2 className="text-2xl font-bold">Agenda Global</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Agenda Centralizada
              </h3>
              <p className="text-muted-foreground mb-4">
                Visualize e gerencie todas as agendas dos médicos, organize
                horários e resolva conflitos de agendamento.
              </p>
              <Button variant="outline">Ver Agenda Completa</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <h2 className="text-2xl font-bold">Relatórios Gerais</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Centro de Relatórios
              </h3>
              <p className="text-muted-foreground mb-4">
                Gere relatórios financeiros, estatísticos e clínicos. Acompanhe
                KPIs e métricas importantes da clínica.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">Relatório Financeiro</Button>
                <Button variant="outline">Relatório Clínico</Button>
                <Button>Gerar Relatório Personalizado</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <h2 className="text-2xl font-bold">Configurações do Sistema</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Configurações Gerais
              </h3>
              <p className="text-muted-foreground mb-4">
                Altere dados da clínica, configure horários de funcionamento,
                gerencie permissões e personalize o sistema.
              </p>
              <Button variant="outline">Abrir Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <h2 className="text-2xl font-bold">Logs e Auditoria</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Sistema de Auditoria
              </h3>
              <p className="text-muted-foreground mb-4">
                Acompanhe todas as alterações feitas no sistema, monitore
                atividades de usuários e garanta a segurança dos dados.
              </p>
              <Button variant="outline">Ver Logs de Atividade</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Archive Tab */}
        <TabsContent value="files" className="space-y-6">
          <h2 className="text-2xl font-bold">Arquivo Digital</h2>
          <Card>
            <CardContent className="p-8 text-center">
              <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Centro de Arquivo</h3>
              <p className="text-muted-foreground mb-4">
                Acesso completo a todos os registros, exames, consultas e
                documentos armazenados no sistema.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">Buscar Registros</Button>
                <Button variant="outline">Exportar Dados</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
