import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { diskStorage } from 'multer';

import { extname } from 'path';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard'; // create this guard
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or email/username taken' })
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT + refresh token' })
  @ApiResponse({ status: 200, description: 'Login successful with tokens and admin status' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    description: 'Provide either email or username with password',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        username: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['password'],
    },
    type: LoginDto,
  })
  async login(@Body() dto: LoginDto) {
    const identifier = dto.email ?? dto.username;
    if (!identifier) {
      // this should be caught by class-validator but add runtime safety
      throw new BadRequestException('Email or username must be provided');
    }
    return this.authService.login(identifier, dto.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login/signup' })
  @ApiResponse({ status: 302, description: 'Redirect to Google' })
  async googleAuth() {
    // Passport handles the redirect
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Login/signup successful with tokens' })
  async googleAuthRedirect(@Req() req) {
    const user = req.user;
    const tokens = await this.authService.generateTokensForUser(user);
    return { message: 'Google login successful', isAdmin: user.isAdmin, ...tokens };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ status: 200, description: 'New tokens returned' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send OTP to email for password reset' })
  @ApiResponse({ status: 200, description: 'OTP sent' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiResponse({ status: 200, description: 'Password reset' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password (logged-in user)' })
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.sub, dto.oldPassword, dto.newPassword);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req) {
    return this.authService.getProfile(req.user.sub);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update profile (optional file upload)',
    type: UpdateProfileDto,
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'Olivia' },
        lastName: { type: 'string', example: 'Adebayo' },
        ein: { type: 'string', example: '12-3456789' },
        numberOfDependents: { type: 'number', example: 2 },
        occupation: { type: 'string', example: 'Engineer' },
        streetAddress: { type: 'string', example: '123 Main St' },
        zipCode: { type: 'string', example: '90210' },
        city: { type: 'string', example: 'Los Angeles' },
        state: { type: 'string', example: 'CA' },
        country: { type: 'string', example: 'USA' },
        filingStatus: { type: 'string', example: 'single' },
        username: { type: 'string' },
        phone: { type: 'string' },
        profilePicture: {
          type: 'string',
          format: 'binary',
          description: 'Profile picture file (jpg/png)',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Update profile (including picture)' })
  async updateProfile(
    @Req() req,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.updateProfile(req.user.sub, dto, file);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout (client-side token removal recommended)' })
  async logout() {
    // JWT is stateless → just instruct client to delete token
    return { message: 'Logout successful - delete JWT from client' };
  }
}