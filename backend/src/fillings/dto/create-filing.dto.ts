/**
 * @file create-filing.dto.ts
 * @description DTO for creating a new tax filing.
 * Handles nested JSON validation for multipart/form-data compatibility.
 */

import { 
  IsString, 
  IsOptional, 
  IsNumber, 
  ValidateNested, 
  IsIn, 
  IsEmail, 
  IsNumberString,
  IsDateString
} from 'class-validator';
import { Type, Transform, plainToInstance } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Helper to parse JSON strings in form-data
const ToClass = (cls: any) => Transform(({ value }) => {
  if (!value) return value;
  let obj = value;
  if (typeof value === 'string') {
    try { obj = JSON.parse(value); } catch (e) { return value; }
  }
  return plainToInstance(cls, obj);
});

class PersonalInfoDto {
  @ApiProperty({ example: 'Olivia Adebayo' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'olivia@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+2348012345678' })
  @IsString()
  phone: string;

  @ApiProperty({ example: '1995-01-01' })
  @IsDateString()
  dob: string;

  @ApiProperty({ example: 'Female' })
  @IsString()
  gender: string;

  @ApiProperty({ example: '123 Main St, Lagos' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'TIN-123456789' })
  @IsString()
  taxId: string;

  @ApiProperty({ example: 'Nigeria' })
  @IsString()
  country: string;
}

class IncomeDetailsDto {
  @ApiProperty({ example: 'Salary' })
  @IsString()
  source: string;

  @ApiProperty({ example: 'Full-time' })
  @IsString()
  employmentType: string;

  @ApiProperty({ example: '50000' })
  @IsNumberString({ no_symbols: false }) // Allows decimals
  grossIncome: string;

  @ApiPropertyOptional({ example: '5000' })
  @IsOptional()
  @IsNumberString({ no_symbols: false })
  withholdingAmount: string;
}

class DeductionDto {
  @ApiProperty({ example: 'Yes', description: 'Must be "Yes" or "No"' })
  @IsIn(['Yes', 'No'])
  hasDeductibleExpenses: 'Yes' | 'No'; // <--- CRITICAL FIX: Strict Type

  @ApiProperty({ example: 'No', description: 'Must be "Yes" or "No"' })
  @IsIn(['Yes', 'No'])
  hasDependents: 'Yes' | 'No';

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  donationAmount: number;
}

export class CreateFilingDto {
  @ApiPropertyOptional({ example: 2023 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  taxYear: number;

  @ApiPropertyOptional({ example: 'Federal' })
  @IsOptional()
  @IsString()
  type: string;

  @ApiProperty({ type: PersonalInfoDto, description: 'JSON object or stringified JSON' })
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  @ToClass(PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @ApiProperty({ type: IncomeDetailsDto, description: 'JSON object or stringified JSON' })
  @ValidateNested()
  @Type(() => IncomeDetailsDto)
  @ToClass(IncomeDetailsDto)
  incomeDetails: IncomeDetailsDto;

  @ApiProperty({ type: DeductionDto, description: 'JSON object or stringified JSON' })
  @ValidateNested()
  @Type(() => DeductionDto)
  @ToClass(DeductionDto)
  deductions: DeductionDto;
}