import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { ContactDto } from './dto/contact.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { SendNewsletterDto } from './dto/send-newsletter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard'; // we'll create this

@ApiTags('contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Send contact message to admin' })
  @ApiResponse({ status: 200, description: 'Message sent' })
  async sendContact(@Body() dto: ContactDto) {
    return this.contactService.sendContactMessage(dto);
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to newsletter' })
  @ApiResponse({ status: 200, description: 'Subscribed' })
  async subscribe(@Body() dto: SubscribeDto) {
    return this.contactService.subscribe(dto);
  }

  @Get('subscribers')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all subscribers (admin only)' })
  async getSubscribers() {
    return this.contactService.getSubscribers();
  }

  @Post('send-newsletter')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send newsletter to all subscribers (admin only)' })
  async sendNewsletter(@Body() dto: SendNewsletterDto) {
    return this.contactService.sendNewsletter(dto);
  }
}
