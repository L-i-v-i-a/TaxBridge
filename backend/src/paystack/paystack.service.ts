import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
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
    // 1. Validate Environment Variable
    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    
    if (!frontendUrl) {
      this.logger.error('FRONTEND_URL is not defined in environment variables!');
      throw new InternalServerErrorException('Server configuration error: Frontend URL missing.');
    }

    // 2. Construct Callback URL (Handle trailing slashes safely)
    const callback_url = `${frontendUrl.replace(/\/$/, '')}/payment/verify`;
    
    // 3. Debug Log: Check your server logs to see exactly what URL is being sent
    this.logger.debug(`Initializing transaction. Callback URL: ${callback_url}`);

    try {
      const payload: any = {
        email,
        amount: Math.round(amountInNgn * 100),
        currency: "NGN",
        callback_url // Ensure this is added to payload
      };
      
      if (plan_code) {
        payload.plan = plan_code;
      }

      const response = await axios.post(
        `${this.baseUrl}/transaction/initialize`,
        payload,
        { headers: this.getHeaders() },
      );
      
      // 4. Log the returned URL from Paystack
      this.logger.debug(`Paystack Authorization URL: ${response.data.data.authorization_url}`);

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

  async createSubscription(customer: string, plan: string, start_date?: Date) {
    try {
      const payload: any = {
        customer,
        plan,
      };

      if (start_date) {
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