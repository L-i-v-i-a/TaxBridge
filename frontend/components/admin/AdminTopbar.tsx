// components/admin/AdminTopbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Settings, User, Search } from 'lucide-react';

interface AdminProfile {
  name: string;
  email: string;
  profilePicture: string | null;
}

export default function AdminTopbar() {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const res = await fetch('https://backend-production-c062.up.railway.app/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setAdmin(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 right-0 left-0 lg:left-64 z-30">
      {/* Left: Search (Optional) */}
      <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2 w-64">
        <Search size={18} className="text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* Right: Admin Info */}
      <div className="flex items-center space-x-4 ml-auto">
        <button className="relative p-2 hover:bg-gray-100 rounded-full">
          <Bell size={20} className="text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-3 border-l pl-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-800">{admin?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#0D23AD] flex items-center justify-center text-white overflow-hidden">
            {admin?.profilePicture ? (
              <img src={admin.profilePicture} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              <User size={18} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}