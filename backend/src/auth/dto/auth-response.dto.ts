/**
 * @file auth-response.dto.ts
 * @description Defines the structure of API responses for the Auth module.
 * Using these classes ensures Swagger generates the 'Example Value' JSON automatically.
 */

import { ApiProperty } from '@nestjs/swagger';

/**
 * Standard response for Login, Signup, and Refresh Token endpoints.
 */
export class AuthTokensResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Access token (short lived)',
  })
  access_token: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT Refresh token (long lived)',
  })
  refresh_token: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if the user has admin privileges',
  })
  isAdmin: boolean;
}

/**
 * Standard response for simple confirmation messages.
 */
export class MessageResponseDto {
  @ApiProperty({
    example: 'Operation successful',
    description: 'Status message confirming the request',
  })
  message: string;
}

/**
 * Response shape for User Profile data.
 */
export class UserResponseDto {
  @ApiProperty({ example: 'uuid-1234-abcd-5678' })
  id: string;

  @ApiProperty({ example: 'olivia@example.com' })
  email: string;

  @ApiProperty({ example: 'olivia_ade' })
  username: string;

  @ApiProperty({ example: 'Olivia' })
  firstName: string;

  @ApiProperty({ example: 'Adebayo' })
  lastName: string;

  @ApiProperty({ example: 'Software Engineer', required: false })
  occupation?: string;

  @ApiProperty({ example: 'https://example.com/image.jpg', required: false })
  profilePicture?: string;
}