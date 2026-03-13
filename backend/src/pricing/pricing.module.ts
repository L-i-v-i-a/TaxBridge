import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { AdminGuard } from '../auth/admin.guard';
import { AuthModule } from '../auth/auth.module';
import { PaystackModule } from '../paystack/paystack.module';

import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';

@Module({
  imports: [AuthModule, PaystackModule],
  providers: [PricingService, PrismaService, AdminGuard],
  controllers: [PricingController],
})
export class PricingModule {}
