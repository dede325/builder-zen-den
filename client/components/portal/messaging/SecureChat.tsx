import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Shield,
  Lock,
  FileText,
  Image,
  Mic,
  Circle,
  CheckCheck,
  AlertTriangle,
  Info,
  Clock,
  Archive,
} from 'lucide-react';
import { formatDate } from '@/lib/locale-angola-portal';
import { useAuthStore } from '@/store/auth-portal';
import { offlineSyncManager } from '@/lib/offline-sync';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor' | 'nurse' | 'admin';
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'voice' | 'system';
  encrypted: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  urgent: boolean;
  attachment?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
  replyTo?: string;
}

interface Conversation {
  id: string;
  participants: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    lastSeen?: Date;
    online: boolean;
  }>;
  lastMessage?: Message;
  unreadCount: number;
  isArchived: boolean;
  isEmergency: boolean;
  encryptionKey: string;
}

interface SecureChatProps {
  conversationId?: string;
  onConversationChange?: (conversation: Conversation) => void;
  className?: string;
}

export default function SecureChat({
  conversationId,
  onConversationChange,
  className = '',
}: SecureChatProps) {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEncrypted, setIsEncrypted] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
    initializeWebSocket();
    loadConversations();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Load specific conversation if provided
  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    }
  }, [conversationId]);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeWebSocket = () => {
    const wsUrl = `wss://${window.location.host}/ws/chat`;
    ws.current = new WebSocket(wsUrl);
    
    ws.current.onopen = () => {
      console.log('[SecureChat] WebSocket connected');
      authenticateWebSocket();
    };
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };
    
    ws.current.onclose = () => {
      console.log('[SecureChat] WebSocket disconnected');
      // Attempt reconnection after 3 seconds
      setTimeout(initializeWebSocket, 3000);
    };
    
    ws.current.onerror = (error) => {
      console.error('[SecureChat] WebSocket error:', error);
    };
  };

  const authenticateWebSocket = () => {
    if (ws.current && user) {
      ws.current.send(JSON.stringify({
        type: 'authenticate',
        token: user.id, // In real app, use proper JWT
        userId: user.id,
      }));
    }
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'new_message':
        handleNewMessage(data.message);
        break;
      case 'message_status':
        updateMessageStatus(data.messageId, data.status);
        break;
      case 'typing':
        handleTypingIndicator(data);
        break;
      case 'user_online':
        updateUserOnlineStatus(data.userId, true);
        break;
      case 'user_offline':
        updateUserOnlineStatus(data.userId, false);
        break;
      default:
        console.log('[SecureChat] Unknown message type:', data.type);
    }
  };

  const loadConversations = async () => {
    try {
      // Try to load from network first
      const response = await fetch('/api/conversations', {
        headers: {
          'Authorization': `Bearer ${user?.id}`, // Use proper auth token
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations);
      } else {
        // Load from offline storage
        const offlineConversations = await offlineSyncManager.getOfflineData('message', user?.id);
        // Process offline data into conversations
        setConversations([]);
      }
    } catch (error) {
      console.error('[SecureChat] Failed to load conversations:', error);
      // Load from offline storage as fallback
      const offlineConversations = await offlineSyncManager.getOfflineData('message', user?.id);
      setConversations([]);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      const conversation = conversations.find(c => c.id === id);
      if (conversation) {
        setActiveConversation(conversation);
        
        // Load messages for this conversation
        const response = await fetch(`/api/conversations/${id}/messages`, {
          headers: {
            'Authorization': `Bearer ${user?.id}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const decryptedMessages = await decryptMessages(data.messages);
          setMessages(decryptedMessages);
          markMessagesAsRead(id);
        }
        
        onConversationChange?.(conversation);
      }
    } catch (error) {
      console.error('[SecureChat] Failed to load conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;
    if (!activeConversation || !user) return;

    const message: Message = {
      id: generateMessageId(),
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: newMessage,
      timestamp: new Date(),
      type: selectedFile ? getFileType(selectedFile) : 'text',
      encrypted: isEncrypted,
      status: 'sending',
      urgent: false,
      attachment: selectedFile ? {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        url: '', // Will be set after upload
      } : undefined,
    };

    // Add message to UI immediately
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setSelectedFile(null);

    try {
      // Encrypt message content if encryption is enabled
      const encryptedContent = isEncrypted 
        ? await encryptMessage(message.content, activeConversation.encryptionKey)
        : message.content;

      // Upload file if present
      let attachmentUrl = '';
      if (selectedFile) {
        attachmentUrl = await uploadFile(selectedFile);
      }

      // Send via WebSocket for real-time delivery
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'send_message',
          conversationId: activeConversation.id,
          message: {
            ...message,
            content: encryptedContent,
            attachment: message.attachment ? {
              ...message.attachment,
              url: attachmentUrl,
            } : undefined,
          },
        }));
      }

      // Also send via API for persistence
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`,
        },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          content: encryptedContent,
          type: message.type,
          attachment: message.attachment ? {
            ...message.attachment,
            url: attachmentUrl,
          } : undefined,
          encrypted: isEncrypted,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        updateMessageStatus(message.id, 'sent');
      } else {
        throw new Error('Failed to send message via API');
      }

    } catch (error) {
      console.error('[SecureChat] Failed to send message:', error);
      
      // Store message for offline sync
      await offlineSyncManager.storeOfflineData('message', {
        conversationId: activeConversation.id,
        content: message.content,
        type: message.type,
        attachment: message.attachment,
        encrypted: isEncrypted,
        timestamp: message.timestamp,
      }, 'high');
      
      updateMessageStatus(message.id, 'sent'); // Will sync when online
    }
  };

  const handleNewMessage = async (encryptedMessage: Message) => {
    // Decrypt message if encrypted
    const message = encryptedMessage.encrypted
      ? await decryptMessage(encryptedMessage)
      : encryptedMessage;
    
    setMessages(prev => [...prev, message]);
    
    // Update conversation list
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversation?.id
          ? { ...conv, lastMessage: message, unreadCount: conv.unreadCount + 1 }
          : conv
      )
    );
    
    // Show notification if not in focus
    if (document.hidden && message.senderId !== user?.id) {
      showNotification(message);
    }
  };

  const updateMessageStatus = (messageId: string, status: Message['status']) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, status } : msg
      )
    );
  };

  const handleTypingIndicator = (data: { userId: string; isTyping: boolean }) => {
    setTypingUsers(prev => {
      if (data.isTyping) {
        return prev.includes(data.userId) ? prev : [...prev, data.userId];
      } else {
        return prev.filter(id => id !== data.userId);
      }
    });
  };

  const startTyping = () => {
    if (!isTyping && ws.current && activeConversation) {
      setIsTyping(true);
      ws.current.send(JSON.stringify({
        type: 'typing',
        conversationId: activeConversation.id,
        isTyping: true,
      }));
      
      // Stop typing after 3 seconds
      setTimeout(() => {
        stopTyping();
      }, 3000);
    }
  };

  const stopTyping = () => {
    if (isTyping && ws.current && activeConversation) {
      setIsTyping(false);
      ws.current.send(JSON.stringify({
        type: 'typing',
        conversationId: activeConversation.id,
        isTyping: false,
      }));
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 10MB permitido.');
        return;
      }
      
      // Validate file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'application/pdf', 'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Tipo de arquivo não permitido.');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('encrypted', isEncrypted.toString());
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user?.id}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    const result = await response.json();
    return result.url;
  };

  const getFileType = (file: File): Message['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('audio/')) return 'voice';
    return 'file';
  };

  const encryptMessage = async (content: string, key: string): Promise<string> => {
    // In a real implementation, use Web Crypto API for AES-256-GCM encryption
    // This is a placeholder
    return btoa(content); // Simple base64 encoding for demo
  };

  const decryptMessage = async (message: Message): Promise<Message> => {
    if (!message.encrypted || !activeConversation?.encryptionKey) {
      return message;
    }
    
    try {
      // In a real implementation, use Web Crypto API for decryption
      const decryptedContent = atob(message.content); // Simple base64 decoding for demo
      return { ...message, content: decryptedContent };
    } catch (error) {
      console.error('[SecureChat] Failed to decrypt message:', error);
      return { ...message, content: '[Mensagem encriptada]' };
    }
  };

  const decryptMessages = async (messages: Message[]): Promise<Message[]> => {
    return Promise.all(messages.map(msg => decryptMessage(msg)));
  };

  const markMessagesAsRead = async (conversationId: string) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({
        type: 'mark_read',
        conversationId,
      }));
    }
  };

  const showNotification = (message: Message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Nova mensagem de ${message.senderName}`, {
        body: message.type === 'text' ? message.content : 'Anexo enviado',
        icon: '/icons/icon-192x192.png',
        tag: 'new-message',
      });
    }
  };

  const generateMessageId = (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateUserOnlineStatus = (userId: string, online: boolean) => {
    setConversations(prev =>
      prev.map(conv => ({
        ...conv,
        participants: conv.participants.map(p =>
          p.id === userId ? { ...p, online } : p
        ),
      }))
    );
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-green-500" />;
      default:
        return null;
    }
  };

  const formatMessageTime = (timestamp: Date) => {
    return formatDate(timestamp, 'time');
  };

  if (!activeConversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Chat Seguro</h3>
          <p>Selecione uma conversa para começar</p>
        </div>
      </div>
    );
  }

  const otherParticipant = activeConversation.participants.find(p => p.id !== user?.id);

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={otherParticipant?.avatar} />
              <AvatarFallback>
                {otherParticipant?.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {otherParticipant?.online && (
              <div className="absolute -bottom-0 -right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900">
              {otherParticipant?.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Badge variant="secondary" className="text-xs">
                {otherParticipant?.role}
              </Badge>
              {isEncrypted && (
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">Criptografado</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {otherParticipant?.role === 'doctor' && (
            <>
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === user?.id
                    ? 'bg-clinic-primary text-white'
                    : 'bg-white text-gray-900 border'
                }`}
              >
                {/* Message Content */}
                {message.type === 'text' && (
                  <p className="text-sm">{message.content}</p>
                )}
                
                {message.type === 'file' && message.attachment && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{message.attachment.name}</span>
                  </div>
                )}
                
                {message.type === 'image' && message.attachment && (
                  <div className="space-y-2">
                    <img
                      src={message.attachment.url}
                      alt={message.attachment.name}
                      className="rounded max-w-full h-auto"
                    />
                  </div>
                )}

                {/* Message Info */}
                <div className={`flex items-center justify-between mt-2 text-xs ${
                  message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{formatMessageTime(message.timestamp)}</span>
                  {message.senderId === user?.id && (
                    <div className="flex items-center gap-1">
                      {message.encrypted && <Lock className="h-3 w-3" />}
                      {getMessageStatusIcon(message.status)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicators */}
        {typingUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border rounded-lg px-4 py-2">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="flex gap-1">
                  <Circle className="h-2 w-2 animate-pulse" />
                  <Circle className="h-2 w-2 animate-pulse delay-150" />
                  <Circle className="h-2 w-2 animate-pulse delay-300" />
                </div>
                <span>A escrever...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* File Preview */}
      {selectedFile && (
        <div className="p-4 bg-yellow-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{selectedFile.name}</span>
              <span className="text-xs text-gray-500">
                ({(selectedFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFile(null)}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                if (!isTyping) startTyping();
              }}
              onBlur={stopTyping}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Escreva uma mensagem..."
              className="pr-12"
            />
            
            {isEncrypted && (
              <Shield className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
            )}
          </div>

          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() && !selectedFile}
            className="bg-clinic-primary hover:bg-clinic-secondary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
