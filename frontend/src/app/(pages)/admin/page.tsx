// app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, FileText, CheckCircle, CreditCard, ArrowRight } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import Topbar from '../../../../components/admin/AdminTopbar';
import Sidebar from '../../../../components/admin/AdminSidebar';
import StatCard from '../../../../components/admin/StatCard';

interface DashboardStats {
  totalUsers: number;
  totalCalculatedTax: number;
  totalFiledTax: number;
  activeSubscriptions: number;
  chartData: number[]; 
}

interface Activity {
  id: string;
  filingId: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return router.push('/login');

    try {
      // Fetch Stats
      const statsRes = await fetch('http://localhost:3000/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (statsRes.ok) setStats(await statsRes.json());

      // Fetch Activities
      const actRes = await fetch('http://localhost:3000/admin/activities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (actRes.ok) setActivities(await actRes.json());

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare Bar Chart Data (Monthly)
  const barChartData = stats?.chartData.map((val, idx) => ({
    name: new Date(0, idx).toLocaleString('default', { month: 'short' }),
    filings: val,
  })) || [];

  // Prepare Pie Chart Data (Status Overview)
  // We use the stats to create a visual ratio of Filed vs Pending/Calculated
  const filedCount = stats?.totalFiledTax || 0;
  const remainingCount = (stats?.totalCalculatedTax || 0) - filedCount;
  
  const pieData = [
    { name: 'Filed', value: filedCount, color: '#0D23AD' },
    { name: 'Pending', value: remainingCount > 0 ? remainingCount : 0, color: '#E5E7EB' },
  ];

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 mt-16 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div onClick={() => router.push('/admin/users')} className="cursor-pointer">
                <StatCard 
                  title="Total Users" 
                  value={stats?.totalUsers || 0} 
                  icon={Users} 
                  color="text-blue-600"
                />
              </div>
              <div onClick={() => router.push('/admin/filings')} className="cursor-pointer">
                <StatCard 
                  title="Total Calculated Tax" 
                  value={stats?.totalCalculatedTax || 0} 
                  icon={FileText} 
                  color="text-purple-600"
                />
              </div>
              <div onClick={() => router.push('/admin/filings')} className="cursor-pointer">
                <StatCard 
                  title="Total Filed Tax" 
                  value={stats?.totalFiledTax || 0} 
                  icon={CheckCircle} 
                  color="text-green-600"
                />
              </div>
              <div onClick={() => router.push('/admin/users')} className="cursor-pointer">
                <StatCard 
                  title="Active Subscriptions" 
                  value={stats?.activeSubscriptions || 0} 
                  icon={CreditCard} 
                  color="text-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Bar Chart Section */}
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Activity</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="filings" fill="#0D23AD" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right: Circular Graph (Replacing Quick Actions) */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 self-start">Tax Reports</h3>
                
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{stats?.totalFiledTax || 0}</span>
                    <span className="text-xs text-gray-500">Filed</span>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mt-4 text-xs">
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-[#0D23AD] mr-1"></span>
                    Filed
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-gray-200 mr-1"></span>
                    Pending
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button 
                  onClick={() => router.push('/admin/filings')}
                  className="text-sm text-[#0D23AD] font-medium hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Filing ID</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activities.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-3">
                              {item.user.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.user.name}</div>
                              <div className="text-xs text-gray-500">{item.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.filingId}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                            item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}