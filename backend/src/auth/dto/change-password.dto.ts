import { ApiProperty } from '@nestjs/swagger';

import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'OldPass123!' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'NewStrongPass456!', minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword: string;
}