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

import { AdminGuard } from '../auth/admin.guard'; // Import the AdminGuard
import { CreateFilingDto } from './dto/create-filing.dto';

import { FilingsService } from './filings.service';

import { UpdateFilingDto } from './dto/update-filing.dto';

@ApiTags('Filings')
@ApiBearerAuth() // Applies JWT authentication to all routes in this controller
@Controller('filings')
@UseGuards(AuthGuard('jwt')) // Default protection: User must be logged in
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
  @UseInterceptors(FilesInterceptor('documents', 10)) // Max 10 files
  async create(
    @Request() req,
    @Body() createFilingDto: CreateFilingDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Query('serviceType', new ParseEnumPipe(ServiceType)) serviceType: ServiceType,
  ) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    return this.filingsService.createFiling(
      userId,
      createFilingDto,
      files,
      serviceType,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all filings for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of user filings',
    schema: {
      type: 'array',
      example: [
        {
          id: 'uuid-1234',
          filingId: 'F2024-001',
          status: 'COMPLETED',
          amount: 1500.00,
        },
      ],
    },
  })
  async findAll(@Request() req) {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    return this.filingsService.getUserFilings(userId);
  }

  @Patch(':id')
  @UseGuards(AdminGuard) // SECURITY: Only Admins can access this route
  @ApiOperation({ summary: 'Update a filing status or amount (Admin Only)' })
  @ApiResponse({
    status: 200,
    description: 'Filing updated successfully',
    schema: {
      example: {
        id: 'uuid-1234',
        status: 'APPROVED',
        amount: 1450.00,
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Forbidden (Admins only)' })
  async updateFiling(
    @Request() req,
    @Param('id') filingId: string,
    @Body() updateFilingDto: UpdateFilingDto,
  ) {
    // We can pass the adminId for logging purposes, though AdminGuard ensures validity
    const adminId = req.user?.sub;
    return this.filingsService.updateFiling(adminId, filingId, updateFilingDto);
  }
}