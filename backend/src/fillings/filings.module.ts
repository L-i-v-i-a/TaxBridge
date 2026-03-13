import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma.module'; // Verify this path matches your project
import { AiModule } from '../ai/ai.module';

import { FilingsController } from './filings.controller';
import { FilingsService } from './filings.service';

@Module({
  imports: [
    PrismaModule, 
    AiModule
  ],
  controllers: [FilingsController],
  providers: [FilingsService],
})
export class FilingsModule {}