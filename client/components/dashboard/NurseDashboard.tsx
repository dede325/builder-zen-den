import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  Thermometer, 
  Heart, 
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle,
  Pill,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Bell,
  Stethoscope,
  FileText,
  Eye,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Patient {
  id: string;
  name: string;
  room: string;
  condition: 'stable' | 'critical' | 'observation' | 'discharge';
  vitals: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    oxygenSaturation: number;
  };
  lastCheckTime: string;
  medications: number;
  alerts: string[];
}

interface Task {
  id: string;
  patientId: string;
  patientName: string;
  type: 'medication' | 'vitals' | 'care' | 'documentation';
  description: string;
  scheduledTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  completed: boolean;
}

interface Schedule {
  id: string;
  time: string;
  activity: string;
  location: string;
  patients: string[];
  type: 'round' | 'medication' | 'procedure' | 'meeting';
}

const mockPatients: Patient[] = [
  {
    id: 'p001',
    name: 'Maria Silva Santos',
    room: '101A',
    condition: 'critical',
    vitals: {
      temperature: 38.5,
      bloodPressure: '140/90',
      heartRate: 95,
      oxygenSaturation: 94
    },
    lastCheckTime: '2024-01-15T14:30:00Z',
    medications: 4,
    alerts: ['Febre alta', 'Pressão elevada']
  },
  {
    id: 'p002',
    name: 'João Carlos Oliveira',
    room: '102B',
    condition: 'stable',
    vitals: {
      temperature: 36.8,
      bloodPressure: '120/80',
      heartRate: 72,
      oxygenSaturation: 98
    },
    lastCheckTime: '2024-01-15T13:15:00Z',
    medications: 2,
    alerts: []
  },
  {
    id: 'p003',
    name: 'Ana Beatriz Costa',
    room: '103A',
    condition: 'observation',
    vitals: {
      temperature: 37.2,
      bloodPressure: '110/70',
      heartRate: 88,
      oxygenSaturation: 96
    },
    lastCheckTime: '2024-01-15T12:45:00Z',
    medications: 3,
    alerts: ['Observação pós-cirúrgica']
  }
];

const mockTasks: Task[] = [
  {
    id: 't001',
    patientId: 'p001',
    patientName: 'Maria Silva Santos',
    type: 'medication',
    description: 'Administrar antibiótico - Amoxicilina 500mg',
    scheduledTime: '2024-01-15T15:00:00Z',
    priority: 'urgent',
    completed: false
  },
  {
    id: 't002',
    patientId: 'p002',
    patientName: 'João Carlos Oliveira',
    type: 'vitals',
    description: 'Verificar sinais vitais',
    scheduledTime: '2024-01-15T15:30:00Z',
    priority: 'medium',
    completed: false
  },
  {
    id: 't003',
    patientId: 'p003',
    patientName: 'Ana Beatriz Costa',
    type: 'care',
    description: 'Curativo pós-operatório',
    scheduledTime: '2024-01-15T16:00:00Z',
    priority: 'high',
    completed: false
  }
];

const mockSchedule: Schedule[] = [
  {
    id: 's001',
    time: '15:00',
    activity: 'Ronda de Medicamentos',
    location: 'Ala Norte',
    patients: ['Maria Silva', 'João Carlos'],
    type: 'medication'
  },
  {
    id: 's002',
    time: '16:00',
    activity: 'Verificação de Sinais Vitais',
    location: 'Ala Sul',
    patients: ['Ana Beatriz', 'Carlos Mendes'],
    type: 'round'
  },
  {
    id: 's003',
    time: '17:00',
    activity: 'Reunião Multidisciplinar',
    location: 'Sala de Reuniões',
    patients: [],
    type: 'meeting'
  }
];

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink';
}

function StatsCard({ title, value, description, icon: Icon, trend, trendValue, color = 'blue' }: StatsCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
    yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400',
    red: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400',
    purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400',
    pink: 'text-pink-600 bg-pink-100 dark:bg-pink-900/20 dark:text-pink-400'
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-2 rounded-full", colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>{description}</span>
          {trend && trendValue && (
            <div className={cn("flex items-center", {
              'text-green-600': trend === 'up',
              'text-red-600': trend === 'down',
              'text-gray-600': trend === 'stable'
            })}>
              {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
              {trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function NurseDashboard() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [schedule] = useState<Schedule[]>(mockSchedule);
  const [loading, setLoading] = useState(false);

  const completedTasks = tasks.filter(task => task.completed).length;
  const urgentTasks = tasks.filter(task => task.priority === 'urgent' && !task.completed).length;
  const criticalPatients = patients.filter(patient => patient.condition === 'critical').length;
  const medicationsDue = tasks.filter(task => task.type === 'medication' && !task.completed).length;

  const handleCompleteTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
  };

  const getConditionColor = (condition: Patient['condition']) => {
    switch (condition) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'observation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'stable': return 'bg-green-100 text-green-800 border-green-200';
      case 'discharge': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getVitalStatus = (vital: keyof Patient['vitals'], value: number | string) => {
    if (vital === 'temperature' && typeof value === 'number') {
      if (value >= 38) return 'text-red-600';
      if (value <= 35) return 'text-blue-600';
      return 'text-green-600';
    }
    if (vital === 'heartRate' && typeof value === 'number') {
      if (value > 100 || value < 60) return 'text-red-600';
      return 'text-green-600';
    }
    if (vital === 'oxygenSaturation' && typeof value === 'number') {
      if (value < 95) return 'text-red-600';
      return 'text-green-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard de Enfermagem</h2>
          <p className="text-muted-foreground">
            Visão geral dos pacientes e atividades do turno
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Alertas ({urgentTasks})
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Pacientes Ativos"
          value={patients.length}
          description="Sob seus cuidados"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Críticos"
          value={criticalPatients}
          description="Necessitam atenção"
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Medicações Pendentes"
          value={medicationsDue}
          description="Para administrar"
          icon={Pill}
          color="purple"
        />
        <StatsCard
          title="Tarefas Concluídas"
          value={`${completedTasks}/${tasks.length}`}
          description="Hoje"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Urgências"
          value={urgentTasks}
          description="Requerem ação imediata"
          icon={Activity}
          color="red"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Pacientes Críticos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Pacientes sob Cuidados</span>
            </CardTitle>
            <CardDescription>
              Status atual dos pacientes atribuídos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patients.map((patient) => (
                <div key={patient.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">Quarto {patient.room}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getConditionColor(patient.condition)}>
                        {patient.condition === 'critical' && 'Crítico'}
                        {patient.condition === 'stable' && 'Estável'}
                        {patient.condition === 'observation' && 'Observação'}
                        {patient.condition === 'discharge' && 'Alta'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(patient.lastCheckTime), 'HH:mm')}
                      </span>
                    </div>
                  </div>

                  {/* Sinais Vitais */}
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Thermometer className="h-3 w-3 mr-1" />
                        <span className={cn("text-xs font-medium", getVitalStatus('temperature', patient.vitals.temperature))}>
                          {patient.vitals.temperature}°C
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Temp</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Heart className="h-3 w-3 mr-1" />
                        <span className={cn("text-xs font-medium", getVitalStatus('heartRate', patient.vitals.heartRate))}>
                          {patient.vitals.heartRate}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">BPM</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Activity className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">
                          {patient.vitals.bloodPressure}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">PA</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <span className={cn("text-xs font-medium", getVitalStatus('oxygenSaturation', patient.vitals.oxygenSaturation))}>
                          {patient.vitals.oxygenSaturation}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">SpO2</p>
                    </div>
                  </div>

                  {/* Alertas */}
                  {patient.alerts.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {patient.alerts.map((alert, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {alert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {patient.medications} medicação(ões)
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalhes
                      </Button>
                      <Button size="sm">
                        <Stethoscope className="h-3 w-3 mr-1" />
                        Atualizar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tarefas Pendentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5" />
              <span>Tarefas Pendentes</span>
            </CardTitle>
            <CardDescription>
              Atividades programadas para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.filter(task => !task.completed).slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={cn(
                    "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                    getPriorityColor(task.priority)
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{task.description}</p>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(task.scheduledTime), 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{task.patientName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline" className="text-xs">
                        {task.type === 'medication' && 'Medicação'}
                        {task.type === 'vitals' && 'Sinais Vitais'}
                        {task.type === 'care' && 'Cuidados'}
                        {task.type === 'documentation' && 'Documentação'}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleCompleteTask(task.id)}
                        className="text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Concluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {tasks.filter(task => !task.completed).length > 5 && (
                <Button variant="outline" className="w-full text-sm">
                  Ver todas ({tasks.filter(task => !task.completed).length - 5} mais)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Agenda do Turno */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Agenda do Turno</span>
            </CardTitle>
            <CardDescription>
              Cronograma de atividades programadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {schedule.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="text-center min-w-[60px]">
                    <div className="text-lg font-bold">{item.time}</div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.activity}</h3>
                    <p className="text-sm text-muted-foreground">{item.location}</p>
                    {item.patients.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Pacientes: {item.patients.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {item.type === 'medication' && 'Medicação'}
                      {item.type === 'round' && 'Ronda'}
                      {item.type === 'procedure' && 'Procedimento'}
                      {item.type === 'meeting' && 'Reunião'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso do Turno</CardTitle>
          <CardDescription>
            Acompanhe o andamento das suas atividades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tarefas Concluídas</span>
                <span>{completedTasks}/{tasks.length} ({Math.round((completedTasks / tasks.length) * 100)}%)</span>
              </div>
              <Progress value={(completedTasks / tasks.length) * 100} className="h-2" />
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{tasks.length - completedTasks}</div>
                <p className="text-sm text-muted-foreground">Tarefas Pendentes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{urgentTasks}</div>
                <p className="text-sm text-muted-foreground">Urgências</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
