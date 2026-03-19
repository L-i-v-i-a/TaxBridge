'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, UserCircle, X, Mail, Phone, Calendar, FileText, CreditCard, BarChart2, Menu } from 'lucide-react';
import Topbar from '../../../../../components/admin/AdminTopbar';
import Sidebar from '../../../../../components/admin/AdminSidebar';

// Interfaces remain the same
interface UserListItem {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  joinedDate: string;
  subscription: { id: string; planName: string; status: string } | null;
  lastFiling: { id: string; status: string } | null;
}

interface UserFiling {
  id: string;
  filingId: string;
  status: string;
  amount: number | null;
  createdAt: string;
}

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle

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
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Hidden on mobile, controlled by state */}
      <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 mt-16 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Manage registered users and subscriptions.</p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0D23AD] bg-white text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#0D23AD]" size={32} /></div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Desktop View: Table */}
                <div className="hidden md:block overflow-x-auto">
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
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden mr-3">
                                {user.profilePicture ? (
                                  <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <UserCircle className="text-gray-400" size={24} />
                                )}
                              </div>
                              <div className="truncate max-w-[150px]">
                                <div className="text-sm font-medium text-gray-900 truncate">{user.name || 'Unnamed'}</div>
                                <div className="text-xs text-gray-500 truncate">{user.email}</div>
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
                              className="text-[#0D23AD] hover:text-[#0a1b8a] text-xs font-bold"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View: Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden mr-3">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle className="text-gray-400" size={24} />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{user.name || 'Unnamed'}</div>
                            <div className="text-xs text-gray-500">{user.email}</div>
                          </div>
                        </div>
                        <button 
                          onClick={() => fetchUserDetails(user.id)}
                          className="bg-gray-100 p-2 rounded-lg text-[#0D23AD]"
                        >
                          <FileText size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-gray-500">Joined: {new Date(user.joinedDate).toLocaleDateString()}</span>
                         <div className="flex gap-2">
                            {user.subscription && (
                              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                                {user.subscription.planName}
                              </span>
                            )}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredUsers.length === 0 && (
                  <div className="text-center py-10 text-gray-500">No users found.</div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* User Details Modal - FIXED BLUR & MOBILE SIZE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Overlay: Changed from blur/opacity to a clean dark overlay */}
          <div className="flex items-center justify-center min-h-screen p-4">
            <div 
              className="fixed inset-0 bg-black/60 transition-opacity" 
              onClick={() => setIsModalOpen(false)}
            ></div>
            
            {/* Modal Container */}
            <div className="relative bg-white rounded-2xl w-full max-w-lg mx-auto shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
              
              {/* Header */}
              <div className="bg-white px-6 pt-6 pb-4 border-b border-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div className="h-14 w-14 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center overflow-hidden mr-4 border-2 border-white shadow-sm">
                       {selectedUser?.profilePicture ? (
                         <img src={selectedUser.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                       ) : (
                         <UserCircle className="text-blue-500" size={32} />
                       )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{selectedUser?.name}</h3>
                      <p className="text-xs font-medium text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded mt-1">
                        {selectedUser?.isAdmin ? 'Administrator' : 'Standard User'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="max-h-[70vh] overflow-y-auto">
                {modalLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-[#0D23AD]" size={40} />
                    <p className="text-sm text-gray-500">Fetching user profile...</p>
                  </div>
                ) : selectedUser && (
                  <div className="px-6 py-6 space-y-6">
                    {/* Contact Info Card */}
                    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 gap-3">
                      <div className="flex items-center text-sm text-gray-700">
                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center mr-3 shadow-sm">
                          <Mail size={14} className="text-gray-400" />
                        </div>
                        {selectedUser.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center mr-3 shadow-sm">
                          <Phone size={14} className="text-gray-400" />
                        </div>
                        {selectedUser.phone || 'No phone added'}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <div className="w-8 h-8 rounded bg-white flex items-center justify-center mr-3 shadow-sm">
                          <Calendar size={14} className="text-gray-400" />
                        </div>
                        Joined {new Date(selectedUser.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0D23AD]/5 border border-[#0D23AD]/10 p-4 rounded-xl">
                        <p className="text-2xl font-black text-[#0D23AD]">{selectedUser.stats?.totalFilings || 0}</p>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-[#0D23AD]/60">Total Filings</p>
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                        <p className="text-2xl font-black text-emerald-700">{selectedUser.stats?.documentsUploaded || 0}</p>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-emerald-600/60">Documents</p>
                      </div>
                    </div>

                    {/* Subscription Section */}
                    {selectedUser.subscription ? (
                      <div className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Plan</h4>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                            {selectedUser.subscription.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-50 rounded-lg">
                            <CreditCard className="text-amber-600" size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{selectedUser.subscription.plan?.title}</p>
                            <p className="text-xs text-gray-500">Next billing: {selectedUser.subscription.nextPaymentDate ? new Date(selectedUser.subscription.nextPaymentDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center">
                        <p className="text-sm text-gray-400">No active subscription</p>
                      </div>
                    )}

                    {/* Filings Table - Mini */}
                    {selectedUser.filings && selectedUser.filings.length > 0 && (
                       <div className="space-y-3">
                         <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Filings</h4>
                         <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                           {selectedUser.filings.slice(0, 5).map((f: UserFiling, idx) => (
                             <div key={f.id} className={`flex justify-between items-center p-3 text-sm ${idx !== selectedUser.filings.length - 1 ? 'border-b border-gray-50' : ''}`}>
                               <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                 <span className="font-medium text-gray-700">{f.filingId}</span>
                               </div>
                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${f.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                 {f.status}
                               </span>
                             </div>
                           ))}
                         </div>
                       </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}