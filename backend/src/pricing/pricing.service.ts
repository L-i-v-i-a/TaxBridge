import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePricingDto, UpdatePricingDto } from './dto/pricing.dto';

@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.pricingPlan.create({
      data: dto,
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
