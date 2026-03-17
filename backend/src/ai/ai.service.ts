// src/ai/ai.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

import { TAX_DATA } from './tax-data.constant';

// Interfaces
export interface AiResult {
  success: boolean;
  amount?: number;
  error?: string;
  taxType?: string; // Added: Federal or State name
}

export interface IncomeDetailsDto {
  grossIncome: number | string;
  withholdingAmount?: number | string;
}

export interface DeductionsDto {
  hasDeductibleExpenses?: 'Yes' | 'No';
  donationAmount?: number | string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// NEW: Structured output for document extraction
export interface ExtractedDocumentData {
  documentType: string; // e.g., "W2", "1099-INT", "Receipt", "Bank Statement"
  summary: string;
  extractedFields: Record<string, any>; // Key-value pairs
  confidenceScore: number; // 0.0 to 1.0
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
   * NEW: DOCUMENT OCR & EXTRACTION
   * Uses Llama 3.2 Vision to analyze document images.
   */
  async extractFromDocument(imageBase64: string): Promise<ExtractedDocumentData> {
    if (!this.client) throw new Error('AI client not initialized');

    try {
      const response = await this.client.chat.completions.create({
        model: 'llama-3.2-11b-vision-preview', // Vision-capable model
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are a professional Tax Document Analyzer. Analyze this image.
                1. Identify the document type (e.g., W-2, 1099, Donation Receipt, Medical Bill).
                2. Extract all relevant financial numbers (Income, Taxes Withheld, Amounts, Dates).
                3. Summarize the content briefly.
                
                Return strictly JSON format matching this interface:
                { "documentType": string, "summary": string, "extractedFields": object, "confidenceScore": number }
                `,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64, // Expects data:image/jpeg;base64,...
                },
              },
            ],
          },
        ],
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error('Empty AI response');
      
      return JSON.parse(content) as ExtractedDocumentData;
    } catch (error) {
      this.logger.error('Document Extraction Error:', error);
      throw error;
    }
  }

  /**
   * TAX CALCULATION FEATURE
   */
  async calculateTax(
    taxYear: number,
    incomeDetails: IncomeDetailsDto,
    deductions: DeductionsDto,
    documentContext?: string,
  ): Promise<AiResult> {
    if (!incomeDetails || !deductions) {
      return { success: false, error: 'Missing input data.' };
    }

    if (this.client) {
      try {
        return await this.aiCalculation(taxYear, incomeDetails, deductions, documentContext);
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
    documentContext?: string,
  ): Promise<AiResult> {
    const client = this.client;
    if (!client) throw new Error('AI client not initialized.');

    const contextPrompt = documentContext 
      ? `\n\nAdditional Context from User Documents:\n${documentContext}\n\nUse this context to cross-verify the numbers provided.`
      : '';

    const prompt = `
      You are a US Tax Professional.
      Calculate ${taxYear} US Federal Income Tax for:
      Income: ${JSON.stringify(incomeDetails)}
      Deductions: ${JSON.stringify(deductions)}
      ${contextPrompt}
      
      Determine if this is a Federal or State tax calculation based on the data. Default to Federal if unspecified.
      
      Return JSON: { "success": boolean, "amount": number, "error": "string or null", "taxType": "string (e.g., 'Federal', 'State - CA')" }
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
   * CHAT FEATURE
   */
  async chat(userMessage: string, history: ChatMessage[] = []): Promise<string> {
    if (!this.client) return "I'm sorry, the AI service is offline.";

    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: 'You are a helpful Tax Assistant...',
        },
        ...history,
        { role: 'user', content: userMessage }
      ];

      const response = await this.client.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: messages,
      });

      return response.choices[0].message.content || "I couldn't generate a response.";
    } catch (error) {
      this.logger.error('Chat AI Error:', error);
      return "Sorry, encountered an error.";
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
      const taxPaid = parseFloat(String(incomeDetails.withholdingAmount || '0'));

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

      // FIX: Define finalAmount before using it
      const finalAmount = taxPaid - taxOwed;

      return {
        success: true,
        amount: Math.round(finalAmount * 100) / 100,
        taxType: 'Federal'
      };
    } catch (err) {
      this.logger.error('Local calculation failed', err);
      return { success: false, error: 'Internal calculation error' };
    }
  }
}