import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { PaystackService } from '../paystack/paystack.service';

import { CreatePricingDto, UpdatePricingDto } from './dto/pricing.dto';

@Injectable()
export class PricingService {
  constructor(
    private prisma: PrismaService,
    private paystack: PaystackService
  ) {}

  async getMonthlyPlans() {
    return this.prisma.pricingPlan.findMany({
      where: { type: 'monthly' },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getYearlyPlans() {
    return this.prisma.pricingPlan.findMany({
      where: { type: 'yearly' },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createPlan(dto: CreatePricingDto) {
    const interval = dto.type === 'monthly' ? 'monthly' : 'annually';
    
    const paystackPlan = await this.paystack.createPlan(
      dto.title,
      dto.price,
      interval
    );

    return this.prisma.pricingPlan.create({
      data: {
        ...dto,
        paystackPlanCode: paystackPlan.plan_code
      },
    });
  }

  async updatePlan(id: string, dto: UpdatePricingDto) {
    return this.prisma.pricingPlan.update({
      where: { id },
      data: dto,
    });
  }

  async deletePlan(id: string) {
    return this.prisma.pricingPlan.delete({
      where: { id },
    });
  }

  async getAllPlans() {
    return this.prisma.pricingPlan.findMany({
      orderBy: { type: 'asc', createdAt: 'asc' },
    });
  }
}
