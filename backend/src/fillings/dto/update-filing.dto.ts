import { FilingStatus } from '@prisma/client';

import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpdateFilingDto {
  @IsOptional()
  @IsEnum(FilingStatus)
  status?: FilingStatus;

  @IsOptional()
  @IsNumber()
  amount?: number;
}