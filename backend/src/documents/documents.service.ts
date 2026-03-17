// src/documents/documents.service.ts
import { Injectable, NotFoundException, ForbiddenException, Logger, InternalServerErrorException, BadRequestException } from '@nestjs/common';

import { join } from 'path';

import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';

import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async uploadDocument(userId: string, file: Express.Multer.File) {
    this.logger.log(`Processing document for user ${userId}: ${file.originalname}`);

    if (!file.buffer) {
      throw new BadRequestException('File buffer is missing. Ensure memoryStorage is used.');
    }

    // 1. Convert buffer to Base64 for Vision AI
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    // 2. Call AI for OCR & Extraction
    let extractionResult: any = { documentType: 'Unknown', summary: '', extractedFields: {} };
    try {
      extractionResult = await this.ai.extractFromDocument(base64);
    } catch (error) {
      this.logger.error('AI Extraction failed, saving without metadata', error);
    }

    // 3. Save file to disk manually (since we used memoryStorage)
    const uploadDir = join(process.cwd(), 'uploads', 'documents');
    
    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}-${file.originalname}`;
    const filePath = join(uploadDir, filename);

    try {
      writeFileSync(filePath, file.buffer);
    } catch (err) {
      this.logger.error('Failed to save file to disk', err);
      throw new InternalServerErrorException('Failed to save file');
    }

    // 4. Save Metadata to Database
    const document = await this.prisma.document.create({
      data: {
        name: file.originalname,
        url: `uploads/documents/${filename}`,
        type: file.mimetype,
        size: file.size,
        userId: userId,
        documentType: extractionResult.documentType,
        summary: extractionResult.summary,
        extractedData: extractionResult.extractedFields,
      },
    });

    return document;
  }

  async getUserDocuments(userId: string, type?: string) {
    const where: any = { userId };
    if (type) {
      where.documentType = type;
    }

    return this.prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDocumentById(id: string, userId: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    if (doc.userId !== userId) throw new ForbiddenException('Access denied');
    return doc;
  }

  async deleteDocument(id: string, userId: string) {
    const doc = await this.getDocumentById(id, userId);

    // Delete file from disk
    const filePath = join(process.cwd(), doc.url);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    // Delete from DB
    await this.prisma.document.delete({ where: { id } });
    return { message: 'Document deleted' };
  }
}