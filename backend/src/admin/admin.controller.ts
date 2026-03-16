// src/admin/admin.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AdminGuard } from '../auth/admin.guard';

import { AdminService } from './admin.service';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboard() {
    const stats = await this.adminService.getDashboardStats();
    return stats;
  }

  @Get('activities')
  @ApiOperation({ summary: 'Get recent activities (filings)' })
  async getActivities(@Query('limit') limit: string) {
    const limitNum = parseInt(limit) || 10;
    return this.adminService.getRecentActivities(limitNum);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with subscription and filing info' })
  async getUsers() {
    return this.adminService.getAllUsers();
  }
}