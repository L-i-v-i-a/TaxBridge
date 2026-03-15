import { Injectable, BadRequestException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { PaystackService } from '../paystack/paystack.service';

@Injectable()
export class PaymentService {
  // Same rate as PricingService
  private readonly USD_TO_NGN_RATE = 1500;

  constructor(
    private prisma: PrismaService,
    private paystack: PaystackService
  ) {}

  async initializeSubscription(userId: string, planId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id: planId } });

    if (!user || !plan) throw new BadRequestException('User or Plan not found');

    if (!user.paystackCustomerId) {
      const customer = await this.paystack.createCustomer(user.email, user.firstName || 'User', user.lastName || '');
      await this.prisma.user.update({
        where: { id: userId },
        data: { paystackCustomerId: customer.customer_code },
      });
    }

    if (!plan.paystackPlanCode) throw new BadRequestException('Plan is not configured for payments');

    // Convert price to NGN for transaction initialization (if needed for initial charge setup)
    // Note: Paystack Subscription uses the Plan's set amount, but we initialize with amount for validation/initial auth
    const priceInNgn = plan.price * this.USD_TO_NGN_RATE;

    const transaction = await this.paystack.initializeTransaction(user.email, priceInNgn, plan.paystackPlanCode);

    return {
      authorization_url: transaction.authorization_url,
      access_code: transaction.access_code,
      reference: transaction.reference,
    };
  }

  async verifyPayment(reference: string) {
    const verification = await this.paystack.verifyTransaction(reference);

    if (verification.status !== 'success') {
      throw new BadRequestException('Payment verification failed');
    }

    const userEmail = verification.customer.email;
    const planCode = verification.plan?.plan_code;
    const subscriptionCode = verification.subscription?.subscription_code;
    const emailToken = verification.subscription?.email_token;

    const user = await this.prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) throw new BadRequestException('User not found');

    const plan = await this.prisma.pricingPlan.findFirst({ where: { paystackPlanCode: planCode } });
    if (!plan) throw new BadRequestException('Plan not found');

    const existingSubscription = await this.prisma.subscription.findFirst({
      where: { userId: user.id, planId: plan.id }
    });

    if (existingSubscription) {
      return this.prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: 'active',
          paystackSubscriptionCode: subscriptionCode,
          paystackEmailToken: emailToken,
          nextPaymentDate: verification.next_payment_date ? new Date(verification.next_payment_date) : null
        }
      });
    }

    return this.prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        status: 'active',
        paystackSubscriptionCode: subscriptionCode,
        paystackEmailToken: emailToken,
        nextPaymentDate: verification.next_payment_date ? new Date(verification.next_payment_date) : null
      }
    });
  }
}