import { Controller, Post, Get, Delete, Query, Param, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AdminGuard } from '../auth/admin.guard';

import { PaymentService } from './payment.service';

import { InitializePaymentDto } from './dto/initialize-payment.dto';

@ApiTags('subscriptions')
@Controller('subscriptions')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // --- User Endpoints ---

  @Post()
  @ApiOperation({ summary: 'Initialize a new subscription payment' })
  async initialize(@Request() req, @Body() dto: InitializePaymentDto) {
    return this.paymentService.initializeSubscription(req.user.sub, dto.planId);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify payment callback' })
  async verify(@Query('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }

  @Get('my-subscription')
  @ApiOperation({ summary: 'Get current user subscription' })
  async getMine(@Request() req) {
    return this.paymentService.getMySubscription(req.user.sub);
  }

  @Post('update-card')
  @ApiOperation({ summary: 'Generate link to update card details' })
  async updateCard(@Request() req) {
    return this.paymentService.updateCard(req.user.sub);
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Cancel current subscription' })
  async cancel(@Request() req) {
    return this.paymentService.cancelSubscription(req.user.sub);
  }

  @Post('change-plan')
  @ApiOperation({ summary: 'Change to a new plan' })
  async changePlan(@Request() req, @Body('planId') planId: string) {
    return this.paymentService.changePlan(req.user.sub, planId);
  }

  // --- Admin Endpoints ---

  @Get('admin/all')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all users with subscription status (Admin)' })
  async getAllUsers() {
    return this.paymentService.getAllUsersWithSubscriptions();
  }

  @Delete('admin/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a user subscription (Admin)' })
  async adminDelete(@Param('id') id: string) {
    return this.paymentService.adminDeleteSubscription(id);
  }
}