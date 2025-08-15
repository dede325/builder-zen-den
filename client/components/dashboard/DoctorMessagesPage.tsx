import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Heart,
  Users,
  Plus,
  X,
  Download,
  Image as ImageIcon,
  FileText,
  Mic,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderType: "doctor" | "patient" | "nurse" | "secretary" | "admin";
  recipientId: string;
  content: string;
  timestamp: string;
  read: boolean;
  messageType: "text" | "image" | "document" | "audio";
  attachments?: {
    url: string;
    name: string;
    type: string;
    size: number;
  }[];
  priority: "normal" | "urgent" | "emergency";
}

interface Contact {
  id: string;
  name: string;
  type: "doctor" | "patient" | "nurse" | "secretary" | "admin";
  specialty?: string;
  avatar?: string;
  status: "online" | "offline" | "busy";
  lastMessage?: string;
  lastActivity: string;
  unreadCount: number;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  title: string;
  type: "direct" | "group";
}

const mockContacts: Contact[] = [
  {
    id: "p_001",
    name: "Maria Silva Santos",
    type: "patient",
    avatar: "/avatars/maria.jpg",
    status: "online",
    lastMessage: "Doutor, quando posso buscar o resultado?",
    lastActivity: new Date().toISOString(),
    unreadCount: 2,
  },
  {
    id: "n_001",
    name: "Enfermeira Ana Costa",
    type: "nurse",
    specialty: "Cardiologia",
    avatar: "/avatars/ana.jpg",
    status: "busy",
    lastMessage: "Paciente da sala 3 está pronto para consulta",
    lastActivity: "2024-01-15T10:30:00Z",
    unreadCount: 1,
  },
  {
    id: "s_001",
    name: "Secretária Carla",
    type: "secretary",
    avatar: "/avatars/carla.jpg",
    status: "online",
    lastMessage: "Reagendei a consulta das 15h",
    lastActivity: "2024-01-15T09:15:00Z",
    unreadCount: 0,
  },
  {
    id: "d_001",
    name: "Dr. Pedro Lima",
    type: "doctor",
    specialty: "Pneumologista",
    avatar: "/avatars/pedro.jpg",
    status: "offline",
    lastMessage: "Preciso de uma segunda opinião sobre o caso",
    lastActivity: "2024-01-14T16:45:00Z",
    unreadCount: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: "msg_001",
    conversationId: "conv_p001",
    senderId: "p_001",
    senderName: "Maria Silva Santos",
    senderType: "patient",
    recipientId: "current_doctor",
    content: "Bom dia, doutor! Como está?",
    timestamp: "2024-01-15T08:00:00Z",
    read: true,
    messageType: "text",
    priority: "normal",
  },
  {
    id: "msg_002",
    conversationId: "conv_p001",
    senderId: "current_doctor",
    senderName: "Dr. João Carvalho",
    senderType: "doctor",
    recipientId: "p_001",
    content: "Bom dia, Maria! Estou bem, obrigado. Como você está se sentindo?",
    timestamp: "2024-01-15T08:05:00Z",
    read: true,
    messageType: "text",
    priority: "normal",
  },
  {
    id: "msg_003",
    conversationId: "conv_p001",
    senderId: "p_001",
    senderName: "Maria Silva Santos",
    senderType: "patient",
    recipientId: "current_doctor",
    content:
      "Estou me sentindo melhor. Quando posso buscar o resultado do exame?",
    timestamp: "2024-01-15T08:10:00Z",
    read: false,
    messageType: "text",
    priority: "normal",
  },
];

function formatMessageTime(dateString: string) {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, "HH:mm");
  } else if (isYesterday(date)) {
    return "Ontem";
  } else {
    return format(date, "dd/MM", { locale: ptBR });
  }
}

function getContactIcon(type: Contact["type"]) {
  switch (type) {
    case "doctor":
      return <Stethoscope className="h-4 w-4" />;
    case "nurse":
      return <Heart className="h-4 w-4" />;
    case "secretary":
    case "admin":
      return <Users className="h-4 w-4" />;
    case "patient":
      return <Circle className="h-4 w-4" />;
    default:
      return <Circle className="h-4 w-4" />;
  }
}

function getStatusColor(status: Contact["status"]) {
  switch (status) {
    case "online":
      return "bg-green-500";
    case "busy":
      return "bg-yellow-500";
    case "offline":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
}

interface ChatHeaderProps {
  contact: Contact;
  onStartCall: () => void;
  onStartVideo: () => void;
}

function ChatHeader({ contact, onStartCall, onStartVideo }: ChatHeaderProps) {
  const ContactIcon = getContactIcon(contact.type);

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={contact.avatar} />
            <AvatarFallback>
              {contact.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div
            className={cn(
              "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
              getStatusColor(contact.status),
            )}
          />
        </div>
        <div>
          <h3 className="font-medium">{contact.name}</h3>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            {ContactIcon}
            <span className="capitalize">{contact.type}</span>
            {contact.specialty && (
              <>
                <span>•</span>
                <span>{contact.specialty}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={onStartCall}>
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onStartVideo}>
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
  messages: Message[];
  currentUserId: string;
}

function ChatMessages({ messages, currentUserId }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUserId;
          const showDate =
            index === 0 ||
            new Date(message.timestamp).toDateString() !==
              new Date(messages[index - 1].timestamp).toDateString();

          return (
            <div key={message.id}>
              {showDate && (
                <div className="text-center my-4">
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {format(new Date(message.timestamp), "dd 'de' MMMM", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              )}

              <div
                className={cn(
                  "flex",
                  isCurrentUser ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-3 py-2 shadow-sm",
                    isCurrentUser
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border rounded-bl-none dark:bg-gray-700",
                  )}
                >
                  {!isCurrentUser && (
                    <p className="text-xs font-medium mb-1 text-blue-600 dark:text-blue-400">
                      {message.senderName}
                    </p>
                  )}

                  {message.priority === "urgent" && (
                    <Badge variant="destructive" className="mb-2 text-xs">
                      Urgente
                    </Badge>
                  )}

                  {message.priority === "emergency" && (
                    <Badge
                      variant="destructive"
                      className="mb-2 text-xs bg-red-600"
                    >
                      Emergência
                    </Badge>
                  )}

                  <p className="text-sm leading-relaxed">{message.content}</p>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 p-2 bg-black/10 rounded text-xs"
                        >
                          {attachment.type.startsWith("image/") ? (
                            <ImageIcon className="h-3 w-3" />
                          ) : (
                            <FileText className="h-3 w-3" />
                          )}
                          <span>{attachment.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex items-center justify-end space-x-1 mt-1",
                      isCurrentUser ? "text-blue-100" : "text-muted-foreground",
                    )}
                  >
                    <span className="text-xs">
                      {format(new Date(message.timestamp), "HH:mm")}
                    </span>
                    {isCurrentUser &&
                      (message.read ? (
                        <CheckCheck className="h-3 w-3 text-blue-200" />
                      ) : (
                        <Check className="h-3 w-3 text-blue-200" />
                      ))}
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
  onSendMessage: (
    content: string,
    priority: Message["priority"],
    attachments?: File[],
  ) => void;
  disabled?: boolean;
}

function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<Message["priority"]>("normal");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), priority, attachments);
      setMessage("");
      setPriority("normal");
      setAttachments([]);
    }
  };

  const handleFileSelect = (files: FileList) => {
    const newFiles = Array.from(files);
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 border-t bg-white dark:bg-gray-800">
      {attachments.length > 0 && (
        <div className="mb-2 space-y-1">
          {attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-muted rounded text-sm"
            >
              <div className="flex items-center space-x-2">
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span>{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center space-x-2">
          <Select
            value={priority}
            onValueChange={(value: Message["priority"]) => setPriority(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
              <SelectItem value="emergency">Emergência</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end space-x-2">
          <div className="flex space-x-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm">
              <Camera className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm">
              <Mic className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={disabled}
              className="min-h-[40px] max-h-[120px] resize-none pr-10"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 bottom-1"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          <Button type="submit" disabled={!message.trim() || disabled}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx"
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
      />
    </div>
  );
}

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (
    recipientId: string,
    content: string,
    priority: Message["priority"],
  ) => void;
  contacts: Contact[];
}

function NewMessageModal({
  isOpen,
  onClose,
  onSendMessage,
  contacts,
}: NewMessageModalProps) {
  const [selectedContact, setSelectedContact] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<Message["priority"]>("normal");

  const handleSend = () => {
    if (selectedContact && message.trim()) {
      onSendMessage(selectedContact, message.trim(), priority);
      setSelectedContact("");
      setMessage("");
      setPriority("normal");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Mensagem</DialogTitle>
          <DialogDescription>
            Envie uma mensagem para outro profissional ou paciente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="recipient">Destinatário</Label>
            <Select value={selectedContact} onValueChange={setSelectedContact}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o destinatário" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    <div className="flex items-center space-x-2">
                      {getContactIcon(contact.type)}
                      <span>{contact.name}</span>
                      {contact.specialty && (
                        <span className="text-xs text-muted-foreground">
                          ({contact.specialty})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select
              value={priority}
              onValueChange={(value: Message["priority"]) => setPriority(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="emergency">Emergência</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              rows={4}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleSend}
              disabled={!selectedContact || !message.trim()}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DoctorMessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);

  const currentUserId = "current_doctor";

  useEffect(() => {
    // Simular carregamento inicial
    setLoading(false);
    if (contacts.length > 0 && !activeContact) {
      setActiveContact(contacts[0]);
    }
  }, [contacts]);

  useEffect(() => {
    // Simular WebSocket para mensagens em tempo real
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        // 5% chance a cada segundo
        const newMessage: Message = {
          id: `msg_${Date.now()}`,
          conversationId: `conv_${activeContact?.id}`,
          senderId: activeContact?.id || "unknown",
          senderName: activeContact?.name || "Desconhecido",
          senderType: activeContact?.type || "patient",
          recipientId: currentUserId,
          content: "Esta é uma mensagem simulada recebida em tempo real!",
          timestamp: new Date().toISOString(),
          read: false,
          messageType: "text",
          priority: "normal",
        };

        setMessages((prev) => [...prev, newMessage]);

        // Atualizar contador de mensagens não lidas
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === activeContact?.id
              ? {
                  ...contact,
                  unreadCount: contact.unreadCount + 1,
                  lastMessage: newMessage.content,
                  lastActivity: newMessage.timestamp,
                }
              : contact,
          ),
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeContact]);

  const handleSendMessage = async (
    content: string,
    priority: Message["priority"],
    attachments?: File[],
  ) => {
    if (!activeContact) return;

    setSendingMessage(true);
    try {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        conversationId: `conv_${activeContact.id}`,
        senderId: currentUserId,
        senderName: "Dr. João Carvalho",
        senderType: "doctor",
        recipientId: activeContact.id,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        messageType:
          attachments && attachments.length > 0 ? "document" : "text",
        priority,
        attachments: attachments?.map((file) => ({
          url: `/uploads/${Date.now()}_${file.name}`,
          name: file.name,
          type: file.type,
          size: file.size,
        })),
      };

      setMessages((prev) => [...prev, newMessage]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setActiveContact(contact);

    // Marcar mensagens como lidas
    setContacts((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c)),
    );

    setMessages((prev) =>
      prev.map((msg) =>
        msg.senderId === contact.id ? { ...msg, read: true } : msg,
      ),
    );
  };

  const handleNewMessage = (
    recipientId: string,
    content: string,
    priority: Message["priority"],
  ) => {
    const recipient = contacts.find((c) => c.id === recipientId);
    if (recipient) {
      setActiveContact(recipient);
      handleSendMessage(content, priority);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.specialty?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeMessages = messages.filter(
    (msg) =>
      (msg.senderId === activeContact?.id &&
        msg.recipientId === currentUserId) ||
      (msg.senderId === currentUserId && msg.recipientId === activeContact?.id),
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mensagens</h2>
          <p className="text-muted-foreground">
            Comunicação segura com pacientes e equipe médica
          </p>
        </div>
        <Button onClick={() => setShowNewMessage(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Mensagem
        </Button>
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
                {filteredContacts.map((contact) => {
                  const ContactIcon = getContactIcon(contact.type);

                  return (
                    <div
                      key={contact.id}
                      onClick={() => handleSelectContact(contact)}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-muted transition-colors",
                        activeContact?.id === contact.id
                          ? "bg-blue-50 border border-blue-200 dark:bg-blue-950/20"
                          : "",
                      )}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                            getStatusColor(contact.status),
                          )}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium truncate">
                            {contact.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {contact.unreadCount > 0 && (
                              <Badge className="bg-blue-600 text-white h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {contact.unreadCount}
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(contact.lastActivity)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          {ContactIcon}
                          <span className="capitalize">{contact.type}</span>
                          {contact.specialty && (
                            <>
                              <span>•</span>
                              <span className="truncate">
                                {contact.specialty}
                              </span>
                            </>
                          )}
                        </div>

                        {contact.lastMessage && (
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {contact.lastMessage}
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
            {activeContact ? (
              <>
                <ChatHeader
                  contact={activeContact}
                  onStartCall={() => {}}
                  onStartVideo={() => {}}
                />
                <ChatMessages
                  messages={activeMessages}
                  currentUserId={currentUserId}
                />
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={sendingMessage}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    Selecione uma conversa
                  </h3>
                  <p className="text-muted-foreground">
                    Escolha um contato na lista para começar a conversar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <NewMessageModal
        isOpen={showNewMessage}
        onClose={() => setShowNewMessage(false)}
        onSendMessage={handleNewMessage}
        contacts={contacts}
      />
    </div>
  );
}
