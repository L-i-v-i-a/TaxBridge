// src/settings/settings.module.ts
import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma.module';
import { FilingsModule } from '../fillings/filings.module';
import { PaymentModule } from '../payment/payment.module';

import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

@Module({
  imports: [PrismaModule, FilingsModule, PaymentModule],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}