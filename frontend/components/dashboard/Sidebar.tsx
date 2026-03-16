'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  MessageCircle
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tax Filing', href: '/filings', icon: FileText },
  { name: 'Communication', href: '/communication', icon: MessageCircle },
  { name: 'Subscription', href: '/pricing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center pl-2.5 mb-8">
            <span className="text-2xl font-bold text-[#0D23AD]">TaxBridge</span>
          </Link>

          {/* Navigation Links */}
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center p-3 rounded-lg transition-colors group
                      ${isActive 
                        ? 'bg-[#0D23AD] text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'}`} />
                    <span className="ml-3 font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Logout / Bottom Section */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className="flex items-center w-full p-3 text-gray-700 rounded-lg hover:bg-gray-100 group"
            >
              <LogOut className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
              <span className="ml-3 font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;