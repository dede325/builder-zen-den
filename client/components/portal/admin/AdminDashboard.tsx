import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  UserPlus,
  Calendar,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Settings,
  Database,
  Shield,
  Bell,
  Globe,
  Zap,
} from 'lucide-react';
import { formatDate, formatMoney, formatNumber } from '@/lib/locale-angola-portal';
import { useAuthStore } from '@/store/auth-portal';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  systemUptime: number;
  storageUsed: number;
  bandwidthUsed: number;
}

interface RecentActivity {
  id: string;
  type: 'user_login' | 'appointment_created' | 'payment_received' | 'system_error' | 'content_updated';
  user: string;
  description: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

interface UserMetrics {
  patients: number;
  doctors: number;
  nurses: number;
  admins: number;
  receptionists: number;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [userMetrics, setUserMetrics] = useState<UserMetrics | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [appointmentData, setAppointmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockStats: SystemStats = {
      totalUsers: 1247,
      activeUsers: 892,
      totalAppointments: 3456,
      completedAppointments: 3123,
      totalRevenue: 15678900,
      monthlyRevenue: 2345000,
      systemUptime: 99.8,
      storageUsed: 68.5,
      bandwidthUsed: 45.2,
    };

    const mockUserMetrics: UserMetrics = {
      patients: 1050,
      doctors: 25,
      nurses: 45,
      admins: 3,
      receptionists: 8,
    };

    const mockActivities: RecentActivity[] = [
      {
        id: '1',
        type: 'user_login',
        user: 'Dr. João Silva',
        description: 'Login realizado com sucesso',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        severity: 'low',
      },
      {
        id: '2',
        type: 'appointment_created',
        user: 'Maria Santos (Paciente)',
        description: 'Nova consulta agendada para 20/01/2025',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        severity: 'medium',
      },
      {
        id: '3',
        type: 'payment_received',
        user: 'Sistema',
        description: 'Pagamento recebido: 15.000 Kz',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        severity: 'low',
      },
      {
        id: '4',
        type: 'system_error',
        user: 'Sistema',
        description: 'Erro de conectividade com servidor de backup',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        severity: 'high',
      },
    ];

    const mockRevenueData = [
      { month: 'Jul', value: 180000 },
      { month: 'Ago', value: 195000 },
      { month: 'Set', value: 210000 },
      { month: 'Out', value: 225000 },
      { month: 'Nov', value: 240000 },
      { month: 'Dez', value: 255000 },
      { month: 'Jan', value: 270000 },
    ];

    const mockAppointmentData = [
      { day: 'Seg', appointments: 45 },
      { day: 'Ter', appointments: 52 },
      { day: 'Qua', appointments: 48 },
      { day: 'Qui', appointments: 61 },
      { day: 'Sex', appointments: 55 },
      { day: 'Sáb', appointments: 28 },
      { day: 'Dom', appointments: 12 },
    ];

    setSystemStats(mockStats);
    setUserMetrics(mockUserMetrics);
    setRecentActivities(mockActivities);
    setRevenueData(mockRevenueData);
    setAppointmentData(mockAppointmentData);
    setLoading(false);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_login':
        return <Users className="h-4 w-4" />;
      case 'appointment_created':
        return <Calendar className="h-4 w-4" />;
      case 'payment_received':
        return <DollarSign className="h-4 w-4" />;
      case 'system_error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'content_updated':
        return <FileText className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const userDistributionData = userMetrics ? [
    { name: 'Pacientes', value: userMetrics.patients, color: COLORS[0] },
    { name: 'Médicos', value: userMetrics.doctors, color: COLORS[1] },
    { name: 'Enfermeiros', value: userMetrics.nurses, color: COLORS[2] },
    { name: 'Recepcionistas', value: userMetrics.receptionists, color: COLORS[3] },
    { name: 'Administradores', value: userMetrics.admins, color: COLORS[4] },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-clinic-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-purple-50/50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard Administrativo 🏥
            </h1>
            <p className="text-gray-600 mt-1">
              Gestão completa da Clínica Bem Cuidar
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Relatório
            </Button>
            <Button className="bg-clinic-gradient flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </Button>
          </div>
        </motion.div>

        {/* System Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários Totais</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemStats ? formatNumber(systemStats.totalUsers) : '--'}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {systemStats ? systemStats.activeUsers : 0} ativos
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Consultas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemStats ? formatNumber(systemStats.totalAppointments) : '--'}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {systemStats ? systemStats.completedAppointments : 0} concluídas
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemStats ? formatMoney(systemStats.totalRevenue) : '--'}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    +{systemStats ? formatMoney(systemStats.monthlyRevenue) : 0} este mês
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Uptime Sistema</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {systemStats ? systemStats.systemUptime : '--'}%
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={systemStats?.systemUptime || 0} 
                      className="h-2"
                    />
                  </div>
                </div>
                <Activity className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Evolução da Receita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => formatMoney(value)} />
                    <Tooltip formatter={(value) => formatMoney(Number(value))} />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Distribuição de Usuários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={userDistributionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {userDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Appointments Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Consultas por Dia da Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Atividade Recente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`flex items-start gap-3 p-3 rounded-lg ${getSeverityColor(activity.severity)}`}
                    >
                      <div className="mt-0.5">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.description}
                        </p>
                        <p className="text-xs opacity-75">
                          {activity.user} • {formatDate(activity.timestamp, 'dateTime')}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full text-sm">
                    Ver Todas as Atividades
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Saúde do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Armazenamento</span>
                    <span className="text-sm text-gray-600">
                      {systemStats?.storageUsed}%
                    </span>
                  </div>
                  <Progress value={systemStats?.storageUsed || 0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Largura de Banda</span>
                    <span className="text-sm text-gray-600">
                      {systemStats?.bandwidthUsed}%
                    </span>
                  </div>
                  <Progress value={systemStats?.bandwidthUsed || 0} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Backup</p>
                    <p className="text-sm font-semibold text-green-600">OK</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Database className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600">Base de Dados</p>
                    <p className="text-sm font-semibold text-blue-600">Online</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Gestão Rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="users">Usuários</TabsTrigger>
                  <TabsTrigger value="content">Conteúdo</TabsTrigger>
                  <TabsTrigger value="system">Sistema</TabsTrigger>
                  <TabsTrigger value="reports">Relatórios</TabsTrigger>
                </TabsList>
                
                <TabsContent value="users" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <UserPlus className="h-6 w-6" />
                      <span className="text-sm">Novo Usuário</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Users className="h-6 w-6" />
                      <span className="text-sm">Gerir Usuários</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Shield className="h-6 w-6" />
                      <span className="text-sm">Permissões</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Eye className="h-6 w-6" />
                      <span className="text-sm">Auditoria</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="content" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">Criar Página</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Edit className="h-6 w-6" />
                      <span className="text-sm">Editar Site</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6" />
                      <span className="text-sm">Media</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Globe className="h-6 w-6" />
                      <span className="text-sm">SEO</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="system" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Settings className="h-6 w-6" />
                      <span className="text-sm">Configurações</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Database className="h-6 w-6" />
                      <span className="text-sm">Backup</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Zap className="h-6 w-6" />
                      <span className="text-sm">Performance</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Bell className="h-6 w-6" />
                      <span className="text-sm">Notificações</span>
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="reports" className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <TrendingUp className="h-6 w-6" />
                      <span className="text-sm">Financeiro</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Users className="h-6 w-6" />
                      <span className="text-sm">Usuários</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Calendar className="h-6 w-6" />
                      <span className="text-sm">Consultas</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                      <Download className="h-6 w-6" />
                      <span className="text-sm">Exportar</span>
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
