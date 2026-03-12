import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';

import { ServiceType, FilingStatus } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
import { MailService } from '../mail/mail.service';

import { CreateFilingDto } from './dto/create-filing.dto';

@Injectable()
export class FilingsService {
  constructor(
    private prisma: PrismaService,
    private ai: AiService,
    private mailer: MailService
  ) {}

  async createFiling(
    userId: string,
    dto: CreateFilingDto,
    files: Express.Multer.File[],
    serviceType: ServiceType
  ) {
    
    if (!userId) {
      throw new UnauthorizedException('User ID is missing. Authentication failed.');
    }

    // 1. Generate ID and Extract Year
    const count = await this.prisma.taxFiling.count();
    const filingId = `F${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    
    // Ensure we have a tax year, default to current year if missing
    const taxYear = dto.taxYear || new Date().getFullYear();

    // 2. Prepare Data Object
    const filingData: any = {
      userId: userId,
      filingId: filingId,
      serviceType: serviceType,
      taxYear: taxYear,
      type: dto.type || 'Federal',
      personalInfo: dto.personalInfo,
      incomeDetails: dto.incomeDetails,
      deductions: dto.deductions,
    };

    // Map uploaded files
    if (files && files.length > 0) {
      filingData.documents = {
        create: files.map(f => ({
          name: f.originalname,
          url: `uploads/${f.filename}`,
          type: f.mimetype
        }))
      };
    }

    // --- LOGIC HANDLERS ---

    // A. CALCULATION ONLY
    if (serviceType === ServiceType.CALCULATION_ONLY) {
      // FIX: Pass taxYear as the first argument
      const aiResult = await this.ai.calculateTax(taxYear, dto.incomeDetails, dto.deductions);

      if (aiResult.success) {
        return this.prisma.taxFiling.create({
          data: {
            ...filingData,
            status: FilingStatus.COMPLETED,
            amount: aiResult.amount
          }
        });
      } else {
        const filing = await this.prisma.taxFiling.create({
          data: { ...filingData, status: FilingStatus.UNDER_REVIEW }
        });
        
        await this.mailer.sendAdminNotification(
          filingId,
          `AI Calculation Failed: ${aiResult.error}`,
          dto.personalInfo?.email
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
      
      return filing;
    }

    // C. FULL FILING
    if (serviceType === ServiceType.FULL_FILING) {
      // FIX: Pass taxYear as the first argument
      const aiResult = await this.ai.calculateTax(taxYear, dto.incomeDetails, dto.deductions);

      if (aiResult.success) {
        return this.prisma.taxFiling.create({
          data: {
            ...filingData,
            status: FilingStatus.COMPLETED,
            amount: aiResult.amount
          }
        });
      } else {
        const filing = await this.prisma.taxFiling.create({
          data: { ...filingData, status: FilingStatus.NEEDS_INFO }
        });
        
        await this.mailer.sendAdminNotification(
          filingId,
          'Manual Filing Intervention Required',
          dto.personalInfo?.email
        );
        
        return filing;
      }
    }

    throw new InternalServerErrorException('Invalid Service Type provided');
  }

  async getUserFilings(userId: string) {
    return this.prisma.taxFiling.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { documents: true }
    });
  }
}