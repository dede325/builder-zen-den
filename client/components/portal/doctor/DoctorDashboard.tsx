import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Video,
  MessageSquare,
  Pill,
  Plus,
  Eye,
  Edit,
  Phone,
} from 'lucide-react';
import { formatDate, formatMoney } from '@/lib/locale-angola-portal';
import { useAuthStore } from '@/store/auth-portal';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  phone: string;
  lastVisit: Date;
  nextAppointment?: Date;
  priority: 'baixa' | 'normal' | 'alta' | 'urgente';
  status: 'ativo' | 'inativo';
  avatar?: string;
}

interface Appointment {
  id: string;
  patient: Patient;
  date: Date;
  time: string;
  duration: number;
  type: 'consulta' | 'retorno' | 'emergencia' | 'teleconsulta';
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  notes?: string;
}

interface TodayStats {
  totalPatients: number;
  completedAppointments: number;
  pendingAppointments: number;
  revenue: number;
  averageConsultationTime: number;
}

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockStats: TodayStats = {
      totalPatients: 12,
      completedAppointments: 8,
      pendingAppointments: 4,
      revenue: 85000,
      averageConsultationTime: 25,
    };

    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'Maria Silva',
        age: 34,
        gender: 'F',
        phone: '+244 923 456 789',
        lastVisit: new Date(2025, 0, 10),
        nextAppointment: new Date(2025, 0, 20),
        priority: 'alta',
        status: 'ativo',
      },
      {
        id: '2',
        name: 'João Santos',
        age: 45,
        gender: 'M',
        phone: '+244 924 567 890',
        lastVisit: new Date(2025, 0, 12),
        priority: 'normal',
        status: 'ativo',
      },
      {
        id: '3',
        name: 'Ana Costa',
        age: 28,
        gender: 'F',
        phone: '+244 925 678 901',
        lastVisit: new Date(2025, 0, 14),
        priority: 'urgente',
        status: 'ativo',
      },
    ];

    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patient: mockPatients[0],
        date: new Date(),
        time: '09:00',
        duration: 30,
        type: 'consulta',
        status: 'confirmado',
      },
      {
        id: '2',
        patient: mockPatients[1],
        date: new Date(),
        time: '10:30',
        duration: 30,
        type: 'retorno',
        status: 'em_andamento',
      },
      {
        id: '3',
        patient: mockPatients[2],
        date: new Date(),
        time: '14:00',
        duration: 45,
        type: 'teleconsulta',
        status: 'agendado',
      },
    ];

    setTodayStats(mockStats);
    setTodayAppointments(mockAppointments);
    setRecentPatients(mockPatients);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
      case 'concluido':
      case 'ativo':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'agendado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em_andamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelado':
      case 'inativo':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente':
        return 'bg-red-500';
      case 'alta':
        return 'bg-orange-500';
      case 'normal':
        return 'bg-blue-500';
      case 'baixa':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const currentAppointment = todayAppointments.find(
    apt => apt.status === 'em_andamento'
  );

  const nextAppointment = todayAppointments
    .filter(apt => apt.status === 'agendado' || apt.status === 'confirmado')
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-clinic-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-green-50/50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bom dia, Dr. {user?.name?.split(' ')[0]}! 👨‍⚕️
            </h1>
            <p className="text-gray-600 mt-1">
              {formatDate(currentTime, 'long')} • {formatDate(currentTime, 'time')}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Consulta
            </Button>
            <Button className="bg-clinic-gradient flex items-center gap-2">
              <Video className="h-4 w-4" />
              Iniciar Teleconsulta
            </Button>
          </div>
        </motion.div>

        {/* Current Status */}
        {currentAppointment && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Consulta em Andamento</h3>
                <p className="text-green-100">
                  {currentAppointment.patient.name} • {currentAppointment.time}
                </p>
                <p className="text-green-200 text-sm">
                  {currentAppointment.type} • {currentAppointment.duration} minutos
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Prescrição
                </Button>
                <Button variant="secondary" size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Daily Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pacientes Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats?.totalPatients}
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
                  <p className="text-sm font-medium text-gray-600">Concluídas</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats?.completedAppointments}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats?.pendingAppointments}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats ? formatMoney(todayStats.revenue) : '--'}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {todayStats?.averageConsultationTime}min
                  </p>
                </div>
                <Activity className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Agenda de Hoje
                  </div>
                  {nextAppointment && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Próximo: {nextAppointment.time}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        appointment.status === 'em_andamento'
                          ? 'bg-green-50 border-l-green-500'
                          : appointment.status === 'confirmado'
                          ? 'bg-blue-50 border-l-blue-500'
                          : 'bg-gray-50 border-l-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">
                              {appointment.time}
                            </p>
                            <p className="text-xs text-gray-500">
                              {appointment.duration}min
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={appointment.patient.avatar} />
                              <AvatarFallback>
                                {appointment.patient.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {appointment.patient.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {appointment.patient.age} anos • {appointment.patient.gender}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${getPriorityColor(appointment.patient.priority)}`} />
                                <span className="text-xs text-gray-500 capitalize">
                                  {appointment.type}
                                </span>
                                {appointment.type === 'teleconsulta' && (
                                  <Video className="h-3 w-3 text-blue-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {todayAppointments.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma consulta agendada para hoje</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Patients */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Pacientes Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={patient.avatar} />
                            <AvatarFallback>
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getPriorityColor(patient.priority)}`} />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {patient.name}
                          </h5>
                          <p className="text-xs text-gray-500">
                            {patient.age} anos • Última visita: {formatDate(patient.lastVisit, 'dayMonth')}
                          </p>
                          {patient.nextAppointment && (
                            <p className="text-xs text-green-600">
                              Próxima: {formatDate(patient.nextAppointment, 'dayMonth')}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button variant="outline" className="w-full text-sm">
                    Ver Todos os Pacientes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Pill className="h-6 w-6" />
                  <span className="text-sm">Prescrição</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Relatório</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Agenda</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-sm">Mensagens</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">Estatísticas</span>
                </Button>
                
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  <span className="text-sm">Urgências</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
