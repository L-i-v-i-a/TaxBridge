// src/admin/admin.module.ts
import { Module } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { AuthModule } from '../auth/auth.module'; 

import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';// For AdminGuard

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}