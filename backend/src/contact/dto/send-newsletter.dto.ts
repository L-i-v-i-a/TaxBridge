import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendNewsletterDto {
  @ApiProperty({ example: 'Monthly Tax Tips' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Here are some tips for filing your taxes...' })
  @IsString()
  content: string;
}
