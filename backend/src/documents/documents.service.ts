// src/documents/documents.service.ts
import { Injectable, NotFoundException, ForbiddenException, Logger, InternalServerErrorException } from '@nestjs/common';

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

  /**
   * Helper method to validate if a user has access to document features.
   */
  private async validateUserAccess(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { 
        isAdmin: true, 
        subscriptions: { 
          where: { status: 'active' },
          select: { id: true } 
        } 
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isAdmin = user.isAdmin;
    const hasActiveSubscription = user.subscriptions.length > 0;

    if (!isAdmin && !hasActiveSubscription) {
      throw new ForbiddenException('Access denied. You must be an admin or have an active subscription plan to use this feature.');
    }
  }

  async uploadDocument(userId: string, file: Express.Multer.File) {
    // 1. Validate Access
    await this.validateUserAccess(userId);

    // 2. AI Extraction
    let extractionResult = {
      documentType: 'UNKNOWN',
      summary: '',
      extractedFields: {},
    };

    const base64 = file.buffer.toString('base64');

    try {
      extractionResult = await this.ai.extractFromDocument(base64);
    } catch (error) {
      this.logger.error('AI Extraction failed, saving without metadata', error);
    }

    // 3. Save file to disk
    const uploadDir = join(process.cwd(), 'uploads', 'documents');
    
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
    await this.validateUserAccess(userId);

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
    await this.validateUserAccess(userId);

    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) throw new NotFoundException('Document not found');
    if (doc.userId !== userId) throw new ForbiddenException('Access denied');
    return doc;
  }

  async deleteDocument(id: string, userId: string) {
    await this.validateUserAccess(userId);

    const doc = await this.getDocumentById(id, userId);

    const filePath = join(process.cwd(), doc.url);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    await this.prisma.document.delete({ where: { id } });
    return { message: 'Document deleted' };
  }
}