import { ApiProperty } from '@nestjs/swagger';

import { IsNumber, Min } from 'class-validator'; // ← Import this

export class CalculateRefundDto {
  @ApiProperty({
    description: 'Annual income in dollars (or your currency)',
    example: 50000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  annualIncome: number;

  @ApiProperty({
    description: 'Federal tax already withheld/paid',
    example: 7000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  federalTaxWithheld: number;
}
