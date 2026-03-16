// src/chat/chat.service.ts
import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter'; // Import EventEmitter
import { MessageType, SenderType, ConversationType } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private mailer: MailService,
    private eventEmitter: EventEmitter2, // Inject EventEmitter
  ) {}

  async createConversation(userId: string, type: ConversationType) {
    this.logger.log(`Attempting to create conversation for user: ${userId}, type: ${type}`);
    
    try {
      const conversation = await this.prisma.conversation.create({
        data: { userId, type },
      });
      this.logger.log(`Conversation created successfully: ${conversation.id}`);
      return conversation;
    } catch (error) {
      this.logger.error(`Failed to create conversation: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Database error: Could not create conversation. Did you run migrations?');
    }
  }

  async getConversations(userId: string, isAdmin: boolean) {
    try {
      if (isAdmin) {
        return this.prisma.conversation.findMany({
          where: { type: 'AGENT' },
          include: {
            user: { select: { id: true, name: true, email: true } },
            messages: { take: 1, orderBy: { createdAt: 'desc' } },
          },
          orderBy: { updatedAt: 'desc' },
        });
      }
      return this.prisma.conversation.findMany({
        where: { userId },
        include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } },
        orderBy: { updatedAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Failed to get conversations: ${error.message}`);
      return [];
    }
  }

  async getConversation(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async createMessage(
    conversationId: string,
    senderId: string,
    senderType: SenderType,
    content: string | null,
    type: MessageType,
    fileUrl?: string,
  ) {
    try {
      const message = await this.prisma.message.create({
        data: {
          conversationId,
          senderId,
          senderType,
          content,
          type,
          fileUrl,
        },
      });

      // Update conversation timestamp
      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      // Emit event so Gateway can broadcast to sockets
      // We pass the full message and the senderId for logic checks
      this.eventEmitter.emit('message.created', { message, senderId });

      return message;
    } catch (error) {
      this.logger.error(`Failed to create message: ${error.message}`);
      throw error;
    }
  }

  async addReaction(messageId: string, userId: string, emoji: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });
    if (!message) throw new NotFoundException('Message not found');

    const reactions: any[] = (message.reactions as any[]) || [];
    const existingIndex = reactions.findIndex((r) => r.userId === userId);
    
    if (existingIndex > -1) {
      if (reactions[existingIndex].emoji === emoji) {
        reactions.splice(existingIndex, 1);
      } else {
        reactions[existingIndex].emoji = emoji;
      }
    } else {
      reactions.push({ userId, emoji });
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { reactions },
    });
  }
}