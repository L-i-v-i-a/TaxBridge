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

import { SenderType, NotificationType, NotificationPriority } from '@prisma/client';

import { Server, Socket } from 'socket.io';

import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';

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
    private notifications: NotificationsService, // Inject Notifications
    private prisma: PrismaService, // Inject Prisma to fetch admins
  ) {}

  async handleConnection(client: Socket) {
    try {
      let token = client.handshake.auth.token || client.handshake.headers.authorization;
      if (!token) throw new Error('No token provided');
      if (token.startsWith('Bearer ')) token = token.split(' ')[1];
      
      const payload = await this.jwtService.verifyAsync(token);
      client.data.user = payload;
      client.join(`user-${payload.sub}`);
      
      if (payload.isAdmin) {
        client.join('admin-support');
      }
    } catch (e) {
      this.logger.error(`Connection failed: ${e.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {}

  @SubscribeMessage('joinConversation')
  async handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() conversationId: string) {
    client.join(`conv-${conversationId}`);
  }

  @OnEvent('message.created')
  async handleMessageCreatedEvent(payload: { message: any; senderId: string }) {
    const { message, senderId } = payload;
    const conversationId = message.conversationId;

    // 1. Broadcast the new message to the room
    this.server.to(`conv-${conversationId}`).emit('newMessage', message);

    // 2. Handle Side Effects (AI / Agent)
    const conversation = await this.chatService.getConversation(conversationId);
    if (!conversation) return;

    const isAiConversation = conversation.type === 'AI';
    const isUserSender = message.senderType === 'USER';

    if (isAiConversation && isUserSender) {
      // --- AI LOGIC ---
      this.server.to(`conv-${conversationId}`).emit('ai_typing', { isTyping: true });

      try {
        // Fetch recent history for context (last 10 messages)
        const history = conversation.messages.slice(-10).map((msg: any) => ({
          role: (msg.senderType === 'AI' ? 'assistant' : 'user') as 'user' | 'assistant',
          content: msg.content,
        }));

        // Get AI Response
        const aiResponseContent = await this.aiService.chat(message.content, history);
        
        // Save AI Message
        await this.chatService.createMessage(
          conversationId,
          'AI_SYSTEM',
          'AI',
          aiResponseContent,
          'TEXT',
        );
      } catch (error) {
        this.logger.error('AI Response failed', error);
      } finally {
        this.server.to(`conv-${conversationId}`).emit('ai_typing', { isTyping: false });
      }
    } else if (conversation.type === 'AGENT') {
      // --- AGENT LOGIC ---
      const isSenderAdmin = message.senderType === 'ADMIN';
      
      if (isSenderAdmin) {
        // 1. Real-time Socket Notification to User
        this.server.to(`user-${conversation.userId}`).emit('notification', message);
        
        // 2. Email Notification
        const userName = conversation.user.name || 'User';
        await this.mailService.sendNewMessageNotification(
          conversation.user.email,
          userName,
          'Agent',
          message.content,
          conversationId
        );

        // 3. In-App Notification for User
        await this.notifications.createNotification(
          conversation.userId,
          NotificationType.CHAT,
          'New Support Message',
          message.content.substring(0, 50) + '...',
          NotificationPriority.LOW,
          `/communication/${conversationId}`
        );

      } else {
        // User replied -> Notify Admins
        
        // 1. Real-time Socket Notification to Admin Room
        this.server.to('admin-support').emit('notification', message);

        // 2. Create In-App Notification for ALL Admins
        // Fetch all admin IDs
        const admins = await this.prisma.user.findMany({
          where: { isAdmin: true },
          select: { id: true },
        });

        // Create notification for each admin
        // Note: In a high-traffic app, use Promise.all or a bulk insert method
        for (const admin of admins) {
          await this.notifications.createNotification(
            admin.id,
            NotificationType.CHAT,
            'New Support Ticket Reply',
            `${conversation.user.name || 'User'}: ${message.content.substring(0, 30)}...`,
            NotificationPriority.HIGH, // Support tickets usually high priority
            `/admin/support/${conversationId}`
          );
        }
      }
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSocketMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string; type: 'TEXT' | 'IMAGE' | 'FILE' }
  ) {
    const user = client.data.user;
    if (!user) return;

    const senderType: SenderType = user.isAdmin ? 'ADMIN' : 'USER';
    
    await this.chatService.createMessage(
      data.conversationId,
      user.sub,
      senderType,
      data.content,
      data.type || 'TEXT',
    );
  }
}