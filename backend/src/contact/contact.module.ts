import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
// JwtService will be provided by AuthModule
import { AdminGuard } from '../auth/admin.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ContactService, PrismaService, ConfigService, AdminGuard],
  controllers: [ContactController],
})
export class ContactModule {}
