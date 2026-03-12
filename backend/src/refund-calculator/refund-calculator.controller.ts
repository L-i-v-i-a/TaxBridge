import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'; // ← Add these
import { RefundCalculatorService } from './refund-calculator.service';

import { CalculateRefundDto } from './dto/calculate-refund.dto';

@ApiTags('refund-calculator') // Groups this under a nice section
@Controller('refund-calculator')
export class RefundCalculatorController {
  constructor(
    private readonly refundCalculatorService: RefundCalculatorService,
  ) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate estimated tax refund' }) // Nice title in docs
  @ApiBody({ type: CalculateRefundDto }) // Shows input schema
  @ApiResponse({ status: 201, description: 'Refund calculated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  calculateRefund(@Body() dto: CalculateRefundDto) {
    return this.refundCalculatorService.calculate(dto);
  }
}
