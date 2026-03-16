import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getUserDashboard(userId: string) {
    // 1. Fetch all filings for the user
    const filings = await this.prisma.taxFiling.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Calculate Financial Stats
    let totalIncome = 0;
    let totalExpenses = 0;

    filings.forEach(filing => {
      // Cast to any to access JSON properties safely
      const incomeDetails = filing.incomeDetails as any;
      const deductions = filing.deductions as any;

      // Income is stored in incomeDetails.grossIncome
      const income = parseFloat(incomeDetails?.grossIncome || '0');
      if (!isNaN(income)) totalIncome += income;

      // Expenses: Sum up known deduction fields
      const donation = Number(deductions?.donationAmount || 0);
      if (!isNaN(donation)) totalExpenses += donation;
    });

    const netPosition = totalIncome - totalExpenses;

    // 3. Filing Status Breakdown (for Pie Chart)
    const statusCounts = {
      COMPLETED: 0,
      PENDING: 0,
      UNDER_REVIEW: 0,
      NEEDS_INFO: 0,
      REJECTED: 0,
    };

    filings.forEach(filing => {
      if (statusCounts.hasOwnProperty(filing.status)) {
        statusCounts[filing.status]++;
      }
    });

    // 4. Recent Activity (Last 5 filings)
    const recentFilings = filings.slice(0, 5).map(f => ({
      id: f.id,
      filingId: f.filingId,
      date: f.createdAt,
      status: f.status,
      amount: f.amount,
      type: f.type
    }));

    // 5. Monthly Report Data (Group by month for Bar Chart)
    const monthlyData = this.groupByMonth(filings);

    return {
      stats: {
        totalIncome: totalIncome,
        totalExpenses: totalExpenses,
        netPosition: netPosition,
        totalFilings: filings.length,
      },
      charts: {
        filingStatus: [
          { name: 'Completed', value: statusCounts.COMPLETED },
          { name: 'Pending', value: statusCounts.PENDING },
          { name: 'Under Review', value: statusCounts.UNDER_REVIEW },
        ],
        monthlyActivity: monthlyData,
      },
      recentActivity: recentFilings,
    };
  }

  // Helper to group filings by month for charts
  private groupByMonth(filings: any[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = new Array(12).fill(0);

    filings.forEach(filing => {
      const date = new Date(filing.createdAt);
      const monthIndex = date.getMonth();
      counts[monthIndex]++;
    });

    return months.map((month, index) => ({
      month: month,
      filings: counts[index]
    }));
  }
}
