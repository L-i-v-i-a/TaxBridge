import { IsString, IsOptional, IsNumber, ValidateNested } from 'class-validator';

import { Type, Transform, plainToInstance } from 'class-transformer';

// Helper to parse JSON strings in form-data
const ToClass = (cls: any) =>
  Transform(({ value }) => {
    if (!value) return value;
    let obj = value;
    if (typeof value === 'string') {
      try {
        obj = JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return plainToInstance(cls, obj);
  });

class PersonalInfoDto {
  @IsString() name: string;
  @IsString() email: string;
  @IsString() phone: string;
  @IsString() dob: string;
  @IsString() gender: string;
  @IsString() address: string;
  @IsString() taxId: string;
  @IsString() country: string;
}

class IncomeDetailsDto {
  @IsString() source: string;
  @IsString() employmentType: string;

  // NEW FIELD ADDED HERE
  @IsOptional()
  @IsString()
  grossIncome: string;

  @IsOptional()
  @IsString()
  withholdingAmount: string;
}

class DeductionDto {
  @IsString() hasDeductibleExpenses: string;
  @IsString() hasDependents: string;
  
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  donationAmount: number;
}

export class CreateFilingDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  taxYear: number;

  @IsOptional()
  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => PersonalInfoDto)
  @ToClass(PersonalInfoDto)
  personalInfo: PersonalInfoDto;

  @ValidateNested()
  @Type(() => IncomeDetailsDto)
  @ToClass(IncomeDetailsDto)
  incomeDetails: IncomeDetailsDto;

  @ValidateNested()
  @Type(() => DeductionDto)
  @ToClass(DeductionDto)
  deductions: DeductionDto;
}
