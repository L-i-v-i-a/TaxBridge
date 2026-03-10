import { Injectable, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma.service'; // adjust path if needed
import { SignupDto } from './dto/signup.dto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
    // Initialize nodemailer transporter for Gmail
    const gmailUser = this.config.get<string>('GMAIL_USER');
    const gmailPass = this.config.get<string>('GMAIL_APP_PASSWORD');

    console.log('process.env.GMAIL_USER:', process.env.GMAIL_USER);
    console.log('process.env.GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? 'set' : 'not set');
    console.log('GMAIL_USER from config:', gmailUser ? 'set' : 'not set');
    console.log('GMAIL_APP_PASSWORD from config:', gmailPass ? 'set' : 'not set');

    if (gmailUser && gmailPass) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
      console.log('✅ Nodemailer initialized with Gmail');
    } else {
      console.warn('⚠️ GMAIL_USER or GMAIL_APP_PASSWORD not found in environment – email sending disabled');
    }
  }

  async signup(dto: SignupDto) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) throw new BadRequestException('Email or username already taken');

    const hashed = await bcrypt.hash(dto.password, 10);

    // build profile fields
    const profileData: any = {
      username: dto.username,
      phone: dto.phone,
      email: dto.email,
      dateOfBirth: new Date(dto.dateOfBirth),
      password: hashed,
      ssn: dto.ssn,
    };

    if (dto.firstName) profileData.firstName = dto.firstName;
    if (dto.lastName) profileData.lastName = dto.lastName;
    if (dto.firstName && dto.lastName) {
      profileData.name = `${dto.firstName} ${dto.lastName}`;
    } else if (dto.name) {
      // legacy support
      profileData.name = dto.name;
    }

    await this.prisma.user.create({
      data: profileData,
    });

    // do not issue token on signup – keep client flow simple
    return { message: 'Signup successful' };
  }

  /**
   * Attempt to log in using either email or username.
   * Returns access/refresh tokens plus a message.
   */
  async login(identifier: string, password: string) {
    // allow login by email or username
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Send login notification email on every successful login
    if (!this.transporter) {
      console.warn('Login email skipped: Gmail not configured');
    } else {
      try {
        const greetingName = user.firstName ?? user.name ?? 'there';
        console.log(`Sending login email to ${user.email}`);
        const emailResponse = await this.transporter.sendMail({
          from: `"Taxbridge" <${this.config.get<string>('GMAIL_USER')}>`,
          to: user.email,
          subject: 'Login to your Taxbridge account',
          html: `<p>Hi ${greetingName},</p><p>You have just logged in to your Taxbridge account. If this wasn't you, please reset your password immediately.</p>`,
        });
        console.log('Login email sent successfully, Nodemailer response:', emailResponse);
      } catch (err) {
        console.error('Login email failed to send:', err);
      }
    }

    // sign tokens with admin flag included
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email, isAdmin: user.isAdmin }, { expiresIn: '15m' });
    const refreshToken = this.jwt.sign({ sub: user.id }, { expiresIn: '7d' });
    return { message: 'Login successful', isAdmin: user.isAdmin, access_token: accessToken, refresh_token: refreshToken };
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
      return { message: 'OTP would be sent (email service not configured in this environment)' };
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

  async updateProfile(userId: string, dto: any, file?: Express.Multer.File) {
    let profilePicture: string | undefined;

    if (file) {
      console.log('Uploaded file:', file.originalname);
      profilePicture = `/uploads/${file.filename}`;
    }

    // if first/last provided, update legacy name field as well
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

  /**
   * Return an object with both access and refresh tokens.
   * Access tokens are short lived; refresh tokens last longer.
   */
  private signTokens(id: string, email: string, isAdmin: boolean) {
    const accessPayload = { sub: id, email, isAdmin };
    const refreshPayload = { sub: id };
    const accessToken = this.jwt.sign(accessPayload, {
      expiresIn: '15m',
    });
    const refreshToken = this.jwt.sign(refreshPayload, {
      expiresIn: '7d',
    });
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  /**
   * Validate a refresh token and issue new tokens.
   */
  async refreshTokens(token: string) {
    try {
      const decoded: any = this.jwt.verify(token);
      const user = await this.prisma.user.findUnique({ where: { id: decoded.sub } });
      if (!user) throw new UnauthorizedException('User not found');
      return this.signTokens(user.id, user.email, user.isAdmin);
    } catch (err) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}