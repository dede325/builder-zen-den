import React, { useState, useEffect, useRef } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageSquare,
  Send,
  Paperclip,
  Image,
  FileText,
  Users,
  Search,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Check,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  type: "text" | "file" | "image" | "document";
  file_url?: string;
  file_name?: string;
  file_size?: number;
  read: boolean;
  read_at?: string;
  created_at: string;
  updated_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  online?: boolean;
  lastMessage?: string;
  unreadCount?: number;
}

interface WebSocketMessage {
  type: "message" | "typing" | "read" | "connected" | "message_sent";
  data: any;
}

export default function MessagingComponent() {
  const { user } = useAuthStore();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log("WebSocket connected");
      // Authenticate
      websocket.send(
        JSON.stringify({
          type: "connect",
          data: { userId: user.id, token: "auth-token" },
        }),
      );
    };

    websocket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      handleWebSocketMessage(message);
    };

    websocket.onclose = () => {
      console.log("WebSocket disconnected");
      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        if (!ws || ws.readyState === WebSocket.CLOSED) {
          console.log("Attempting to reconnect...");
          // Re-run this effect
        }
      }, 3000);
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [user]);

  // Load contacts
  useEffect(() => {
    if (!user) return;

    fetchContacts();
  }, [user]);

  // Load messages when contact is selected
  useEffect(() => {
    if (!selectedContact || !user) return;

    fetchMessages(user.id, selectedContact.id);
  }, [selectedContact, user]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchContacts = async () => {
    try {
      const response = await fetch(
        `/api/messaging/contacts?userRole=${user?.role}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setContacts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchMessages = async (userId: string, otherUserId: string) => {
    try {
      const response = await fetch(
        `/api/messaging/conversation/${userId}/${otherUserId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleWebSocketMessage = (wsMessage: WebSocketMessage) => {
    switch (wsMessage.type) {
      case "message":
        setMessages((prev) => [...prev, wsMessage.data]);
        // Mark as read if chat is open
        if (selectedContact?.id === wsMessage.data.from_user_id) {
          markMessageAsRead(wsMessage.data.id);
        }
        break;

      case "typing":
        setTypingUsers((prev) => ({
          ...prev,
          [wsMessage.data.from_user_id]: wsMessage.data.typing,
        }));
        break;

      case "connected":
        console.log("Connected to WebSocket:", wsMessage.data);
        break;

      case "message_sent":
        setMessages((prev) => [...prev, wsMessage.data]);
        break;
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || !user || !ws) return;

    const messageData = {
      type: "message",
      data: {
        to_user_id: selectedContact.id,
        message: newMessage,
        type: "text",
      },
    };

    ws.send(JSON.stringify(messageData));
    setNewMessage("");
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/messaging/messages/${messageId}/read`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const handleTyping = (typing: boolean) => {
    if (!selectedContact || !ws) return;

    ws.send(
      JSON.stringify({
        type: "typing",
        data: {
          to_user_id: selectedContact.id,
          typing,
        },
      }),
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedContact || !user) return;

    const file = files[0];

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("Arquivo muito grande. Máximo 10MB permitido.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("userId", user.id);
      formData.append("category", "document");

      const response = await fetch("/api/files/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const uploadedFile = data.data[0];

        // Send message with file attachment
        if (ws) {
          const messageData = {
            type: "message",
            data: {
              to_user_id: selectedContact.id,
              message: `📎 ${file.name}`,
              type: file.type.startsWith("image/") ? "image" : "file",
              file_url: uploadedFile.url,
              file_name: file.name,
              file_size: file.size,
            },
          };
          ws.send(JSON.stringify(messageData));
        }
      } else {
        alert("Erro ao enviar arquivo");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Erro ao enviar arquivo");
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleColor = (role: string) => {
    const colors = {
      doctor: "bg-blue-100 text-blue-800",
      nurse: "bg-green-100 text-green-800",
      receptionist: "bg-purple-100 text-purple-800",
      admin: "bg-red-100 text-red-800",
      patient: "bg-gray-100 text-gray-800",
    };
    return colors[role as keyof typeof colors] || colors.patient;
  };

  return (
    <div className="h-[600px] border rounded-lg overflow-hidden">
      <div className="flex h-full">
        {/* Contacts Sidebar */}
        <div className="w-1/3 border-r bg-gray-50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Mensagens</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Users className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Contacts</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={contact.avatar_url} />
                          <AvatarFallback>
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{contact.name}</p>
                          <Badge
                            variant="secondary"
                            className={`text-xs ${getRoleColor(contact.role)}`}
                          >
                            {contact.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar contatos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-120px)]">
            <div className="p-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id
                      ? "bg-blue-100 border-blue-200"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={contact.avatar_url} />
                      <AvatarFallback>
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">
                        {contact.name}
                      </p>
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${getRoleColor(contact.role)}`}
                      >
                        {contact.role}
                      </Badge>
                    </div>
                    {contact.lastMessage && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {contact.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedContact.avatar_url} />
                      <AvatarFallback>
                        {getInitials(selectedContact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selectedContact.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getRoleColor(selectedContact.role)}`}
                        >
                          {selectedContact.role}
                        </Badge>
                        {selectedContact.online && (
                          <span className="text-xs text-green-600">Online</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="ghost">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.from_user_id === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.from_user_id === user?.id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.type === "image" && message.file_url ? (
                          <div className="space-y-2">
                            <img
                              src={message.file_url}
                              alt={message.file_name || "Image"}
                              className="max-w-full h-auto rounded cursor-pointer"
                              onClick={() =>
                                window.open(message.file_url, "_blank")
                              }
                            />
                            <p className="text-sm">{message.message}</p>
                          </div>
                        ) : message.type === "file" && message.file_url ? (
                          <div className="space-y-2">
                            <div
                              className={`flex items-center space-x-2 p-2 rounded border ${
                                message.from_user_id === user?.id
                                  ? "border-blue-300 bg-blue-400/20"
                                  : "border-gray-300 bg-gray-50"
                              }`}
                            >
                              <FileText className="w-4 h-4" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">
                                  {message.file_name}
                                </p>
                                <p className="text-xs opacity-70">
                                  {message.file_size
                                    ? `${Math.round(message.file_size / 1024)} KB`
                                    : ""}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                asChild
                              >
                                <a
                                  href={message.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="w-3 h-3" />
                                </a>
                              </Button>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        ) : (
                          <p className="text-sm">{message.message}</p>
                        )}
                        <div
                          className={`flex items-center justify-between mt-1 text-xs ${
                            message.from_user_id === user?.id
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          <span>{formatTime(message.created_at)}</span>
                          {message.from_user_id === user?.id && (
                            <div className="ml-2">
                              {message.read ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {typingUsers[selectedContact.id] && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleFileUpload}
                      title="Anexar arquivo"
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.accept = "image/*";
                          fileInputRef.current.click();
                        }
                      }}
                      title="Enviar imagem"
                    >
                      <Image className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping(e.target.value.length > 0);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          sendMessage();
                        }
                      }}
                      onBlur={() => handleTyping(false)}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={onFileSelected}
                  accept="image/*,application/pdf,.doc,.docx,.txt,.xls,.xlsx"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Selecione um contato para iniciar a conversa
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
