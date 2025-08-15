import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  FileText,
  DollarSign,
  Activity,
  Clock,
  UserCheck,
  AlertTriangle,
  Download,
  RefreshCw,
  Filter,
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalPatients: number;
    totalAppointments: number;
    totalRevenue: number;
    averageWaitTime: number;
    patientSatisfaction: number;
  };
  trends: {
    appointments: Array<{ month: string; count: number; revenue: number }>;
    patients: Array<{ month: string; new: number; returning: number }>;
    departments: Array<{
      name: string;
      appointments: number;
      revenue: number;
      color: string;
    }>;
  };
  performance: {
    doctorStats: Array<{
      name: string;
      appointments: number;
      rating: number;
      revenue: number;
    }>;
    appointmentStats: Array<{
      hour: string;
      scheduled: number;
      completed: number;
      cancelled: number;
    }>;
  };
  demographics: {
    ageGroups: Array<{ range: string; count: number; percentage: number }>;
    genderDistribution: Array<{ gender: string; count: number; color: string }>;
  };
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("last30days");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData>({
    overview: {
      totalPatients: 1248,
      totalAppointments: 856,
      totalRevenue: 425600,
      averageWaitTime: 23,
      patientSatisfaction: 4.6,
    },
    trends: {
      appointments: [
        { month: "Jan", count: 65, revenue: 32500 },
        { month: "Fev", count: 78, revenue: 39000 },
        { month: "Mar", count: 82, revenue: 41000 },
        { month: "Abr", count: 74, revenue: 37000 },
        { month: "Mai", count: 88, revenue: 44000 },
        { month: "Jun", count: 95, revenue: 47500 },
        { month: "Jul", count: 102, revenue: 51000 },
        { month: "Ago", count: 89, revenue: 44500 },
        { month: "Set", count: 96, revenue: 48000 },
        { month: "Out", count: 105, revenue: 52500 },
        { month: "Nov", count: 112, revenue: 56000 },
        { month: "Dez", count: 98, revenue: 49000 },
      ],
      patients: [
        { month: "Jan", new: 25, returning: 40 },
        { month: "Fev", new: 32, returning: 46 },
        { month: "Mar", new: 28, returning: 54 },
        { month: "Abr", new: 35, returning: 39 },
        { month: "Mai", new: 42, returning: 46 },
        { month: "Jun", new: 38, returning: 57 },
        { month: "Jul", new: 45, returning: 57 },
        { month: "Ago", new: 33, returning: 56 },
        { month: "Set", new: 39, returning: 57 },
        { month: "Out", new: 41, returning: 64 },
        { month: "Nov", new: 47, returning: 65 },
        { month: "Dez", new: 35, returning: 63 },
      ],
      departments: [
        {
          name: "Cardiologia",
          appointments: 245,
          revenue: 122500,
          color: "#ff6b6b",
        },
        {
          name: "Pediatria",
          appointments: 198,
          revenue: 99000,
          color: "#4ecdc4",
        },
        {
          name: "Dermatologia",
          appointments: 167,
          revenue: 83500,
          color: "#45b7d1",
        },
        {
          name: "Clínica Geral",
          appointments: 156,
          revenue: 78000,
          color: "#96ceb4",
        },
        {
          name: "Neurologia",
          appointments: 90,
          revenue: 45000,
          color: "#feca57",
        },
      ],
    },
    performance: {
      doctorStats: [
        {
          name: "Dr. António Silva",
          appointments: 156,
          rating: 4.8,
          revenue: 78000,
        },
        {
          name: "Dra. Maria Santos",
          appointments: 142,
          rating: 4.6,
          revenue: 71000,
        },
        {
          name: "Dr. João Mendes",
          appointments: 134,
          rating: 4.7,
          revenue: 67000,
        },
        {
          name: "Dra. Ana Costa",
          appointments: 128,
          rating: 4.5,
          revenue: 64000,
        },
        {
          name: "Dr. Pedro Lima",
          appointments: 98,
          rating: 4.4,
          revenue: 49000,
        },
      ],
      appointmentStats: [
        { hour: "08:00", scheduled: 12, completed: 11, cancelled: 1 },
        { hour: "09:00", scheduled: 15, completed: 14, cancelled: 1 },
        { hour: "10:00", scheduled: 18, completed: 16, cancelled: 2 },
        { hour: "11:00", scheduled: 16, completed: 15, cancelled: 1 },
        { hour: "14:00", scheduled: 20, completed: 18, cancelled: 2 },
        { hour: "15:00", scheduled: 17, completed: 16, cancelled: 1 },
        { hour: "16:00", scheduled: 14, completed: 13, cancelled: 1 },
        { hour: "17:00", scheduled: 10, completed: 9, cancelled: 1 },
      ],
    },
    demographics: {
      ageGroups: [
        { range: "0-18", count: 156, percentage: 25 },
        { range: "19-35", count: 312, percentage: 40 },
        { range: "36-55", count: 187, percentage: 30 },
        { range: "56+", count: 93, percentage: 15 },
      ],
      genderDistribution: [
        { gender: "Feminino", count: 728, color: "#ff6b9d" },
        { gender: "Masculino", count: 520, color: "#4da6ff" },
      ],
    },
  });

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportReport = () => {
    // In a real app, this would generate and download a PDF/Excel report
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      ...data,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clinic-analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);
  };

  const getPercentageChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analytics & Reports</h2>
          <p className="text-muted-foreground">
            Acompanhe o desempenho da clínica em tempo real
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Últimos 7 dias</SelectItem>
              <SelectItem value="last30days">Últimos 30 dias</SelectItem>
              <SelectItem value="last3months">Últimos 3 meses</SelectItem>
              <SelectItem value="last6months">Últimos 6 meses</SelectItem>
              <SelectItem value="lastyear">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
          <Button onClick={exportReport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pacientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.totalPatients.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12.5% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.totalAppointments.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8.2% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(data.overview.totalRevenue)}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15.3% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tempo de Espera
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.averageWaitTime}min
            </div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="w-3 h-3 mr-1" />
              -5.2% vs mês anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.overview.patientSatisfaction}/5
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.1% vs mês anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="appointments">Consultas</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="demographics">Demografia</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Consultas por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={data.trends.appointments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Performance por Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.trends.departments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="appointments" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Doctors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Médicos - Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.performance.doctorStats.map((doctor, index) => (
                  <div
                    key={doctor.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-gray-500">
                          {doctor.appointments} consultas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(doctor.revenue)}
                      </p>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">
                          {doctor.rating}
                        </span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Consultas por Hora</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.performance.appointmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="scheduled" fill="#8884d8" name="Agendadas" />
                    <Bar
                      dataKey="completed"
                      fill="#82ca9d"
                      name="Completadas"
                    />
                    <Bar dataKey="cancelled" fill="#ff7c7c" name="Canceladas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Patient Types */}
            <Card>
              <CardHeader>
                <CardTitle>Pacientes Novos vs Retornos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.trends.patients}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="new"
                      stroke="#8884d8"
                      name="Novos"
                    />
                    <Line
                      type="monotone"
                      dataKey="returning"
                      stroke="#82ca9d"
                      name="Retornos"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Age Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Idade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.demographics.ageGroups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Gênero</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.demographics.genderDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ gender, count }) => `${gender}: ${count}`}
                    >
                      {data.demographics.genderDistribution.map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ),
                      )}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
