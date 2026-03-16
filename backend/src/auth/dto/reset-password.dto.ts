/**
 * @file reset-password.dto.ts
 * @description Data Transfer Object for resetting a forgotten password.
 * Requires the user's email, the OTP received, and the new password.
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'The email address associated with the account.',
    example: 'olivia@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'The One-Time Password sent to the user email (usually 6 digits).',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: 'OTP is required.' })
  @MinLength(6, { message: 'OTP must be at least 6 characters.' })
  otp: string;

  @ApiProperty({
    description:
      'The new password. Must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number/special char.',
    example: 'NewStrongPass456!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'New password cannot be empty.' })
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak. It must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character.',
  })
  newPassword: string;
}
