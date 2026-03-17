/**
 * @file filings.controller.ts
 * @description Handles API routes for Tax Filing management.
 */

import {
  Controller,
  Post,
  Patch,
  Param,
  Get,
  Body,
  Query,
  UseInterceptors,
  UploadedFiles,
  Request,
  UseGuards,
  UnauthorizedException,
  ParseEnumPipe,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ServiceType } from '@prisma/client';

import { AdminGuard } from '../auth/admin.guard';

import { FilingsService } from './filings.service';

import { CreateFilingDto } from './dto/create-filing.dto';
import { UpdateFilingDto } from './dto/update-filing.dto';

@ApiTags('Filings')
@ApiBearerAuth()
@Controller('filings')
@UseGuards(AuthGuard('jwt'))
export class FilingsController {
  constructor(private readonly filingsService: FilingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Tax Filing' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Filing data including personal info, income, and deductions.',
    type: CreateFilingDto,
  })
  @ApiQuery({
    name: 'serviceType',
    enum: ServiceType,
    description: 'Type of service requested',
  })
  @ApiResponse({
    status: 201,
    description: 'Filing created successfully',
    schema: {
      example: {
        id: 'uuid-1234',
        filingId: 'F2024-001',
        status: 'COMPLETED',
        amount: 1500.00,
        createdAt: '2023-10-01T12:00:00Z',
      },
    },
  })
  @UseInterceptors(FilesInterceptor('documents', 10))
  async create(
    @Request() req,
    @Body() createFilingDto: CreateFilingDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('serviceType', new ParseEnumPipe(ServiceType)) serviceType: ServiceType,
  ) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User ID not found in token');

    return this.filingsService.createFiling(
      userId,
      createFilingDto,
      files,
      serviceType,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all filings for the current user' })
  async findAll(@Request() req) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User ID not found in token');
    return this.filingsService.getUserFilings(userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get filing statistics for the logged-in user' })
  async getStats(@Request() req) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User ID not found');
    return this.filingsService.getUserFilingStats(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single filing by ID (Admin/User)' })
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User ID not found');
    return this.filingsService.getFilingById(id, userId);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a filing status or amount (Admin Only)' })
  async updateFiling(
    @Request() req,
    @Param('id') filingId: string,
    @Body() updateFilingDto: UpdateFilingDto,
  ) {
    const adminId = req.user?.sub;
    if (!adminId) throw new UnauthorizedException('Admin ID not found');
    
    return this.filingsService.updateFiling(adminId, filingId, updateFilingDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a filing (Admin Only)' })
  async remove(@Param('id') id: string) {
    return this.filingsService.deleteFiling(id);
  }
}