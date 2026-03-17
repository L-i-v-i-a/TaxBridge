'use client';

import React, { useEffect, useState } from 'react';
import { Trash2, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image'; // 1. Import Image
// Import your existing components
import AdminSidebar from '../../../../../components/admin/AdminSidebar';
import AdminTopbar from '../../../../../components/admin/AdminTopbar';

interface SubscriptionData {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  subscription: {
    id: string;
    status: string;
    startDate: string;
    planName: string;
    planType: string;
  };
}

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data from your API
  const fetchSubscriptions = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch('https://backend-production-c062.up.railway.app/subscriptions/admin/all', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete Logic
  const handleDelete = async (subId: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`https://backend-production-c062.up.railway.app/subscriptions/admin/${subId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setSubscriptions(prev => prev.filter(item => item.subscription.id !== subId));
      }
    } catch (error) {
      alert('Failed to delete subscription');
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="flex h-screen bg-[#F9FAFB]">
      {/* Sidebar - Positioned on the left */}
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar - Positioned at the top */}
        <AdminTopbar />

        {/* Main Content Area */}
        <main className="flex-1 pt-16 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Subscription</h1>

            {loading ? (
              <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="animate-spin text-[#0D23AD]" size={40} />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Name/Client</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Plan Type</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {subscriptions.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {/* 2. Replaced img with Image component */}
                            <Image 
                              src={item.profilePicture || 'https://via.placeholder.com/40'} 
                              alt={item.name || 'Profile'}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover border border-gray-100"
                            />
                            <div>
                              <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                              <div className="text-xs text-gray-400 flex items-center gap-1">
                                <MapPin size={10} /> Lagos, Nigeria
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="text-sm text-gray-700">
                            {new Date(item.subscription.startDate).toLocaleDateString('en-GB', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </div>
                          <div className="text-[10px] text-gray-400 uppercase">
                            at {new Date(item.subscription.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-500">
                          {item.subscription.planName} Plan
                        </td>

                        <td className="px-6 py-5">
                          <span className={`px-3 py-1 rounded-md text-xs font-medium ${
                            item.subscription.status === 'active' 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-orange-50 text-orange-600'
                          }`}>
                            {item.subscription.status === 'active' ? 'Paid' : 'Pending'}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => handleDelete(item.subscription.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {subscriptions.length === 0 && !loading && (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500 text-sm">
                          No subscription records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}