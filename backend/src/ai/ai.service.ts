/**
 * @file ai.service.ts
 * @description Core business logic for tax calculations and AI chat using Groq (OpenAI Compatible).
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

import { TAX_DATA } from './tax-data.constant';

// Interfaces
export interface AiResult {
  success: boolean;
  amount?: number;
  error?: string;
}

export interface IncomeDetailsDto {
  grossIncome: number | string;
  withholdingAmount?: number | string;
}

export interface DeductionsDto {
  hasDeductibleExpenses?: 'Yes' | 'No';
  donationAmount?: number | string;
}

// Interface for Chat History
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Injectable()
export class AiService {
  private client: OpenAI | null = null;
  private readonly logger = new Logger(AiService.name);

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('GROQ_API_KEY');

    if (apiKey) {
      this.client = new OpenAI({
        apiKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      this.logger.log('Groq AI Client initialized successfully.');
    } else {
      this.logger.warn('GROQ_API_KEY not found. Using Mock Calculator only.');
    }
  }

  /**
   * TAX CALCULATION FEATURE
   */
  async calculateTax(
    taxYear: number,
    incomeDetails: IncomeDetailsDto,
    deductions: DeductionsDto,
  ): Promise<AiResult> {
    if (!incomeDetails || !deductions) {
      return { success: false, error: 'Missing input data.' };
    }

    if (this.client) {
      try {
        return await this.aiCalculation(taxYear, incomeDetails, deductions);
      } catch (error) {
        this.logger.error(
          `Groq AI Error: ${error.message}. Falling back to local logic.`,
        );
      }
    }

    return this.localCalculation(taxYear, incomeDetails, deductions);
  }

  private async aiCalculation(
    taxYear: number,
    incomeDetails: IncomeDetailsDto,
    deductions: DeductionsDto,
  ): Promise<AiResult> {
    const client = this.client;
    if (!client) {
      throw new Error('AI client is not initialized.');
    }

    const prompt = `
      You are a US Tax Professional.
      Calculate ${taxYear} US Federal Income Tax for:
      Income: ${JSON.stringify(incomeDetails)}
      Deductions: ${JSON.stringify(deductions)}
      
      Return JSON: { "success": boolean, "amount": number, "error": "string or null" }
    `;

    const response = await client.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty AI response');
    return JSON.parse(content);
  }

  /**
   * CHAT FEATURE (UPDATED)
   * Now accepts history to maintain context (ChatGPT-like memory).
   */
  async chat(userMessage: string, history: ChatMessage[] = []): Promise<string> {
    if (!this.client) {
      return "I'm sorry, the AI service is currently offline. Please try again later.";
    }

    try {
      // Construct messages array: System Prompt + History + Current User Message
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: 'You are a helpful Tax Assistant for a tax filing platform. You answer questions about tax laws, filing procedures, and help users organize their financial data. Be concise and professional. Remember context from previous messages.',
        },
        // Spread previous history
        ...history,
        // Add current user message
        { role: 'user', content: userMessage }
      ];

      const response = await this.client.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: messages,
      });

      return response.choices[0].message.content || "I couldn't generate a response.";
    } catch (error) {
      this.logger.error('Chat AI Error:', error);
      return "Sorry, I encountered an error processing your request. Please try again.";
    }
  }

  /**
   * LOCAL CALCULATOR
   */
  private async localCalculation(
    taxYear: number,
    incomeDetails: IncomeDetailsDto,
    deductions: DeductionsDto,
  ): Promise<AiResult> {
    await new Promise((r) => setTimeout(r, 100));

    try {
      const grossIncome = parseFloat(String(incomeDetails.grossIncome || '0'));
      const taxPaid = parseFloat(
        String(incomeDetails.withholdingAmount || '0'),
      );

      if (isNaN(grossIncome) || grossIncome <= 0) {
        return { success: false, error: 'Valid Gross Income required' };
      }

      const config = TAX_DATA[taxYear] || TAX_DATA[2024];

      let totalDeductions = config.standardDeduction;

      if (deductions.hasDeductibleExpenses === 'Yes') {
        totalDeductions += 5000;
      }
      if (deductions.donationAmount) {
        totalDeductions += parseFloat(String(deductions.donationAmount));
      }

      const taxableIncome = Math.max(0, grossIncome - totalDeductions);

      let taxOwed = 0;
      for (const bracket of config.brackets) {
        if (taxableIncome > bracket.min) {
          const width = bracket.max - bracket.min;
          const incomeInBracket = Math.min(taxableIncome - bracket.min, width);
          taxOwed += incomeInBracket * bracket.rate;
        }
      }

      const finalAmount = taxPaid - taxOwed;

      return {
        success: true,
        amount: Math.round(finalAmount * 100) / 100,
      };
    } catch (err) {
      this.logger.error('Local calculation failed', err);
      return { success: false, error: 'Internal calculation error' };
    }
  }
}