import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

interface AiResult {
  success: boolean;
  amount?: number;
  error?: string;
}

// Configuration for Single Filers
interface TaxConfig {
  standardDeduction: number;
  brackets: { rate: number; min: number; max: number }[];
}

// Historical Tax Data (2019-2024) for Single Filers
const TAX_DATA: Record<number, TaxConfig> = {
  2024: {
    standardDeduction: 14600,
    brackets: [
      { rate: 0.10, min: 0, max: 11600 },
      { rate: 0.12, min: 11600, max: 47150 },
      { rate: 0.22, min: 47150, max: 100525 },
      { rate: 0.24, min: 100525, max: 191950 },
      { rate: 0.32, min: 191950, max: 243725 },
      { rate: 0.35, min: 243725, max: 609350 },
      { rate: 0.37, min: 609350, max: Infinity },
    ],
  },
  2023: {
    standardDeduction: 13850,
    brackets: [
      { rate: 0.10, min: 0, max: 11000 },
      { rate: 0.12, min: 11000, max: 44725 },
      { rate: 0.22, min: 44725, max: 95375 },
      { rate: 0.24, min: 95375, max: 182100 },
      { rate: 0.32, min: 182100, max: 231250 },
      { rate: 0.35, min: 231250, max: 578125 },
      { rate: 0.37, min: 578125, max: Infinity },
    ],
  },
  2022: {
    standardDeduction: 12950,
    brackets: [
      { rate: 0.10, min: 0, max: 10275 },
      { rate: 0.12, min: 10275, max: 41775 },
      { rate: 0.22, min: 41775, max: 89075 },
      { rate: 0.24, min: 89075, max: 170050 },
      { rate: 0.32, min: 170050, max: 215950 },
      { rate: 0.35, min: 215950, max: 539900 },
      { rate: 0.37, min: 539900, max: Infinity },
    ],
  },
  2021: {
    standardDeduction: 12550,
    brackets: [
      { rate: 0.10, min: 0, max: 9950 },
      { rate: 0.12, min: 9950, max: 40525 },
      { rate: 0.22, min: 40525, max: 86375 },
      { rate: 0.24, min: 86375, max: 164925 },
      { rate: 0.32, min: 164925, max: 209425 },
      { rate: 0.35, min: 209425, max: 523600 },
      { rate: 0.37, min: 523600, max: Infinity },
    ],
  },
  2020: {
    standardDeduction: 12400,
    brackets: [
      { rate: 0.10, min: 0, max: 9875 },
      { rate: 0.12, min: 9875, max: 40125 },
      { rate: 0.22, min: 40125, max: 85525 },
      { rate: 0.24, min: 85525, max: 163300 },
      { rate: 0.32, min: 163300, max: 207350 },
      { rate: 0.35, min: 207350, max: 518400 },
      { rate: 0.37, min: 518400, max: Infinity },
    ],
  },
  2019: {
    standardDeduction: 12200,
    brackets: [
      { rate: 0.10, min: 0, max: 9700 },
      { rate: 0.12, min: 9700, max: 39475 },
      { rate: 0.22, min: 39475, max: 84200 },
      { rate: 0.24, min: 84200, max: 160725 },
      { rate: 0.32, min: 160725, max: 204100 },
      { rate: 0.35, min: 204100, max: 510300 },
      { rate: 0.37, min: 510300, max: Infinity },
    ],
  },
};

@Injectable()
export class AiService {
  private openai: OpenAI | null = null;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async calculateTax(taxYear: number, incomeDetails: any, deductions: any): Promise<AiResult> {
    // If no OpenAI client, use Mock
    if (!this.openai) {
      return this.mockCalculation(taxYear, incomeDetails, deductions);
    }

    try {
      const prompt = `
        You are a US Tax Professional.
        Calculate ${taxYear} US Federal Income Tax for:
        Income Details: ${JSON.stringify(incomeDetails)}
        Deductions: ${JSON.stringify(deductions)}
        
        Return JSON: { "success": boolean, "amount": number, "error": "string or null" }
        Amount should be the final tax due or refund amount (negative for refund).
      `;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("Empty AI response");

      return JSON.parse(content);

    } catch (error) {
      console.warn(`⚠️ OpenAI Error (Falling back to Mock): ${error.message}`);
      return this.mockCalculation(taxYear, incomeDetails, deductions);
    }
  }

  /**
   * MOCK CALCULATOR: Real US Tax Logic for any year (2019-2024)
   */
  private async mockCalculation(taxYear: number, incomeDetails: any, deductions: any): Promise<AiResult> {
    await new Promise(r => setTimeout(r, 500)); // Simulate processing

    try {
      // 1. Get Gross Income (Total Earnings)
      const grossIncome = parseFloat(incomeDetails?.grossIncome || '0');
      
      // 2. Get Tax Already Paid (Withholding)
      const taxPaid = parseFloat(incomeDetails?.withholdingAmount || '0');

      if (isNaN(grossIncome) || grossIncome <= 0) {
        return { success: false, error: "Valid Gross Income required" };
      }

      // 3. Get Tax Config for the Year (Default to 2024 if year unknown)
      const config = TAX_DATA[taxYear] || TAX_DATA[2024];

      // 4. Calculate Deductions
      let totalDeductions = config.standardDeduction;

      if (deductions?.hasDeductibleExpenses === 'Yes') {
        totalDeductions += 5000; // Simplified estimation
      }
      if (deductions?.donationAmount) {
        totalDeductions += Number(deductions.donationAmount);
      }

      // 5. Taxable Income
      const taxableIncome = Math.max(0, grossIncome - totalDeductions);

      // 6. Calculate Tax using Brackets
      let taxOwed = 0;
      for (const bracket of config.brackets) {
        if (taxableIncome > bracket.min) {
          const width = bracket.max - bracket.min;
          const incomeInBracket = Math.min(taxableIncome - bracket.min, width);
          taxOwed += incomeInBracket * bracket.rate;
        }
      }

      // 7. Calculate Refund/Due
      // Positive = Refund (Paid more than owed), Negative = Owe Money
      const finalAmount = taxPaid - taxOwed;

      return { 
        success: true, 
        amount: Math.round(finalAmount * 100) / 100 
      };

    } catch (err) {
      console.error(err);
      return { success: false, error: "Mock calculation failed" };
    }
  }
}