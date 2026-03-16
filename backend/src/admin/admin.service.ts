// src/admin/admin.service.ts
import { Injectable } from '@nestjs/common';

import { FilingStatus } from '@prisma/client';

import { PrismaService } from '../prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // 1. Total Users (non-admin)
    const totalUsers = await this.prisma.user.count({
      where: { isAdmin: false },
    });

    // 2. Total Calculated Tax (Count of filings)
    const totalCalculatedTax = await this.prisma.taxFiling.count();

    // 3. Total Filed Tax (Count of COMPLETED filings)
    const totalFiledTax = await this.prisma.taxFiling.count({
      where: { status: FilingStatus.COMPLETED },
    });

    // 4. Active Subscriptions
    const activeSubscriptions = await this.prisma.subscription.count({
      where: { status: 'active' },
    });

    // 5. Chart Data (Filings per month for current year)
    const currentYear = new Date().getFullYear();
    const filingsPerMonth = await this.prisma.taxFiling.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
      _count: {
        id: true,
      },
    });

    // Aggregate by month for frontend
    const monthlyData = Array(12).fill(0);
    filingsPerMonth.forEach((f) => {
      const month = new Date(f.createdAt).getMonth();
      monthlyData[month] += f._count.id;
    });

    return {
      totalUsers,
      totalCalculatedTax,
      totalFiledTax,
      activeSubscriptions,
      chartData: monthlyData,
    };
  }

  async getRecentActivities(limit: number = 10) {
    // Fetch recent filings with user details
    return this.prisma.taxFiling.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      where: { isAdmin: false },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        createdAt: true,
        subscriptions: {
          where: { status: 'active' },
          select: {
            id: true,
            startDate: true,
            plan: {
              select: { title: true, price: true, type: true },
            },
          },
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
        filings: {
          select: { id: true, status: true, filingId: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Flatten structure for frontend
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      joinedDate: user.createdAt,
      subscription: user.subscriptions[0]
        ? {
            id: user.subscriptions[0].id,
            planName: user.subscriptions[0].plan.title,
            status: 'Active', // We filtered for active
          }
        : null,
      lastFiling: user.filings[0]
        ? {
            id: user.filings[0].id,
            status: user.filings[0].status,
          }
        : null,
    }));
  }
}