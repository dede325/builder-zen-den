import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Calendar, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Stethoscope,
  Image,
  FileIcon,
  X,
  Plus,
  Send,
  Save,
  Camera,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Exam {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  requestDate: string;
  collectionDate?: string;
  resultDate?: string;
  status: 'requested' | 'scheduled' | 'collected' | 'result_available' | 'delivered';
  priority: 'routine' | 'urgent' | 'emergency';
  requestingDoctor: string;
  laboratory?: string;
  results?: {
    text?: string;
    images?: string[];
    documents?: string[];
  };
  notes?: string;
  observations?: string;
}

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  type: 'image' | 'document';
}

const mockExams: Exam[] = [
  {
    id: 'ex_001',
    patientId: 'p_001',
    patientName: 'Maria Silva Santos',
    type: 'Hemograma Completo',
    requestDate: '2024-01-15',
    collectionDate: '2024-01-16',
    resultDate: '2024-01-17',
    status: 'result_available',
    priority: 'routine',
    requestingDoctor: 'Dr. João Carvalho',
    laboratory: 'Lab Central',
    results: {
      text: 'Hemoglobina: 12.5 g/dL (normal)\nHematócrito: 37% (normal)\nLeucócitos: 7.200/μL (normal)\nPlaquetas: 250.000/μL (normal)',
      documents: ['/results/hemograma_001.pdf']
    },
    notes: 'Resultados dentro dos parâmetros normais para a idade.',
    observations: 'Paciente em jejum de 12 horas.'
  },
  {
    id: 'ex_002',
    patientId: 'p_002',
    patientName: 'Carlos Oliveira',
    type: 'Eletrocardiograma',
    requestDate: '2024-01-14',
    collectionDate: '2024-01-15',
    status: 'collected',
    priority: 'urgent',
    requestingDoctor: 'Dr. Ana Costa',
    laboratory: 'Centro Cardio',
    observations: 'Paciente com histórico de arritmia.'
  },
  {
    id: 'ex_003',
    patientId: 'p_003',
    patientName: 'Joana Fernandes',
    type: 'Raio-X Tórax',
    requestDate: '2024-01-13',
    status: 'scheduled',
    priority: 'routine',
    requestingDoctor: 'Dr. Pedro Lima',
    laboratory: 'Imagem Total',
    observations: 'Suspeita de pneumonia.'
  }
];

interface ExamDetailsProps {
  exam: Exam;
  onClose: () => void;
  onStatusUpdate: (examId: string, status: Exam['status'], data?: any) => void;
}

function ExamDetails({ exam, onClose, onStatusUpdate }: ExamDetailsProps) {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState({
    text: exam.results?.text || '',
    images: exam.results?.images || [],
    documents: exam.results?.documents || []
  });
  const [notes, setNotes] = useState(exam.notes || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const statusConfig = {
    requested: { color: 'bg-gray-100 text-gray-800', label: 'Solicitado', icon: Clock },
    scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Agendado', icon: Calendar },
    collected: { color: 'bg-yellow-100 text-yellow-800', label: 'Coletado', icon: AlertCircle },
    result_available: { color: 'bg-green-100 text-green-800', label: 'Resultado Disponível', icon: CheckCircle },
    delivered: { color: 'bg-gray-100 text-gray-800', label: 'Entregue', icon: CheckCircle }
  };

  const priorityConfig = {
    routine: { color: 'bg-green-100 text-green-800', label: 'Rotina' },
    urgent: { color: 'bg-yellow-100 text-yellow-800', label: 'Urgente' },
    emergency: { color: 'bg-red-100 text-red-800', label: 'Emergência' }
  };

  const StatusIcon = statusConfig[exam.status].icon;

  const handleFileUpload = async (files: FileList, type: 'image' | 'document') => {
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Simular upload
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          success: true,
          url: `/uploads/${type}s/${Date.now()}_${file.name}`,
          type
        } as UploadResult;
      });

      const uploadResults = await Promise.all(uploadPromises);
      const successfulUploads = uploadResults.filter(r => r.success).map(r => r.url!);

      if (type === 'image') {
        setResults(prev => ({
          ...prev,
          images: [...prev.images, ...successfulUploads]
        }));
      } else {
        setResults(prev => ({
          ...prev,
          documents: [...prev.documents, ...successfulUploads]
        }));
      }
    } catch (error) {
      console.error('Erro no upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveResults = () => {
    onStatusUpdate(exam.id, 'result_available', {
      results,
      notes,
      resultDate: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  const removeFile = (url: string, type: 'images' | 'documents') => {
    setResults(prev => ({
      ...prev,
      [type]: prev[type].filter(file => file !== url)
    }));
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>{exam.type} - {exam.patientName}</span>
        </DialogTitle>
        <DialogDescription>
          Gerencie os resultados e status do exame
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Paciente</Label>
              <p className="text-lg flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{exam.patientName}</span>
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Tipo de Exame</Label>
              <p className="text-lg">{exam.type}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <div className="flex items-center space-x-2 mt-1">
                <StatusIcon className="h-4 w-4" />
                <Badge className={statusConfig[exam.status].color}>
                  {statusConfig[exam.status].label}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Prioridade</Label>
              <Badge className={priorityConfig[exam.priority].color}>
                {priorityConfig[exam.priority].label}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Data da Solicitação</Label>
              <p className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(exam.requestDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Médico Solicitante</Label>
              <p className="flex items-center space-x-2">
                <Stethoscope className="h-4 w-4" />
                <span>{exam.requestingDoctor}</span>
              </p>
            </div>
            {exam.laboratory && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Laboratório</Label>
                <p>{exam.laboratory}</p>
              </div>
            )}
            {exam.collectionDate && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Data da Coleta</Label>
                <p>{format(new Date(exam.collectionDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
            )}
          </div>

          {exam.observations && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Observações</Label>
              <p className="mt-1 p-3 bg-muted rounded-lg">{exam.observations}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div>
            <Label htmlFor="result-text">Resultado em Texto</Label>
            <Textarea
              id="result-text"
              value={results.text}
              onChange={(e) => setResults(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Digite o resultado do exame..."
              rows={6}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Imagens dos Resultados</Label>
            <div className="mt-2 space-y-2">
              {results.images.map((image, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2">
                    <Image className="h-4 w-4" />
                    <span className="text-sm">{image.split('/').pop()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(image, 'images')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Adicionar Imagens
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Documentos (PDF, etc.)</Label>
            <div className="mt-2 space-y-2">
              {results.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{doc.split('/').pop()}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(doc, 'documents')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar Documentos
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas do Médico</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione suas observações médicas..."
              rows={4}
              className="mt-1"
            />
          </div>

          {uploading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Fazendo upload dos arquivos...
              </AlertDescription>
            </Alert>
          )}

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'document')}
            className="hidden"
          />
          
          <input
            ref={imageInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'image')}
            className="hidden"
          />
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid gap-4">
            {exam.status === 'requested' && (
              <Button onClick={() => onStatusUpdate(exam.id, 'scheduled')} className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Marcar como Agendado
              </Button>
            )}
            
            {exam.status === 'scheduled' && (
              <Button onClick={() => onStatusUpdate(exam.id, 'collected')} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Marcar como Coletado
              </Button>
            )}
            
            {(exam.status === 'collected' || exam.status === 'result_available') && (
              <Button onClick={handleSaveResults} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Salvar Resultados
              </Button>
            )}
            
            {exam.status === 'result_available' && (
              <div className="space-y-2">
                <Button onClick={() => onStatusUpdate(exam.id, 'delivered')} variant="outline" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Marcar como Entregue
                </Button>
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório PDF
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Fechar
        </Button>
      </div>
    </DialogContent>
  );
}

export default function DoctorExamsPage() {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [filteredExams, setFilteredExams] = useState<Exam[]>(mockExams);
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    let filtered = exams;

    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(exam => exam.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(exam => exam.priority === priorityFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(exam => 
            new Date(exam.requestDate).toDateString() === today.toDateString()
          );
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(exam => 
            new Date(exam.requestDate) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(exam => 
            new Date(exam.requestDate) >= filterDate
          );
          break;
      }
    }

    setFilteredExams(filtered);
  }, [exams, searchTerm, statusFilter, priorityFilter, dateFilter]);

  const handleStatusUpdate = (examId: string, status: Exam['status'], data?: any) => {
    setExams(prev => prev.map(exam => 
      exam.id === examId ? { 
        ...exam, 
        status,
        ...data
      } : exam
    ));
  };

  const statusCounts = {
    total: exams.length,
    requested: exams.filter(e => e.status === 'requested').length,
    scheduled: exams.filter(e => e.status === 'scheduled').length,
    collected: exams.filter(e => e.status === 'collected').length,
    result_available: exams.filter(e => e.status === 'result_available').length,
    delivered: exams.filter(e => e.status === 'delivered').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Exames</h2>
          <p className="text-muted-foreground">
            Gerencie exames dos pacientes e faça upload de resultados
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Solicitar Exame
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <p className="text-xs text-muted-foreground">Exames</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Solicitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.requested}</div>
            <p className="text-xs text-muted-foreground">Aguardando</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Agendados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.scheduled}</div>
            <p className="text-xs text-muted-foreground">Programados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coletados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.collected}</div>
            <p className="text-xs text-muted-foreground">Processando</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prontos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.result_available}</div>
            <p className="text-xs text-muted-foreground">Disponíveis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entregues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.delivered}</div>
            <p className="text-xs text-muted-foreground">Finalizados</p>
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
                placeholder="Buscar por paciente ou exame..."
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
                <SelectItem value="requested">Solicitados</SelectItem>
                <SelectItem value="scheduled">Agendados</SelectItem>
                <SelectItem value="collected">Coletados</SelectItem>
                <SelectItem value="result_available">Resultado Disponível</SelectItem>
                <SelectItem value="delivered">Entregues</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="routine">Rotina</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="emergency">Emergência</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Última semana</SelectItem>
                <SelectItem value="month">Último mês</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Exames */}
      <Card>
        <CardHeader>
          <CardTitle>Exames ({filteredExams.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Tipo de Exame</TableHead>
                <TableHead>Data Solicitação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Laboratório</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((exam) => {
                const statusConfig = {
                  requested: { color: 'bg-gray-100 text-gray-800', label: 'Solicitado', icon: Clock },
                  scheduled: { color: 'bg-blue-100 text-blue-800', label: 'Agendado', icon: Calendar },
                  collected: { color: 'bg-yellow-100 text-yellow-800', label: 'Coletado', icon: AlertCircle },
                  result_available: { color: 'bg-green-100 text-green-800', label: 'Disponível', icon: CheckCircle },
                  delivered: { color: 'bg-gray-100 text-gray-800', label: 'Entregue', icon: CheckCircle }
                };

                const priorityConfig = {
                  routine: { color: 'bg-green-100 text-green-800', label: 'Rotina' },
                  urgent: { color: 'bg-yellow-100 text-yellow-800', label: 'Urgente' },
                  emergency: { color: 'bg-red-100 text-red-800', label: 'Emergência' }
                };

                const StatusIcon = statusConfig[exam.status].icon;

                return (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.patientName}</TableCell>
                    <TableCell>{exam.type}</TableCell>
                    <TableCell>
                      {format(new Date(exam.requestDate), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[exam.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[exam.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityConfig[exam.priority].color}>
                        {priorityConfig[exam.priority].label}
                      </Badge>
                    </TableCell>
                    <TableCell>{exam.laboratory || '-'}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedExam(exam)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Gerenciar
                          </Button>
                        </DialogTrigger>
                        {selectedExam && (
                          <ExamDetails
                            exam={selectedExam}
                            onClose={() => setSelectedExam(null)}
                            onStatusUpdate={handleStatusUpdate}
                          />
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
