'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, UserCircle, X, Mail, Phone, Calendar, FileText, CreditCard, BarChart2 } from 'lucide-react';
import Topbar from '../../../../../components/admin/AdminTopbar';
import Sidebar from '../../../../../components/admin/AdminSidebar';

// Interface for the list item
interface UserListItem {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  joinedDate: string;
  subscription: { id: string; planName: string; status: string } | null;
  lastFiling: { id: string; status: string } | null;
}

// Interface for filings inside UserDetail
interface UserFiling {
  id: string;
  filingId: string;
  status: string;
  amount: number | null;
  createdAt: string;
}

// Interface for detailed view (does not extend UserListItem due to structural differences)
interface UserDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  profilePicture: string | null;
  isAdmin: boolean;
  createdAt: string;
  subscription: {
    status: string;
    startDate: string;
    nextPaymentDate: string | null;
    plan: { title: string; price: number };
  } | null;
  filings: UserFiling[];
  stats: { totalFilings: number; documentsUploaded: number };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

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
      if (res.ok) setUsers(await res.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    setModalLoading(true);
    setIsModalOpen(true);
    setSelectedUser(null);

    const token = localStorage.getItem('access_token');
    try {
      const res = await fetch(`https://backend-production-c062.up.railway.app/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSelectedUser(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setModalLoading(false);
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
                            onClick={() => fetchUserDetails(user.id)}
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
                  <div className="text-center py-10 text-gray-500">No users found.</div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* User Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setIsModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Header */}
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden mr-4">
                       {selectedUser?.profilePicture ? (
                         <img src={selectedUser.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                       ) : (
                         <UserCircle className="text-blue-600" size={28} />
                       )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{selectedUser?.name}</h3>
                      <p className="text-xs text-gray-500">{selectedUser?.isAdmin ? 'Administrator' : 'Standard User'}</p>
                    </div>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Body */}
              {modalLoading ? (
                <div className="p-10 flex justify-center">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
              ) : selectedUser && (
                <div className="px-6 pb-6 space-y-4">
                  {/* Contact Info */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={14} className="mr-2 text-gray-400" /> {selectedUser.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone size={14} className="mr-2 text-gray-400" /> {selectedUser.phone || 'Not provided'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-2 text-gray-400" /> Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 p-3 rounded-lg text-center">
                      <p className="text-xl font-bold text-blue-700">{selectedUser.stats?.totalFilings || 0}</p>
                      <p className="text-xs text-blue-600">Filings</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-xl font-bold text-green-700">{selectedUser.stats?.documentsUploaded || 0}</p>
                      <p className="text-xs text-green-600">Documents</p>
                    </div>
                  </div>

                  {/* Subscription */}
                  {selectedUser.subscription && (
                    <div className="border border-gray-100 p-4 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Subscription</h4>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{selectedUser.subscription.plan?.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                           selectedUser.subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {selectedUser.subscription.status}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Recent Filings */}
                  {selectedUser.filings && selectedUser.filings.length > 0 && (
                     <div>
                       <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Filings</h4>
                       <div className="space-y-2">
                         {selectedUser.filings.map((f: UserFiling) => (
                           <div key={f.id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                             <span className="text-gray-700">{f.filingId}</span>
                             <span className={`text-xs ${f.status === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>{f.status}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}