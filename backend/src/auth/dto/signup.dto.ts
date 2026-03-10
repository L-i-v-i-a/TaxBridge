import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsString, IsEmail, IsOptional, IsDateString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Olivia Adebayo', description: 'Full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'olivia_ade', minLength: 4 })
  @IsString()
  @MinLength(4)
  username: string;

  @ApiPropertyOptional({ example: '08031234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'olivia@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1995-05-20', description: 'ISO date string' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ example: 'StrongPass123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: '123-45-6789' })
  @IsOptional()
  @IsString()
  ssn?: string;
}