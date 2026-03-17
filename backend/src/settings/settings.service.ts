// src/settings/settings.service.ts
import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException, 
  BadRequestException, 
  StreamableFile 
} from '@nestjs/common';

import { createReadStream, unlinkSync, existsSync } from 'fs';

import { join } from 'path';

import { PrismaService } from '../prisma.service';
import { FilingsService } from '../fillings/filings.service';
import { PaymentService } from '../payment/payment.service';

// --- EXPORTED INTERFACES ---
export interface YearlyData {
  year: string;
  amount: number;
}

export interface DeductionData {
  name: string;
  value: number;
}

export interface StatsResponse {
  cards: {
    totalRefunds: number;
    refundGrowth: number;
    filedReturns: number;
    filingSince: number | string;
    avgProcessingDays: number;
    daysFaster: number;
    docsUploaded: number;
  };
  subscription: { plan: string; status: string } | null;
  refundHistory: YearlyData[];
  deductions: DeductionData[];
}

@Injectable()
export class SettingsService {
  constructor(
    private prisma: PrismaService,
    private filingsService: FilingsService,
    private paymentService: PaymentService,
  ) {}

  async getSettingsStats(userId: string): Promise<StatsResponse> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;

    // 1. TIMEFRAMES
    const startOfCurrentYear = new Date(currentYear, 0, 1); 
    const startOfLastYear = new Date(lastYear, 0, 1); 
    const startOfNextYear = new Date(currentYear + 1, 0, 1); 

    // 2. FETCH DATA
    const filings = await this.prisma.taxFiling.findMany({
      where: { userId },
      select: { 
        amount: true, 
        status: true, 
        createdAt: true, 
        updatedAt: true, 
        deductions: true 
      },
    });

    // Fetch documents for current year
    const documents = await this.prisma.document.findMany({
      where: { 
        filing: { userId },
        createdAt: { gte: startOfCurrentYear } 
      },
    });

    // 3. CALCULATIONS

    // --- Card 1: Total Refunds ---
    const currentYearRefunds = filings
      .filter(f => f.createdAt >= startOfCurrentYear && f.createdAt < startOfNextYear)
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    const lastYearRefunds = filings
      .filter(f => f.createdAt >= startOfLastYear && f.createdAt < startOfCurrentYear)
      .reduce((sum, f) => sum + (f.amount || 0), 0);

    const refundGrowth = lastYearRefunds === 0 
      ? (currentYearRefunds > 0 ? 100 : 0) 
      : Math.round(((currentYearRefunds - lastYearRefunds) / lastYearRefunds) * 100);

    // --- Card 2: Filed Returns ---
    const completedFilings = filings.filter(f => f.status === 'COMPLETED');
    const totalFiled = completedFilings.length;
    
    const firstFilingDate = filings.length > 0 
      ? filings.reduce((min, f) => f.createdAt < min ? f.createdAt : min, filings[0].createdAt)
      : null;

    // --- Card 3: Avg Processing Time ---
    const processingTimes = completedFilings
      .map(f => (new Date(f.updatedAt).getTime() - new Date(f.createdAt).getTime()) / (1000 * 60 * 60 * 24)); 
    
    const avgProcessingDays = processingTimes.length > 0 
      ? Math.round(processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length)
      : 0;
    
    const daysFaster = 3; 

    // --- Card 4: Documents Uploaded ---
    const docsUploaded = documents.length;

    // --- Graph 1: Refund/Payment History (Last 5 Years) ---
    const yearlyData: YearlyData[] = [];

    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;
      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);
      
      const yearTotal = filings
        .filter(f => f.createdAt >= start && f.createdAt < end)
        .reduce((sum, f) => sum + (f.amount || 0), 0);

      yearlyData.push({
        year: year.toString(),
        amount: Math.abs(yearTotal),
      });
    }

    // --- Graph 2: Deductions Breakdown (Current Year) ---
    const deductionBreakdown: Record<string, number> = {};
    
    filings
      .filter(f => f.createdAt >= startOfCurrentYear && f.deductions)
      .forEach(f => {
        const ded: any = f.deductions;
        if (ded.donationAmount) {
          deductionBreakdown['Donations'] = (deductionBreakdown['Donations'] || 0) + Number(ded.donationAmount);
        }
        if (ded.medicalExpenses) { 
           deductionBreakdown['Medical'] = (deductionBreakdown['Medical'] || 0) + Number(ded.medicalExpenses);
        }
      });

    const pieData: DeductionData[] = Object.keys(deductionBreakdown).map(name => ({
      name,
      value: deductionBreakdown[name]
    }));

    // 4. CONSTRUCT RESPONSE
    return {
      cards: {
        totalRefunds: currentYearRefunds,
        refundGrowth,
        filedReturns: totalFiled,
        filingSince: firstFilingDate ? firstFilingDate.getFullYear() : 'N/A',
        avgProcessingDays,
        daysFaster,
        docsUploaded,
      },
      subscription: await this.getSubDetails(userId),
      refundHistory: yearlyData,
      deductions: pieData,
    };
  }

  private async getSubDetails(userId: string) {
    const sub = await this.paymentService.getMySubscription(userId);
    return sub ? { plan: sub.plan.title, status: sub.status } : null;
  }

  // --- Document Methods ---

  async getUserDocuments(userId: string) {
    const filings = await this.prisma.taxFiling.findMany({
      where: { userId },
      include: { documents: true },
      orderBy: { createdAt: 'desc' },
    });

    return filings.flatMap(filing => 
      filing.documents.map(doc => ({
        ...doc,
        filingId: filing.id,
        filingName: filing.filingId,
      }))
    );
  }

  async uploadDocument(userId: string, file: Express.Multer.File, filingId: string | null, name?: string) {
    const fileUrl = `uploads/documents/${file.filename}`;
    const docName = name || file.originalname;

    if (filingId) {
      const filing = await this.prisma.taxFiling.findFirst({
        where: { id: filingId, userId },
      });
      if (!filing) throw new NotFoundException('Filing not found');
      
      return this.prisma.document.create({
        data: { name: docName, url: fileUrl, type: file.mimetype, filingId },
      });
    }
    throw new BadRequestException('filingId is required to upload a document');
  }

  async downloadDocument(userId: string, docId: string): Promise<StreamableFile> {
    const doc = await this.prisma.document.findUnique({
      where: { id: docId },
      include: { filing: true },
    });

    if (!doc || doc.filing.userId !== userId) throw new NotFoundException('Document not found');

    const filePath = join(process.cwd(), doc.url);
    if (!existsSync(filePath)) throw new NotFoundException('File missing');
    
    return new StreamableFile(createReadStream(filePath));
  }

  async deleteDocument(userId: string, docId: string) {
    const doc = await this.prisma.document.findUnique({
      where: { id: docId },
      include: { filing: true },
    });

    if (!doc || doc.filing.userId !== userId) throw new ForbiddenException('Access denied');

    const filePath = join(process.cwd(), doc.url);
    if (existsSync(filePath)) unlinkSync(filePath);

    await this.prisma.document.delete({ where: { id: docId } });
    return { message: 'Deleted' };
  }
}