import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

interface AiResult {
  success: boolean;
  amount?: number;
  error?: string;
}

type AiResponse = {
  success: boolean;
  amount?: number;
  error?: string | null;
};

const isAiResponse = (value: unknown): value is AiResponse => {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  if (typeof record.success !== 'boolean') return false;
  if (
    record.amount !== undefined &&
    typeof record.amount !== 'number' &&
    record.amount !== null
  ) {
    return false;
  }
  if (
    record.error !== undefined &&
    typeof record.error !== 'string' &&
    record.error !== null
  ) {
    return false;
  }
  return true;
};

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async calculateTax(
    incomeDetails: { withholdingAmount?: string | number } | null,
    deductions: unknown,
  ): Promise<AiResult> {
    // If no API key is set, use Mock Logic for testing
    if (!this.openai) {
      return this.mockCalculation(incomeDetails, deductions);
    }

    try {
      const prompt = `
        You are a professional tax calculator AI.
        Analyze the following JSON data and calculate the estimated tax liability.
        
        Income Data: ${JSON.stringify(incomeDetails)}
        Deduction Data: ${JSON.stringify(deductions)}
        
        Rules:
        1. If the data is empty or too complex, return success: false.
        2. Otherwise calculate tax based on standard rates (mock rates if unknown).
        
        Return ONLY a valid JSON object in this exact format:
        { "success": boolean, "amount": number, "error": "string or null" }
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
      });

      // FIX: Extract content safely
      const content = response.choices[0].message.content;
      if (!content) {
        return { success: false, error: 'Empty AI response' };
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(content);
      } catch {
        return { success: false, error: 'Invalid AI response format' };
      }
      if (!isAiResponse(parsed)) {
        return { success: false, error: 'Unexpected AI response schema' };
      }
      return {
        success: parsed.success,
        amount: typeof parsed.amount === 'number' ? parsed.amount : undefined,
        error: typeof parsed.error === 'string' ? parsed.error : undefined,
      };
    } catch (error) {
      console.error('OpenAI Error:', error);
      return { success: false, error: 'AI Service failed to process request' };
    }
  }

  // Fallback Mock Logic
  private async mockCalculation(
    incomeDetails: { withholdingAmount?: string | number } | null,
    deductions: unknown,
  ): Promise<AiResult> {
    await new Promise((r) => setTimeout(r, 500)); // Simulate delay

    const hasDeductions = Boolean(deductions);
    const rate = hasDeductions ? 0.12 : 0.15;
    // Simple mock: if income exists, succeed. Else fail.
    if (incomeDetails?.withholdingAmount) {
      const baseAmount =
        typeof incomeDetails.withholdingAmount === 'string'
          ? parseFloat(incomeDetails.withholdingAmount)
          : incomeDetails.withholdingAmount;
      return {
        success: true,
        amount: baseAmount * rate,
      };
    }
    return { success: false, error: 'Insufficient data for calculation' };
  }
}
