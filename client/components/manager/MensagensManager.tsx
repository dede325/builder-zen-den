import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  Search, 
  Plus,
  Send,
  Archive,
  Star,
  Clock,
  Eye
} from 'lucide-react';
import { MensagemInterna } from '@shared/manager-types';
import ManagerDataService from '@/services/managerData';
import { cn } from '@/lib/utils';

interface NovaMessagemProps {
  onSend: (mensagem: Partial<MensagemInterna>) => void;
  onClose: () => void;
}

function NovaMensagem({ onSend, onClose }: NovaMessagemProps) {
  const [formData, setFormData] = useState({
    destinatarioId: '',
    destinatarioNome: '',
    assunto: '',
    conteudo: '',
    prioridade: 'normal' as MensagemInterna['prioridade']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(formData);
    onClose();
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Nova Mensagem</DialogTitle>
        <DialogDescription>
          Envie uma mensagem para outro usuário do sistema
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="destinatario">Destinatário</Label>
            <Select 
              value={formData.destinatarioId} 
              onValueChange={(value) => {
                setFormData(prev => ({ 
                  ...prev, 
                  destinatarioId: value,
                  destinatarioNome: value === 'm1' ? 'Dr. João Santos' : 'Enfermeira Carolina'
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o destinatário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m1">Dr. João Santos</SelectItem>
                <SelectItem value="e1">Enfermeira Carolina</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select 
              value={formData.prioridade} 
              onValueChange={(value: MensagemInterna['prioridade']) => setFormData(prev => ({ ...prev, prioridade: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="assunto">Assunto</Label>
          <Input
            id="assunto"
            value={formData.assunto}
            onChange={(e) => setFormData(prev => ({ ...prev, assunto: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="conteudo">Mensagem</Label>
          <Textarea
            id="conteudo"
            rows={5}
            value={formData.conteudo}
            onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
            required
          />
        </div>
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1">
            <Send className="h-4 w-4 mr-2" />
            Enviar Mensagem
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

export function MensagensManager() {
  const [mensagens, setMensagens] = useState<MensagemInterna[]>([]);
  const [filteredMensagens, setFilteredMensagens] = useState<MensagemInterna[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'todas' | 'nao_lidas' | 'arquivadas'>('todas');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const loadMensagens = async () => {
      try {
        const data = await ManagerDataService.getMensagens();
        setMensagens(data);
        setFilteredMensagens(data);
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMensagens();
  }, []);

  useEffect(() => {
    let filtered = mensagens;

    if (searchTerm) {
      filtered = filtered.filter(msg =>
        msg.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.remetenteNome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter === 'nao_lidas') {
      filtered = filtered.filter(msg => !msg.lida);
    } else if (filter === 'arquivadas') {
      filtered = filtered.filter(msg => msg.arquivada);
    }

    setFilteredMensagens(filtered);
  }, [mensagens, searchTerm, filter]);

  const handleSendMensagem = (novaMensagem: Partial<MensagemInterna>) => {
    const mensagem: MensagemInterna = {
      id: Date.now().toString(),
      remetenteId: 'gestor1',
      remetenteNome: 'Carlos Silva',
      dataEnvio: new Date().toISOString(),
      lida: false,
      arquivada: false,
      ...novaMensagem
    } as MensagemInterna;

    setMensagens(prev => [mensagem, ...prev]);
  };

  const handleMarkAsRead = (id: string) => {
    setMensagens(prev => prev.map(m => 
      m.id === id ? { ...m, lida: true } : m
    ));
  };

  const handleArchive = (id: string) => {
    setMensagens(prev => prev.map(m => 
      m.id === id ? { ...m, arquivada: !m.arquivada } : m
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mensagens Internas</h2>
          <p className="text-muted-foreground">
            Comunicação interna entre membros da equipe
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Mensagem
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mensagens.length}</div>
            <p className="text-xs text-muted-foreground">Mensagens no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Não Lidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mensagens.filter(m => !m.lida).length}
            </div>
            <p className="text-xs text-muted-foreground">Aguardando leitura</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Arquivadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {mensagens.filter(m => m.arquivada).length}
            </div>
            <p className="text-xs text-muted-foreground">Mensagens arquivadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por assunto ou remetente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as mensagens</SelectItem>
                <SelectItem value="nao_lidas">Não lidas</SelectItem>
                <SelectItem value="arquivadas">Arquivadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Mensagens List */}
      <Card>
        <CardHeader>
          <CardTitle>Mensagens ({filteredMensagens.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando mensagens...</div>
          ) : (
            <div className="space-y-4">
              {filteredMensagens.map((mensagem) => (
                <div 
                  key={mensagem.id} 
                  className={cn(
                    "border rounded-lg p-4 hover:bg-muted/50 transition-colors",
                    !mensagem.lida && "bg-blue-50 dark:bg-blue-950/20 border-blue-200"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium">{mensagem.assunto}</h3>
                        <Badge variant={
                          mensagem.prioridade === 'urgente' ? 'destructive' :
                          mensagem.prioridade === 'alta' ? 'default' :
                          mensagem.prioridade === 'normal' ? 'secondary' : 'outline'
                        }>
                          {mensagem.prioridade}
                        </Badge>
                        {!mensagem.lida && (
                          <Badge variant="default" className="bg-blue-600">
                            Nova
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        De: {mensagem.remetenteNome} | Para: {mensagem.destinatarioNome}
                      </p>
                      <p className="text-sm line-clamp-2">{mensagem.conteudo}</p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(mensagem.dataEnvio).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!mensagem.lida && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(mensagem.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleArchive(mensagem.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <NovaMensagem
          onSend={handleSendMensagem}
          onClose={() => setShowForm(false)}
        />
      </Dialog>
    </div>
  );
}
