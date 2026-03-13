import { Controller, Post, Patch, Param, Get, Body, Query, UseInterceptors, UploadedFiles, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { ServiceType } from '@prisma/client';

import { FilingsService } from './filings.service';

import { CreateFilingDto } from './dto/create-filing.dto';
import { UpdateFilingDto } from './dto/update-filing.dto';

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
    @Query('serviceType') serviceType: ServiceType,
  ) {
    const userId = req.user?.sub; 

    if (!userId) {
       throw new UnauthorizedException('User ID not found in token');
    }

    return this.filingsService.createFiling(userId, createFilingDto, files, serviceType);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user?.sub;
    
    if (!userId) {
       throw new UnauthorizedException('User ID not found in token');
    }
    
    return this.filingsService.getUserFilings(userId);
  }

  @Patch(':id')
  async updateFiling(
    @Request() req,
    @Param('id') filingId: string,
    @Body() updateFilingDto: UpdateFilingDto
  ) {
    const adminId = req.user?.sub;
    return this.filingsService.updateFiling(adminId, filingId, updateFilingDto);
  }
}
