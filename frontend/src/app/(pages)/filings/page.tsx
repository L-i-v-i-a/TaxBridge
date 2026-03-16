'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/dashboard/Sidebar';
import TopBar from '../../../../components/dashboard/Topbar';
import FilingStatsCards from '../../../../components/filings/FilingStatsCards';
import ServiceOptions from '../../../../components/filings/ServiceOptions';
import { FilingStats } from '../../../../types/filings';

export default function FilingsPage() {
  const [stats, setStats] = useState<FilingStats | null>(null);
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
        // Fetch Stats
        const statsRes = await fetch('http://localhost:3000/filings/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
      } catch (error) {
        console.error("Error fetching filing data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Tax Filing</h1>
              <p className="text-gray-500 mt-1">Manage your tax filings and start new submissions.</p>
            </div>

            {/* Stats Cards */}
            {stats && <FilingStatsCards stats={stats} />}

            {/* Service Options (The 3 Buttons) */}
            <div className="mt-8">
                <ServiceOptions />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}