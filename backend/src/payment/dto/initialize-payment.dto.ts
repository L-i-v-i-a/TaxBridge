import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNotEmpty } from 'class-validator';

export class InitializePaymentDto {
  @ApiProperty({ example: 'plan-id-123' })
  @IsString()
  @IsNotEmpty()
  planId: string;
}