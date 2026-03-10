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

import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
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
  @ApiOperation({ summary: 'Login user and get JWT' })
  @ApiResponse({ status: 200, description: 'JWT token' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
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
        name: { type: 'string', example: 'New Name' },
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