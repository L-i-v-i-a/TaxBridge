import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

import { PrismaModule } from '../prisma.module'; // Verify this path matches your project
import { AiModule } from '../ai/ai.module';

import { FilingsController } from './filings.controller';
import { FilingsService } from './filings.service';

@Module({
  imports: [
    PrismaModule, 
    AiModule,
    AuthModule,
    NotificationsModule,
  ],
  controllers: [FilingsController],
  providers: [FilingsService],
  exports: [FilingsService],
})
export class FilingsModule {}