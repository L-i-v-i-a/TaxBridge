import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEmail, IsString, IsOptional, ValidateIf } from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional({ example: 'olivia@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'olivia_ade' })
  @IsOptional()
  @IsString()
  username?: string;

  // note: validation of "at least one of email or username" is performed in controller/service

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  password: string;
}