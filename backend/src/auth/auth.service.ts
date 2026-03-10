import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service'; // adjust path if needed
import { SignupDto } from './dto/signup.dto';
import { Resend } from 'resend';

@Injectable()
export class AuthService {
  private resend: Resend | null = null;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    // Safe initialization – runs after .env is loaded
    const apiKey = this.config.get<string>('RESEND_API_KEY');

    if (apiKey) {
      this.resend = new Resend(apiKey);
      console.log('✅ Resend initialized with API key');
    } else {
      console.warn('⚠️ RESEND_API_KEY not found in environment – email sending disabled');
    }
  }

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) throw new BadRequestException('Email or username already taken');

    const hashed = await bcrypt.hash(dto.password, 10);

    await this.prisma.user.create({
      data: {
        name: dto.name,
        username: dto.username,
        phone: dto.phone,
        email: dto.email,
        dateOfBirth: new Date(dto.dateOfBirth),
        password: hashed,
        ssn: dto.ssn,
      },
    });

    // do not issue token on signup – keep client flow simple
    return { message: 'Signup successful' };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.signToken(user.id, user.email);
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

    if (!this.resend) {
      console.warn('Email sending skipped – Resend not configured');
      return { message: 'OTP would be sent (email service not configured in this environment)' };
    }

    try {
      await this.resend.emails.send({
        from: 'Taxbridge <no-reply@yourdomain.com>',
        to: [email],
        subject: 'Your Taxbridge Password Reset OTP',
        html: `<p>Your OTP is: <strong>${otp}</strong></p><p>Valid for 10 minutes.</p>`,
      });
      return { message: 'OTP sent to your email' };
    } catch (err) {
      console.error('Resend email error:', err);
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

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
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
        username: true,
        phone: true,
        email: true,
        dateOfBirth: true,
        profilePicture: true,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: any, file?: Express.Multer.File) {
    let profilePicture: string | undefined;

    if (file) {
      console.log('Uploaded file:', file.originalname);
      profilePicture = `/uploads/${file.filename}`;
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto, profilePicture },
      select: {
        id: true,
        name: true,
        username: true,
        phone: true,
        email: true,
        profilePicture: true,
      },
    });

    return updated;
  }

  private signToken(id: string, email: string) {
    const payload = { sub: id, email };
    return {
      access_token: this.jwt.sign(payload),
    };
  }
}