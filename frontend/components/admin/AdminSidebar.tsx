'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  BarChart2, 
  Settings, 
  LogOut, 
  CreditCard,
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Management', href: '/admin/users', icon: Users },
  { name: 'Subscription', href: '/admin/subscription', icon: CreditCard },
  { name: 'Communication', href: '/admin/communication', icon: MessageSquare },
  { name: 'Reports', href: '/admin/reports', icon: BarChart2 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Fix: Use setTimeout to avoid synchronous setState warning during route changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Toggle Button - Visible only below 'lg' breakpoint */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-100 text-gray-600 focus:outline-none hover:bg-gray-50 transition-colors"
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay - Blurs background when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto shrink-0
      `}>
        
        {/* Logo Section */}
        <div className="px-6 py-8">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#0D23AD] tracking-tight">TaxBridge</span>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-black uppercase">Admin</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${active 
                    ? 'bg-[#0D23AD] text-white shadow-lg shadow-blue-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <item.icon className={`w-5 h-5 transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Footer */}
        <div className="p-4 mt-auto border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50 transition-colors group"
          >
            <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}