import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;
  private readonly logger = new Logger(MailService.name);

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
      this.logger.log('Gmail transporter initialized successfully.');
    } else {
      this.logger.warn('GMAIL_USER or GMAIL_APP_PASSWORD not set. Email service disabled.');
    }
  }

  async sendAdminNotification(
    filingId: string,
    reason: string,
    userEmail: string | undefined,
  ) {
    const adminEmail =
      this.config.get<string>('ADMIN_EMAIL') || 'oliviaoguelina@gmail.com';

    if (!this.transporter) {
      this.logger.error('Email service not configured. Cannot notify admin.');
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
          <p><strong>User Email:</strong> ${userEmail ?? 'N/A'}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <hr />
          <p>Please log in to the admin dashboard to review this filing immediately.</p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Admin notified for Filing ${filingId}`);
    } catch (error) {
      this.logger.error('Failed to send admin email:', error);
    }
  }

  /**
   * NEW: Sends a notification email for new chat messages.
   */
  async sendNewMessageNotification(
    recipientEmail: string,
    recipientName: string,
    senderName: string,
    messagePreview: string,
    conversationId: string,
  ) {
    if (!this.transporter) {
      this.logger.warn('Email service not configured. Cannot send chat notification.');
      return;
    }

    const frontendUrl = this.config.get<string>('FRONTEND_URL') || 'http://localhost:3001';
    const link = `${frontendUrl}/chat/${conversationId}`;

    const mailOptions = {
      from: `"Taxbridge Support" <${this.config.get<string>('GMAIL_USER')}>`,
      to: recipientEmail,
      subject: `New Message from ${senderName}`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border: 1px solid #eeeeee;">
            <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">💬 New Message Received</h2>
            <p style="font-size: 16px; color: #555;">Hi ${recipientName},</p>
            <p style="font-size: 16px; color: #555;">You have received a new message from <strong>${senderName}</strong>:</p>
            
            <div style="background-color: #f1f1f1; padding: 15px; border-left: 4px solid #0D23AD; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #333; font-style: italic;">
                "${messagePreview.substring(0, 150)}${messagePreview.length > 150 ? '...' : ''}"
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${link}" target="_blank" style="background-color: #0D23AD; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View & Reply
              </a>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
            <p style="font-size: 12px; color: #999; text-align: center;">
              You received this email because you are part of the conversation on Taxbridge.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Chat notification sent to ${recipientEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send chat notification to ${recipientEmail}`, error);
    }
  }
}