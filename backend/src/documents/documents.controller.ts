// src/documents/documents.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { memoryStorage } from 'multer'; 

import { DocumentsService } from './documents.service';// Import memoryStorage

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a document and extract data via AI' })
  @ApiConsumes('multipart/form-data')
  // FIX: Explicitly use memoryStorage to ensure file.buffer is populated
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async upload(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentsService.uploadDocument(req.user.sub, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user documents (optional filter by type)' })
  async findAll(
    @Request() req,
    @Query('type') type?: string,
  ) {
    return this.documentsService.getUserDocuments(req.user.sub, type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get document details' })
  async findOne(@Request() req, @Param('id') id: string) {
    return this.documentsService.getDocumentById(id, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  async remove(@Request() req, @Param('id') id: string) {
    return this.documentsService.deleteDocument(id, req.user.sub);
  }
}