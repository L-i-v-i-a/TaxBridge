/**
 * @file update-filing.dto.ts
 * @description DTO for updating a tax filing. Intended for Admin use only.
 * Allows updating the status and the calculated tax amount.
 */

import { FilingStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFilingDto {
  @ApiPropertyOptional({
    description: 'The new status of the filing',
    enum: FilingStatus,
    example: FilingStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(FilingStatus)
  status?: FilingStatus;

  @ApiPropertyOptional({
    description: 'The calculated tax amount or refund',
    example: 1500.00,
    type: Number,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }) 
  amount?: number;
}