import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminGuard } from '../auth/admin.guard';

@Module({
  providers: [ContactService, PrismaService, ConfigService, JwtService, AdminGuard],
  controllers: [ContactController],
})
export class ContactModule {}