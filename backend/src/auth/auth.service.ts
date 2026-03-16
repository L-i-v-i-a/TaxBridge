/**
 * @file auth.service.ts
 * @description Handles authentication logic, token generation, and user management.
 */

import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from '@prisma/client';

import * as bcrypt from 'bcrypt';

import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

import { PrismaService } from '../prisma.service';
import { PaystackService } from '../paystack/paystack.service';

import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

interface JwtPayload {
  sub: string;
  email: string;
  isAdmin: boolean;
}

@Injectable()
export class AuthService {
  private transporter: Transporter | null = null;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private paystack: PaystackService,
  ) {
    // Initialize Nodemailer Transporter
    const gmailUser = this.config.get<string>('GMAIL_USER');
    const gmailPass = this.config.get<string>('GMAIL_APP_PASSWORD');

    if (gmailUser && gmailPass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
    } else {
      this.logger.warn('Email credentials not configured. Email features disabled.');
    }
  }

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create Paystack Customer
    let paystackCustomerId: string | null = null;
    try {
      const customer = await this.paystack.createCustomer(
        dto.email,
        dto.firstName || 'User',
        dto.lastName || '',
      );
      paystackCustomerId = customer.customer_code;
    } catch (err) {
      this.logger.error('Paystack customer creation failed', err);
      // We continue signup even if Paystack fails, or you could throw error depending on requirements
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        username:
          dto.username || dto.email.split('@')[0] + Math.floor(Math.random() * 1000),
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : new Date('2000-01-01'),
        paystackCustomerId: paystackCustomerId,
        name: `${dto.firstName} ${dto.lastName}`.trim(),
        // Map other fields from DTO if provided
      },
    });

    return { message: 'Signup successful', userId: user.id };
  }

  async login(identifier: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Send Login Notification Email (Non-blocking)
    if (this.transporter) {
      this.sendLoginEmail(user).catch(err => 
        this.logger.error('Failed to send login email', err)
      );
    }

    return this.generateTokens(user);
  }

  async validateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string; 
  }) {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
      },
    });

    if (!user) {
      let paystackCustomerId: string | null = null;
      try {
        const customer = await this.paystack.createCustomer(
          googleUser.email,
          googleUser.firstName || 'User',
          googleUser.lastName || '',
        );
        paystackCustomerId = customer.customer_code;
      } catch (err) {
        this.logger.error('Paystack customer creation failed for Google user', err);
      }

      const username =
        googleUser.email.split('@')[0] + Math.random().toString(36).substring(7);
      user = await this.prisma.user.create({
        data: {
          googleId: googleUser.googleId,
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          name: `${googleUser.firstName} ${googleUser.lastName}`.trim(),
          username,
          dateOfBirth: new Date('2000-01-01'),
          password: '', // No password for Google users
          isVerified: true,
          paystackCustomerId,
          profilePicture: googleUser.picture,
        },
      });
    } else if (!user.googleId) {
      // Link Google ID to existing account
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.googleId },
      });
    }

    return user;
  }

  generateTokensForUser(user: Pick<User, 'id' | 'email' | 'isAdmin'>) {
    return this.generateTokens(user);
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Security: Always return success message to prevent User Enumeration
    if (!user) {
      this.logger.warn(`Password reset requested for non-existent email: ${email}`);
      return { message: 'If that email exists in our system, an OTP has been sent.' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10); // Security: Hash OTP like a password
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await this.prisma.user.update({
      where: { email },
      data: { otp: hashedOtp, otpExpiresAt: expires },
    });

    if (!this.transporter) {
      this.logger.warn(`Email service down. OTP for ${email} is: ${otp}`); // Log OTP in dev for testing
      return { message: 'OTP would be sent (email service not configured).' };
    }

    try {
      await this.transporter.sendMail({
        from: `"Taxbridge" <${this.config.get<string>('GMAIL_USER')}>`,
        to: [email],
        subject: 'Your Taxbridge Password Reset OTP',
        html: `<p>Your OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`,
      });
    } catch (err) {
      this.logger.error('Failed to send reset email', err);
      throw new InternalServerErrorException('Failed to send reset email');
    }

    return { message: 'If that email exists in our system, an OTP has been sent.' };
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.otp || !user.otpExpiresAt) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Check if OTP is expired
    if (user.otpExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Security: Compare hashed OTP
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpiresAt: null,
      },
    });

    return { message: 'Password reset successful' };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    // Google users might not have passwords
    if (!user.password) {
      throw new BadRequestException('Please set a password via "Forgot Password" first.');
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { message: 'Password changed successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        username: true,
        phone: true,
        email: true,
        dateOfBirth: true,
        profilePicture: true,
        ein: true,
        numberOfDependents: true,
        occupation: true,
        streetAddress: true,
        zipCode: true,
        city: true,
        state: true,
        country: true,
        filingStatus: true,
        isAdmin: true,
        paystackCustomerId: true, // Useful to know if linked
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto, file?: Express.Multer.File) {
    const updateData: any = { ...dto };

    if (dto.firstName && dto.lastName) {
      updateData.name = `${dto.firstName} ${dto.lastName}`;
    }

    if (file) {
      // In production, you would upload this to S3/Cloudinary and save the URL
      updateData.profilePicture = `/uploads/${file.filename}`;
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        username: true,
        phone: true,
        email: true,
        profilePicture: true,
        occupation: true,
      },
    });

    return updated;
  }

  async refreshTokens(token: string) {
    try {
      const decoded = this.jwt.verify<JwtPayload>(token);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });

      if (!user) throw new UnauthorizedException('User not found');

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // --- Helper Methods ---

  private generateTokens(user: Pick<User, 'id' | 'email' | 'isAdmin'>) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      isAdmin: user.isAdmin || false,
    };

    const accessToken = this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '3h',
    });

    const refreshToken = this.jwt.sign(
      { sub: user.id },
      {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      },
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      isAdmin: payload.isAdmin,
    };
  }

  private async sendLoginEmail(user: User) {
    if (!this.transporter) return;
    
    const greetingName = user.firstName || user.name || 'there';
    await this.transporter.sendMail({
      from: `"Taxbridge" <${this.config.get<string>('GMAIL_USER')}>`,
      to: user.email,
      subject: 'Login to your Taxbridge account',
      html: `<p>Hi ${greetingName},</p><p>You have just logged in to your Taxbridge account. If this wasn't you, please secure your account immediately.</p>`,
    });
  }
}