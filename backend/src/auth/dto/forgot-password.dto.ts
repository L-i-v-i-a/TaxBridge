import { ApiProperty } from '@nestjs/swagger';

import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'olivia@example.com' })
  @IsEmail()
  email: string;
}