import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from '@prisma/client'; 

import * as bcrypt from 'bcrypt';

import * as nodemailer from 'nodemailer';

import { PrismaService } from '../prisma.service';
import { PaystackService } from '../paystack/paystack.service';

import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto'; // <--- 2. Import the DTO

// <--- 3. Define the JwtPayload interface
interface JwtPayload {
  sub: string;
  email: string;
  isAdmin: boolean;
}

@Injectable()
export class AuthService {
  private transporter: { sendMail: (options: Record<string, unknown>) => Promise<unknown> } | null =
    null;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private paystack: PaystackService
  ) {
    const gmailUser = this.config.get<string>('GMAIL_USER');
    const gmailPass = this.config.get<string>('GMAIL_APP_PASSWORD');

    if (gmailUser && gmailPass) {
      const createTransport = nodemailer.createTransport as unknown as (
        options: Record<string, unknown>,
      ) => { sendMail: (options: Record<string, unknown>) => Promise<unknown> };
      this.transporter = createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
    }
  }

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);

    // Create Paystack Customer
    let paystackCustomerId = null;
    try {
      const customer = await this.paystack.createCustomer(
        dto.email, 
        dto.firstName || 'User', 
        dto.lastName || ''
      );
      paystackCustomerId = customer.customer_code;
    } catch (err) {
      console.error('Paystack customer creation failed:', err);
    }

    const profileData: any = {
      email: dto.email,
      password: hashed,
      firstName: dto.firstName,
      lastName: dto.lastName,
      username: dto.username || dto.email.split('@')[0] + Math.floor(Math.random() * 1000),
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : new Date('2000-01-01'),
      paystackCustomerId: paystackCustomerId
    };

    if (dto.firstName && dto.lastName) {
      profileData.name = `${dto.firstName} ${dto.lastName}`;
    } else if (dto.name) {
      profileData.name = dto.name;
    }

    await this.prisma.user.create({
      data: profileData,
    });

    return { message: 'Signup successful' };
  }

  async login(identifier: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
    });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (this.transporter) {
      try {
        const greetingName = user.firstName ?? user.name ?? 'there';
        console.log(`Sending login email to ${user.email}`);
        await this.transporter.sendMail({
          from: `"Taxbridge" <${this.config.get<string>('GMAIL_USER')}>`,
          to: user.email,
          subject: 'Login to your Taxbridge account',
          html: `<p>Hi ${greetingName},</p><p>You have just logged in to your Taxbridge account. If this wasn't you, please reset your password immediately.</p>`,
        });
      } catch (err) {
        console.error('Login email failed to send:', err);
      }
    }

    const accessToken = this.jwt.sign({ sub: user.id, email: user.email, isAdmin: user.isAdmin }, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign({ sub: user.id }, { expiresIn: '7d' });
    
    return { 
      message: 'Login successful', 
      isAdmin: user.isAdmin, 
      access_token: accessToken, 
      refresh_token: refreshToken 
    };
  }

  async validateGoogleUser(googleUser: {
    googleId: string;
    email: string;
    firstName?: string;
    lastName?: string;
  }) {
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleUser.googleId }, { email: googleUser.email }],
      },
    });

    if (!user) {
      let paystackCustomerId = null;
      try {
        const customer = await this.paystack.createCustomer(googleUser.email, googleUser.firstName || 'User', googleUser.lastName || '');
        paystackCustomerId = customer.customer_code;
      } catch (err) {
        console.error('Paystack customer creation failed for Google user:', err);
      }

      const username = googleUser.email.split('@')[0] + Math.random().toString(36).substring(7);
      user = await this.prisma.user.create({
        data: {
          googleId: googleUser.googleId,
          email: googleUser.email,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          name: `${googleUser.firstName} ${googleUser.lastName}`.trim(),
          username,
          dateOfBirth: new Date('2000-01-01'),
          password: '',
          isVerified: true,
          paystackCustomerId
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: googleUser.googleId },
      });
    }

    return user;
  }

  generateTokensForUser(user: Pick<User, 'id' | 'email' | 'isAdmin'>) {
    const accessToken = this.jwt.sign(
      { sub: user.id, email: user.email, isAdmin: user.isAdmin },
      { expiresIn: '15m' },
    );
    const refreshToken = this.jwt.sign({ sub: user.id }, { expiresIn: '7d' });
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new BadRequestException('Email not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await this.prisma.user.update({
      where: { email },
      data: { otp, otpExpiresAt: expires },
    });

    if (!this.transporter) {
      console.warn('Email sending skipped – Gmail not configured');
      return {
        message:
          'OTP would be sent (email service not configured in this environment)',
      };
    }

    try {
      await this.transporter.sendMail({
        from: `"Taxbridge" <${this.config.get<string>('GMAIL_USER')}>`,
        to: [email],
        subject: 'Your Taxbridge Password Reset OTP',
        html: `<p>Your OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`,
      });
      return { message: 'OTP sent to your email' };
    } catch (err) {
      console.error('Nodemailer email error:', err);
      throw new InternalServerErrorException('Failed to send reset email');
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < new Date()
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashed, otp: null, otpExpiresAt: null },
    });

    return { message: 'Password reset successful' };
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

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
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    let profilePicture: string | undefined;

    if (file) {
      console.log('Uploaded file:', file.originalname);
      profilePicture = `/uploads/${file.filename}`;
    }

    const updateData: any = { ...dto, profilePicture };
    if (dto.firstName) updateData.firstName = dto.firstName;
    if (dto.lastName) updateData.lastName = dto.lastName;
    if (dto.firstName && dto.lastName) {
      updateData.name = `${dto.firstName} ${dto.lastName}`;
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
        ein: true,
        numberOfDependents: true,
        occupation: true,
        streetAddress: true,
        zipCode: true,
        city: true,
        state: true,
        country: true,
        filingStatus: true,
      },
    });

    return updated;
  }

  private signTokens(id: string, email: string, isAdmin: boolean) {
    const accessPayload = { sub: id, email, isAdmin };
    const refreshPayload = { sub: id };
    const accessToken = this.jwt.sign(accessPayload, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign(refreshPayload, { expiresIn: '7d' });
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshTokens(token: string) {
    try {
      const decoded = this.jwt.verify<JwtPayload>(token);
      const user = await this.prisma.user.findUnique({
        where: { id: decoded.sub },
      });
      if (!user) throw new UnauthorizedException('User not found');
      return this.signTokens(user.id, user.email, user.isAdmin);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}