import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Weight,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit,
  Stethoscope,
  Pill,
  Apple,
  Moon,
  Coffee,
  Footprints,
  Timer,
  Award,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HealthMetric {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'weight' | 'temperature' | 'glucose' | 'steps' | 'sleep' | 'water' | 'exercise';
  value: number | string;
  unit: string;
  timestamp: string;
  notes?: string;
  target?: number;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  taken: boolean;
  color: string;
}

interface Goal {
  id: string;
  type: 'weight_loss' | 'exercise' | 'sleep' | 'water' | 'steps' | 'medication_adherence';
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
}

interface Symptom {
  id: string;
  name: string;
  severity: number; // 1-10
  notes: string;
  timestamp: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'fitness' | 'health' | 'medication' | 'goals';
}

export default function HealthTrackingDashboard() {
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState<string>('');
  
  // Mock data
  const [healthMetrics] = useState<HealthMetric[]>([
    // Blood pressure data
    { id: '1', type: 'blood_pressure', value: '120/80', unit: 'mmHg', timestamp: '2024-12-20T08:00:00Z', target: 120 },
    { id: '2', type: 'blood_pressure', value: '125/82', unit: 'mmHg', timestamp: '2024-12-19T08:00:00Z' },
    { id: '3', type: 'blood_pressure', value: '118/78', unit: 'mmHg', timestamp: '2024-12-18T08:00:00Z' },
    
    // Weight data
    { id: '4', type: 'weight', value: 75.5, unit: 'kg', timestamp: '2024-12-20T07:00:00Z', target: 75 },
    { id: '5', type: 'weight', value: 75.8, unit: 'kg', timestamp: '2024-12-19T07:00:00Z' },
    { id: '6', type: 'weight', value: 76.2, unit: 'kg', timestamp: '2024-12-18T07:00:00Z' },
    
    // Heart rate data
    { id: '7', type: 'heart_rate', value: 72, unit: 'bpm', timestamp: '2024-12-20T08:00:00Z', target: 75 },
    { id: '8', type: 'heart_rate', value: 68, unit: 'bpm', timestamp: '2024-12-19T08:00:00Z' },
    { id: '9', type: 'heart_rate', value: 74, unit: 'bpm', timestamp: '2024-12-18T08:00:00Z' },
    
    // Steps data
    { id: '10', type: 'steps', value: 8500, unit: 'passos', timestamp: '2024-12-20T23:59:00Z', target: 10000 },
    { id: '11', type: 'steps', value: 9200, unit: 'passos', timestamp: '2024-12-19T23:59:00Z' },
    { id: '12', type: 'steps', value: 7800, unit: 'passos', timestamp: '2024-12-18T23:59:00Z' },
    
    // Sleep data
    { id: '13', type: 'sleep', value: 7.5, unit: 'horas', timestamp: '2024-12-20T07:00:00Z', target: 8 },
    { id: '14', type: 'sleep', value: 6.8, unit: 'horas', timestamp: '2024-12-19T07:00:00Z' },
    { id: '15', type: 'sleep', value: 8.2, unit: 'horas', timestamp: '2024-12-18T07:00:00Z' },
    
    // Water intake
    { id: '16', type: 'water', value: 2.1, unit: 'litros', timestamp: '2024-12-20T23:59:00Z', target: 2.5 },
    { id: '17', type: 'water', value: 2.8, unit: 'litros', timestamp: '2024-12-19T23:59:00Z' },
    { id: '18', type: 'water', value: 1.9, unit: 'litros', timestamp: '2024-12-18T23:59:00Z' },
  ]);

  const [medications] = useState<Medication[]>([
    {
      id: 'med-1',
      name: 'Losartana',
      dosage: '50mg',
      frequency: '1x ao dia',
      nextDose: '2024-12-21T08:00:00Z',
      taken: true,
      color: '#3b82f6',
    },
    {
      id: 'med-2',
      name: 'AAS',
      dosage: '100mg',
      frequency: '1x ao dia',
      nextDose: '2024-12-21T08:00:00Z',
      taken: false,
      color: '#ef4444',
    },
    {
      id: 'med-3',
      name: 'Ômega 3',
      dosage: '1000mg',
      frequency: '2x ao dia',
      nextDose: '2024-12-21T12:00:00Z',
      taken: false,
      color: '#10b981',
    },
  ]);

  const [goals] = useState<Goal[]>([
    {
      id: 'goal-1',
      type: 'weight_loss',
      title: 'Perder 5kg',
      target: 70,
      current: 75.5,
      unit: 'kg',
      deadline: '2025-03-01',
      completed: false,
    },
    {
      id: 'goal-2',
      type: 'steps',
      title: 'Caminhar 10.000 passos/dia',
      target: 10000,
      current: 8500,
      unit: 'passos',
      deadline: '2024-12-31',
      completed: false,
    },
    {
      id: 'goal-3',
      type: 'sleep',
      title: 'Dormir 8h por noite',
      target: 8,
      current: 7.5,
      unit: 'horas',
      deadline: '2024-12-31',
      completed: false,
    },
    {
      id: 'goal-4',
      type: 'water',
      title: 'Beber 2.5L água/dia',
      target: 2.5,
      current: 2.1,
      unit: 'litros',
      deadline: '2024-12-31',
      completed: false,
    },
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: 'ach-1',
      title: 'Primeira Semana',
      description: 'Completou sua primeira semana de monitoramento',
      icon: '🎉',
      earnedAt: '2024-12-15T10:00:00Z',
      category: 'health',
    },
    {
      id: 'ach-2',
      title: 'Meta de Passos',
      description: 'Atingiu 10.000 passos em um dia',
      icon: '👟',
      earnedAt: '2024-12-19T23:59:00Z',
      category: 'fitness',
    },
    {
      id: 'ach-3',
      title: 'Medicação em Dia',
      description: 'Tomou todas as medicações por 7 dias consecutivos',
      icon: '💊',
      earnedAt: '2024-12-18T20:00:00Z',
      category: 'medication',
    },
  ]);

  const getMetricsByType = (type: HealthMetric['type']) => {
    return healthMetrics
      .filter(metric => metric.type === type)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(metric => ({
        ...metric,
        date: format(new Date(metric.timestamp), 'dd/MM'),
        fullDate: format(new Date(metric.timestamp), 'dd/MM/yyyy'),
      }));
  };

  const getLatestMetric = (type: HealthMetric['type']) => {
    const metrics = healthMetrics.filter(metric => metric.type === type);
    return metrics.length > 0 
      ? metrics.reduce((latest, current) => 
          new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
        )
      : null;
  };

  const calculateTrend = (type: HealthMetric['type']) => {
    const metrics = getMetricsByType(type).slice(-7); // Last 7 days
    if (metrics.length < 2) return 0;
    
    const recent = Number(metrics[metrics.length - 1].value);
    const previous = Number(metrics[metrics.length - 2].value);
    
    return ((recent - previous) / previous) * 100;
  };

  const getTodayProgress = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const todayMetrics = healthMetrics.filter(metric => 
      metric.timestamp.startsWith(today)
    );
    
    const steps = todayMetrics.find(m => m.type === 'steps');
    const water = todayMetrics.find(m => m.type === 'water');
    const sleep = todayMetrics.find(m => m.type === 'sleep');
    
    return {
      steps: steps ? {
        current: Number(steps.value),
        target: steps.target || 10000,
        percentage: Math.min((Number(steps.value) / (steps.target || 10000)) * 100, 100)
      } : null,
      water: water ? {
        current: Number(water.value),
        target: water.target || 2.5,
        percentage: Math.min((Number(water.value) / (water.target || 2.5)) * 100, 100)
      } : null,
      sleep: sleep ? {
        current: Number(sleep.value),
        target: sleep.target || 8,
        percentage: Math.min((Number(sleep.value) / (sleep.target || 8)) * 100, 100)
      } : null,
    };
  };

  const getMedicationAdherence = () => {
    const total = medications.length;
    const taken = medications.filter(med => med.taken).length;
    return total > 0 ? (taken / total) * 100 : 0;
  };

  const getGoalProgress = (goal: Goal) => {
    if (goal.type === 'weight_loss') {
      const progress = Math.max(0, goal.current - goal.target);
      const total = 75.5 - goal.target; // Starting weight - target
      return Math.min((1 - progress / total) * 100, 100);
    }
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getMetricIcon = (type: HealthMetric['type']) => {
    const icons = {
      blood_pressure: Heart,
      heart_rate: Activity,
      weight: Weight,
      temperature: Thermometer,
      glucose: Droplets,
      steps: Footprints,
      sleep: Moon,
      water: Droplets,
      exercise: Timer,
    };
    return icons[type] || Activity;
  };

  const getMetricColor = (type: HealthMetric['type']) => {
    const colors = {
      blood_pressure: '#ef4444',
      heart_rate: '#f59e0b',
      weight: '#8b5cf6',
      temperature: '#06b6d4',
      glucose: '#10b981',
      steps: '#3b82f6',
      sleep: '#6366f1',
      water: '#0ea5e9',
      exercise: '#f97316',
    };
    return colors[type] || '#6b7280';
  };

  const todayProgress = getTodayProgress();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Minha Saúde</h2>
          <p className="text-muted-foreground">
            Monitore seus dados de saúde e bem-estar
          </p>
        </div>
        <Dialog open={showAddMetric} onOpenChange={setShowAddMetric}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Registrar Dados
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nova Medição</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tipo de Medição</Label>
                <select 
                  className="w-full p-2 border rounded mt-1"
                  value={selectedMetricType}
                  onChange={(e) => setSelectedMetricType(e.target.value)}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="weight">Peso</option>
                  <option value="blood_pressure">Pressão Arterial</option>
                  <option value="heart_rate">Frequência Cardíaca</option>
                  <option value="temperature">Temperatura</option>
                  <option value="glucose">Glicose</option>
                  <option value="steps">Passos</option>
                  <option value="sleep">Sono</option>
                  <option value="water">Água</option>
                </select>
              </div>
              {selectedMetricType === 'weight' && (
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="75.5"
                    className="mt-1"
                  />
                </div>
              )}

              {selectedMetricType === 'blood_pressure' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="systolic">Sistólica (mmHg)</Label>
                      <Input
                        id="systolic"
                        type="number"
                        placeholder="120"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="diastolic">Diastólica (mmHg)</Label>
                      <Input
                        id="diastolic"
                        type="number"
                        placeholder="80"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedMetricType === 'heart_rate' && (
                <div>
                  <Label htmlFor="heartRate">Frequência Cardíaca (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="72"
                    className="mt-1"
                  />
                </div>
              )}

              {selectedMetricType === 'temperature' && (
                <div>
                  <Label htmlFor="temperature">Temperatura (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    className="mt-1"
                  />
                </div>
              )}

              {selectedMetricType === 'glucose' && (
                <div>
                  <Label htmlFor="glucose">Glicose (mg/dL)</Label>
                  <Input
                    id="glucose"
                    type="number"
                    placeholder="90"
                    className="mt-1"
                  />
                  <div className="mt-2">
                    <Label>Momento da medição</Label>
                    <select className="w-full p-2 border rounded mt-1">
                      <option value="fasting">Jejum</option>
                      <option value="before_meal">Antes da refeição</option>
                      <option value="after_meal">Após refeição</option>
                      <option value="bedtime">Antes de dormir</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedMetricType === 'steps' && (
                <div>
                  <Label htmlFor="steps">Passos</Label>
                  <Input
                    id="steps"
                    type="number"
                    placeholder="8500"
                    className="mt-1"
                  />
                </div>
              )}

              {selectedMetricType === 'sleep' && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="sleepHours">Horas de sono</Label>
                    <Input
                      id="sleepHours"
                      type="number"
                      step="0.5"
                      placeholder="7.5"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Qualidade do sono</Label>
                    <select className="w-full p-2 border rounded mt-1">
                      <option value="excellent">Excelente</option>
                      <option value="good">Boa</option>
                      <option value="fair">Regular</option>
                      <option value="poor">Ruim</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedMetricType === 'water' && (
                <div>
                  <Label htmlFor="water">Água consumida (litros)</Label>
                  <Input
                    id="water"
                    type="number"
                    step="0.1"
                    placeholder="2.1"
                    className="mt-1"
                  />
                </div>
              )}

              {selectedMetricType && (
                <div>
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Adicione observações sobre esta medição..."
                    className="mt-1"
                    rows={2}
                  />
                </div>
              )}

              {selectedMetricType && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddMetric(false);
                      setSelectedMetricType('');
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      // Here you would handle saving the metric
                      console.log('Saving metric:', selectedMetricType);
                      setShowAddMetric(false);
                      setSelectedMetricType('');
                    }}
                  >
                    Salvar
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Steps */}
        {todayProgress.steps && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Footprints className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Passos</span>
                </div>
                <Badge variant="outline">
                  {todayProgress.steps.percentage.toFixed(0)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {todayProgress.steps.current.toLocaleString()}
                </div>
                <Progress value={todayProgress.steps.percentage} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  Meta: {todayProgress.steps.target.toLocaleString()} passos
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Water */}
        {todayProgress.water && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Água</span>
                </div>
                <Badge variant="outline">
                  {todayProgress.water.percentage.toFixed(0)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {todayProgress.water.current}L
                </div>
                <Progress value={todayProgress.water.percentage} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  Meta: {todayProgress.water.target}L
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sleep */}
        {todayProgress.sleep && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Moon className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium">Sono</span>
                </div>
                <Badge variant="outline">
                  {todayProgress.sleep.percentage.toFixed(0)}%
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {todayProgress.sleep.current}h
                </div>
                <Progress value={todayProgress.sleep.percentage} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  Meta: {todayProgress.sleep.target}h
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medication Adherence */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Pill className="w-5 h-5 text-green-500" />
                <span className="font-medium">Medicações</span>
              </div>
              <Badge variant="outline">
                {getMedicationAdherence().toFixed(0)}%
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {medications.filter(m => m.taken).length}/{medications.length}
              </div>
              <Progress value={getMedicationAdherence()} className="h-2" />
              <div className="text-sm text-muted-foreground">
                Tomadas hoje
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="vitals">Sinais Vitais</TabsTrigger>
          <TabsTrigger value="lifestyle">Estilo de Vida</TabsTrigger>
          <TabsTrigger value="medications">Medicações</TabsTrigger>
          <TabsTrigger value="goals">Metas</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weight Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Weight className="w-5 h-5 text-purple-500" />
                  <span>Evolução do Peso</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getMetricsByType('weight')}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8b5cf6" 
                        strokeWidth={2}
                        dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-sm text-muted-foreground">Peso atual:</span>
                    <span className="ml-2 font-medium">{getLatestMetric('weight')?.value}kg</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {calculateTrend('weight') < 0 ? (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm ${calculateTrend('weight') < 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(calculateTrend('weight')).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blood Pressure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span>Pressão Arterial</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getMetricsByType('blood_pressure').slice(-5).map((metric, index) => {
                    const [systolic, diastolic] = metric.value.toString().split('/');
                    const isHigh = Number(systolic) >= 140 || Number(diastolic) >= 90;
                    
                    return (
                      <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{metric.value} mmHg</div>
                          <div className="text-sm text-muted-foreground">{metric.fullDate}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isHigh ? (
                            <AlertCircle className="w-5 h-5 text-red-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          <Badge variant={isHigh ? "destructive" : "secondary"}>
                            {isHigh ? "Alta" : "Normal"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health Score */}
          <Card>
            <CardHeader>
              <CardTitle>Score de Saúde</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">85</div>
                  <div className="text-sm text-muted-foreground">Score Geral</div>
                  <Progress value={85} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">92</div>
                  <div className="text-sm text-muted-foreground">Atividade Física</div>
                  <Progress value={92} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500">78</div>
                  <div className="text-sm text-muted-foreground">Sono</div>
                  <Progress value={78} className="mt-2" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">88</div>
                  <div className="text-sm text-muted-foreground">Nutrição</div>
                  <Progress value={88} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map(goal => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <Badge variant={goal.completed ? "default" : "secondary"}>
                      {goal.completed ? "Concluída" : "Em progresso"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Progresso</span>
                      <span className="font-medium">
                        {getGoalProgress(goal).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={getGoalProgress(goal)} className="h-3" />
                    <div className="flex items-center justify-between text-sm">
                      <span>Atual: {goal.current} {goal.unit}</span>
                      <span>Meta: {goal.target} {goal.unit}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Prazo: {format(new Date(goal.deadline), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Medications */}
            <Card>
              <CardHeader>
                <CardTitle>Medicações de Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications.map(medication => (
                    <div 
                      key={medication.id} 
                      className={`flex items-center justify-between p-4 rounded-lg border-l-4`}
                      style={{ borderLeftColor: medication.color }}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: medication.color }}
                        />
                        <div>
                          <div className="font-medium">{medication.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {medication.dosage} - {medication.frequency}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Próxima dose: {format(new Date(medication.nextDose), 'HH:mm')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {medication.taken ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <Button size="sm" variant="outline">
                            Marcar como tomada
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Medication Adherence Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Aderência Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { day: 'Seg', adherence: 100 },
                      { day: 'Ter', adherence: 85 },
                      { day: 'Qua', adherence: 100 },
                      { day: 'Qui', adherence: 90 },
                      { day: 'Sex', adherence: 100 },
                      { day: 'Sáb', adherence: 75 },
                      { day: 'Dom', adherence: 95 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="adherence" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map(achievement => (
              <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <h3 className="font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {achievement.description}
                  </p>
                  <Badge variant="outline">
                    {format(new Date(achievement.earnedAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </Badge>
                </CardContent>
              </Card>
            ))}
            
            {/* Locked achievements */}
            <Card className="opacity-60">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="font-semibold mb-2">Meta Semanal</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete todas as metas por uma semana
                </p>
                <Badge variant="secondary">Bloqueada</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
