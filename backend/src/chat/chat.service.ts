// src/chat/chat.service.ts
import { Injectable, NotFoundException, Logger, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { MessageType, SenderType, ConversationType } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private mailer: MailService,
    private eventEmitter: EventEmitter2,
  ) {}

  /**
   * Helper method to validate if a user has access to chat features.
   * Access is granted if: User isAdmin = true OR User has an ACTIVE subscription.
   */
  private async validateUserAccess(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        isAdmin: true, 
        subscriptions: { 
          where: { status: 'active' },
          select: { id: true } 
        } 
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAdmin = user.isAdmin;
    const hasActiveSubscription = user.subscriptions.length > 0;

    if (!isAdmin && !hasActiveSubscription) {
      throw new ForbiddenException('Access denied. You must be an admin or have an active subscription plan to use this feature.');
    }
  }

  async createConversation(userId: string, type: ConversationType) {
    // 1. Check Access
    await this.validateUserAccess(userId);

    this.logger.log(`Attempting to create conversation for user: ${userId}, type: ${type}`);
    
    try {
      const conversation = await this.prisma.conversation.create({
        data: { userId, type },
      });
      this.logger.log(`Conversation created successfully: ${conversation.id}`);
      return conversation;
    } catch (error) {
      this.logger.error(`Failed to create conversation: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Database error: Could not create conversation.');
    }
  }

  async getConversations(userId: string, isAdmin: boolean) {
    // If not admin, check access
    if (!isAdmin) {
      await this.validateUserAccess(userId);
    }

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
    // 1. Validate Access (unless it's an Admin/AI replying)
    if (senderType === 'USER') {
      await this.validateUserAccess(senderId);
    }

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

      await this.prisma.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

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