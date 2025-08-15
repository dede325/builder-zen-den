import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  CheckCircle,
  X,
  Edit,
  Trash2,
  AlertCircle,
  Users,
  Stethoscope,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { format, addDays, isSameDay, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  workingHours: {
    start: string;
    end: string;
    days: number[]; // 0 = Sunday, 1 = Monday, etc.
  };
  consultationDuration: number; // in minutes
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  insurance?: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status:
    | "scheduled"
    | "confirmed"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "no_show";
  reason: string;
  notes?: string;
  room?: string;
  type: "consultation" | "follow_up" | "emergency" | "procedure";
  priority: "low" | "normal" | "high" | "urgent";
  reminderSent: boolean;
  createdAt: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: Appointment;
}

export default function AppointmentScheduler() {
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  // Mock data
  const [doctors] = useState<Doctor[]>([
    {
      id: "doc-1",
      name: "Dr. António Silva",
      specialty: "Cardiologia",
      workingHours: { start: "08:00", end: "17:00", days: [1, 2, 3, 4, 5] },
      consultationDuration: 30,
    },
    {
      id: "doc-2",
      name: "Dra. Maria Santos",
      specialty: "Pediatria",
      workingHours: { start: "09:00", end: "16:00", days: [1, 2, 3, 4, 5] },
      consultationDuration: 25,
    },
    {
      id: "doc-3",
      name: "Dr. João Mendes",
      specialty: "Dermatologia",
      workingHours: { start: "08:30", end: "17:30", days: [1, 2, 3, 4, 5, 6] },
      consultationDuration: 20,
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "apt-1",
      patientId: "pat-1",
      patientName: "Carlos Mendes",
      patientPhone: "+244 923 456 789",
      doctorId: "doc-1",
      doctorName: "Dr. António Silva",
      specialty: "Cardiologia",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "09:30",
      duration: 30,
      status: "confirmed",
      reason: "Consulta de rotina - checkup cardíaco",
      room: "Sala 105",
      type: "consultation",
      priority: "normal",
      reminderSent: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "apt-2",
      patientId: "pat-2",
      patientName: "Ana Costa",
      patientPhone: "+244 934 567 890",
      doctorId: "doc-2",
      doctorName: "Dra. Maria Santos",
      specialty: "Pediatria",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "10:30",
      endTime: "10:55",
      duration: 25,
      status: "scheduled",
      reason: "Vacinação infantil",
      room: "Sala 203",
      type: "procedure",
      priority: "normal",
      reminderSent: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    doctorId: "",
    date: format(selectedDate, "yyyy-MM-dd"),
    time: "",
    reason: "",
    notes: "",
    type: "consultation" as const,
    priority: "normal" as const,
  });

  // Generate time slots for selected doctor and date
  const generateTimeSlots = (doctorId: string, date: Date): TimeSlot[] => {
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!doctor) return [];

    const dayOfWeek = date.getDay();
    if (!doctor.workingHours.days.includes(dayOfWeek)) return [];

    const slots: TimeSlot[] = [];
    const startHour = parseInt(doctor.workingHours.start.split(":")[0]);
    const startMinute = parseInt(doctor.workingHours.start.split(":")[1]);
    const endHour = parseInt(doctor.workingHours.end.split(":")[0]);
    const endMinute = parseInt(doctor.workingHours.end.split(":")[1]);

    const currentTime = new Date(date);
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(endHour, endMinute, 0, 0);

    while (currentTime < endTime) {
      const timeString = format(currentTime, "HH:mm");
      const dateString = format(date, "yyyy-MM-dd");

      const existingAppointment = appointments.find(
        (apt) =>
          apt.doctorId === doctorId &&
          apt.date === dateString &&
          apt.startTime === timeString &&
          apt.status !== "cancelled",
      );

      slots.push({
        time: timeString,
        available: !existingAppointment,
        appointment: existingAppointment,
      });

      currentTime.setMinutes(
        currentTime.getMinutes() + doctor.consultationDuration,
      );
    }

    return slots;
  };

  const getTodaysAppointments = () => {
    const today = format(new Date(), "yyyy-MM-dd");
    return appointments.filter(
      (apt) => apt.date === today && apt.status !== "cancelled",
    );
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    let filtered = appointments.filter(
      (apt) => apt.date === dateString && apt.status !== "cancelled",
    );

    if (selectedDoctor !== "all") {
      filtered = filtered.filter((apt) => apt.doctorId === selectedDoctor);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return filtered.sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const handleCreateAppointment = async () => {
    if (
      !newAppointment.patientName ||
      !newAppointment.doctorId ||
      !newAppointment.time ||
      !newAppointment.reason
    ) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const doctor = doctors.find((d) => d.id === newAppointment.doctorId);
    if (!doctor) return;

    const startTime = new Date(`${newAppointment.date}T${newAppointment.time}`);
    const endTime = new Date(
      startTime.getTime() + doctor.consultationDuration * 60000,
    );

    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: `pat-${Date.now()}`,
      patientName: newAppointment.patientName,
      patientPhone: newAppointment.patientPhone,
      doctorId: newAppointment.doctorId,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: newAppointment.date,
      startTime: newAppointment.time,
      endTime: format(endTime, "HH:mm"),
      duration: doctor.consultationDuration,
      status: "scheduled",
      reason: newAppointment.reason,
      notes: newAppointment.notes,
      type: newAppointment.type,
      priority: newAppointment.priority,
      reminderSent: false,
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [...prev, appointment]);
    setShowNewAppointment(false);

    // Reset form
    setNewAppointment({
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      doctorId: "",
      date: format(selectedDate, "yyyy-MM-dd"),
      time: "",
      reason: "",
      notes: "",
      type: "consultation",
      priority: "normal",
    });
  };

  const handleUpdateAppointmentStatus = (
    appointmentId: string,
    status: Appointment["status"],
  ) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status } : apt)),
    );
  };

  const getStatusColor = (status: Appointment["status"]) => {
    const colors = {
      scheduled: "bg-blue-100 text-blue-800",
      confirmed: "bg-green-100 text-green-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-emerald-100 text-emerald-800",
      cancelled: "bg-red-100 text-red-800",
      no_show: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Appointment["priority"]) => {
    const colors = {
      low: "bg-gray-100 text-gray-600",
      normal: "bg-blue-100 text-blue-600",
      high: "bg-orange-100 text-orange-600",
      urgent: "bg-red-100 text-red-600",
    };
    return colors[priority];
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return "Hoje";
    if (isTomorrow(date)) return "Amanhã";
    return format(date, "dd MMM", { locale: ptBR });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Agendamento de Consultas</h2>
          <p className="text-muted-foreground">
            Gerencie consultas e visualize a agenda médica
          </p>
        </div>
        <Dialog open={showNewAppointment} onOpenChange={setShowNewAppointment}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agendar Nova Consulta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="patientName">Nome do Paciente *</Label>
                <Input
                  id="patientName"
                  value={newAppointment.patientName}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      patientName: e.target.value,
                    }))
                  }
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <Label htmlFor="patientPhone">Telefone *</Label>
                <Input
                  id="patientPhone"
                  value={newAppointment.patientPhone}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      patientPhone: e.target.value,
                    }))
                  }
                  placeholder="+244 923 456 789"
                />
              </div>

              <div>
                <Label htmlFor="doctorId">Médico *</Label>
                <Select
                  value={newAppointment.doctorId}
                  onValueChange={(value) =>
                    setNewAppointment((prev) => ({ ...prev, doctorId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o médico" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="time">Horário *</Label>
                <Select
                  value={newAppointment.time}
                  onValueChange={(value) =>
                    setNewAppointment((prev) => ({ ...prev, time: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {newAppointment.doctorId &&
                      generateTimeSlots(
                        newAppointment.doctorId,
                        new Date(newAppointment.date),
                      )
                        .filter((slot) => slot.available)
                        .map((slot) => (
                          <SelectItem key={slot.time} value={slot.time}>
                            {slot.time}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reason">Motivo da Consulta *</Label>
                <Textarea
                  id="reason"
                  value={newAppointment.reason}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Descreva o motivo da consulta"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={newAppointment.type}
                  onValueChange={(value: any) =>
                    setNewAppointment((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consulta</SelectItem>
                    <SelectItem value="follow_up">Retorno</SelectItem>
                    <SelectItem value="procedure">Procedimento</SelectItem>
                    <SelectItem value="emergency">Emergência</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select
                  value={newAppointment.priority}
                  onValueChange={(value: any) =>
                    setNewAppointment((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNewAppointment(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleCreateAppointment}>Agendar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por paciente, médico ou especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os médicos</SelectItem>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tabs
          value={viewMode}
          onValueChange={(value: any) => setViewMode(value)}
        >
          <TabsList>
            <TabsTrigger value="day">Dia</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="month">Mês</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border"
            />

            {/* Quick stats for selected date */}
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium">
                {getDateLabel(selectedDate)}
              </div>
              <div className="space-y-1">
                {getAppointmentsForDate(selectedDate).length > 0 ? (
                  <div className="text-sm text-muted-foreground">
                    {getAppointmentsForDate(selectedDate).length} consulta(s)
                    agendada(s)
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Nenhuma consulta agendada
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Consultas - {getDateLabel(selectedDate)}
              <Badge variant="outline">
                {getAppointmentsForDate(selectedDate).length} consultas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getAppointmentsForDate(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma consulta agendada para esta data</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setShowNewAppointment(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agendar Consulta
                  </Button>
                </div>
              ) : (
                getAppointmentsForDate(selectedDate).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="font-bold text-lg">
                          {appointment.startTime}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {appointment.duration}min
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium">
                            {appointment.patientName}
                          </h4>
                          <Badge
                            className={getPriorityColor(appointment.priority)}
                          >
                            {appointment.priority}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Stethoscope className="w-3 h-3" />
                            <span>
                              {appointment.doctorName} - {appointment.specialty}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 mt-1">
                            <Phone className="w-3 h-3" />
                            <span>{appointment.patientPhone}</span>
                          </div>
                          {appointment.room && (
                            <div className="flex items-center space-x-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>{appointment.room}</span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm mt-2">{appointment.reason}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status === "scheduled" && "Agendada"}
                        {appointment.status === "confirmed" && "Confirmada"}
                        {appointment.status === "in_progress" && "Em andamento"}
                        {appointment.status === "completed" && "Concluída"}
                        {appointment.status === "cancelled" && "Cancelada"}
                        {appointment.status === "no_show" && "Faltou"}
                      </Badge>

                      {appointment.status === "scheduled" && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateAppointmentStatus(
                                appointment.id,
                                "confirmed",
                              )
                            }
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateAppointmentStatus(
                                appointment.id,
                                "cancelled",
                              )
                            }
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}

                      {appointment.status === "confirmed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleUpdateAppointmentStatus(
                              appointment.id,
                              "in_progress",
                            )
                          }
                        >
                          Iniciar
                        </Button>
                      )}

                      {appointment.status === "in_progress" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            handleUpdateAppointmentStatus(
                              appointment.id,
                              "completed",
                            )
                          }
                        >
                          Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
