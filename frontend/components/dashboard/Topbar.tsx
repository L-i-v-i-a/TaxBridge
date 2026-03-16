'use client';
import React, { useEffect, useState } from 'react';
import { Bell, Search } from 'lucide-react';

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

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token'); // Adjust key if needed
      
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

  // Determine display name: FirstName LastName fallback to Username
  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.username || 'User';

  // Generate initials for the Avatar fallback
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
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-64 border border-gray-200">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="bg-transparent outline-none text-sm text-gray-700 w-full"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-200"></div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{displayName}</p>
            <p className="text-xs text-gray-500">{user?.email || 'Loading...'}</p>
          </div>
          
          {/* Avatar */}
          {user?.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#0D23AD] flex items-center justify-center text-white font-bold text-sm">
              {getInitials()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;