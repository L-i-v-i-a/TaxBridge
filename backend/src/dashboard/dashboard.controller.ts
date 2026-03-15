import { Controller, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard) // Just needs to be logged in
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get user dashboard statistics' })
  async getDashboard(@Request() req) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }
    return this.dashboardService.getUserDashboard(userId);
  }
}