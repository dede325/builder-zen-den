import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useDoctorStore, Patient } from '@/store/doctor';
import {
  Users,
  Search,
  Filter,
  Eye,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  Activity,
  Heart,
  AlertTriangle,
  User,
  Plus,
  Edit,
  History
} from 'lucide-react';

export default function DoctorPatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const { user } = useAuthStore();
  const { patients, consultations, exams, fetchPatients, fetchConsultations, fetchExams, searchPatients } = useDoctorStore();

  useEffect(() => {
    if (user && user.role === 'doctor') {
      fetchPatients(user.id);
      fetchConsultations(user.id);
      fetchExams(user.id);
    }
  }, [user, fetchPatients, fetchConsultations, fetchExams]);

  // Filtrar pacientes
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchQuery === '' || 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.processNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || patient.clinicalStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Agrupar pacientes por status
  const groupedPatients = {
    all: filteredPatients,
    stable: filteredPatients.filter(p => p.clinicalStatus === 'stable'),
    monitoring: filteredPatients.filter(p => p.clinicalStatus === 'monitoring'),
    critical: filteredPatients.filter(p => p.clinicalStatus === 'critical'),
    recovered: filteredPatients.filter(p => p.clinicalStatus === 'recovered')
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      stable: { label: 'Estável', variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      monitoring: { label: 'Monitoramento', variant: 'default' as const, color: 'bg-yellow-100 text-yellow-800' },
      critical: { label: 'Crítico', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      recovered: { label: 'Recuperado', variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' }
    };

    return badges[status as keyof typeof badges] || { label: status, variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getPatientConsultations = (patientId: string) => {
    return consultations.filter(consult => consult.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getPatientExams = (patientId: string) => {
    return exams.filter(exam => exam.patientId === patientId)
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const PatientCard = ({ patient }: { patient: Patient }) => {
    const statusBadge = getStatusBadge(patient.clinicalStatus);
    const patientConsultations = getPatientConsultations(patient.id);
    const patientExams = getPatientExams(patient.id);
    const lastConsultation = patientConsultations[0];
    const pendingExams = patientExams.filter(exam => exam.status === 'requested' || exam.status === 'scheduled').length;

    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => {
          setSelectedPatient(patient);
          setIsDetailsDialogOpen(true);
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{patient.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Processo: {patient.processNumber}
                </p>
                {patient.birthDate && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {calculateAge(patient.birthDate)} anos
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={statusBadge.color}>
                {statusBadge.label}
              </Badge>
              {pendingExams > 0 && (
                <Badge variant="outline" className="text-xs">
                  {pendingExams} exame(s)
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-2">
            {patient.phone && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 mr-2" />
                <span>{patient.phone}</span>
              </div>
            )}
            
            {patient.email && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <span>{patient.email}</span>
              </div>
            )}

            {patient.insuranceProvider && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <FileText className="w-4 h-4 mr-2" />
                <span>{patient.insuranceProvider}</span>
              </div>
            )}

            {lastConsultation && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                <span>Última consulta: {formatDate(lastConsultation.date)}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {patientConsultations.length} consulta(s) • {patientExams.length} exame(s)
            </div>
            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
              <Eye className="w-4 h-4 mr-1" />
              Ver detalhes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meus Pacientes</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie e acompanhe seus pacientes atribuídos
          </p>
        </div>
        
        <Button className="bg-clinic-gradient hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Novo Paciente
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou número de processo..."
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
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="stable">Estável</SelectItem>
            <SelectItem value="monitoring">Monitoramento</SelectItem>
            <SelectItem value="critical">Crítico</SelectItem>
            <SelectItem value="recovered">Recuperado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {patients.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {groupedPatients.stable.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Estáveis</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {groupedPatients.monitoring.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Monitoramento</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {groupedPatients.critical.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Críticos</div>
          </CardContent>
        </Card>
      </div>

      {/* Patients Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            Todos ({groupedPatients.all.length})
          </TabsTrigger>
          <TabsTrigger value="critical">
            Críticos ({groupedPatients.critical.length})
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            Monitoramento ({groupedPatients.monitoring.length})
          </TabsTrigger>
          <TabsTrigger value="stable">
            Estáveis ({groupedPatients.stable.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {groupedPatients.all.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum paciente encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery ? 'Nenhum paciente corresponde à sua busca' : 'Você ainda não tem pacientes atribuídos'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groupedPatients.all.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          {groupedPatients.critical.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum paciente crítico
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ótimo! Todos os seus pacientes estão em condição estável
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groupedPatients.critical.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          {groupedPatients.monitoring.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum paciente em monitoramento
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Não há pacientes que requerem monitoramento especial no momento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groupedPatients.monitoring.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stable" className="space-y-4">
          {groupedPatients.stable.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum paciente estável
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Pacientes estáveis aparecerão aqui
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {groupedPatients.stable.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Patient Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPatient && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedPatient.name}</h3>
                    <p className="text-sm text-gray-500">Processo: {selectedPatient.processNumber}</p>
                  </div>
                  <Badge className={getStatusBadge(selectedPatient.clinicalStatus).color}>
                    {getStatusBadge(selectedPatient.clinicalStatus).label}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Patient Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedPatient.birthDate && (
                        <div>
                          <p className="text-sm font-medium">Data de Nascimento</p>
                          <p className="text-sm text-gray-600">
                            {formatDate(selectedPatient.birthDate)} ({calculateAge(selectedPatient.birthDate)} anos)
                          </p>
                        </div>
                      )}
                      
                      {selectedPatient.phone && (
                        <div>
                          <p className="text-sm font-medium">Telefone</p>
                          <p className="text-sm text-gray-600">{selectedPatient.phone}</p>
                        </div>
                      )}
                      
                      {selectedPatient.email && (
                        <div>
                          <p className="text-sm font-medium">E-mail</p>
                          <p className="text-sm text-gray-600">{selectedPatient.email}</p>
                        </div>
                      )}
                      
                      {selectedPatient.bloodType && (
                        <div>
                          <p className="text-sm font-medium">Tipo Sanguíneo</p>
                          <p className="text-sm text-gray-600">{selectedPatient.bloodType}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Informações Médicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedPatient.allergies && (
                        <div>
                          <p className="text-sm font-medium">Alergias</p>
                          <p className="text-sm text-gray-600">{selectedPatient.allergies}</p>
                        </div>
                      )}
                      
                      {selectedPatient.emergencyContact && (
                        <div>
                          <p className="text-sm font-medium">Contato de Emergência</p>
                          <p className="text-sm text-gray-600">{selectedPatient.emergencyContact}</p>
                        </div>
                      )}
                      
                      {selectedPatient.insuranceProvider && (
                        <div>
                          <p className="text-sm font-medium">Plano de Saúde</p>
                          <p className="text-sm text-gray-600">{selectedPatient.insuranceProvider}</p>
                        </div>
                      )}
                      
                      {selectedPatient.lastConsultation && (
                        <div>
                          <p className="text-sm font-medium">Última Consulta</p>
                          <p className="text-sm text-gray-600">{formatDate(selectedPatient.lastConsultation)}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Consultations and Exams */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Consultas Recentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getPatientConsultations(selectedPatient.id).slice(0, 3).map((consultation) => (
                        <div key={consultation.id} className="mb-4 p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">{formatDate(consultation.date)}</p>
                            <Badge variant="outline" className="text-xs">
                              {consultation.type === 'follow_up' ? 'Retorno' : 'Consulta'}
                            </Badge>
                          </div>
                          {consultation.chiefComplaint && (
                            <p className="text-sm text-gray-600 mb-1">{consultation.chiefComplaint}</p>
                          )}
                          {consultation.diagnosis && (
                            <p className="text-sm text-blue-600">Diagnóstico: {consultation.diagnosis}</p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Exames Recentes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getPatientExams(selectedPatient.id).slice(0, 3).map((exam) => (
                        <div key={exam.id} className="mb-4 p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">{exam.examType}</p>
                            <Badge variant="outline" className="text-xs">
                              {exam.status === 'completed' ? 'Concluído' : 'Pendente'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            Solicitado em {formatDate(exam.requestDate)}
                          </p>
                          {exam.interpretation && (
                            <p className="text-sm text-green-600 mt-1">{exam.interpretation}</p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Paciente
                  </Button>
                  <Button variant="outline">
                    <History className="w-4 h-4 mr-2" />
                    Histórico Completo
                  </Button>
                  <Button>
                    <Calendar className="w-4 h-4 mr-2" />
                    Nova Consulta
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
