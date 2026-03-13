import { Controller, Post, Get, Query, Request, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { PaymentService } from './payment.service';

import { InitializePaymentDto } from './dto/initialize-payment.dto';

@ApiTags('payment')
@Controller('payment')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initialize')
  @ApiOperation({ summary: 'Initialize a subscription payment' })
  async initialize(@Request() req, @Body() dto: InitializePaymentDto) {
    return this.paymentService.initializeSubscription(req.user.sub, dto.planId);
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verify payment callback' })
  async verify(@Query('reference') reference: string) {
    return this.paymentService.verifyPayment(reference);
  }
}