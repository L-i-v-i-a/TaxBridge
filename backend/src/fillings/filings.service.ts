// src/filings/filings.service.ts
import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';

import { ServiceType, FilingStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { AiService, DeductionsDto } from '../ai/ai.service';
import { MailService } from '../mail/mail.service';

import { CreateFilingDto } from './dto/create-filing.dto';
import { UpdateFilingDto } from './dto/update-filing.dto';

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
    if (!userId) {
      throw new UnauthorizedException(
        'User ID is missing. Authentication failed.',
      );
    }

    // 1. Generate ID and Extract Year
    const count = await this.prisma.taxFiling.count();
    const filingId = `F${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    
    const taxYear = dto.taxYear || new Date().getFullYear();

    // 2. Prepare Data Object
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

    // Map uploaded files
    if (files && files.length > 0) {
      filingData.documents = {
        create: files.map((f) => ({
          name: f.originalname,
          url: `uploads/${f.filename}`,
          type: f.mimetype,
        })),
      };
    }

    // --- LOGIC HANDLERS ---

    const aiDeductions: DeductionsDto = {
      ...dto.deductions,
      hasDeductibleExpenses: dto.deductions.hasDeductibleExpenses as 'Yes' | 'No' | undefined,
    };

    // A. CALCULATION ONLY
    if (serviceType === ServiceType.CALCULATION_ONLY) {
      const aiResult = await this.ai.calculateTax(taxYear, dto.incomeDetails, aiDeductions);

      if (aiResult.success) {
        return this.prisma.taxFiling.create({
          data: {
            ...filingData,
            status: FilingStatus.COMPLETED,
            amount: aiResult.amount,
          },
        });
      } else {
        const filing = await this.prisma.taxFiling.create({
          data: { ...filingData, status: FilingStatus.UNDER_REVIEW },
        });

        await this.mailer.sendAdminNotification(
          filingId,
          `AI Calculation Failed: ${aiResult.error}`,
          dto.personalInfo?.email,
        );

        return filing;
      }
    }

    // B. EXPERT GUIDED
    if (serviceType === ServiceType.EXPERT_GUIDED) {
      const filing = await this.prisma.taxFiling.create({
        data: { ...filingData, status: FilingStatus.UNDER_REVIEW },
      });

      await this.mailer.sendAdminNotification(
        filingId,
        'New Expert Guided Request',
        dto.personalInfo?.email,
      );

      return filing;
    }

    // C. FULL FILING
    if (serviceType === ServiceType.FULL_FILING) {
      const aiResult = await this.ai.calculateTax(taxYear, dto.incomeDetails, aiDeductions);

      if (aiResult.success) {
        return this.prisma.taxFiling.create({
          data: {
            ...filingData,
            status: FilingStatus.COMPLETED,
            amount: aiResult.amount,
          },
        });
      } else {
        const filing = await this.prisma.taxFiling.create({
          data: { ...filingData, status: FilingStatus.NEEDS_INFO },
        });

        await this.mailer.sendAdminNotification(
          filingId,
          'Manual Filing Intervention Required',
          dto.personalInfo?.email,
        );

        return filing;
      }
    }

    throw new InternalServerErrorException('Invalid Service Type provided');
  }

  // NEW: Admin Update Method
  async updateFiling(adminId: string, filingId: string, dto: UpdateFilingDto) {
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });

    if (!admin || !admin.isAdmin) {
      throw new ForbiddenException('Only administrators can update filings');
    }

    return this.prisma.taxFiling.update({
      where: { id: filingId },
      data: {
        status: dto.status,
        amount: dto.amount,
      },
    });
  }
  async getUserFilings(userId: string) {
    return this.prisma.taxFiling.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { documents: true },
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
      include: { documents: true, user: true }
    });

    if (!filing) {
      throw new NotFoundException('Filing not found');
    }

    // If the user is not an admin, check ownership
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    // FIX: Explicitly check if user is null before accessing properties
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isAdmin && filing.userId !== userId) {
      throw new ForbiddenException('You do not have permission to view this filing');
    }

    return filing;
  }

  async deleteFiling(id: string) {
    // Check if filing exists
    const filing = await this.prisma.taxFiling.findUnique({ where: { id } });
    if (!filing) {
      throw new NotFoundException('Filing not found');
    }

    // Delete associated documents first if needed, or use cascade in Prisma schema
    // Assuming cascade is set up or we delete manually:
    await this.prisma.document.deleteMany({ where: { filingId: id } });

    return this.prisma.taxFiling.delete({ where: { id } });
  }
}
