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
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SenderType } from '@prisma/client';

import { Server, Socket } from 'socket.io';

import { AiService } from '../ai/ai.service';
import { MailService } from '../mail/mail.service';

import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: '*' }, // Adjust for your frontend URL
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

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string; type: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'STICKER' }
  ) {
    const user = client.data.user;
    if (!user) return;

    const { conversationId, content, type } = data;

    // 1. Save User Message
    const senderType: SenderType = user.isAdmin ? 'ADMIN' : 'USER';

    const message = await this.chatService.createMessage(
      conversationId,
      user.sub,
      senderType,
      content,
      type || 'TEXT',
    );

    // Emit to the conversation room immediately
    this.server.to(`conv-${conversationId}`).emit('newMessage', message);

    // 2. Logic for AI vs Agent
    const conversation = await this.chatService.getConversation(conversationId);

    // Safety check for conversation existence
    if (!conversation) {
      this.logger.error(`Conversation ${conversationId} not found`);
      return;
    }

    if (conversation.type === 'AI' && !user.isAdmin) {
      // --- AI LOGIC ---
      const aiResponseContent = await this.aiService.chat(content);

      const aiMessage = await this.chatService.createMessage(
        conversationId,
        'AI_SYSTEM',
        'AI',
        aiResponseContent,
        'TEXT',
      );

      this.server.to(`conv-${conversationId}`).emit('newMessage', aiMessage);

    } else if (conversation.type === 'AGENT') {
      // --- AGENT LOGIC ---

      if (user.isAdmin) {
        // Admin replied -> Email the User
        this.server.to(`user-${conversation.userId}`).emit('notification', message);
        
        // Handle nullable name property
        const userName = conversation.user.name || 'User';
        
        await this.mailService.sendNewMessageNotification(
          conversation.user.email,
          userName,
          'Agent',
          content,
          conversationId
        );
      } else {
        // User replied -> Notify Admins
        this.server.to('admin-support').emit('notification', message);
        // Note: You might want to fetch all admin emails here or send to a generic admin inbox
      }
    }
  }
}