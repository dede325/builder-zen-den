import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  FileText,
  Heart,
  Activity,
  Clock,
  Download,
  Eye,
  Plus,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Video,
  Upload,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { formatDate, formatMoney } from "@/lib/locale-angola-portal";
import { useAuthStore } from "@/store/auth-portal";

interface Appointment {
  id: string;
  date: Date;
  time: string;
  doctor: string;
  specialty: string;
  status: "agendado" | "confirmado" | "concluido" | "cancelado";
  location: string;
  type: "presencial" | "teleconsulta";
}

interface ExamResult {
  id: string;
  name: string;
  date: Date;
  doctor: string;
  status: "pendente" | "disponivel" | "revisao";
  category: string;
  priority: "normal" | "urgente";
  hasFile: boolean;
}

interface VitalSign {
  date: Date;
  weight: number;
  height: number;
  bloodPressure: { systolic: number; diastolic: number };
  heartRate: number;
  temperature: number;
}

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        date: new Date(2025, 0, 20),
        time: "14:30",
        doctor: "Dr. João Silva",
        specialty: "Cardiologia",
        status: "confirmado",
        location: "Consultório 301",
        type: "presencial",
      },
      {
        id: "2",
        date: new Date(2025, 0, 25),
        time: "09:00",
        doctor: "Dra. Maria Santos",
        specialty: "Dermatologia",
        status: "agendado",
        location: "Online",
        type: "teleconsulta",
      },
    ];

    const mockExams: ExamResult[] = [
      {
        id: "1",
        name: "Análises Sanguíneas Completas",
        date: new Date(2025, 0, 15),
        doctor: "Dr. João Silva",
        status: "disponivel",
        category: "Laboratório",
        priority: "normal",
        hasFile: true,
      },
      {
        id: "2",
        name: "Eletrocardiograma",
        date: new Date(2025, 0, 18),
        doctor: "Dr. João Silva",
        status: "revisao",
        category: "Cardiologia",
        priority: "urgente",
        hasFile: false,
      },
    ];

    const mockVitals: VitalSign[] = [
      {
        date: new Date(2025, 0, 15),
        weight: 75.5,
        height: 175,
        bloodPressure: { systolic: 120, diastolic: 80 },
        heartRate: 72,
        temperature: 36.5,
      },
    ];

    setAppointments(mockAppointments);
    setExamResults(mockExams);
    setVitalSigns(mockVitals);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmado":
      case "disponivel":
        return "bg-green-100 text-green-800 border-green-200";
      case "agendado":
      case "pendente":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "cancelado":
        return "bg-red-100 text-red-800 border-red-200";
      case "revisao":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const nextAppointment = appointments
    .filter((apt) => apt.date >= new Date() && apt.status !== "cancelado")
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  const bmi =
    vitalSigns.length > 0
      ? (
          vitalSigns[0].weight / Math.pow(vitalSigns[0].height / 100, 2)
        ).toFixed(1)
      : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-clinic-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-blue-50/50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Olá, {user?.name?.split(" ")[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie sua saúde de forma inteligente
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Agendar Consulta
            </Button>
            <Button className="bg-clinic-gradient flex items-center gap-2">
              <Video className="h-4 w-4" />
              Teleconsulta
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
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
                  <p className="text-sm font-medium text-gray-600">
                    Próxima Consulta
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {nextAppointment
                      ? formatDate(nextAppointment.date, "dayMonth")
                      : "--"}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Exames Pendentes
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {examResults.filter((e) => e.status === "pendente").length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">IMC Atual</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bmi || "--"}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pressão Arterial
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vitalSigns.length > 0
                      ? `${vitalSigns[0].bloodPressure.systolic}/${vitalSigns[0].bloodPressure.diastolic}`
                      : "--"}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Próximas Consultas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
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
                  {appointments.slice(0, 3).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-clinic-gradient rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {appointment.specialty}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {appointment.doctor}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(appointment.date, "short")} às{" "}
                            {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {appointment.type === "teleconsulta" ? (
                            <span className="flex items-center gap-1">
                              <Video className="h-3 w-3" />
                              Online
                            </span>
                          ) : (
                            appointment.location
                          )}
                        </p>
                      </div>
                    </div>
                  ))}

                  {appointments.length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Nenhuma consulta agendada</p>
                      <Button variant="outline" className="mt-4">
                        Agendar Primeira Consulta
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Resultados de Exames */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resultados de Exames
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {examResults.slice(0, 4).map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-gray-900">
                          {exam.name}
                        </h5>
                        <p className="text-xs text-gray-500">
                          {formatDate(exam.date, "short")}
                        </p>
                        <Badge
                          className={`${getStatusColor(exam.status)} text-xs mt-1`}
                        >
                          {exam.status}
                        </Badge>
                      </div>

                      <div className="flex gap-1">
                        {exam.hasFile && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button variant="outline" className="w-full text-sm">
                    Ver Todos os Exames
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Health Monitoring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Monitorização de Saúde
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vitalSigns.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">⚖️</span>
                    </div>
                    <p className="text-sm text-gray-600">Peso</p>
                    <p className="text-xl font-bold text-gray-900">
                      {vitalSigns[0].weight} kg
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">📏</span>
                    </div>
                    <p className="text-sm text-gray-600">Altura</p>
                    <p className="text-xl font-bold text-gray-900">
                      {vitalSigns[0].height} cm
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-sm text-gray-600">Freq. Cardíaca</p>
                    <p className="text-xl font-bold text-gray-900">
                      {vitalSigns[0].heartRate} bpm
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-2xl">🌡️</span>
                    </div>
                    <p className="text-sm text-gray-600">Temperatura</p>
                    <p className="text-xl font-bold text-gray-900">
                      {vitalSigns[0].temperature}°C
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum dado vital registado</p>
                  <Button variant="outline" className="mt-4">
                    Registar Sinais Vitais
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center gap-2"
          >
            <MessageSquare className="h-6 w-6" />
            <span className="text-sm">Chat Médico</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col items-center gap-2"
          >
            <Upload className="h-6 w-6" />
            <span className="text-sm">Upload Docs</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col items-center gap-2"
          >
            <User className="h-6 w-6" />
            <span className="text-sm">Perfil</span>
          </Button>

          <Button
            variant="outline"
            className="h-20 flex flex-col items-center gap-2"
          >
            <Phone className="h-6 w-6" />
            <span className="text-sm">Emergência</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
