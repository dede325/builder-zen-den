import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  FileText,
  Heart,
  Activity,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Plus,
} from "lucide-react";

// Mock data for demonstration
const statsCards = [
  {
    title: "Total de Pacientes",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Consultas Hoje",
    value: "34",
    change: "+5%",
    trend: "up",
    icon: Calendar,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Exames Pendentes",
    value: "89",
    change: "-8%",
    trend: "down",
    icon: FileText,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    title: "Taxa de Satisfação",
    value: "98.5%",
    change: "+2%",
    trend: "up",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "appointment",
    title: "Nova consulta agendada",
    description: "Maria Santos - Cardiologia",
    time: "há 5 min",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "exam",
    title: "Resultado de exame disponível",
    description: "João Silva - Análises Sanguíneas",
    time: "há 15 min",
    icon: FileText,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "alert",
    title: "Medicamento em falta",
    description: "Paracetamol 500mg - Estoque baixo",
    time: "há 30 min",
    icon: AlertCircle,
    color: "text-orange-600",
  },
  {
    id: 4,
    type: "success",
    title: "Backup realizado com sucesso",
    description: "Dados sincronizados às 14:00",
    time: "há 1h",
    icon: CheckCircle,
    color: "text-green-600",
  },
];

const upcomingAppointments = [
  {
    id: 1,
    patient: "Ana Costa",
    doctor: "Dr. João Silva",
    time: "09:00",
    type: "Consulta",
    status: "confirmado",
  },
  {
    id: 2,
    patient: "Carlos Santos",
    doctor: "Dra. Maria Fernandes",
    time: "10:30",
    type: "Retorno",
    status: "pendente",
  },
  {
    id: 3,
    patient: "Sofia Mendes",
    doctor: "Dr. Paulo Oliveira",
    time: "14:00",
    type: "Exame",
    status: "confirmado",
  },
];

export default function DashboardExample() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Visão Geral
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Acompanhe o desempenho da clínica em tempo real
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Relatório
          </Button>
          <Button className="bg-clinic-gradient flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nova Consulta
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

          return (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendIcon
                        className={`h-4 w-4 mr-1 ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">
                        vs. mês anterior
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
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
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm`}
                      >
                        <Icon className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center mt-2">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">
                            {activity.time}
                          </span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Próximas Consultas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {appointment.time}
                      </span>
                      <Badge
                        variant={
                          appointment.status === "confirmado"
                            ? "default"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                      {appointment.patient}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {appointment.doctor}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {appointment.type}
                    </p>
                  </div>
                ))}

                <Button variant="outline" className="w-full text-sm mt-4">
                  Ver Todas as Consultas
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métricas de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Taxa de Ocupação
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    85%
                  </span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-gray-500">Meta: 80%</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Tempo Médio de Espera
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    12 min
                  </span>
                </div>
                <Progress value={60} className="h-2" />
                <p className="text-xs text-gray-500">Meta: 15 min</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Satisfação do Cliente
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    98.5%
                  </span>
                </div>
                <Progress value={98.5} className="h-2" />
                <p className="text-xs text-gray-500">Meta: 95%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="text-center">
          <CardContent className="p-6">
            <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Localização
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Av. 21 de Janeiro, Nº 351
              <br />
              Benfica, Luanda, Angola
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Contacto
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              +244 222 123 456
              <br />
              +244 923 456 789
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <Mail className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              E-mail
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              info@clinicabemcuidar.ao
              <br />
              contato@clinicabemcuidar.ao
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
