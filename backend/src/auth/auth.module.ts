/**
 * @file auth.module.ts
 * @description Defines the Auth module.
 * Configures Passport strategies, JWT signing, and database connections.
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from '../prisma.module';
import { PaystackModule } from '../paystack/paystack.module';

import { AdminGuard } from './admin.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    PaystackModule,
  ],
  // FIX: Add AdminGuard to providers so NestJS creates an instance of it
  providers: [AuthService, JwtStrategy, GoogleStrategy, AdminGuard], 
  controllers: [AuthController],
  // Now you can safely export it to other modules
  exports: [AuthService, JwtModule, AdminGuard],
})
export class AuthModule {}