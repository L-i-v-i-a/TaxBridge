import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { PaystackService } from '../paystack/paystack.service';

import { CreatePricingDto, UpdatePricingDto } from './dto/pricing.dto';

@Injectable()
export class PricingService {
  // Define your test exchange rate here (1 USD = X NGN)
  private readonly USD_TO_NGN_RATE = 1500; 

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
    // 1. Convert USD Price to NGN
    const priceInNgn = dto.price * this.USD_TO_NGN_RATE;

    let paystackPlanCode: string | null = null;

    // 2. Create Plan on Paystack with NGN amount
    try {
      const interval = dto.type === 'monthly' ? 'monthly' : 'annually';
      const paystackPlan = await this.paystack.createPlan(dto.title, priceInNgn, interval);
      paystackPlanCode = paystackPlan.plan_code;
    } catch (error) {
      console.error('Failed to create Paystack plan:', error);
      throw new Error('Could not create plan on Paystack.');
    }

    // 3. Save to Database (Store original USD price)
    return this.prisma.pricingPlan.create({
      data: {
        title: dto.title,
        features: dto.features,
        price: dto.price, // Still stores USD in DB
        discount: dto.discount,
        type: dto.type,
        paystackPlanCode: paystackPlanCode,
      },
    });
  }

  async updatePlan(id: string, dto: UpdatePricingDto) {
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');

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
