'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
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
  { name: 'Report', href: '/admin/reports', icon: BarChart2 },
  { name: 'Setting', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change (e.g., browser back button)
  // Wrapped in setTimeout to prevent synchronous setState warning
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

  const handleNavClick = (href: string) => {
    setIsOpen(false); // Close immediately on click
    router.push(href);
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* --- Mobile Hamburger Toggle (Visible only on mobile when sidebar is closed) --- */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-md shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50"
        aria-label="Open Sidebar"
      >
        <Menu size={24} />
      </button>

      {/* --- Backdrop (Visible on mobile when open) --- */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- Sidebar Container --- */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 h-screen bg-white border-r border-gray-200 flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          
          /* Mobile State: Hidden by default (-translate-x-full), visible when open (translate-x-0) */
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          
          /* Desktop State: Always visible and static relative position */
          md:translate-x-0 md:static
        `}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-[#0D23AD]">Taxbridge</h1>
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Admin</span>
          </div>
          
          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 text-gray-500 hover:text-gray-700 rounded-md"
            aria-label="Close Sidebar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.href)}
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
    </>
  );
}