import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { CreatePricingDto, UpdatePricingDto } from './dto/pricing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('pricing')
@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('monthly')
  @ApiOperation({ summary: 'Get all monthly pricing plans' })
  async getMonthly() {
    return this.pricingService.getMonthlyPlans();
  }

  @Get('yearly')
  @ApiOperation({ summary: 'Get all yearly pricing plans' })
  async getYearly() {
    return this.pricingService.getYearlyPlans();
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all pricing plans (admin)' })
  async getAll() {
    return this.pricingService.getAllPlans();
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new pricing plan (admin)' })
  @ApiResponse({ status: 201, description: 'Plan created' })
  async create(@Body() dto: CreatePricingDto) {
    return this.pricingService.createPlan(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a pricing plan (admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdatePricingDto) {
    return this.pricingService.updatePlan(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a pricing plan (admin)' })
  async delete(@Param('id') id: string) {
    return this.pricingService.deletePlan(id);
  }
}
