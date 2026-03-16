// components/admin/AdminSidebar.tsx
'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  BarChart2, 
  Settings, 
  LogOut, 
  CreditCard
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Management', href: '/admin/users', icon: Users },
  { name: 'Subscription', href: '/admin/subscription', icon: CreditCard },
  { name: 'Communication', href: '/admin/communication', icon: MessageSquare },
  { name: 'Report', href: '/admin/reports', icon: BarChart2 },
  { name: 'Setting', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col shrink-0">
      {/* Logo Section */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-[#0D23AD]">Taxbridge</h1>
        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => router.push(item.href)}
            className={`
              w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive(item.href) 
                ? 'bg-[#0D23AD] text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <item.icon size={20} className={isActive(item.href) ? 'text-white' : 'text-gray-400'} />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}