import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Upload, 
  CheckCircle, 
  Clock,
  Plus,
  Calendar
} from 'lucide-react';
import { Exame } from '@shared/manager-types';
import ManagerDataService from '@/services/managerData';
import { cn } from '@/lib/utils';

interface ExameDetailsProps {
  exame: Exame;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Exame['status']) => void;
}

function ExameDetails({ exame, onClose, onUpdateStatus }: ExameDetailsProps) {
  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Detalhes do Exame</DialogTitle>
        <DialogDescription>
          Informações completas e ações disponíveis
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Paciente</label>
            <p className="text-lg">{exame.pacienteNome}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Médico Solicitante</label>
            <p className="text-lg">{exame.medicoSolicitante}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Tipo de Exame</label>
            <p>{exame.tipoExame}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Data da Coleta</label>
            <p>{new Date(exame.dataColeta).toLocaleDateString('pt-BR')}</p>
          </div>
          {exame.dataResultado && (
            <div>
              <label className="text-sm font-medium">Data do Resultado</label>
              <p>{new Date(exame.dataResultado).toLocaleDateString('pt-BR')}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Status</label>
            <Badge variant={
              exame.status === 'pendente' ? 'secondary' :
              exame.status === 'coletado' ? 'default' :
              exame.status === 'resultado_disponivel' ? 'outline' : 'destructive'
            }>
              {exame.status === 'pendente' && 'Pendente'}
              {exame.status === 'coletado' && 'Coletado'}
              {exame.status === 'resultado_disponivel' && 'Resultado Disponível'}
              {exame.status === 'entregue' && 'Entregue'}
            </Badge>
          </div>
        </div>

        {exame.observacoes && (
          <div>
            <label className="text-sm font-medium">Observações</label>
            <p className="mt-1 p-3 bg-muted rounded-lg">{exame.observacoes}</p>
          </div>
        )}

        <div className="flex space-x-2">
          {exame.status === 'pendente' && (
            <Button onClick={() => onUpdateStatus(exame.id, 'coletado')} className="flex-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar como Coletado
            </Button>
          )}
          {exame.status === 'coletado' && (
            <Button onClick={() => onUpdateStatus(exame.id, 'resultado_disponivel')} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Disponibilizar Resultado
            </Button>
          )}
          {exame.status === 'resultado_disponivel' && (
            <>
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={() => onUpdateStatus(exame.id, 'entregue')} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Entregue
              </Button>
            </>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

export function ExamesManager() {
  const [exames, setExames] = useState<Exame[]>([]);
  const [filteredExames, setFilteredExames] = useState<Exame[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tipoFilter, setTipoFilter] = useState('all');
  const [selectedExame, setSelectedExame] = useState<Exame | null>(null);

  useEffect(() => {
    const loadExames = async () => {
      try {
        const data = await ManagerDataService.getExames();
        setExames(data);
        setFilteredExames(data);
      } catch (error) {
        console.error('Erro ao carregar exames:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExames();
  }, []);

  useEffect(() => {
    let filtered = exames;

    if (searchTerm) {
      filtered = filtered.filter(exame =>
        exame.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exame.medicoSolicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exame.tipoExame.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(exame => exame.status === statusFilter);
    }

    if (tipoFilter !== 'all') {
      filtered = filtered.filter(exame => exame.tipoExame === tipoFilter);
    }

    setFilteredExames(filtered);
  }, [exames, searchTerm, statusFilter, tipoFilter]);

  const handleUpdateStatus = (id: string, status: Exame['status']) => {
    setExames(prev => prev.map(e => 
      e.id === id ? { 
        ...e, 
        status,
        dataResultado: status === 'resultado_disponivel' ? new Date().toISOString().split('T')[0] : e.dataResultado
      } : e
    ));
    setSelectedExame(null);
  };

  const tiposExame = Array.from(new Set(exames.map(e => e.tipoExame)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Exames</h2>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todos os exames laboratoriais
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Exame
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{exames.length}</div>
            <p className="text-xs text-muted-foreground">Exames cadastrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {exames.filter(e => e.status === 'pendente').length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando coleta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coletados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {exames.filter(e => e.status === 'coletado').length}
            </div>
            <p className="text-xs text-muted-foreground">Processando resultado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prontos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {exames.filter(e => e.status === 'resultado_disponivel').length}
            </div>
            <p className="text-xs text-muted-foreground">Resultado disponível</p>
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
                placeholder="Buscar por paciente, médico ou exame..."
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
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="coletado">Coletados</SelectItem>
                <SelectItem value="resultado_disponivel">Resultado Disponível</SelectItem>
                <SelectItem value="entregue">Entregues</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Exame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {tiposExame.map(tipo => (
                  <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Exames Table */}
      <Card>
        <CardHeader>
          <CardTitle>Exames ({filteredExames.length})</CardTitle>
          <CardDescription>
            Lista de todos os exames com filtros aplicados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando exames...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Tipo de Exame</TableHead>
                  <TableHead>Médico Solicitante</TableHead>
                  <TableHead>Data Coleta</TableHead>
                  <TableHead>Data Resultado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExames.map((exame) => (
                  <TableRow key={exame.id}>
                    <TableCell className="font-medium">{exame.pacienteNome}</TableCell>
                    <TableCell>{exame.tipoExame}</TableCell>
                    <TableCell>{exame.medicoSolicitante}</TableCell>
                    <TableCell>
                      {new Date(exame.dataColeta).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {exame.dataResultado 
                        ? new Date(exame.dataResultado).toLocaleDateString('pt-BR')
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        exame.status === 'pendente' ? 'secondary' :
                        exame.status === 'coletado' ? 'default' :
                        exame.status === 'resultado_disponivel' ? 'outline' : 'destructive'
                      }>
                        {exame.status === 'pendente' && (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Pendente
                          </>
                        )}
                        {exame.status === 'coletado' && 'Coletado'}
                        {exame.status === 'resultado_disponivel' && 'Resultado Disponível'}
                        {exame.status === 'entregue' && 'Entregue'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedExame(exame)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          {selectedExame && (
                            <ExameDetails
                              exame={selectedExame}
                              onClose={() => setSelectedExame(null)}
                              onUpdateStatus={handleUpdateStatus}
                            />
                          )}
                        </Dialog>
                        {exame.status === 'resultado_disponivel' && (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
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
