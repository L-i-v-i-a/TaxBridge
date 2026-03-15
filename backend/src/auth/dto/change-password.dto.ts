/**
 * @file change-password.dto.ts
 * @description Data Transfer Object for user password updates.
 * Enforces strong password policies and input validation.
 */

import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength, IsNotEmpty, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: "The·user's·current·password·for·verification.",
    example: 'CurrentPassword123!',
  })
  @IsString()
  @IsNotEmpty({ message: 'Current password cannot be empty.' })
  oldPassword: string;

  @ApiProperty({
    description:
      'The new password. Must be at least 8 characters long, contain an uppercase letter, a lowercase letter, and a number/special character.',
    example: 'NewStrongPass456!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty({ message: 'New password cannot be empty.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak. It must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character.',
  })
  newPassword: string;
}
