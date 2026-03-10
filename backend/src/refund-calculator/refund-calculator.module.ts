import { Module } from '@nestjs/common';
import { RefundCalculatorController } from './refund-calculator.controller';
import { RefundCalculatorService } from './refund-calculator.service';

@Module({
  controllers: [RefundCalculatorController],
  providers: [RefundCalculatorService]
})
export class RefundCalculatorModule {}
