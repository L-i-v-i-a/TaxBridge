import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  MinLength,
  Matches,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Olivia', description: 'First name of the user' })
  @IsString()
  @IsNotEmpty({ message: 'First name is required.' })
  firstName: string;

  @ApiProperty({ example: 'Adebayo', description: 'Last name of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  @ApiPropertyOptional({
    example: 'Olivia Adebayo',
    description: 'Full name (optional, derived from first/last if omitted)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'olivia_ade',
    description: 'Unique username for the account',
    minLength: 4,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores.',
  })
  username: string;

  @ApiPropertyOptional({
    example: '+2348031234567',
    description: 'Phone number in E.164 format (optional)',
  })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Please provide a valid phone number.' })
  phone?: string;

  @ApiProperty({
    example: 'olivia@example.com',
    description: 'User email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '1995-05-20',
    description: 'Date of birth in ISO 8601 format (YYYY-MM-DD)',
  })
  @IsDateString(
    {},
    { message: 'Date of birth must be a valid ISO date string.' },
  )
  dateOfBirth: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description:
      'Password (min 8 chars, requires upper, lower, and number/symbol)',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak. It must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character.',
  })
  password: string;

  @ApiPropertyOptional({
    example: '123-45-6789',
    description: 'Social Security Number (Optional). Highly sensitive data.',
  })
  @IsOptional()
  @IsString()
  // Basic validation for SSN format (US Example). Adjust regex for your specific region.
  @Matches(/^\d{3}-\d{2}-\d{4}$/, {
    message: 'SSN must be in the format XXX-XX-XXXX',
  })
  ssn?: string;
}
