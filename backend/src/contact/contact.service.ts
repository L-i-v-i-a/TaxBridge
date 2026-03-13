import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';
import { PrismaService } from '../prisma.service';
import { ContactDto } from './dto/contact.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { SendNewsletterDto } from './dto/send-newsletter.dto';

@Injectable()
export class ContactService {
  private transporter: Transporter | null = null;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
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
    }
  }

  async sendContactMessage(dto: ContactDto) {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    if (!adminEmail) throw new Error('ADMIN_EMAIL not configured');

    if (!this.transporter) throw new Error('Email service not configured');

    const mailOptions = {
      from: `"Taxbridge Contact" <${this.config.get<string>('GMAIL_USER')}>`,
      to: adminEmail,
      subject: `Contact Form: ${dto.name}`,
      html: `
        <p><strong>Name:</strong> ${dto.name}</p>
        <p><strong>Email:</strong> ${dto.email}</p>
        <p><strong>Phone:</strong> ${dto.phone || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${dto.message.replace(/\n/g, '<br>')}</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
    return { message: 'Contact message sent successfully' };
  }

  async subscribe(dto: SubscribeDto) {
    const existing = await this.prisma.subscriber.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      return { message: 'Already subscribed' };
    }

    await this.prisma.subscriber.create({
      data: { email: dto.email },
    });
    return { message: 'Subscribed successfully' };
  }

  async getSubscribers() {
    return this.prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });
  }

  async sendNewsletter(dto: SendNewsletterDto) {
    if (!this.transporter) throw new Error('Email service not configured');

    const subscribers = await this.prisma.subscriber.findMany();
    const emails = subscribers.map((s) => s.email);

    if (emails.length === 0) {
      return { message: 'No subscribers to send to' };
    }

    const mailOptions = {
      from: `"Taxbridge Newsletter" <${this.config.get<string>('GMAIL_USER')}>`,
      bcc: emails, // BCC to protect privacy
      subject: dto.subject,
      html: dto.content,
    };

    await this.transporter.sendMail(mailOptions);
    return { message: `Newsletter sent to ${emails.length} subscribers` };
  }
}
