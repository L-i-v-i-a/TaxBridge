import { Module } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { PricingController } from './pricing.controller';
import { PrismaService } from '../prisma.service';
// JwtService will be provided by AuthModule
import { AdminGuard } from '../auth/admin.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [PricingService, PrismaService, AdminGuard],
  controllers: [PricingController],
})
export class PricingModule {}