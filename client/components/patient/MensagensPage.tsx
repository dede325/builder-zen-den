import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Paperclip,
  Smile,
  CheckCheck,
  Check,
  Circle,
  MessageSquare,
  Stethoscope,
  UserNurse,
  Users
} from 'lucide-react';
import { ContatoChat, Mensagem } from '@shared/patient-types';
import PatientDataService from '@/services/patientData';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function formatMessageTime(dateString: string) {
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return 'Ontem';
  } else {
    return format(date, 'dd/MM', { locale: ptBR });
  }
}

function getStatusIcon(tipo: ContatoChat['tipo']) {
  switch (tipo) {
    case 'medico':
      return <Stethoscope className="h-4 w-4" />;
    case 'enfermagem':
      return <UserNurse className="h-4 w-4" />;
    case 'secretaria':
      return <Users className="h-4 w-4" />;
    default:
      return <Circle className="h-4 w-4" />;
  }
}

function getStatusColor(status: ContatoChat['status']) {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'ocupado':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
}

interface ChatHeaderProps {
  contato: ContatoChat;
}

function ChatHeader({ contato }: ChatHeaderProps) {
  const StatusIcon = getStatusIcon(contato.tipo);
  
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={contato.foto_url} />
            <AvatarFallback>
              {contato.nome.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
            getStatusColor(contato.status)
          )} />
        </div>
        <div>
          <h3 className="font-medium">{contato.nome}</h3>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            {StatusIcon}
            <span className="capitalize">{contato.tipo}</span>
            {contato.especialidade && (
              <>
                <span>•</span>
                <span>{contato.especialidade}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface ChatMessagesProps {
  mensagens: Mensagem[];
  currentUserId: string;
}

function ChatMessages({ mensagens, currentUserId }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4">
        {mensagens.map((mensagem, index) => {
          const isCurrentUser = mensagem.remetente_id === currentUserId;
          const showDate = index === 0 || 
            new Date(mensagem.enviado_em).toDateString() !== 
            new Date(mensagens[index - 1].enviado_em).toDateString();

          return (
            <div key={mensagem.id}>
              {showDate && (
                <div className="text-center my-4">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {format(new Date(mensagem.enviado_em), "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
              )}
              
              <div className={cn(
                "flex",
                isCurrentUser ? "justify-end" : "justify-start"
              )}>
                <div className={cn(
                  "max-w-[70%] rounded-lg px-3 py-2 shadow-sm",
                  isCurrentUser 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white border rounded-bl-none"
                )}>
                  {!isCurrentUser && (
                    <p className="text-xs font-medium mb-1 text-blue-600">
                      {mensagem.remetente_nome}
                    </p>
                  )}
                  <p className="text-sm leading-relaxed">{mensagem.texto}</p>
                  <div className={cn(
                    "flex items-center justify-end space-x-1 mt-1",
                    isCurrentUser ? "text-blue-100" : "text-muted-foreground"
                  )}>
                    <span className="text-xs">
                      {format(new Date(mensagem.enviado_em), 'HH:mm')}
                    </span>
                    {isCurrentUser && (
                      mensagem.lido ? (
                        <CheckCheck className="h-3 w-3 text-blue-200" />
                      ) : (
                        <Check className="h-3 w-3 text-blue-200" />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

interface ChatInputProps {
  onSendMessage: (texto: string) => void;
  disabled?: boolean;
}

function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mensagem.trim() && !disabled) {
      onSendMessage(mensagem.trim());
      setMensagem('');
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Button type="button" variant="ghost" size="sm">
          <Paperclip className="h-4 w-4" />
        </Button>
        <div className="flex-1 relative">
          <Input
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={disabled}
            className="pr-10"
          />
          <Button type="button" variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2">
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        <Button type="submit" disabled={!mensagem.trim() || disabled}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

export default function MensagensPage() {
  const [contatos, setContatos] = useState<ContatoChat[]>([]);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [contatoAtivo, setContatoAtivo] = useState<ContatoChat | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  const currentUserId = 'pac_001';

  useEffect(() => {
    const loadContatos = async () => {
      try {
        const data = await PatientDataService.getContatos(currentUserId);
        setContatos(data);
        if (data.length > 0 && !contatoAtivo) {
          setContatoAtivo(data[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar contatos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContatos();
  }, []);

  useEffect(() => {
    const loadMensagens = async () => {
      if (!contatoAtivo) return;
      
      try {
        const conversaId = `conv_${contatoAtivo.id}`;
        const data = await PatientDataService.getMensagens(conversaId);
        setMensagens(data);
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    };

    loadMensagens();
  }, [contatoAtivo]);

  useEffect(() => {
    // Simular WebSocket - receber mensagens em tempo real
    const handleNovaMensagem = (novaMensagem: Mensagem) => {
      setMensagens(prev => [...prev, novaMensagem]);
      
      // Atualizar contador de mensagens não lidas
      setContatos(prev => prev.map(contato => 
        contato.id === novaMensagem.remetente_id 
          ? { 
              ...contato, 
              mensagens_nao_lidas: contato.mensagens_nao_lidas + 1,
              ultima_mensagem: novaMensagem.texto,
              ultima_atividade: novaMensagem.enviado_em
            }
          : contato
      ));
    };

    PatientDataService.onNovaMensagem(handleNovaMensagem);
  }, []);

  const handleSendMessage = async (texto: string) => {
    if (!contatoAtivo) return;
    
    setSendingMessage(true);
    try {
      const conversaId = `conv_${contatoAtivo.id}`;
      const novaMensagem = await PatientDataService.enviarMensagem(conversaId, texto);
      setMensagens(prev => [...prev, novaMensagem]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSelectContato = (contato: ContatoChat) => {
    setContatoAtivo(contato);
    
    // Marcar mensagens como lidas
    setContatos(prev => prev.map(c => 
      c.id === contato.id ? { ...c, mensagens_nao_lidas: 0 } : c
    ));
  };

  const filteredContatos = contatos.filter(contato =>
    contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contato.especialidade?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[600px] flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Carregando mensagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mensagens</h2>
        <p className="text-muted-foreground">
          Converse com médicos e equipe da clínica
        </p>
      </div>

      <Card className="h-[600px]">
        <div className="flex h-full">
          {/* Lista de Contatos */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="space-y-1 p-2">
                {filteredContatos.map((contato) => {
                  const StatusIcon = getStatusIcon(contato.tipo);
                  
                  return (
                    <div
                      key={contato.id}
                      onClick={() => handleSelectContato(contato)}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                        contatoAtivo?.id === contato.id ? "bg-blue-50 border border-blue-200" : ""
                      )}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contato.foto_url} />
                          <AvatarFallback>
                            {contato.nome.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                          getStatusColor(contato.status)
                        )} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">{contato.nome}</h3>
                          <div className="flex items-center space-x-1">
                            {contato.mensagens_nao_lidas > 0 && (
                              <Badge className="bg-blue-600 text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {contato.mensagens_nao_lidas}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(contato.ultima_atividade)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          {StatusIcon}
                          <span className="capitalize">{contato.tipo}</span>
                          {contato.especialidade && (
                            <>
                              <span>•</span>
                              <span className="truncate">{contato.especialidade}</span>
                            </>
                          )}
                        </div>
                        
                        {contato.ultima_mensagem && (
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {contato.ultima_mensagem}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Área de Chat */}
          <div className="flex-1 flex flex-col">
            {contatoAtivo ? (
              <>
                <ChatHeader contato={contatoAtivo} />
                <ChatMessages mensagens={mensagens} currentUserId={currentUserId} />
                <ChatInput onSendMessage={handleSendMessage} disabled={sendingMessage} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Selecione uma conversa</h3>
                  <p className="text-muted-foreground">
                    Escolha um contato na lista para começar a conversar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
