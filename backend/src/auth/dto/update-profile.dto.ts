import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Olivia', description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Adebayo', description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: '12-3456789', description: 'Employer Identification Number' })
  @IsOptional()
  @IsString()
  ein?: string;

  @ApiPropertyOptional({ example: 2, description: 'Number of dependents' })
  @IsOptional()
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

  @ApiPropertyOptional({ example: 'single', description: 'Filing status' })
  @IsOptional()
  @IsString()
  filingStatus?: string;

  @ApiPropertyOptional({ example: 'olivia_new' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: '08099999999' })
  @IsOptional()
  @IsString()
  phone?: string;
}