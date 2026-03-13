import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module';
import { PaystackModule } from '../paystack/paystack.module';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [PaystackModule, AuthModule],
  providers: [PaymentService, PrismaService],
  controllers: [PaymentController],
})
export class PaymentModule {}