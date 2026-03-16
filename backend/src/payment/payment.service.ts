import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { PaystackService } from '../paystack/paystack.service';

@Injectable()
export class PaymentService {
  private readonly USD_TO_NGN_RATE = 1500;

  constructor(
    private prisma: PrismaService,
    private paystack: PaystackService
  ) {}

  async initializeSubscription(userId: string, planId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const plan = await this.prisma.pricingPlan.findUnique({ where: { id: planId } });

    if (!user || !plan) throw new BadRequestException('User or Plan not found');

    // Ensure Customer exists
    if (!user.paystackCustomerId) {
      const customer = await this.paystack.createCustomer(user.email, user.firstName || 'User', user.lastName || '');
      await this.prisma.user.update({
        where: { id: userId },
        data: { paystackCustomerId: customer.customer_code },
      });
    }

    if (!plan.paystackPlanCode) throw new BadRequestException('Plan is not configured for payments');

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
    // Paystack returns subscription details if a plan was involved
    const subscriptionData = verification.subscription;
    
    const user = await this.prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) throw new BadRequestException('User not found');

    // Determine plan from verification if possible, otherwise fallback
    // Note: verification.plan might be present depending on Paystack response structure for subscription init
    const planCode = verification.plan?.plan_code || verification.plan;
    
    const plan = await this.prisma.pricingPlan.findFirst({ 
      where: { paystackPlanCode: planCode } 
    });
    
    // If plan not found via code (sometimes Paystack returns ID), fallback logic needed or error
    if (!plan) {
        // Fallback: Try to find the most recent plan for the user if logic allows, or throw error
        throw new BadRequestException('Plan associated with this payment could not be found.');
    }

    // Check for existing subscription
    const existingSubscription = await this.prisma.subscription.findFirst({
      where: { userId: user.id, planId: plan.id }
    });

    const subscriptionCode = subscriptionData?.subscription_code;
    const emailToken = subscriptionData?.email_token;

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

  // --- User Actions ---

  async getMySubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateCard(userId: string) {
    const subscription = await this.getMySubscription(userId);
    if (!subscription || !subscription.paystackSubscriptionCode) {
      throw new NotFoundException('Active subscription not found');
    }

    const result = await this.paystack.generateUpdateLink(subscription.paystackSubscriptionCode);
    return { authorization_url: result.link };
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.getMySubscription(userId);
    if (!subscription || !subscription.paystackSubscriptionCode) {
      throw new NotFoundException('Active subscription not found');
    }

    await this.paystack.disableSubscription(
      subscription.paystackSubscriptionCode, 
      subscription.paystackEmailToken || '' // Email token is required by Paystack
    );

    return this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'cancelled' }
    });
  }

  async changePlan(userId: string, newPlanId: string) {
    // 1. Get Current Active Subscription
    const currentSub = await this.prisma.subscription.findFirst({
      where: { userId, status: 'active' },
      include: { plan: true }
    });

    if (!currentSub) {
      throw new NotFoundException('No active subscription found to modify.');
    }

    if (currentSub.planId === newPlanId) {
      throw new BadRequestException('You are already on this plan.');
    }

    const newPlan = await this.prisma.pricingPlan.findUnique({ where: { id: newPlanId } });
    if (!newPlan || !newPlan.paystackPlanCode) {
      throw new NotFoundException('New plan not found or not configured.');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // 2. Determine Next Billing Date
    // We want the new plan to start when the old one was supposed to renew
    const nextBillingDate = currentSub.nextPaymentDate || new Date();

    // 3. Cancel Old Subscription on Paystack
    // We disable the recurring charge for the old plan
    if (currentSub.paystackSubscriptionCode) {
      try {
        await this.paystack.disableSubscription(
          currentSub.paystackSubscriptionCode,
          currentSub.paystackEmailToken || ''
        );
      } catch (error) {
        // Log error but maybe proceed if it fails (e.g. if it was already cancelled)
        console.error('Warning: Could not cancel old Paystack subscription', error.message);
      }
    }

    // Update old subscription status locally
    await this.prisma.subscription.update({
      where: { id: currentSub.id },
      data: { status: 'cancelled' }
    });

    // 4. Create New Subscription on Paystack with delayed start
    // This uses the user's existing card authorization
    const newPaystackSub = await this.paystack.createSubscription(
      user.email, // Paystack uses email or customer code to find existing auth
      newPlan.paystackPlanCode,
      nextBillingDate // Schedule for future
    );

    // 5. Create new DB record
    return this.prisma.subscription.create({
      data: {
        userId: userId,
        planId: newPlanId,
        status: 'active', // It is active, just scheduled for future charge
        paystackSubscriptionCode: newPaystackSub.subscription_code,
        paystackEmailToken: newPaystackSub.email_token,
        startDate: nextBillingDate, // The effective start date
        nextPaymentDate: newPaystackSub.next_payment_date ? new Date(newPaystackSub.next_payment_date) : nextBillingDate
      }
    });
  }

  // --- Admin Actions ---

  async getAllUsersWithSubscriptions() {
    const users = await this.prisma.user.findMany({
      where: { isAdmin: false },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        subscriptions: {
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Flatten for frontend ease
    return users.map(user => {
      const sub = user.subscriptions[0];
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        subscription: sub ? {
          id: sub.id,
          status: sub.status,
          startDate: sub.startDate,
          planName: sub.plan?.title,
          planType: sub.plan?.type
        } : null
      };
    });
  }

  async adminDeleteSubscription(subscriptionId: string) {
    // Optionally cancel on Paystack first
    const sub = await this.prisma.subscription.findUnique({ where: { id: subscriptionId } });
    if (sub?.paystackSubscriptionCode && sub.paystackEmailToken) {
      try {
        await this.paystack.disableSubscription(sub.paystackSubscriptionCode, sub.paystackEmailToken);
      } catch (e) {
        console.error('Failed to cancel on Paystack, deleting locally anyway', e);
      }
    }

    return this.prisma.subscription.delete({ where: { id: subscriptionId } });
  }
}