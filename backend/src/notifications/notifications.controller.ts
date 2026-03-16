// src/notifications/notifications.controller.ts
import { Controller, Get, Patch, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { NotificationType } from '@prisma/client';

import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications with filters' })
  async getNotifications(
    @Request() req,
    @Query('status') status?: 'READ' | 'UNREAD',
    @Query('type') type?: NotificationType
  ) {
    return this.notificationsService.findAll(req.user.sub, { status, type });
  }

  @Get('count')
  @ApiOperation({ summary: 'Get unread notification count' })
  async getCount(@Request() req) {
    const count = await this.notificationsService.getUnreadCount(req.user.sub);
    return { count };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(id, req.user.sub);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }
}