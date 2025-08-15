import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Stethoscope,
  Image,
  FileIcon
} from 'lucide-react';
import { ExamePaciente, FiltroExames } from '@shared/patient-types';
import PatientDataService from '@/services/patientData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExameDetailsProps {
  exame: ExamePaciente;
  onClose: () => void;
}

function ExameDetails({ exame, onClose }: ExameDetailsProps) {
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);

  const handleDownloadPDF = async () => {
    if (!exame.resultado_url) return;
    
    setDownloadingPDF(true);
    try {
      // Simular download
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em uma implementação real, isso seria um link direto ou fetch da API
      const link = document.createElement('a');
      link.href = exame.resultado_url;
      link.download = `exame_${exame.tipo.replace(/\s+/g, '_')}_${exame.data}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao baixar PDF:', error);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const statusConfig = {
    pendente: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    coletado: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
    resultado_disponivel: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    entregue: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle }
  };

  const StatusIcon = statusConfig[exame.status].icon;

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>{exame.tipo}</span>
        </DialogTitle>
        <DialogDescription>
          Detalhes completos do exame e resultado
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Informações Básicas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Data do Exame</label>
            <p className="text-lg flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(exame.data), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <div className="flex items-center space-x-2 mt-1">
              <StatusIcon className="h-4 w-4" />
              <Badge className={statusConfig[exame.status].color}>
                {exame.status === 'pendente' && 'Pendente'}
                {exame.status === 'coletado' && 'Coletado'}
                {exame.status === 'resultado_disponivel' && 'Resultado Disponível'}
                {exame.status === 'entregue' && 'Entregue'}
              </Badge>
            </div>
          </div>
          <div className="col-span-2">
            <label className="text-sm font-medium text-muted-foreground">Médico Solicitante</label>
            <p className="flex items-center space-x-2">
              <Stethoscope className="h-4 w-4" />
              <span>{exame.medico_solicitante}</span>
            </p>
          </div>
        </div>

        {/* Observações */}
        {exame.observacoes && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Observações</label>
            <p className="mt-1 p-3 bg-muted rounded-lg">{exame.observacoes}</p>
          </div>
        )}

        {/* Resultado */}
        {(exame.status === 'resultado_disponivel' || exame.status === 'entregue') && (
          <Tabs defaultValue="texto" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="texto">Resultado em Texto</TabsTrigger>
              <TabsTrigger value="arquivo">Arquivo PDF</TabsTrigger>
            </TabsList>
            
            <TabsContent value="texto" className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Laudo Médico</label>
                <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm leading-relaxed">
                    {exame.resultado_texto || 'Resultado em texto não disponível.'}
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="arquivo" className="space-y-4">
              <div className="text-center py-8">
                <FileIcon className="h-16 w-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-lg font-medium mb-2">Resultado em PDF</h3>
                <p className="text-muted-foreground mb-4">
                  Baixe o arquivo PDF com o resultado completo do exame
                </p>
                {exame.resultado_url && (
                  <Button 
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                    className="w-full max-w-xs"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloadingPDF ? 'Baixando...' : 'Baixar PDF'}
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Ações */}
        <div className="flex space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Fechar
          </Button>
          {(exame.status === 'resultado_disponivel' || exame.status === 'entregue') && exame.resultado_url && (
            <Button onClick={handleDownloadPDF} disabled={downloadingPDF} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              {downloadingPDF ? 'Baixando...' : 'Baixar Resultado'}
            </Button>
          )}
        </div>
      </div>
    </DialogContent>
  );
}

export default function ExamesPage() {
  const [exames, setExames] = useState<ExamePaciente[]>([]);
  const [filteredExames, setFilteredExames] = useState<ExamePaciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExame, setSelectedExame] = useState<ExamePaciente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState<FiltroExames>({
    periodo: 'todos'
  });

  useEffect(() => {
    const loadExames = async () => {
      try {
        const data = await PatientDataService.getExames('pac_001', filtros);
        setExames(data);
        setFilteredExames(data);
      } catch (error) {
        console.error('Erro ao carregar exames:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExames();
  }, [filtros]);

  useEffect(() => {
    let filtered = exames;

    if (searchTerm) {
      filtered = filtered.filter(exame =>
        exame.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exame.medico_solicitante.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredExames(filtered);
  }, [exames, searchTerm]);

  const handleFiltroChange = (key: keyof FiltroExames, value: any) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const statusCounts = {
    total: exames.length,
    pendente: exames.filter(e => e.status === 'pendente').length,
    coletado: exames.filter(e => e.status === 'coletado').length,
    resultado_disponivel: exames.filter(e => e.status === 'resultado_disponivel').length,
    entregue: exames.filter(e => e.status === 'entregue').length
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meus Exames</h2>
          <p className="text-muted-foreground">
            Visualize e baixe os resultados dos seus exames médicos
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">Exames realizados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pendente}</div>
            <p className="text-xs text-muted-foreground">Aguardando coleta</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coletados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.coletado}</div>
            <p className="text-xs text-muted-foreground">Em processamento</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.resultado_disponivel}</div>
            <p className="text-xs text-muted-foreground">Prontos para download</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entregues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.entregue}</div>
            <p className="text-xs text-muted-foreground">Já visualizados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por tipo de exame..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select 
              value={filtros.periodo} 
              onValueChange={(value: FiltroExames['periodo']) => handleFiltroChange('periodo', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="todos">Todos os exames</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={filtros.status || 'todos'} 
              onValueChange={(value) => handleFiltroChange('status', value === 'todos' ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="coletado">Coletados</SelectItem>
                <SelectItem value="resultado_disponivel">Resultado Disponível</SelectItem>
                <SelectItem value="entregue">Entregues</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Exames */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExames.map((exame) => {
          const statusConfig = {
            pendente: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
            coletado: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: AlertCircle },
            resultado_disponivel: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
            entregue: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: CheckCircle }
          };

          const StatusIcon = statusConfig[exame.status].icon;

          return (
            <Card 
              key={exame.id} 
              className={cn(
                "hover:shadow-md transition-all duration-200 cursor-pointer",
                exame.status === 'resultado_disponivel' ? 'ring-2 ring-green-200' : ''
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{exame.tipo}</CardTitle>
                  <Badge className={cn("ml-2", statusConfig[exame.status].color)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {exame.status === 'pendente' && 'Pendente'}
                    {exame.status === 'coletado' && 'Coletado'}
                    {exame.status === 'resultado_disponivel' && 'Pronto'}
                    {exame.status === 'entregue' && 'Entregue'}
                  </Badge>
                </div>
                <CardDescription className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(exame.data), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Solicitado por:</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{exame.medico_solicitante}</p>
                </div>
                
                {exame.observacoes && (
                  <div>
                    <p className="text-sm font-medium">Observações:</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{exame.observacoes}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedExame(exame)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                    </DialogTrigger>
                    {selectedExame && (
                      <ExameDetails
                        exame={selectedExame}
                        onClose={() => setSelectedExame(null)}
                      />
                    )}
                  </Dialog>
                  
                  {(exame.status === 'resultado_disponivel' || exame.status === 'entregue') && exame.resultado_url && (
                    <Button size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredExames.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Nenhum exame encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm || filtros.status 
                ? 'Tente ajustar os filtros para ver mais resultados.'
                : 'Você ainda não possui exames cadastrados.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
