// src/ai/ai.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import OpenAI from 'openai';

import { TAX_DATA } from './tax-data.constant';

// Interfaces
export interface AiResult {
  success: boolean;
  amount?: number;
  error?: string;
  taxType?: string;
  region?: string | null;
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

export interface ExtractedDocumentData {
  documentType: string;
  summary: string;
  extractedFields: Record<string, any>;
  confidenceScore: number;
}

@Injectable()
export class AiService {
  // Groq Client (Text)
  private groqClient: OpenAI | null = null;
  // Google Client (Vision)
  private googleClient: GoogleGenerativeAI | null = null;
  
  private readonly logger = new Logger(AiService.name);

  constructor(private config: ConfigService) {
    // 1. Init Groq
    const groqKey = this.config.get<string>('GROQ_API_KEY');
    if (groqKey) {
      this.groqClient = new OpenAI({
        apiKey: groqKey,
        baseURL: 'https://api.groq.com/openai/v1',
      });
      this.logger.log('Groq Client initialized (Text).');
    }

    // 2. Init Google
    const googleKey = this.config.get<string>('GOOGLE_API_KEY');
    if (googleKey) {
      this.googleClient = new GoogleGenerativeAI(googleKey);
      this.logger.log('Google Gemini Client initialized (Vision/OCR).');
    }
  }

  /**
   * OCR: Uses Google Gemini 1.5 Flash (Free Tier)
   */
  async extractFromDocument(imageBase64: string): Promise<ExtractedDocumentData> {
    if (!this.googleClient) throw new Error('Google Client not initialized');

    try {
      // 1. Clean Base64 Data (remove data URI prefix)
      const matches = imageBase64.match(/^data:(.+?);base64,(.*)$/);
      const mimeType = matches ? matches[1] : 'image/jpeg';
      const base64Data = matches ? matches[2] : imageBase64;

      // 2. Try Latest Model first, fallback to Stable
      let model;
      try {
        // Try the specific latest version
        model = this.googleClient.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      } catch (e) {
        // Fallback to stable vision model
        this.logger.warn('Gemini 1.5 not found, falling back to gemini-1.0-pro-vision');
        model = this.googleClient.getGenerativeModel({ model: 'gemini-1.0-pro-vision' });
      }

      const prompt = `You are a professional Tax Document Analyzer. Analyze this image.
      1. Identify the document type (e.g., W-2, 1099, State Tax Return, Donation Receipt).
      2. Determine the tax jurisdiction: Is this Federal or a specific State? If state, which one?
      3. Extract all relevant financial numbers (Wages, Taxes Withheld, Amounts, Dates).
      4. Summarize the content briefly.
      
      Return strictly JSON format matching this interface:
      { 
        "documentType": string, 
        "summary": string, 
        "extractedFields": { 
          "jurisdiction": "Federal" | "State", 
          "region": "string (e.g., California) or null if Federal",
          "wages": number,
          "tax_withheld": number 
        }, 
        "confidenceScore": number 
      }`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
      ]);

      const response = await result.response;
      const text = response.text();
      
      // Clean potential markdown formatting
      let jsonStr = text.trim();
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.slice(7, -3).trim();
      } else if (jsonStr.startsWith("```")) {
         jsonStr = jsonStr.slice(3, -3).trim();
      }

      return JSON.parse(jsonStr) as ExtractedDocumentData;
    } catch (error) {
      this.logger.error('Google OCR Error:', error);
      throw error;
    }
  }

  /**
   * CALCULATION: Uses Groq (Llama 3.1)
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

    if (this.groqClient) {
      try {
        return await this.aiCalculation(taxYear, incomeDetails, deductions, documentContext);
      } catch (error) {
        this.logger.error(`Groq AI Error: ${error.message}. Falling back to local logic.`);
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
    if (!this.groqClient) throw new Error('Groq client not initialized.');

    const contextPrompt = documentContext 
      ? `\n\nAdditional Context from User Documents:\n${documentContext}\n\nUse this context to identify the tax jurisdiction (Federal vs State) and verify numbers.`
      : '';

    const prompt = `
      You are a US Tax Professional expert in both Federal and State tax laws.
      Calculate the tax liability/refund for ${taxYear}.
      
      User Input:
      Income: ${JSON.stringify(incomeDetails)}
      Deductions: ${JSON.stringify(deductions)}
      ${contextPrompt}
      
      Instructions:
      1. Determine jurisdiction: Is this Federal or State tax?
      2. Region Detection: If the context indicates a specific state, use that. If no state is detected, DEFAULT to 'California'.
      3. Apply the relevant tax brackets and standard deductions for that jurisdiction and year.
      
      Return JSON strictly in this format:
      { 
        "success": boolean, 
        "amount": number (refund positive, owe negative), 
        "error": "string or null", 
        "taxType": "Federal" | "State",
        "region": "string (e.g., 'California') or null if Federal"
      }
    `;

    const response = await this.groqClient.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error('Empty AI response');
    return JSON.parse(content);
  }

  /**
   * CHAT: Uses Groq (Llama 3.1)
   */
  async chat(userMessage: string, history: ChatMessage[] = []): Promise<string> {
    if (!this.groqClient) return "I'm sorry, the AI service is offline.";

    try {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: 'You are a helpful Tax Assistant.' },
        ...history,
        { role: 'user', content: userMessage }
      ];

      const response = await this.groqClient.chat.completions.create({
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
   * LOCAL FALLBACK
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

      if (deductions.hasDeductibleExpenses === 'Yes') totalDeductions += 5000;
      if (deductions.donationAmount) totalDeductions += parseFloat(String(deductions.donationAmount));

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
        taxType: 'Federal',
        region: null
      };
    } catch (err) {
      this.logger.error('Local calculation failed', err);
      return { success: false, error: 'Internal calculation error' };
    }
  }
}