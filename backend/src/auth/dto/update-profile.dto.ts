import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Olivia Updated' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'olivia_new' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: '08099999999' })
  @IsOptional()
  @IsString()
  phone?: string;
}