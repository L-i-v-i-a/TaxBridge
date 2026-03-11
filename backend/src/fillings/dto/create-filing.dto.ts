import { IsString, IsObject, IsOptional, IsNumber, IsEnum, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';

class PersonalInfoDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  dob: string;

  @IsString()
  gender: string;

  @IsString()
  address: string;

  @IsString()
  taxId: string;

  @IsString()
  country: string;
}

class IncomeDetailsDto {
  @IsString()
  source: string;

  @IsString()
  employmentType: string;

  @IsOptional()
  @IsString()
  withholdingAmount: string;
}

class DeductionDto {
  @IsString()
  hasDeductibleExpenses: string;

  @IsString()
  hasDependents: string;
  
  @IsOptional()
  @IsNumber()
  donationAmount: number;
}

export class CreateFilingDto {
  @IsOptional()
  @IsNumber()
  taxYear: number;

  @IsOptional()
  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @ValidateNested()
  @Type(() => IncomeDetailsDto)
  incomeDetails: IncomeDetailsDto;

  @ValidateNested()
  @Type(() => DeductionDto)
  deductions: DeductionDto;
}