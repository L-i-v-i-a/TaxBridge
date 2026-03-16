import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma.module';

import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { ContactModule } from './contact/contact.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FeaturesModule } from './features/features.module';
import { FilingsModule } from './fillings/filings.module';
import { MailModule } from './mail/mail.module';
import { PaymentModule } from './payment/payment.module';
import { PaystackModule } from './paystack/paystack.module';
import { PricingModule } from './pricing/pricing.module';
import { RefundCalculatorModule } from './refund-calculator/refund-calculator.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: undefined,
    }),

    PrismaModule,
    MailModule,
    FeaturesModule,
    RefundCalculatorModule,
    AuthModule,
    ContactModule,
    PricingModule,
    AiModule,
    FilingsModule,
    PaymentModule,
    PaystackModule,
    DashboardModule,
    ChatModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
