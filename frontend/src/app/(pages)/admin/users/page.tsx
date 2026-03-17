// app/admin/users/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, ShieldCheck, UserCircle, FileText, CreditCard } from 'lucide-react';
import Topbar from '../../../../../components/admin/AdminTopbar';
import Sidebar from '../../../../../components/admin/AdminSidebar';

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  joinedDate: string;
  subscription: {
    id: string;
    planName: string;
    status: string;
  } | null;
  lastFiling: {
    id: string;
    status: string;
  } | null;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch('https://backend-production-c062.up.railway.app/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(await res.json());
      } else {
        // Handle 403 or 401
        router.push('/login');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 mt-16 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Manage all registered users, subscriptions, and filings.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D23AD]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0D23AD]" size={32} /></div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Filing</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                              {user.profilePicture ? (
                                <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <UserCircle className="text-gray-400" size={24} />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name || 'Unnamed'}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.subscription ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {user.subscription.planName}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No subscription</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.lastFiling ? (
                             <span className={`text-xs px-2 py-0.5 rounded ${
                               user.lastFiling.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                             }`}>
                               {user.lastFiling.status}
                             </span>
                          ) : (
                            <span className="text-xs text-gray-400">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.joinedDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                            className="text-[#0D23AD] hover:text-[#0a1b8a] text-xs font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredUsers.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    No users found.
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}