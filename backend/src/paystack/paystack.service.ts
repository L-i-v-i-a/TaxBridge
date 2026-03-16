import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';

@Injectable()
export class PaystackService {
  private secretKey: string;
  private baseUrl = 'https://api.paystack.co';
  private readonly logger = new Logger(PaystackService.name);

  constructor(private config: ConfigService) {
    this.secretKey = this.config.get<string>('PAYSTACK_SECRET_KEY') || '';
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };
  }

  async createCustomer(email: string, first_name: string, last_name: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/customer`,
        { email, first_name, last_name },
        { headers: this.getHeaders() },
      );
      return response.data.data;
    } catch (error) {
      this.logger.error('Paystack Create Customer Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to create Paystack customer');
    }
  }

  async createPlan(name: string, amountInNgn: number, interval: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/plan`,
        { 
          name, 
          amount: Math.round(amountInNgn * 100), 
          interval,
          currency: "NGN" 
        },
        { headers: this.getHeaders() },
      );
      return response.data.data;
    } catch (error) {
      this.logger.error('Paystack Create Plan Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to create Paystack plan');
    }
  }

  async initializeTransaction(email: string, amountInNgn: number, plan_code?: string) {
    try {
      const payload: any = {
        email,
        amount: Math.round(amountInNgn * 100),
        currency: "NGN",
        callback_url: `${this.config.get('FRONTEND_URL')}/payment/verify`
      };
      
      if (plan_code) {
        payload.plan = plan_code;
      }

      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        payload,
        { headers: this.getHeaders() },
      );
      return response.data.data;
    } catch (error) {
      this.logger.error('Paystack Init Transaction Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to initialize transaction');
    }
  }

  async verifyTransaction(reference: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transaction/verify/${reference}`,
        { headers: this.getHeaders() },
      );
      return response.data.data;
    } catch (error) {
      this.logger.error('Paystack Verify Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to verify transaction');
    }
  }

  async disableSubscription(subscription_code: string, email_token: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/subscription/disable`,
        { code: subscription_code, token: email_token },
        { headers: this.getHeaders() },
      );
      return response.data.data;
    } catch (error) {
      this.logger.error('Paystack Disable Subscription Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to cancel subscription');
    }
  }

  async generateUpdateLink(subscription_code: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/subscription/${subscription_code}/manage/link`,
        { headers: this.getHeaders() },
      );
      return response.data.data;
    } catch (error) {
      this.logger.error('Paystack Generate Update Link Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to generate update link');
    }
  }

  /**
   * NEW: Creates a subscription directly using an existing authorization (card)
   * Can set a start_date to delay the first charge.
   */
  async createSubscription(customer: string, plan: string, start_date?: Date) {
    try {
      const payload: any = {
        customer,
        plan,
      };

      if (start_date) {
        // Paystack expects ISO 8601 format
        payload.start_date = start_date.toISOString();
      }

      const response = await axios.post(
        `${this.baseUrl}/subscription`,
        payload,
        { headers: this.getHeaders() },
      );
      return response.data.data;
    } catch (error) {
      this.logger.error('Paystack Create Subscription Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to create new subscription');
    }
  }
}