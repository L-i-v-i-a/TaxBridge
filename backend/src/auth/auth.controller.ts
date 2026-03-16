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
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { diskStorage } from 'multer';

import { extname } from 'path';

import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

import {
  AuthTokensResponseDto,
  MessageResponseDto,
  UserResponseDto,
} from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
/**
 * Security Filter: Only allow image files.
 * Prevents upload of malicious scripts.
 */
const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new BadRequestException('Only image files are allowed!'),
      false,
    );
  }
  callback(null, true);
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
    schema: {
      example: {
        id: 'uuid-1234',
        email: 'olivia@example.com',
        username: 'olivia_ade',
        createdAt: '2023-10-01T12:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input or email taken' })
  async signup(@Body() dto: SignupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and get JWT + refresh token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthTokensResponseDto,
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        isAdmin: false,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    const identifier = dto.email ?? dto.username;
    if (!identifier) {
      throw new BadRequestException('Email or username must be provided');
    }
    return this.authService.login(identifier, dto.password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth login/signup' })
  async googleAuth() {
    // Passport handles redirect automatically
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthRedirect(
    @Req() req: Request & { user?: any },
    @Res() res: Response,
  ) {
    const user = req.user;
    if (!user) {
      throw new BadRequestException('Google authentication failed');
    }

    const tokens = this.authService.generateTokensForUser(user);

    // Securely read frontend URL from .env
    const frontendUrl = this.config.get<string>('FRONTEND_URL') || 'http://localhost:3001';

    const query = new URLSearchParams({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      isAdmin: String(user.isAdmin),
    }).toString();

    return res.redirect(`${frontendUrl}/callback?${query}`);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'New tokens returned',
    type: AuthTokensResponseDto,
    schema: {
      example: { access_token: 'new_jwt_token...', refresh_token: 'new_refresh_token...' },
    },
  })
  async refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send OTP to email' })
  @ApiResponse({ status: 200, 
    type: MessageResponseDto,
    schema: { example: { message: 'OTP sent successfully' } } })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiResponse({ status: 200, type: MessageResponseDto, schema: { example: { message: 'Password reset successful' } } })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto.email, dto.otp, dto.newPassword);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change password (logged-in user)' })
  @ApiResponse({ status: 200, type: MessageResponseDto, schema: { example: { message: 'Password changed successfully' } } })
  async changePassword(
    @Req() req: Request & { user?: { sub?: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    if (!req.user?.sub) throw new BadRequestException('Invalid user context');
    return this.authService.changePassword(req.user.sub, dto.oldPassword, dto.newPassword);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    type: UserResponseDto,
    description: 'User profile data',
    schema: {
      example: {
        id: 'uuid',
        email: 'olivia@example.com',
        firstName: 'Olivia',
        lastName: 'Adebayo',
        isAdmin: false,
      },
    },
  })
  async getProfile(@Req() req: Request & { user?: { sub?: string } }) {
    if (!req.user?.sub) throw new BadRequestException('Invalid user context');
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
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: imageFileFilter, // Security: Image only
      limits: { fileSize: 5 * 1024 * 1024 }, // Security: 5MB limit
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update profile details or picture',
    type: UpdateProfileDto,
  })
  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({
    status: 200,
    type: UserResponseDto, 
  })
  async updateProfile(
    @Req() req: Request & { user?: { sub?: string } },
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!req.user?.sub) throw new BadRequestException('Invalid user context');
    return this.authService.updateProfile(req.user.sub, dto, file);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    type: MessageResponseDto,
    schema: { example: { message: 'Logout successful' } } 
  })
  async logout(@Req() req: Request & { user?: { sub?: string } }) {
    return { message: 'Logout successful - delete JWT from client' };
  }
}
