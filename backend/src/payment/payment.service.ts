import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { PaystackService } from '../paystack/paystack.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private paystack: PaystackService
  ) {}

  async initializeSubscription(userId: string, planId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id: planId } });

    if (!user || !plan) throw new NotFoundException('User or Plan not found');

    let amount = plan.price;
    if (plan.discount) {
      amount = amount - (amount * (plan.discount / 100));
    }

    const result = await this.paystack.initializeTransaction(
      user.email,
      amount,
      plan.paystackPlanCode || undefined
    );

    return result;
  }

  async verifyPayment(reference: string) {
    const verification = await this.paystack.verifyTransaction(reference);

    if (verification.status === 'success') {
      const email = verification.customer.email;
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (user && verification.plan) {
        const plan = await this.prisma.pricingPlan.findFirst({ 
          where: { paystackPlanCode: verification.plan }
        });

        if (plan) {
          await this.prisma.subscription.create({
            data: {
              userId: user.id,
              planId: plan.id,
              paystackSubscriptionCode: verification.subscription?.subscription_code,
              status: 'active',
            }
          });
        }
      }
    }

    return verification;
  }
}