// app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, FileText, CheckCircle, CreditCard, 
  Eye, Trash2, Check, XCircle, Loader2 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import Topbar from '../../../../../components/admin/AdminTopbar';
import Sidebar from '../../../../../components/admin/AdminSidebar';
import StatCard from '../../../../../components/admin/StatCard';

interface Activity {
  id: string;
  filingId: string;
  status: string;
  createdAt: string;
  amount: number | null;
  user: {
    name: string;
    email: string;
  };
}

// Define the shape of the stats object
interface DashboardStats {
  totalUsers: number;
  totalCalculatedTax: number;
  totalFiledTax: number;
  activeSubscriptions: number;
  chartData: number[];
}

export default function AdminDashboard() {
  const router = useRouter();
  // Replace 'any' with 'DashboardStats | null'
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [selectedFiling, setSelectedFiling] = useState<Activity | null>(null);
  const [approveAmount, setApproveAmount] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return router.push('/login');
    try {
      const [statsRes, actRes] = await Promise.all([
        fetch('https://backend-production-c062.up.railway.app/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('https://backend-production-c062.up.railway.app/admin/activities', {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (actRes.ok) setActivities(await actRes.json());

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => localStorage.getItem('access_token');

  // --- Actions ---

  const handleView = (item: Activity) => {
    setSelectedFiling(item);
    setIsViewOpen(true);
  };

  const handleApproveInit = (item: Activity) => {
    setSelectedFiling(item);
    setApproveAmount(item.amount?.toString() || '');
    setIsApproveOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedFiling || !approveAmount) return;
    setProcessingId(selectedFiling.id);
    const token = getToken();

    try {
      const res = await fetch(`https://backend-production-c062.up.railway.app/filings/${selectedFiling.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: 'COMPLETED', 
          amount: parseFloat(approveAmount) 
        }),
      });

      if (res.ok) {
        setIsApproveOpen(false);
        fetchData(); // Refresh data
      } else {
        alert('Failed to approve filing');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSuspend = async (item: Activity) => {
    if (!confirm('Are you sure you want to reject this filing?')) return;
    
    const token = getToken();
    try {
      const res = await fetch(`https://backend-production-c062.up.railway.app/filings/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'REJECTED' }),
      });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (item: Activity) => {
    if (!confirm('Are you sure you want to delete this filing? This cannot be undone.')) return;
    
    const token = getToken();
    try {
      const res = await fetch(`https://backend-production-c062.up.railway.app/filings/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchData();
    } catch (e) { console.error(e); }
  };

  // --- Chart Data Prep ---
  const barChartData = stats?.chartData.map((val: number, idx: number) => ({
    name: new Date(0, idx).toLocaleString('default', { month: 'short' }),
    filings: val,
  })) || [];

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
               {/* Same Stats Cards as before */}
               <div onClick={() => router.push('/admin/users')} className="cursor-pointer">
                <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="text-blue-600"/>
              </div>
              <div onClick={() => router.push('/admin/filings')} className="cursor-pointer">
                <StatCard title="Total Calculated Tax" value={stats?.totalCalculatedTax || 0} icon={FileText} color="text-purple-600"/>
              </div>
              <div onClick={() => router.push('/admin/filings')} className="cursor-pointer">
                <StatCard title="Total Filed Tax" value={stats?.totalFiledTax || 0} icon={CheckCircle} color="text-green-600"/>
              </div>
              <div onClick={() => router.push('/admin/users')} className="cursor-pointer">
                <StatCard title="Active Subscriptions" value={stats?.activeSubscriptions || 0} icon={CreditCard} color="text-orange-500"/>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Bar Chart */}
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

              {/* Right: Pie Chart */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 self-start">Tax Reports</h3>
                <div className="relative w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                        {pieData.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.color} /> ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{stats?.totalFiledTax || 0}</span>
                    <span className="text-xs text-gray-500">Filed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Table */}
            <div className="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button 
                  onClick={() => router.push('/admin/users')} 
                  className="text-sm text-[#0D23AD] font-medium hover:underline"
                >
                  View More
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
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                            item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        
                        {/* Actions Column */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                          <button onClick={() => handleView(item)} className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200" title="View">
                            <Eye size={16} className="text-gray-600" />
                          </button>
                          <button onClick={() => handleApproveInit(item)} className="p-1.5 bg-green-100 rounded-md hover:bg-green-200" title="Approve">
                            <Check size={16} className="text-green-600" />
                          </button>
                          <button onClick={() => handleSuspend(item)} className="p-1.5 bg-orange-100 rounded-md hover:bg-orange-200" title="Suspend/Reject">
                            <XCircle size={16} className="text-orange-600" />
                          </button>
                          <button onClick={() => handleDelete(item)} className="p-1.5 bg-red-100 rounded-md hover:bg-red-200" title="Delete">
                            <Trash2 size={16} className="text-red-600" />
                          </button>
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

      {/* View Modal */}
      {isViewOpen && selectedFiling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Filing Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Filing ID:</strong> {selectedFiling.filingId}</p>
              <p><strong>User:</strong> {selectedFiling.user.name}</p>
              <p><strong>Status:</strong> {selectedFiling.status}</p>
              <p><strong>Amount:</strong> {selectedFiling.amount || 'Not Set'}</p>
              <p><strong>Date:</strong> {new Date(selectedFiling.createdAt).toLocaleString()}</p>
            </div>
            <button onClick={() => setIsViewOpen(false)} className="mt-6 w-full py-2 bg-gray-100 rounded-lg font-medium hover:bg-gray-200">Close</button>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {isApproveOpen && selectedFiling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-4">Approve Filing</h3>
            <p className="text-sm text-gray-600 mb-4">Set the final tax amount to mark this filing as completed.</p>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Amount ($)</label>
            <input 
              type="number" 
              value={approveAmount} 
              onChange={(e) => setApproveAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 outline-none focus:ring-1 focus:ring-[#0D23AD]"
              placeholder="0.00"
            />
            <div className="flex space-x-3">
              <button onClick={() => setIsApproveOpen(false)} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
              <button 
                onClick={handleApproveConfirm} 
                disabled={processingId === selectedFiling.id}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center"
              >
                {processingId === selectedFiling.id ? <Loader2 className="animate-spin h-4 w-4" /> : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}