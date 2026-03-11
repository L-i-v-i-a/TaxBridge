import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

interface AiResult {
  success: boolean;
  amount?: number;
  error?: string;
}

@Injectable()
export class AiService {
  private openai: OpenAI;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async calculateTax(incomeDetails: any, deductions: any): Promise<AiResult> {
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
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      const result = JSON.parse(content);

      return {
        success: result.success,
        amount: result.amount,
        error: result.error
      };

    } catch (error) {
      console.error("OpenAI Error:", error);
      return { success: false, error: "AI Service failed to process request" };
    }
  }

  // Fallback Mock Logic
  private async mockCalculation(incomeDetails: any, deductions: any): Promise<AiResult> {
    await new Promise(r => setTimeout(r, 500)); // Simulate delay
    
    // Simple mock: if income exists, succeed. Else fail.
    if (incomeDetails?.withholdingAmount) {
       return { success: true, amount: parseFloat(incomeDetails.withholdingAmount) * 0.15 };
    }
    return { success: false, error: "Insufficient data for calculation" };
  }
}