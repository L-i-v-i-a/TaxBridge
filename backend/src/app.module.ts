import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';

import { AuthModule } from './auth/auth.module';
import { FeaturesModule } from './features/features.module';
import { RefundCalculatorModule } from './refund-calculator/refund-calculator.module';
import { ContactModule } from './contact/contact.module';
import { PricingModule } from './pricing/pricing.module';
import { AiModule } from './npx/ai/ai.module';
import { AiService } from './ai/ai.service';

@Module({
  imports: [
    // ConfigModule should be imported FIRST (and made global)
    ConfigModule.forRoot({
      isGlobal: true,              // Makes ConfigService injectable everywhere without importing ConfigModule again
      envFilePath: '.env',         // Explicitly load your .env file
      ignoreEnvFile: process.env.NODE_ENV === 'production', // Optional: skip .env in prod if using real env vars
      validationSchema: undefined, // Add Joi/Zod validation later if needed
    }),

    PrismaModule,            // should be listed before feature modules
    FeaturesModule,
    RefundCalculatorModule,
    AuthModule,
    ContactModule,
    PricingModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService, AiService],
})
export class AppModule {}