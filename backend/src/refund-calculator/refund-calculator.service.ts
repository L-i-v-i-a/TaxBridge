import { Injectable } from '@nestjs/common';

import { CalculateRefundDto } from './dto/calculate-refund.dto';

@Injectable()
export class RefundCalculatorService {
  calculate(dto: CalculateRefundDto) {
    const { annualIncome, federalTaxWithheld } = dto;

    // Placeholder: very rough US-style estimation (2025 brackets simplified)
    // In reality: use progressive brackets, deductions, etc.
    let estimatedTaxLiability = 0;

    if (annualIncome <= 11600) {
      estimatedTaxLiability = annualIncome * 0.1;
    } else if (annualIncome <= 47150) {
      estimatedTaxLiability = 1160 + (annualIncome - 11600) * 0.12;
    } else if (annualIncome <= 100525) {
      estimatedTaxLiability = 5426 + (annualIncome - 47150) * 0.22;
    } else {
      // Simplified for higher – add more brackets later
      estimatedTaxLiability =
        5426 + (100525 - 47150) * 0.22 + (annualIncome - 100525) * 0.24;
    }

    // Refund = withheld - liability (positive = refund, negative = owe)
    const estimatedRefund = federalTaxWithheld - estimatedTaxLiability;

    return {
      estimatedRefund: Math.round(estimatedRefund),
      currency: '$', // Change to '₦' later for Nigeria
      annualIncome,
      federalTaxWithheld,
      message:
        estimatedRefund > 0
          ? `Estimated refund: $${Math.abs(estimatedRefund).toLocaleString()}`
          : `You may owe: $${Math.abs(estimatedRefund).toLocaleString()}`,
    };
  }
}
