import { Injectable } from '@nestjs/common';

import { CalculateRefundDto } from './dto/calculate-refund.dto';

@Injectable()
export class RefundCalculatorService {
  calculate(dto: CalculateRefundDto) {
    const { annualIncome, federalTaxWithheld } = dto;

    // 2024 US Federal Tax Constants (Single Filer Status)
    const STANDARD_DEDUCTION = 14_600;
    
    // Calculate Taxable Income (Gross Income - Standard Deduction)
    // If taxable income is negative (income < deduction), set to 0
    const taxableIncome = Math.max(0, annualIncome - STANDARD_DEDUCTION);

    // Calculate Tax Liability using 2024 Marginal Brackets
    let estimatedTaxLiability = 0;

    if (taxableIncome <= 0) {
      estimatedTaxLiability = 0;
    } 
    // Bracket 1: 10% for income over $0
    else if (taxableIncome <= 11_600) {
      estimatedTaxLiability = taxableIncome * 0.10;
    } 
    // Bracket 2: 12% for income over $11,600
    // Tax = $1,160 (10% of previous bracket max) + 12% of excess
    else if (taxableIncome <= 47_150) {
      estimatedTaxLiability = 1_160 + (taxableIncome - 11_600) * 0.12;
    } 
    // Bracket 3: 22% for income over $47,150
    // Tax = $5,426 (cumulative tax from previous brackets) + 22% of excess
    else if (taxableIncome <= 100_525) {
      estimatedTaxLiability = 5_426 + (taxableIncome - 47_150) * 0.22;
    } 
    // Bracket 4: 24% for income over $100,525
    // Tax = $17,168.50 (cumulative) + 24% of excess
    else if (taxableIncome <= 191_950) {
      estimatedTaxLiability = 17_168.50 + (taxableIncome - 100_525) * 0.24;
    } 
    // Bracket 5: 32% for income over $191,950
    // Tax = $39,110.50 (cumulative) + 32% of excess
    else if (taxableIncome <= 243_725) {
      estimatedTaxLiability = 39_110.50 + (taxableIncome - 191_950) * 0.32;
    } 
    // Bracket 6: 35% for income over $243,725
    // Tax = $55,678.50 (cumulative) + 35% of excess
    else if (taxableIncome <= 609_350) {
      estimatedTaxLiability = 55_678.50 + (taxableIncome - 243_725) * 0.35;
    } 
    // Bracket 7: 37% for income over $609,350
    // Tax = $183_647.25 (cumulative) + 37% of excess
    else {
      estimatedTaxLiability = 183_647.25 + (taxableIncome - 609_350) * 0.37;
    }

    // Refund/Owed = Total Withheld - Calculated Tax Liability
    const estimatedRefund = federalTaxWithheld - estimatedTaxLiability;

    return {
      estimatedRefund: Math.round(estimatedRefund),
      currency: 'USD',
      annualIncome,
      federalTaxWithheld,
      taxableIncome: Math.round(taxableIncome),
      effectiveTaxRate: taxableIncome > 0 
        ? `${((estimatedTaxLiability / annualIncome) * 100).toFixed(2)}%` 
        : '0%',
      message:
        estimatedRefund > 0
          ? `Estimated refund: $${Math.abs(estimatedRefund).toLocaleString()}`
          : `Estimated tax owed: $${Math.abs(estimatedRefund).toLocaleString()}`,
    };
  }
}
