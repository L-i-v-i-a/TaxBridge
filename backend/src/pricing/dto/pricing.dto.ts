import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsString, IsArray, IsNumber, IsOptional, IsIn } from 'class-validator';

export class CreatePricingDto {
  @ApiProperty({ example: 'Basic Plan' })
  @IsString()
  title: string;

  @ApiProperty({
    example: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({ example: 'monthly', enum: ['monthly', 'yearly'] })
  @IsIn(['monthly', 'yearly'])
  type: string;
}

export class UpdatePricingDto {
  @ApiPropertyOptional({ example: 'Updated Basic Plan' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: ['Updated Feature 1', 'Feature 2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({ example: 39.99 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  discount?: number;
}
