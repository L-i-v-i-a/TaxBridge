import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';

import { ServiceType, FilingStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../prisma.service';
import { AiService } from '../ai/ai.service';
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
      throw new UnauthorizedException('User ID is missing. Authentication failed.');
    }

    // 1. Generate ID and Extract Year
    const count = await this.prisma.taxFiling.count();
    const filingId = `F${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    // Ensure we have a tax year, default to current year if missing
    const taxYear = dto.taxYear ?? new Date().getFullYear();

    // 2. Prepare Base Data
    const filingData: Prisma.TaxFilingUncheckedCreateInput = {
      userId,
      filingId,
      serviceType,
      taxYear,
      type: dto.type || 'Federal',
      personalInfo: dto.personalInfo,
      incomeDetails: dto.incomeDetails,
      deductions: dto.deductions,
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

    // A. CALCULATION ONLY
    if (serviceType === ServiceType.CALCULATION_ONLY) {
      const aiResult = await this.ai.calculateTax(
        taxYear,
        dto.incomeDetails,
        dto.deductions,
      );

      if (aiResult.success) {
        filingData.status = FilingStatus.COMPLETED;
        filingData.amount = aiResult.amount;
        const filing = await this.prisma.taxFiling.create({ data: filingData });
        return { message: 'Calculation successful', data: filing };
      }

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

      return {
        message: 'Submission received. An expert has been assigned.',
        data: filing,
      };
    }

    // C. FULL FILING
    if (serviceType === ServiceType.FULL_FILING) {
      const aiResult = await this.ai.calculateTax(
        taxYear,
        dto.incomeDetails,
        dto.deductions,
      );

      if (aiResult.success) {
        filingData.status = FilingStatus.COMPLETED;
        filingData.amount = aiResult.amount;
        const filing = await this.prisma.taxFiling.create({ data: filingData });
        return {
          message: 'Tax calculated and filed successfully.',
          data: filing,
        };
      }

      const filing = await this.prisma.taxFiling.create({
        data: { ...filingData, status: FilingStatus.NEEDS_INFO },
      });

      await this.mailer.sendAdminNotification(
        filingId,
        'Manual filing intervention required',
        dto.personalInfo?.email,
      );

      return {
        message: 'Submission received. Our team is reviewing to finalize.',
        data: filing,
      };
    }

    throw new InternalServerErrorException('Invalid Service Type provided');
  }

  // Admin Update Method
  async updateFiling(adminId: string, filingId: string, dto: UpdateFilingDto) {
    // 1. Verify the user is an Admin
    const admin = await this.prisma.user.findUnique({ where: { id: adminId } });

    if (!admin || !admin.isAdmin) {
      throw new ForbiddenException('Only administrators can update filings');
    }

    // 2. Update the filing
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
}
