// src/settings/settings.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Body,
  StreamableFile,
  Header,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { diskStorage } from 'multer';

import { extname } from 'path';

import { SettingsService } from './settings.service';

// Multer configuration for file storage
const documentStorage = diskStorage({
  destination: './uploads/documents',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
  },
});

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  // --- Dashboard Stats ---
  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard stats for settings page' })
  async getStats(@Request() req) {
    return this.settingsService.getSettingsStats(req.user.sub);
  }

  // --- Document Management ---

  @Get('documents')
  @ApiOperation({ summary: 'List all user documents across filings' })
  async getDocuments(@Request() req) {
    return this.settingsService.getUserDocuments(req.user.sub);
  }

  @Post('documents')
  @ApiOperation({ summary: 'Upload a new document' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: documentStorage }))
  async uploadDocument(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('filingId') filingId: string,
    @Body('name') name: string,
  ) {
    if (!file) throw new BadRequestException('File is required');
    
    // If filingId is provided, link it. Otherwise, store as orphan (or create a default bucket).
    return this.settingsService.uploadDocument(req.user.sub, file, filingId, name);
  }

  @Get('documents/:id/download')
  @ApiOperation({ summary: 'Download a specific document' })
  @Header('Content-Type', 'application/octet-stream')
  async downloadDocument(@Request() req, @Param('id') id: string) {
    const fileStream = await this.settingsService.downloadDocument(req.user.sub, id);
    return fileStream;
  }

  @Delete('documents/:id')
  @ApiOperation({ summary: 'Delete a document' })
  async deleteDocument(@Request() req, @Param('id') id: string) {
    return this.settingsService.deleteDocument(req.user.sub, id);
  }
}