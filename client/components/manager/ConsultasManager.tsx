import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Plus
} from 'lucide-react';
import { Consulta } from '@shared/manager-types';
import ManagerDataService from '@/services/managerData';
import { cn } from '@/lib/utils';

interface ConsultaDetailsProps {
  consulta: Consulta;
  onClose: () => void;
  onApprove: (id: string) => void;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
}

function ConsultaDetails({ consulta, onClose, onApprove, onCancel, onReschedule }: ConsultaDetailsProps) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Detalhes da Consulta</DialogTitle>
        <DialogDescription>
          Informações completas e ações disponíveis
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Paciente</label>
            <p className="text-lg">{consulta.pacienteNome}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Médico</label>
            <p className="text-lg">{consulta.medicoNome}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Especialidade</label>
            <p>{consulta.especialidade}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Data e Hora</label>
            <p>{new Date(`${consulta.data}T${consulta.hora}`).toLocaleString('pt-BR')}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Tipo</label>
            <p className="capitalize">{consulta.tipo}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Status</label>
            <Badge variant={
              consulta.status === 'agendada' ? 'secondary' :
              consulta.status === 'em_andamento' ? 'default' :
              consulta.status === 'concluida' ? 'outline' : 'destructive'
            }>
              {consulta.status === 'agendada' && 'Agendada'}
              {consulta.status === 'em_andamento' && 'Em Andamento'}
              {consulta.status === 'concluida' && 'Concluída'}
              {consulta.status === 'cancelada' && 'Cancelada'}
            </Badge>
          </div>
        </div>

        {consulta.observacoes && (
          <div>
            <label className="text-sm font-medium">Observações</label>
            <p className="mt-1 p-3 bg-muted rounded-lg">{consulta.observacoes}</p>
          </div>
        )}

        <div className="flex space-x-2">
          {consulta.status === 'agendada' && (
            <>
              <Button onClick={() => onApprove(consulta.id)} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar
              </Button>
              <Button variant="outline" onClick={() => onReschedule(consulta.id)} className="flex-1">
                <Calendar className="h-4 w-4 mr-2" />
                Reagendar
              </Button>
              <Button variant="destructive" onClick={() => onCancel(consulta.id)} className="flex-1">
                <XCircle className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </>
          )}
          {consulta.status === 'em_andamento' && (
            <Button onClick={() => onApprove(consulta.id)} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Finalizar Consulta
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

export function ConsultasManager() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [filteredConsultas, setFilteredConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [especialidadeFilter, setEspecialidadeFilter] = useState('all');
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null);

  useEffect(() => {
    const loadConsultas = async () => {
      try {
        const data = await ManagerDataService.getConsultas();
        setConsultas(data);
        setFilteredConsultas(data);
      } catch (error) {
        console.error('Erro ao carregar consultas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConsultas();
  }, []);

  useEffect(() => {
    let filtered = consultas;

    if (searchTerm) {
      filtered = filtered.filter(consulta =>
        consulta.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consulta.medicoNome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(consulta => consulta.status === statusFilter);
    }

    if (especialidadeFilter !== 'all') {
      filtered = filtered.filter(consulta => consulta.especialidade === especialidadeFilter);
    }

    setFilteredConsultas(filtered);
  }, [consultas, searchTerm, statusFilter, especialidadeFilter]);

  const handleApprove = (id: string) => {
    setConsultas(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'em_andamento' as const } : c
    ));
    setSelectedConsulta(null);
  };

  const handleCancel = (id: string) => {
    setConsultas(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'cancelada' as const } : c
    ));
    setSelectedConsulta(null);
  };

  const handleReschedule = (id: string) => {
    console.log('Reagendar consulta:', id);
    setSelectedConsulta(null);
  };

  const especialidades = Array.from(new Set(consultas.map(c => c.especialidade)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Consultas</h2>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as consultas médicas
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Consulta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{consultas.length}</div>
            <p className="text-xs text-muted-foreground">Consultas cadastradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {consultas.filter(c => c.status === 'agendada').length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando confirmação</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {consultas.filter(c => c.status === 'em_andamento').length}
            </div>
            <p className="text-xs text-muted-foreground">Acontecendo agora</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {consultas.filter(c => c.status === 'concluida').length}
            </div>
            <p className="text-xs text-muted-foreground">Finalizadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente ou médico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="agendada">Agendadas</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluídas</SelectItem>
                <SelectItem value="cancelada">Canceladas</SelectItem>
              </SelectContent>
            </Select>
            <Select value={especialidadeFilter} onValueChange={setEspecialidadeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as especialidades</SelectItem>
                {especialidades.map(esp => (
                  <SelectItem key={esp} value={esp}>{esp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Consultas Table */}
      <Card>
        <CardHeader>
          <CardTitle>Consultas ({filteredConsultas.length})</CardTitle>
          <CardDescription>
            Lista de todas as consultas com filtros aplicados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando consultas...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Médico</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredConsultas.map((consulta) => (
                  <TableRow key={consulta.id}>
                    <TableCell className="font-medium">{consulta.pacienteNome}</TableCell>
                    <TableCell>{consulta.medicoNome}</TableCell>
                    <TableCell>{consulta.especialidade}</TableCell>
                    <TableCell>
                      {new Date(`${consulta.data}T${consulta.hora}`).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="capitalize">{consulta.tipo}</TableCell>
                    <TableCell>
                      <Badge variant={
                        consulta.status === 'agendada' ? 'secondary' :
                        consulta.status === 'em_andamento' ? 'default' :
                        consulta.status === 'concluida' ? 'outline' : 'destructive'
                      }>
                        {consulta.status === 'agendada' && (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Agendada
                          </>
                        )}
                        {consulta.status === 'em_andamento' && 'Em Andamento'}
                        {consulta.status === 'concluida' && 'Concluída'}
                        {consulta.status === 'cancelada' && 'Cancelada'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedConsulta(consulta)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedConsulta && (
                            <ConsultaDetails
                              consulta={selectedConsulta}
                              onClose={() => setSelectedConsulta(null)}
                              onApprove={handleApprove}
                              onCancel={handleCancel}
                              onReschedule={handleReschedule}
                            />
                          )}
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
