import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
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

  async sendAdminNotification(filingId: string, reason: string, userEmail: string) {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL') || 'oliviaoguelina@gmail.com';
    
    if (!this.transporter) {
      console.error('Email service not configured. Cannot notify admin.');
      return;
    }

    const mailOptions = {
      from: `"Taxbridge System" <${this.config.get<string>('GMAIL_USER')}>`,
      to: adminEmail,
      subject: `Action Required: Filing ${filingId} - ${reason}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h3 style="color: #d9534f;">⚠️ Filing Requires Attention Immediately</h3>
          <p><strong>Filing ID:</strong> ${filingId}</p>
          <p><strong>User Email:</strong> ${userEmail}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <hr />
          <p>Please log in to the admin dashboard to review this filing immediately.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Admin notified for Filing ${filingId}`);
    } catch (error) {
      console.error('Failed to send admin email:', error);
    }
  }
}