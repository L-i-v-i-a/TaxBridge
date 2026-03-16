// app/notifications/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, FileText, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react';
import Topbar from '../../../../components/dashboard/Topbar';
import Sidebar from '../../../../components/dashboard/Sidebar';

type NotificationType = 'FILING' | 'CHAT' | 'SYSTEM';
type StatusFilter = 'ALL' | 'UNREAD' | 'READ';

interface Notification {
  id: string;
  type: NotificationType;
  priority: 'HIGH' | 'LOW';
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<NotificationType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('UNREAD');

  useEffect(() => {
    fetchNotifications();
  }, [activeTab, statusFilter]);

  const fetchNotifications = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    
    const params = new URLSearchParams();
    if (statusFilter !== 'ALL') params.append('status', statusFilter);
    if (activeTab !== 'ALL') params.append('type', activeTab);

    try {
      const res = await fetch(`http://localhost:3000/notifications?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setNotifications(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, link: string | null) => {
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`http://localhost:3000/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from list if filter is UNREAD
      if (statusFilter === 'UNREAD') {
        setNotifications(prev => prev.filter(n => n.id !== id));
      } else {
        // Update state locally
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      }
      
      if (link) router.push(link);
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: NotificationType) => {
    if (type === 'FILING') return <FileText className="text-blue-600" size={20} />;
    if (type === 'CHAT') return <MessageSquare className="text-orange-500" size={20} />;
    return <Bell className="text-gray-500" size={20} />;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 mt-16 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <button 
                onClick={async () => {
                    const token = localStorage.getItem('access_token');
                    await fetch('http://localhost:3000/notifications/read-all', {
                        method: 'PATCH',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    fetchNotifications();
                }}
                className="text-sm text-[#0D23AD] font-medium hover:underline"
              >
                Mark all as read
              </button>
            </div>

            {/* Tabs & Filters */}
            <div className="bg-white rounded-xl border shadow-sm mb-6 p-4">
              <div className="flex flex-wrap gap-2">
                {/* Status Filters */}
                {['UNREAD', 'ALL', 'READ'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s as StatusFilter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      statusFilter === s ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex gap-4 mt-4 border-t pt-4">
                {/* Category Tabs */}
                {[
                  { key: 'ALL', label: 'All' },
                  { key: 'FILING', label: 'Filings' },
                  { key: 'CHAT', label: 'Alerts' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${
                      activeTab === tab.key 
                        ? 'bg-blue-50 border-blue-200 text-blue-700' 
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-400" size={32} /></div>
            ) : notifications.length === 0 ? (
              <div className="text-center text-gray-400 py-20">
                <Bell size={40} className="mx-auto mb-3 opacity-50" />
                <p>No notifications found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`bg-white p-4 rounded-xl border shadow-sm flex items-start gap-4 transition hover:shadow-md ${
                      !n.isRead ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className={`p-2 rounded-full ${n.type === 'FILING' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                      {getIcon(n.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-semibold text-gray-800">{n.title}</h3>
                        {n.priority === 'HIGH' && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <AlertTriangle size={12} /> High
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{n.message}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {!n.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(n.id, n.link)}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-blue-600"
                        title="Mark as read"
                      >
                        <Check size={18} />
                      </button>
                    )}
                    {n.isRead && n.link && (
                       <button 
                        onClick={() => router.push(n.link!)}
                        className="text-xs text-blue-600 font-medium hover:underline"
                       >
                         View
                       </button>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}