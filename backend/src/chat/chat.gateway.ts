// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnEvent } from '@nestjs/event-emitter'; 

import { SenderType } from '@prisma/client';

import { Server, Socket } from 'socket.io';

import { AiService } from '../ai/ai.service';
import { MailService } from '../mail/mail.service';

import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/chat',
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
    private aiService: AiService,
    private mailService: MailService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // 1. Retrieve token from auth or headers
      let token = client.handshake.auth.token || client.handshake.headers.authorization;

      if (!token) {
        throw new Error('No token provided');
      }

      // 2. Remove 'Bearer ' prefix if it exists
      if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
      }

      // 3. Verify Token
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload; // { sub: userId, email, isAdmin }

      // Join personal room for notifications
      client.join(`user-${payload.sub}`);

      // If Admin, join the admin support room
      if (payload.isAdmin) {
        client.join('admin-support');
        this.logger.log(`Admin ${payload.sub} connected`);
      } else {
        this.logger.log(`User ${payload.sub} connected`);
      }
    } catch (e) {
      this.logger.error(`Connection failed: ${e.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    // Cleanup logic if needed
  }

  @SubscribeMessage('joinConversation')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    client.join(`conv-${conversationId}`);
    this.logger.log(`Client ${client.id} joined room conv-${conversationId}`);
  }

  // Listener for messages created via HTTP or Socket
  @OnEvent('message.created')
  async handleMessageCreatedEvent(payload: { message: any; senderId: string }) {
    const { message, senderId } = payload;
    const conversationId = message.conversationId;

    // 1. Broadcast message to the conversation room
    this.server.to(`conv-${conversationId}`).emit('newMessage', message);

    // 2. Handle Side Effects (AI, Email, Notifications)
    const conversation = await this.chatService.getConversation(conversationId);
    if (!conversation) return;

    const isAiConversation = conversation.type === 'AI';
    const isSenderAdmin = message.senderType === 'ADMIN';

    if (isAiConversation && !isSenderAdmin) {
      // --- AI LOGIC ---
      const aiResponseContent = await this.aiService.chat(message.content);
      
      // This creates a new message, which will trigger this event again recursively
      await this.chatService.createMessage(
        conversationId,
        'AI_SYSTEM',
        'AI',
        aiResponseContent,
        'TEXT',
      );
    } else if (conversation.type === 'AGENT') {
      // --- AGENT LOGIC ---
      if (isSenderAdmin) {
        // Admin replied -> Notify specific User
        this.server.to(`user-${conversation.userId}`).emit('notification', message);
        
        // Send Email
        const userName = conversation.user.name || 'User';
        await this.mailService.sendNewMessageNotification(
          conversation.user.email,
          userName,
          'Agent',
          message.content,
          conversationId
        );
      } else {
        // User replied -> Notify all Admins
        this.server.to('admin-support').emit('notification', message);
      }
    }
  }

  // Keep socket listener for direct socket messages
  @SubscribeMessage('sendMessage')
  async handleSocketMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string; type: 'TEXT' | 'IMAGE' | 'FILE' }
  ) {
    const user = client.data.user;
    if (!user) return;

    const senderType: SenderType = user.isAdmin ? 'ADMIN' : 'USER';
    
    // Delegate to service (which emits the event we listen to above)
    await this.chatService.createMessage(
      data.conversationId,
      user.sub,
      senderType,
      data.content,
      data.type || 'TEXT',
    );
  }
}