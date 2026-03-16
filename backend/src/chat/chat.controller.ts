// src/chat/chat.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { ConversationType, SenderType } from '@prisma/client'; 

import { AdminGuard } from '../auth/admin.guard';

import { ChatService } from './chat.service';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('conversations')
  async createConversation(
    @Request() req,
    @Body('type') type: ConversationType
  ) {
    return this.chatService.createConversation(req.user.sub, type);
  }

  @Get('conversations')
  async getConversations(@Request() req) {
    const isAdmin = req.user.isAdmin || false;
    return this.chatService.getConversations(req.user.sub, isAdmin);
  }

  @Get('conversations/:id')
  async getConversation(@Param('id') id: string) {
    return this.chatService.getConversation(id);
  }

  // NEW: HTTP Endpoint to send messages
  @Post('messages')
  async sendMessage(
    @Request() req,
    @Body() body: { conversationId: string; content: string; type: 'TEXT' | 'IMAGE' | 'FILE' }
  ) {
    const { conversationId, content, type } = body;
    const userId = req.user.sub;
    const isAdmin = req.user.isAdmin;

    const senderType: SenderType = isAdmin ? 'ADMIN' : 'USER';

    // This triggers the event that updates the sockets
    return this.chatService.createMessage(
      conversationId,
      userId,
      senderType,
      content,
      type || 'TEXT',
    );
  }

  @Post('messages/:id/react')
  async addReaction(
    @Request() req,
    @Param('id') messageId: string,
    @Body('emoji') emoji: string
  ) {
    return this.chatService.addReaction(messageId, req.user.sub, emoji);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    const urls = files.map(f => ({ url: `uploads/${f.filename}`, name: f.originalname }));
    return { success: true, files: urls };
  }
}