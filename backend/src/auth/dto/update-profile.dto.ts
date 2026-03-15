/**
 * @file update-profile.dto.ts
 * @description DTO for updating user profile information.
 * All fields are optional; validation only runs if the field is present.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsPhoneNumber,
  IsIn,
  Matches,
} from 'class-validator';

// Allowed filing statuses for validation
const FILING_STATUSES = ['single', 'married', 'head_of_household'] as const;

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Olivia', description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Adebayo', description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: '12-3456789',
    description: 'Employer Identification Number (EIN)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}-\d{7}$/, {
    message: 'EIN must be in the format XX-XXXXXXX.',
  })
  ein?: string;

  @ApiPropertyOptional({
    example: 2,
    description: 'Number of dependents (must be a non-negative integer)',
  })
  @IsOptional()
  @IsInt({ message: 'Number of dependents must be an integer.' })
  @Min(0, { message: 'Number of dependents cannot be negative.' })
  numberOfDependents?: number;

  @ApiPropertyOptional({ example: 'Software Engineer' })
  @IsOptional()
  @IsString()
  occupation?: string;

  @ApiPropertyOptional({ example: '123 Main St' })
  @IsOptional()
  @IsString()
  streetAddress?: string;

  @ApiPropertyOptional({ example: '90210' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ example: 'Los Angeles' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'CA' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'USA' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    example: 'single',
    description: 'Filing status (single, married, head_of_household)',
    enum: FILING_STATUSES,
  })
  @IsOptional()
  @IsString()
  @IsIn(FILING_STATUSES, {
    message:
      'Filing status must be one of: single, married, head_of_household.',
  })
  filingStatus?: string;

  @ApiPropertyOptional({
    example: 'olivia_new',
    description: 'Unique username (alphanumeric and underscores only)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  })
  username?: string;

  @ApiPropertyOptional({
    example: '+2348099999999',
    description: 'Phone number in E.164 format',
  })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Please provide a valid phone number.' })
  phone?: string;
}
