/**
 * @file login.dto.ts
 * @description Data Transfer Object for user authentication.
 * Allows users to log in using either their email or username.
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiPropertyOptional({
    description: 'User email address. Required if username is not provided.',
    example: 'olivia@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email format is invalid.' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Username. Required if email is not provided.',
    example: 'olivia_ade',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'User password.',
    example: 'StrongPass123!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}
