import { Controller, Post, Get, Body, Query, UseInterceptors, UploadedFiles, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { ServiceType } from '@prisma/client';

import { FilingsService } from './filings.service';

import { CreateFilingDto } from './dto/create-filing.dto';

@Controller('filings')
@UseGuards(AuthGuard('jwt'))
export class FilingsController {
  constructor(private readonly filingsService: FilingsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('documents', 10))
  async create(
    @Request() req,
    @Body() createFilingDto: CreateFilingDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('serviceType') serviceType: ServiceType
  ) {
    // FIX: Changed from req.user.userId to req.user.sub
    const userId = req.user?.sub; 

    console.log('Extracted User ID:', userId); // Log to verify

    if (!userId) {
       throw new UnauthorizedException('User ID not found in token');
    }

    return this.filingsService.createFiling(userId, createFilingDto, files, serviceType);
  }

  @Get()
  async findAll(@Request() req) {
    // FIX: Changed from req.user.userId to req.user.sub
    const userId = req.user?.sub;
    
    if (!userId) {
       throw new UnauthorizedException('User ID not found in token');
    }
    
    return this.filingsService.getUserFilings(userId);
  }
}