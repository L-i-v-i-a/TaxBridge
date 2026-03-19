// src/filings/filings.service.ts
import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException,
  Logger
} from '@nestjs/common';

import { ServiceType, FilingStatus, Prisma, NotificationType, NotificationPriority } from '@prisma/client';

import { readFileSync, existsSync } from 'fs';

import { join } from 'path';

import { PrismaService } from '../prisma.service';
import { AiService, DeductionsDto } from '../ai/ai.service';
import { MailService } from '../mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service'; 

import { CreateFilingDto } from './dto/create-filing.dto';
import { UpdateFilingDto } from './dto/update-filing.dto';

@Injectable()
export class FilingsService {
  private readonly logger = new Logger(FilingsService.name);

  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private mailer: MailService,
    private notifications: NotificationsService,
  ) {}

  /**
   * Helper method to validate if a user has access to filing features.
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
      throw new ForbiddenException('Access denied. You must be an admin or have an active subscription plan to create filings.');
    }
  }

  async createFiling(
    userId: string,
    dto: CreateFilingDto,
    files: Express.Multer.File[],
    serviceType: ServiceType,
  ) {
    if (!userId) {
      throw new UnauthorizedException('User ID is missing. Authentication failed.');
    }

    // 1. Validate Access
    await this.validateUserAccess(userId);

    // 2. Generate ID and Extract Year
    const count = await this.prisma.taxFiling.count();
    const filingId = `F${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    
    const taxYear = dto.taxYear || new Date().getFullYear();

    // 3. PROCESS DOCUMENTS & EXTRACT CONTEXT
    let documentContext = '';
    const documentsData: any[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const filePath = join(process.cwd(), 'uploads', file.filename);
          
          if (existsSync(filePath)) {
            const fileBuffer = readFileSync(filePath);
            const base64 = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;
            
            this.logger.log(`Analyzing document: ${file.originalname}`);

            const extraction = await this.ai.extractFromDocument(base64);

            documentsData.push({
              name: file.originalname,
              url: `uploads/${file.filename}`,
              type: file.mimetype,
              documentType: extraction.documentType,
              extractedData: extraction.extractedFields,
            });

            documentContext += `\n--- Document: ${file.originalname} (${extraction.documentType}) ---\n`;
            documentContext += `Summary: ${extraction.summary}\n`;
            documentContext += `Extracted Fields: ${JSON.stringify(extraction.extractedFields)}\n`;
            
          } else {
            this.logger.warn(`File not found on disk: ${filePath}`);
          }
        } catch (err) {
          this.logger.error(`Failed to process file ${file.originalname}`, err);
        }
      }
    }

    // 4. Prepare Base Filing Data
    const filingData: Prisma.TaxFilingCreateInput = {
      user: { connect: { id: userId } },
      filingId: filingId,
      serviceType: serviceType,
      taxYear: taxYear,
      type: dto.type || 'Federal',
      personalInfo: dto.personalInfo as any,
      incomeDetails: dto.incomeDetails as any,
      deductions: dto.deductions as any,
    };

    if (documentsData.length > 0) {
      filingData.documents = {
        create: documentsData,
      };
    }

    const aiDeductions: DeductionsDto = {
      ...dto.deductions,
      hasDeductibleExpenses: dto.deductions.hasDeductibleExpenses as 'Yes' | 'No' | undefined,
    };

    // A. CALCULATION ONLY
    if (serviceType === ServiceType.CALCULATION_ONLY) {
      const aiResult = await this.ai.calculateTax(taxYear, dto.incomeDetails, aiDeductions, documentContext);

      if (aiResult.success) {
        const filing = await this.prisma.taxFiling.create({
          data: {
            ...filingData,
            status: FilingStatus.COMPLETED,
            amount: aiResult.amount,
            type: aiResult.taxType || dto.type || 'Federal',
          }
        });

        await this.notifications.createNotification(
          userId,
          NotificationType.FILING,
          'Calculation Complete',
          `Your tax calculation for ${taxYear} is ready. Estimated refund/owe: ${aiResult.amount}`,
          NotificationPriority.LOW,
          `/filings/${filing.id}`
        );

        return filing;
      } else {
        const filing = await this.prisma.taxFiling.create({
          data: { ...filingData, status: FilingStatus.UNDER_REVIEW }
        });
        
        await this.mailer.sendAdminNotification(
          filingId,
          `AI Calculation Failed: ${aiResult.error}`,
          dto.personalInfo?.email
        );

        await this.notifications.createNotification(
          userId,
          NotificationType.FILING,
          'Manual Review Required',
          `Your filing requires manual review by our experts.`,
          NotificationPriority.HIGH,
          `/filings/${filing.id}`
        );
        
        return filing;
      }
    }

    // B. EXPERT GUIDED
    if (serviceType === ServiceType.EXPERT_GUIDED) {
      const filing = await this.prisma.taxFiling.create({
        data: { ...filingData, status: FilingStatus.UNDER_REVIEW }
      });
      
      await this.mailer.sendAdminNotification(
        filingId,
        'New Expert Guided Request',
        dto.personalInfo?.email
      );

      await this.notifications.createNotification(
        userId,
        NotificationType.FILING,
        'Expert Request Submitted',
        `Your request has been submitted. An expert will contact you shortly.`,
        NotificationPriority.LOW,
        `/filings/${filing.id}`
      );
      
      return filing;
    }

    // C. FULL FILING
    if (serviceType === ServiceType.FULL_FILING) {
      const aiResult = await this.ai.calculateTax(taxYear, dto.incomeDetails, aiDeductions, documentContext);

      if (aiResult.success) {
        const filing = await this.prisma.taxFiling.create({
          data: {
            ...filingData,
            status: FilingStatus.COMPLETED,
            amount: aiResult.amount,
            type: aiResult.taxType || dto.type || 'Federal',
          }
        });

        await this.notifications.createNotification(
          userId,
          NotificationType.FILING,
          'Filing Submitted',
          `Your full tax filing has been successfully submitted.`,
          NotificationPriority.LOW,
          `/filings/${filing.id}`
        );

        return filing;
      } else {
        const filing = await this.prisma.taxFiling.create({
          data: { ...filingData, status: FilingStatus.NEEDS_INFO }
        });
        
        await this.mailer.sendAdminNotification(
          filingId,
          'Manual Filing Intervention Required',
          dto.personalInfo?.email
        );

        await this.notifications.createNotification(
          userId,
          NotificationType.FILING,
          'More Information Needed',
          `We need some additional details to process your filing.`,
          NotificationPriority.HIGH,
          `/filings/${filing.id}`
        );
        
        return filing;
      }
    }

    throw new InternalServerErrorException('Invalid Service Type provided');
  }

  // Admin Update Method
  async updateFiling(adminId: string, filingId: string, dto: UpdateFilingDto) {
    const admin = await this.prisma.user.findUnique({ 
      where: { id: adminId },
      select: { isAdmin: true }
    });

    if (!admin || !admin.isAdmin) {
      throw new ForbiddenException('Only administrators can update filings');
    }

    const filing = await this.prisma.taxFiling.update({
      where: { id: filingId },
      data: {
        status: dto.status,
        amount: dto.amount,
      },
    });

    if (dto.status) {
      let title = 'Filing Update';
      let message = `Your filing status changed to ${dto.status}.`;
      let priority: NotificationPriority = NotificationPriority.LOW; 

      if (dto.status === FilingStatus.COMPLETED) {
        title = 'Filing Approved!';
        message = `Your tax filing has been approved. Amount: ${dto.amount || filing.amount}`;
        priority = NotificationPriority.HIGH;
      } else if (dto.status === FilingStatus.REJECTED) {
        title = 'Filing Rejected';
        message = `Your filing was rejected. Please review the details.`;
        priority = NotificationPriority.HIGH;
      } else if (dto.status === FilingStatus.NEEDS_INFO) {
        title = 'Action Required';
        message = `Additional information is required for your filing.`;
        priority = NotificationPriority.HIGH;
      }

      await this.notifications.createNotification(
        filing.userId,
        NotificationType.FILING,
        title,
        message,
        priority,
        `/filings/${filing.id}`
      );
    }

    return filing;
  }

  async getUserFilings(userId: string) {
    return this.prisma.taxFiling.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { 
        documents: true,
        user: {
          select: { id: true, name: true, email: true, profilePicture: true }
        }
      },
    });
  }

  async getUserFilingStats(userId: string) {
    const filings = await this.prisma.taxFiling.findMany({
      where: { userId },
      select: { status: true }
    });

    const stats = {
      total: filings.length,
      pending: 0,
      completed: 0,
      underReview: 0,
      rejected: 0,
    };

    filings.forEach(filing => {
      if (filing.status === 'PENDING') stats.pending++;
      else if (filing.status === 'COMPLETED') stats.completed++;
      else if (filing.status === 'UNDER_REVIEW') stats.underReview++;
      else if (filing.status === 'REJECTED') stats.rejected++;
    });

    return stats;
  }

  async getFilingById(id: string, userId: string) {
    const filing = await this.prisma.taxFiling.findUnique({
      where: { id },
      include: { 
        documents: true,
        user: {
          select: { id: true, name: true, email: true, profilePicture: true }
        }
      }
    });

    if (!filing) {
      throw new NotFoundException('Filing not found');
    }

    const user = await this.prisma.user.findUnique({ 
      where: { id: userId },
      select: { isAdmin: true }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isAdmin && filing.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this filing');
    }

    return filing;
  }

  async deleteFiling(id: string) {
    const filing = await this.prisma.taxFiling.findUnique({ where: { id } });
    if (!filing) {
      throw new NotFoundException('Filing not found');
    }

    await this.prisma.document.deleteMany({ where: { filingId: id } });

    return this.prisma.taxFiling.delete({ where: { id } });
  }
}