import { Injectable } from '@nestjs/common';

import { ServiceType, FilingStatus, Prisma } from '@prisma/client';

import { AiService } from '../ai/ai.service';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';

import { CreateFilingDto } from './dto/create-filing.dto';

@Injectable()
export class FilingsService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private mailer: MailService,
  ) {}

  async createFiling(
    userId: string,
    dto: CreateFilingDto,
    files: Express.Multer.File[],
    serviceType: ServiceType,
  ) {
    // 1. Generate Filing ID
    const count = await this.prisma.taxFiling.count();
    const filingId = `F${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    // 2. Prepare Base Data
    const filingData: Prisma.TaxFilingCreateInput = {
      userId,
      filingId,
      serviceType,
      taxYear: dto.taxYear || 2024,
      type: dto.type || 'Federal',
      personalInfo: dto.personalInfo,
      incomeDetails: dto.incomeDetails,
      deductions: dto.deductions,
    };

    // Handle File Uploads
    if (files && files.length > 0) {
      filingData.documents = {
        create: files.map((f) => ({
          name: f.originalname,
          url: `uploads/${f.filename}`,
          type: f.mimetype,
        })),
      };
    }

    // --- LOGIC FOR BUTTON 1: CALCULATION ONLY ---
    if (serviceType === ServiceType.CALCULATION_ONLY) {
      const aiResult = await this.ai.calculateTax(
        dto.incomeDetails,
        dto.deductions,
      );

      if (aiResult.success) {
        filingData.status = FilingStatus.COMPLETED;
        filingData.amount = aiResult.amount;
        const filing = await this.prisma.taxFiling.create({ data: filingData });
        return { message: 'Calculation Successful', data: filing };
      } else {
        // AI Failed -> Notify Admin
        filingData.status = FilingStatus.UNDER_REVIEW;
        const filing = await this.prisma.taxFiling.create({ data: filingData });

        await this.mailer.sendAdminNotification(
          filingId,
          `AI Calculation Failed: ${aiResult.error}`,
          dto.personalInfo?.email,
        );

        return {
          message: 'Complex data detected. Expert assigned for manual review.',
          data: filing,
        };
      }
    }

    // --- LOGIC FOR BUTTON 2: EXPERT GUIDED ---
    if (serviceType === ServiceType.EXPERT_GUIDED) {
      filingData.status = FilingStatus.UNDER_REVIEW;
      const filing = await this.prisma.taxFiling.create({ data: filingData });

      // Immediate Admin Notification for Expert Review
      await this.mailer.sendAdminNotification(
        filingId,
        'New Expert Guided Filing Request',
        dto.personalInfo?.email,
      );

      return {
        message: 'Submission received. An expert has been assigned.',
        data: filing,
      };
    }

    // --- LOGIC FOR BUTTON 3: CALCULATE AND FILE TAX ---
    if (serviceType === ServiceType.FULL_FILING) {
      const aiResult = await this.ai.calculateTax(
        dto.incomeDetails,
        dto.deductions,
      );

      if (aiResult.success) {
        filingData.status = FilingStatus.COMPLETED; // Or PENDING_AUTHORIZATION
        filingData.amount = aiResult.amount;
        const filing = await this.prisma.taxFiling.create({ data: filingData });
        return {
          message: 'Tax Calculated and Filed Successfully.',
          data: filing,
        };
      } else {
        // AI Failed -> Admin must manually file
        filingData.status = FilingStatus.NEEDS_INFO;
        const filing = await this.prisma.taxFiling.create({ data: filingData });

        await this.mailer.sendAdminNotification(
          filingId,
          'End-to-End Filing Failed AI Check - Manual Intervention Required',
          dto.personalInfo?.email,
        );

        return {
          message: 'Submission received. Our team is reviewing to finalize.',
          data: filing,
        };
      }
    }

    return { message: 'Service type not recognized' };
  }

  async getUserFilings(userId: string) {
    return this.prisma.taxFiling.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { documents: true },
    });
  }
}
