import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useAuthStore } from '@/store/auth';
import { useMedicalStore, Appointment } from '@/store/medical';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle,
  X,
  Edit,
  Stethoscope,
  User,
  Calendar as CalendarIcon,
  FileText
} from 'lucide-react';

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const { user } = useAuthStore();
  const { appointments, fetchAppointments, scheduleAppointment, cancelAppointment } = useMedicalStore();
  const { toast } = useToast();

  // Form data para nova consulta
  const [scheduleForm, setScheduleForm] = useState({
    specialty: '',
    doctorName: '',
    date: '',
    time: '',
    reason: '',
    symptoms: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchAppointments(user.id);
    }
  }, [user, fetchAppointments]);

  // Especialidades disponíveis
  const specialties = [
    'Cardiologia',
    'Pediatria',
    'Dermatologia',
    'Neurologia',
    'Cirurgia Geral',
    'Ginecologia-Obstetrícia',
    'Ortopedia',
    'Otorrinolaringologia',
    'Urologia',
    'Endocrinologia',
    'Gastroenterologia',
    'Medicina do Trabalho'
  ];

  // Médicos por especialidade (mock)
  const doctorsBySpecialty: { [key: string]: string[] } = {
    'Cardiologia': ['Dr. António Silva', 'Dra. Beatriz Cardoso'],
    'Pediatria': ['Dra. Maria Santos', 'Dr. Pedro Oliveira'],
    'Dermatologia': ['Dra. Ana Costa', 'Dr. Paulo Martins'],
    'Neurologia': ['Dr. Fernando Dias', 'Dra. Cristina Rodrigues'],
    'Cirurgia Geral': ['Dr. João Mendes', 'Dra. Fernanda Alves'],
    'Ginecologia-Obstetrícia': ['Dra. Isabel Carvalho', 'Dra. Mariana Lopes'],
    'Ortopedia': ['Dr. Ricardo Pereira', 'Dra. Sónia Ramos'],
    'Otorrinolaringologia': ['Dr. Manuel Castro', 'Dra. Patrícia Moreira'],
    'Urologia': ['Dr. Henrique Viana', 'Dr. Gabriel Monteiro'],
    'Endocrinologia': ['Dra. Helena Correia', 'Dr. Rui Barbosa'],
    'Gastroenterologia': ['Dr. Vítor Almeida', 'Dra. Susana Pinto'],
    'Medicina do Trabalho': ['Dr. Luís Tavares', 'Dra. Mónica Bastos']
  };

  // Filtrar consultas
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.reason?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Agrupar consultas por status
  const groupedAppointments = {
    upcoming: filteredAppointments.filter(apt => 
      apt.status === 'scheduled' && new Date(`${apt.date}T${apt.time}`) >= new Date()
    ),
    past: filteredAppointments.filter(apt => 
      apt.status === 'completed' || (apt.status === 'scheduled' && new Date(`${apt.date}T${apt.time}`) < new Date())
    ),
    cancelled: filteredAppointments.filter(apt => apt.status === 'cancelled')
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      await scheduleAppointment({
        patientId: user.id,
        doctorName: scheduleForm.doctorName,
        specialty: scheduleForm.specialty,
        date: scheduleForm.date,
        time: scheduleForm.time,
        duration: 30,
        status: 'scheduled',
        type: 'consultation',
        reason: scheduleForm.reason,
        symptoms: scheduleForm.symptoms,
        notes: scheduleForm.notes,
        paymentStatus: 'pending',
        paymentAmount: 15000
      });

      toast({
        title: 'Consulta agendada com sucesso!',
        description: `Sua consulta com ${scheduleForm.doctorName} foi agendada para ${new Date(scheduleForm.date).toLocaleDateString('pt-AO')} às ${scheduleForm.time}.`,
      });

      setIsScheduleDialogOpen(false);
      setScheduleForm({
        specialty: '',
        doctorName: '',
        date: '',
        time: '',
        reason: '',
        symptoms: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: 'Erro ao agendar consulta',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      await cancelAppointment(appointmentId, 'Cancelado pelo paciente');
      
      toast({
        title: 'Consulta cancelada',
        description: 'Sua consulta foi cancelada com sucesso.',
      });
      
      setIsDetailsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Erro ao cancelar consulta',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: { label: 'Agendada', variant: 'default' as const },
      confirmed: { label: 'Confirmada', variant: 'default' as const },
      in_progress: { label: 'Em Andamento', variant: 'secondary' as const },
      completed: { label: 'Concluída', variant: 'secondary' as const },
      cancelled: { label: 'Cancelada', variant: 'destructive' as const },
      no_show: { label: 'Não Compareceu', variant: 'destructive' as const }
    };

    const badge = badges[status as keyof typeof badges];
    return badge || { label: status, variant: 'outline' as const };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const badge = getStatusBadge(appointment.status);
    const isPast = new Date(`${appointment.date}T${appointment.time}`) < new Date();
    const canCancel = appointment.status === 'scheduled' && !isPast;

    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => {
          setSelectedAppointment(appointment);
          setIsDetailsDialogOpen(true);
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.specialty}</p>
              </div>
            </div>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              <span>{formatTime(appointment.time)} ({appointment.duration} min)</span>
            </div>

            {appointment.location && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{appointment.location}</span>
              </div>
            )}

            {appointment.reason && (
              <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                <FileText className="w-4 h-4 mr-2 mt-0.5" />
                <span>{appointment.reason}</span>
              </div>
            )}
          </div>

          {canCancel && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelAppointment(appointment.id);
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Consultas</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerencie seus agendamentos médicos</p>
        </div>
        
        <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-clinic-gradient hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Agendar Consulta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Agendar Nova Consulta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="specialty">Especialidade</Label>
                <Select
                  value={scheduleForm.specialty}
                  onValueChange={(value) => {
                    setScheduleForm({ 
                      ...scheduleForm, 
                      specialty: value,
                      doctorName: '' // Reset doctor when specialty changes
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {scheduleForm.specialty && (
                <div>
                  <Label htmlFor="doctor">Médico</Label>
                  <Select
                    value={scheduleForm.doctorName}
                    onValueChange={(value) => setScheduleForm({ ...scheduleForm, doctorName: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctorsBySpecialty[scheduleForm.specialty]?.map((doctor) => (
                        <SelectItem key={doctor} value={doctor}>
                          {doctor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="time">Horário</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Motivo da Consulta</Label>
                <Input
                  id="reason"
                  value={scheduleForm.reason}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, reason: e.target.value })}
                  placeholder="Ex: Dor no peito, check-up..."
                />
              </div>

              <div>
                <Label htmlFor="symptoms">Sintomas (opcional)</Label>
                <Textarea
                  id="symptoms"
                  value={scheduleForm.symptoms}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, symptoms: e.target.value })}
                  placeholder="Descreva os sintomas..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsScheduleDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Agendar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por médico, especialidade ou motivo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="scheduled">Agendadas</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointments Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            Próximas ({groupedAppointments.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Anteriores ({groupedAppointments.past.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Canceladas ({groupedAppointments.cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {groupedAppointments.upcoming.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhuma consulta agendada
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Agende sua próxima consulta para cuidar da sua saúde
                </p>
                <Button onClick={() => setIsScheduleDialogOpen(true)}>
                  Agendar Consulta
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groupedAppointments.upcoming.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {groupedAppointments.past.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhuma consulta anterior
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Suas consultas anteriores aparecerão aqui
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groupedAppointments.past.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {groupedAppointments.cancelled.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhuma consulta cancelada
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ótimo! Você não tem consultas canceladas
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groupedAppointments.cancelled.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes da Consulta</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{selectedAppointment.doctorName}</h3>
                  <Badge variant={getStatusBadge(selectedAppointment.status).variant}>
                    {getStatusBadge(selectedAppointment.status).label}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p><strong>Especialidade:</strong> {selectedAppointment.specialty}</p>
                  <p><strong>Data:</strong> {formatDate(selectedAppointment.date)}</p>
                  <p><strong>Horário:</strong> {formatTime(selectedAppointment.time)}</p>
                  <p><strong>Duração:</strong> {selectedAppointment.duration} minutos</p>
                  {selectedAppointment.location && (
                    <p><strong>Local:</strong> {selectedAppointment.location}</p>
                  )}
                  {selectedAppointment.reason && (
                    <p><strong>Motivo:</strong> {selectedAppointment.reason}</p>
                  )}
                  {selectedAppointment.symptoms && (
                    <p><strong>Sintomas:</strong> {selectedAppointment.symptoms}</p>
                  )}
                  {selectedAppointment.doctorNotes && (
                    <p><strong>Observações do Médico:</strong> {selectedAppointment.doctorNotes}</p>
                  )}
                </div>

                {selectedAppointment.status === 'scheduled' && 
                 new Date(`${selectedAppointment.date}T${selectedAppointment.time}`) >= new Date() && (
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => handleCancelAppointment(selectedAppointment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Cancelar Consulta
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
