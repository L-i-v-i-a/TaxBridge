'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign, FileText, TrendingUp, Activity } from 'lucide-react';
import Sidebar from '../../../../components/dashboard/Sidebar';
import TopBar from '../../../../components/dashboard/Topbar';
import StatsCard from '../../../../components/dashboard/StatsCards';
import { FilingStatusChart, MonthlyActivityChart } from '../../../../components/dashboard/Charts';
import RecentActivityTable from '../../../../components/dashboard/RecentActivityTable';
import { DashboardData } from '../../../../types/dashboard';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('https://backend-production-c062.up.railway.app/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          router.push('/login');
          return;
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D23AD]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here is an overview of your taxes.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard 
                title="Total Income" 
                value={`$${data?.stats.totalIncome.toLocaleString() || 0}`} 
                icon={DollarSign} 
              />
              <StatsCard 
                title="Total Expenses" 
                value={`$${data?.stats.totalExpenses.toLocaleString() || 0}`} 
                icon={TrendingUp} 
                trendColor="text-red-500"
              />
              <StatsCard 
                title="Net Position" 
                value={`$${data?.stats.netPosition.toLocaleString() || 0}`} 
                icon={Activity} 
                trend={data?.stats.netPosition >= 0 ? "Profit" : "Loss"}
                trendColor={data?.stats.netPosition >= 0 ? "text-green-500" : "text-red-500"}
              />
              <StatsCard 
                title="Total Filings" 
                value={data?.stats.totalFilings || 0} 
                icon={FileText} 
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MonthlyActivityChart data={data?.charts.monthlyActivity || []} />
              <FilingStatusChart data={data?.charts.filingStatus || []} />
            </div>

            {/* Recent Activity */}
            <RecentActivityTable data={data?.recentActivity || []} />

          </div>
        </main>
      </div>
    </div>
  );
}