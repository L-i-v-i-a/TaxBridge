import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';

@Injectable()
export class PaystackService {
  private secretKey: string;
  private baseUrl = 'https://api.paystack.co';

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
      console.error('Paystack Create Customer Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to create Paystack customer');
    }
  }

  async createPlan(name: string, amount: number, interval: string) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/plan`,
        { 
          name, 
          amount: Math.round(amount * 100), 
          interval,
          currency: "USD"
        },
        { headers: this.getHeaders() },
      );
      return response.data.data;
    } catch (error) {
      console.error('Paystack Create Plan Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to create Paystack plan');
    }
  }

  async initializeTransaction(email: string, amount: number, plan_code?: string) {
    try {
      const payload: any = {
        email,
        amount: Math.round(amount * 100),
        currency: "USD",
        callback_url: "http://localhost:3000/payment/verify"
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
      console.error('Paystack Init Transaction Error:', error.response?.data || error.message);
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
      console.error('Paystack Verify Error:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to verify transaction');
    }
  }
}