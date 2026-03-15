/**
 * @file ai.service.ts
 * @description Core business logic for tax calculations.
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

import { TAX_DATA } from './tax-data.constant';

// Interfaces moved to top for clarity
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

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;
  private readonly logger = new Logger(AiService.name);

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.logger.warn('OPENAI_API_KEY not found. Using Mock Calculator only.');
    }
  }

  async calculateTax(
    taxYear: number,
    incomeDetails: IncomeDetailsDto,
    deductions: DeductionsDto,
  ): Promise<AiResult> {
    if (!incomeDetails || !deductions) {
      return { success: false, error: 'Missing input data.' };
    }

    // Attempt AI first
    if (this.openai) {
      try {
        return await this.aiCalculation(taxYear, incomeDetails, deductions);
      } catch (error) {
        this.logger.error(
          `OpenAI Error: ${error.message}. Falling back to local logic.`,
        );
      }
    }

    // Fallback to deterministic local calculation
    return this.localCalculation(taxYear, incomeDetails, deductions);
  }

  private async aiCalculation(
    taxYear: number,
    incomeDetails: IncomeDetailsDto,
    deductions: DeductionsDto,
  ): Promise<AiResult> {
    // FIX: Assign to local variable to narrow type from 'OpenAI | null' to 'OpenAI'
    const openaiClient = this.openai;
    if (!openaiClient) {
      throw new Error('AI client is not initialized.');
    }

    const prompt = `
      You are a US Tax Professional.
      Calculate ${taxYear} US Federal Income Tax for:
      Income: ${JSON.stringify(incomeDetails)}
      Deductions: ${JSON.stringify(deductions)}
      
      Return JSON: { "success": boolean, "amount": number, "error": "string or null" }
    `;

    const response = await openaiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty AI response');
    return JSON.parse(content);
  }

  /**
   * LOCAL CALCULATOR
   * Uses imported TAX_DATA for accurate, offline calculations.
   */
  private async localCalculation(
    taxYear: number,
    incomeDetails: IncomeDetailsDto,
    deductions: DeductionsDto,
  ): Promise<AiResult> {
    await new Promise((r) => setTimeout(r, 100)); // Minimal delay for UI feel

    try {
      const grossIncome = parseFloat(String(incomeDetails.grossIncome || '0'));
      const taxPaid = parseFloat(
        String(incomeDetails.withholdingAmount || '0'),
      );

      if (isNaN(grossIncome) || grossIncome <= 0) {
        return { success: false, error: 'Valid Gross Income required' };
      }

      // Retrieve config from imported constant
      const config = TAX_DATA[taxYear] || TAX_DATA[2024];

      let totalDeductions = config.standardDeduction;

      if (deductions.hasDeductibleExpenses === 'Yes') {
        totalDeductions += 5000; // Simplified estimation
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