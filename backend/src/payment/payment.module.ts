import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { AdminGuard } from '../auth/admin.guard';
import { AuthModule } from '../auth/auth.module';
import { PaystackModule } from '../paystack/paystack.module';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [AuthModule, PaystackModule],
  providers: [PaymentService, PrismaService, AdminGuard],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
