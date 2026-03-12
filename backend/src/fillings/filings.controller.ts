import { Controller, Post, Get, Body, Query, UseInterceptors, UploadedFiles, Request, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';

import { ServiceType } from '@prisma/client';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { FilingsService } from './filings.service';

import { CreateFilingDto } from './dto/create-filing.dto';

@Controller('filings')
export class FilingsController {
  constructor(private readonly filingsService: FilingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FilesInterceptor('documents', 10))
  async handleTaxAction(
    @Request() req,
    @Body() createFilingDto: CreateFilingDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('serviceType') serviceType: ServiceType
  ) {
    // Extract userId from JWT (mocked here for demo)
    const userId = req.user?.id || 'user_123';
    
    return this.filingsService.createFiling(userId, createFilingDto, files, serviceType);
  }

  @Get()
  async getHistory(@Request() req) {
    const userId = req.user?.id || 'user_123';
    return this.filingsService.getUserFilings(userId);
  }
}