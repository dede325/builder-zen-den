import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { database } from './database';

interface WebSocketClient extends WebSocket {
  userId?: string;
  userRole?: string;
  isAlive?: boolean;
}

interface WebSocketMessage {
  type: 'message' | 'typing' | 'read' | 'connect' | 'disconnect';
  data: any;
}

export class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocketClient> = new Map();

  constructor(server: any) {
    this.wss = new WebSocketServer({ 
      server,
      path: '/ws'
    });

    this.setupWebSocketServer();
    this.setupHeartbeat();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocketClient, req: IncomingMessage) => {
      console.log('New WebSocket connection');

      ws.isAlive = true;

      // Handle pong responses for heartbeat
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      // Handle incoming messages
      ws.on('message', async (data: Buffer) => {
        try {
          const message: WebSocketMessage = JSON.parse(data.toString());
          await this.handleMessage(ws, message);
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });

      // Handle connection close
      ws.on('close', () => {
        if (ws.userId) {
          this.clients.delete(ws.userId);
          console.log(`User ${ws.userId} disconnected`);
        }
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    });
  }

  private async handleMessage(ws: WebSocketClient, message: WebSocketMessage) {
    switch (message.type) {
      case 'connect':
        await this.handleConnect(ws, message.data);
        break;

      case 'message':
        await this.handleChatMessage(ws, message.data);
        break;

      case 'typing':
        this.handleTyping(ws, message.data);
        break;

      case 'read':
        await this.handleMessageRead(ws, message.data);
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private async handleConnect(ws: WebSocketClient, data: any) {
    const { userId, token } = data;

    // In production, validate the token here
    // For now, just check if user exists
    const user = database.getUserById(userId);
    if (!user) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid user'
      }));
      ws.close();
      return;
    }

    ws.userId = userId;
    ws.userRole = user.role;
    this.clients.set(userId, ws);

    ws.send(JSON.stringify({
      type: 'connected',
      data: { userId, status: 'connected' }
    }));

    console.log(`User ${user.name} (${userId}) connected via WebSocket`);
  }

  private async handleChatMessage(ws: WebSocketClient, data: any) {
    if (!ws.userId) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Not authenticated'
      }));
      return;
    }

    const { to_user_id, message, type = 'text', file_url, file_name, file_size } = data;

    try {
      // Save message to database
      const savedMessage = database.createMessage({
        from_user_id: ws.userId,
        to_user_id,
        message,
        type,
        file_url,
        file_name,
        file_size,
        read: false
      });

      // Send to recipient if online
      const recipientWs = this.clients.get(to_user_id);
      if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
        recipientWs.send(JSON.stringify({
          type: 'message',
          data: savedMessage
        }));
      }

      // Send confirmation to sender
      ws.send(JSON.stringify({
        type: 'message_sent',
        data: savedMessage
      }));

    } catch (error) {
      console.error('Error saving message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to send message'
      }));
    }
  }

  private handleTyping(ws: WebSocketClient, data: any) {
    if (!ws.userId) return;

    const { to_user_id, typing } = data;
    const recipientWs = this.clients.get(to_user_id);
    
    if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
      recipientWs.send(JSON.stringify({
        type: 'typing',
        data: {
          from_user_id: ws.userId,
          typing
        }
      }));
    }
  }

  private async handleMessageRead(ws: WebSocketClient, data: any) {
    if (!ws.userId) return;

    const { message_id } = data;

    try {
      const success = database.markMessageAsRead(message_id);
      
      if (success) {
        ws.send(JSON.stringify({
          type: 'message_read',
          data: { message_id }
        }));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  private setupHeartbeat() {
    const interval = setInterval(() => {
      this.wss.clients.forEach((ws: WebSocketClient) => {
        if (ws.isAlive === false) {
          if (ws.userId) {
            this.clients.delete(ws.userId);
          }
          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000); // 30 seconds

    this.wss.on('close', () => {
      clearInterval(interval);
    });
  }

  // Send message to specific user
  sendToUser(userId: string, message: any) {
    const ws = this.clients.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  // Broadcast to all users with specific role
  broadcastToRole(role: string, message: any) {
    this.clients.forEach((ws, userId) => {
      if (ws.userRole === role && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  // Broadcast to all connected users
  broadcast(message: any) {
    this.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    });
  }

  // Get online users
  getOnlineUsers(): string[] {
    return Array.from(this.clients.keys());
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    const ws = this.clients.get(userId);
    return ws !== undefined && ws.readyState === WebSocket.OPEN;
  }
}

let wsManager: WebSocketManager | null = null;

export function initializeWebSocket(server: any): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager(server);
  }
  return wsManager;
}

export function getWebSocketManager(): WebSocketManager | null {
  return wsManager;
}
