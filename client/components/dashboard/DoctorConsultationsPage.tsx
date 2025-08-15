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
import { Calendar as CalendarIcon } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuthStore } from '@/store/auth';
import { useDoctorStore, DoctorConsultation } from '@/store/doctor';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Stethoscope,
  User,
  FileText,
  Save,
  X,
  Activity,
  Heart,
  AlertCircle,
  CheckCircle,
  CalendarDays,
  Timer
} from 'lucide-react';
import { format } from 'date-fns';

export default function DoctorConsultationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<DoctorConsultation | null>(null);
  
  const { user } = useAuthStore();
  const { 
    consultations, 
    patients, 
    fetchConsultations, 
    fetchPatients, 
    createConsultation, 
    updateConsultation,
    deleteConsultation 
  } = useDoctorStore();
  const { toast } = useToast();

  // Form data para nova consulta
  const [consultationForm, setConsultationForm] = useState({
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    duration: 30,
    type: 'consultation' as const,
    chiefComplaint: '',
    clinicalNotes: '',
    diagnosis: '',
    treatment: '',
    prescriptions: '',
    followUpDate: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: ''
    }
  });

  useEffect(() => {
    if (user && user.role === 'doctor') {
      fetchConsultations(user.id);
      fetchPatients(user.id);
    }
  }, [user, fetchConsultations, fetchPatients]);

  // Filtrar consultas
  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = 
      consultation.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.chiefComplaint?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultation.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || consultation.status === filterStatus;
    
    // Filtro por data selecionada
    const consultationDate = new Date(consultation.date);
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);
    consultationDate.setHours(0, 0, 0, 0);
    
    const matchesDate = viewMode === 'day' 
      ? consultationDate.getTime() === selectedDateOnly.getTime()
      : true; // Para week/month implementar lógica específica depois
    
    return matchesSearch && matchesFilter && matchesDate;
  });

  // Agrupar consultas por status
  const groupedConsultations = {
    today: consultations.filter(consult => {
      const today = new Date().toISOString().split('T')[0];
      return consult.date === today;
    }),
    scheduled: filteredConsultations.filter(consult => consult.status === 'scheduled'),
    completed: filteredConsultations.filter(consult => consult.status === 'completed'),
    cancelled: filteredConsultations.filter(consult => consult.status === 'cancelled')
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      await createConsultation({
        doctorId: user.id,
        patientId: consultationForm.patientId,
        patientName: consultationForm.patientName,
        date: consultationForm.date,
        time: consultationForm.time,
        duration: consultationForm.duration,
        status: 'scheduled',
        type: consultationForm.type,
        chiefComplaint: consultationForm.chiefComplaint,
        clinicalNotes: consultationForm.clinicalNotes,
        diagnosis: consultationForm.diagnosis,
        treatment: consultationForm.treatment,
        prescriptions: consultationForm.prescriptions,
        followUpDate: consultationForm.followUpDate,
        vitalSigns: consultationForm.vitalSigns
      });

      toast({
        title: 'Consulta criada com sucesso!',
        description: `Consulta com ${consultationForm.patientName} agendada para ${new Date(consultationForm.date).toLocaleDateString('pt-AO')} às ${consultationForm.time}.`,
      });

      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: 'Erro ao criar consulta',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedConsultation) return;

    try {
      await updateConsultation(selectedConsultation.id, {
        ...consultationForm,
        status: consultationForm.diagnosis ? 'completed' : selectedConsultation.status
      });

      toast({
        title: 'Consulta atualizada com sucesso!',
        description: 'As informações da consulta foram salvas.',
      });

      setIsEditDialogOpen(false);
      setSelectedConsultation(null);
      resetForm();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar consulta',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteConsultation = async (consultationId: string) => {
    try {
      await deleteConsultation(consultationId);
      
      toast({
        title: 'Consulta cancelada',
        description: 'A consulta foi cancelada com sucesso.',
      });
      
      setIsEditDialogOpen(false);
      setSelectedConsultation(null);
    } catch (error) {
      toast({
        title: 'Erro ao cancelar consulta',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setConsultationForm({
      patientId: '',
      patientName: '',
      date: '',
      time: '',
      duration: 30,
      type: 'consultation',
      chiefComplaint: '',
      clinicalNotes: '',
      diagnosis: '',
      treatment: '',
      prescriptions: '',
      followUpDate: '',
      vitalSigns: {
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        weight: '',
        height: ''
      }
    });
  };

  const openEditDialog = (consultation: DoctorConsultation) => {
    setSelectedConsultation(consultation);
    setConsultationForm({
      patientId: consultation.patientId,
      patientName: consultation.patientName,
      date: consultation.date,
      time: consultation.time,
      duration: consultation.duration,
      type: consultation.type,
      chiefComplaint: consultation.chiefComplaint || '',
      clinicalNotes: consultation.clinicalNotes || '',
      diagnosis: consultation.diagnosis || '',
      treatment: consultation.treatment || '',
      prescriptions: consultation.prescriptions || '',
      followUpDate: consultation.followUpDate || '',
      vitalSigns: consultation.vitalSigns || {
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        weight: '',
        height: ''
      }
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: { label: 'Agendada', variant: 'default' as const },
      in_progress: { label: 'Em Andamento', variant: 'secondary' as const },
      completed: { label: 'Concluída', variant: 'secondary' as const },
      cancelled: { label: 'Cancelada', variant: 'destructive' as const }
    };

    return badges[status as keyof typeof badges] || { label: status, variant: 'outline' as const };
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

  const ConsultationCard = ({ consultation }: { consultation: DoctorConsultation }) => {
    const badge = getStatusBadge(consultation.status);
    const isToday = consultation.date === new Date().toISOString().split('T')[0];
    const isPast = new Date(`${consultation.date}T${consultation.time}`) < new Date();

    return (
      <Card 
        className={`cursor-pointer hover:shadow-md transition-shadow ${
          isToday && consultation.status === 'scheduled' ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/10' : ''
        }`}
        onClick={() => openEditDialog(consultation)}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{consultation.patientName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {consultation.type === 'follow_up' ? 'Consulta de Retorno' : 'Consulta'}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge variant={badge.variant}>{badge.label}</Badge>
              {isToday && consultation.status === 'scheduled' && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Hoje
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span>{formatDate(consultation.date)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              <span>{formatTime(consultation.time)} ({consultation.duration} min)</span>
            </div>

            {consultation.chiefComplaint && (
              <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                <FileText className="w-4 h-4 mr-2 mt-0.5" />
                <span>{consultation.chiefComplaint}</span>
              </div>
            )}

            {consultation.diagnosis && (
              <div className="flex items-start text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5" />
                <span>Diagnóstico: {consultation.diagnosis}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {consultation.vitalSigns?.bloodPressure && (
                <span>PA: {consultation.vitalSigns.bloodPressure}</span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openEditDialog(consultation);
              }}
            >
              <Edit className="w-4 h-4 mr-1" />
              {consultation.status === 'scheduled' ? 'Atender' : 'Ver detalhes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ConsultationForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <form onSubmit={isEdit ? handleUpdateSubmit : handleCreateSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="patient">Paciente</Label>
          <Select
            value={consultationForm.patientId}
            onValueChange={(value) => {
              const patient = patients.find(p => p.id === value);
              setConsultationForm({ 
                ...consultationForm, 
                patientId: value,
                patientName: patient?.name || ''
              });
            }}
            disabled={isEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o paciente" />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name} - {patient.processNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="type">Tipo de Consulta</Label>
          <Select
            value={consultationForm.type}
            onValueChange={(value: 'consultation' | 'follow_up' | 'emergency' | 'procedure') => 
              setConsultationForm({ ...consultationForm, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">Consulta</SelectItem>
              <SelectItem value="follow_up">Retorno</SelectItem>
              <SelectItem value="emergency">Emergência</SelectItem>
              <SelectItem value="procedure">Procedimento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={consultationForm.date}
            onChange={(e) => setConsultationForm({ ...consultationForm, date: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="time">Horário</Label>
          <Input
            id="time"
            type="time"
            value={consultationForm.time}
            onChange={(e) => setConsultationForm({ ...consultationForm, time: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="chiefComplaint">Queixa Principal</Label>
        <Textarea
          id="chiefComplaint"
          value={consultationForm.chiefComplaint}
          onChange={(e) => setConsultationForm({ ...consultationForm, chiefComplaint: e.target.value })}
          placeholder="Descreva a queixa principal do paciente..."
          rows={3}
        />
      </div>

      {isEdit && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bloodPressure">Pressão Arterial</Label>
              <Input
                id="bloodPressure"
                value={consultationForm.vitalSigns.bloodPressure}
                onChange={(e) => setConsultationForm({ 
                  ...consultationForm, 
                  vitalSigns: { ...consultationForm.vitalSigns, bloodPressure: e.target.value }
                })}
                placeholder="120/80"
              />
            </div>
            
            <div>
              <Label htmlFor="heartRate">FC (bpm)</Label>
              <Input
                id="heartRate"
                type="number"
                value={consultationForm.vitalSigns.heartRate}
                onChange={(e) => setConsultationForm({ 
                  ...consultationForm, 
                  vitalSigns: { ...consultationForm.vitalSigns, heartRate: e.target.value }
                })}
                placeholder="72"
              />
            </div>
            
            <div>
              <Label htmlFor="temperature">Temperatura (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={consultationForm.vitalSigns.temperature}
                onChange={(e) => setConsultationForm({ 
                  ...consultationForm, 
                  vitalSigns: { ...consultationForm.vitalSigns, temperature: e.target.value }
                })}
                placeholder="36.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="clinicalNotes">Notas Clínicas</Label>
            <Textarea
              id="clinicalNotes"
              value={consultationForm.clinicalNotes}
              onChange={(e) => setConsultationForm({ ...consultationForm, clinicalNotes: e.target.value })}
              placeholder="Observações do exame físico, sintomas, etc..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Textarea
              id="diagnosis"
              value={consultationForm.diagnosis}
              onChange={(e) => setConsultationForm({ ...consultationForm, diagnosis: e.target.value })}
              placeholder="Diagnóstico médico..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="treatment">Tratamento</Label>
            <Textarea
              id="treatment"
              value={consultationForm.treatment}
              onChange={(e) => setConsultationForm({ ...consultationForm, treatment: e.target.value })}
              placeholder="Plano de tratamento..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="prescriptions">Prescrições</Label>
            <Textarea
              id="prescriptions"
              value={consultationForm.prescriptions}
              onChange={(e) => setConsultationForm({ ...consultationForm, prescriptions: e.target.value })}
              placeholder="Medicamentos prescritos..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="followUpDate">Data de Retorno</Label>
            <Input
              id="followUpDate"
              type="date"
              value={consultationForm.followUpDate}
              onChange={(e) => setConsultationForm({ ...consultationForm, followUpDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
              setSelectedConsultation(null);
            } else {
              setIsCreateDialogOpen(false);
            }
            resetForm();
          }}
        >
          Cancelar
        </Button>
        {isEdit && selectedConsultation?.status === 'scheduled' && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => handleDeleteConsultation(selectedConsultation.id)}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar Consulta
          </Button>
        )}
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          {isEdit ? 'Salvar' : 'Criar Consulta'}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agenda Médica</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas consultas e atendimentos
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-clinic-gradient hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agendar Nova Consulta</DialogTitle>
            </DialogHeader>
            <ConsultationForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] pl-3 text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarIcon
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <div className="flex space-x-1">
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Dia
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Semana
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Mês
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar consultas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
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
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{groupedConsultations.today.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Hoje</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{groupedConsultations.scheduled.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Agendadas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{groupedConsultations.completed.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Concluídas</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{groupedConsultations.cancelled.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Canceladas</div>
          </CardContent>
        </Card>
      </div>

      {/* Consultations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stethoscope className="w-5 h-5 mr-2" />
            Consultas - {format(selectedDate, "dd/MM/yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredConsultations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma consulta encontrada
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery ? 'Nenhuma consulta corresponde à sua busca' : 'Não há consultas agendadas para esta data'}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Agendar Nova Consulta
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredConsultations
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((consultation) => (
                  <ConsultationCard key={consultation.id} consultation={consultation} />
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Consultation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedConsultation?.status === 'scheduled' ? 'Atender Paciente' : 'Detalhes da Consulta'}
            </DialogTitle>
          </DialogHeader>
          <ConsultationForm isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
