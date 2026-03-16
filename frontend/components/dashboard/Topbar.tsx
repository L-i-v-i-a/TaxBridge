'use client';
import React, { useEffect, useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Added this

// Interface for the Profile response
interface UserProfile {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  profilePicture?: string;
}

const TopBar = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      
      if (!token) return;

      try {
        const response = await fetch('http://localhost:3000/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.username || 'User';

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 h-16 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-64 border border-gray-100">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent outline-none text-sm text-gray-700 w-full"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Notification Bell - Clickable Navigation */}
        <button 
          onClick={() => router.push('/notifications')}
          className="relative p-2 text-gray-400 hover:text-[#0D23AD] hover:bg-blue-50 rounded-full transition-all duration-200"
        >
          <Bell className="w-5 h-5" />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200"></div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-none mb-1">{displayName}</p>
            <p className="text-[10px] text-gray-400 font-medium">{user?.email || 'Loading...'}</p>
          </div>
          
          {/* Avatar */}
          <div className="cursor-pointer hover:opacity-80 transition-opacity">
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#0D23AD] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {getInitials()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;