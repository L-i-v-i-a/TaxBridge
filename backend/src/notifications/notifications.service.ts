// src/notifications/notifications.service.ts
import { Injectable, Logger } from '@nestjs/common';

import { NotificationType, NotificationPriority } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    priority: NotificationPriority = 'LOW',
    link?: string
  ) {
    try {
      return await this.prisma.notification.create({
        data: { userId, type, title, message, priority, link },
      });
    } catch (error) {
      this.logger.error(`Failed to create notification for user ${userId}: ${error.message}`);
    }
  }

  async findAll(userId: string, filters: { status?: 'READ' | 'UNREAD'; type?: NotificationType }) {
    const where: any = { userId };
    
    if (filters.status === 'READ') where.isRead = true;
    if (filters.status === 'UNREAD') where.isRead = false;
    if (filters.type) where.type = filters.type;

    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}