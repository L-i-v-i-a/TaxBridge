'use client';

import { useState, useEffect } from 'react';
import Dashboard from '../../../../components/settings/Dashboard';
import PersonalInfo from '../../../../components/settings/PersonalInfo';
import FilingHistory from '../../../../components/settings/FilingHistory';
import Documents from '../../../../components/settings/Documents';
import PasswordModal from '../../../../components/settings/PasswordModal';
import { getProfile, getStats } from '../../../../utilis/api';
import Topbar from '../../../../components/dashboard/Topbar';
import Sidebar from '../../../../components/dashboard/Sidebar';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isPassModal, setIsPassModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getStats().then(setStats);
    getProfile().then(setProfile);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 mt-16 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Top Profile Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 overflow-hidden border-4 border-white shadow-lg flex items-center justify-center text-blue-600 text-2xl font-bold">
                  {profile?.profilePicture ? (
                    <img src={profile.profilePicture} className="w-full h-full object-cover" />
                  ) : (
                    profile?.name?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{profile?.name || 'User'}</h1>
                    <span className="bg-green-100 text-green-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">✓ Verified</span>
                  </div>
                  <p className="text-gray-400 text-sm">{profile?.email}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setActiveTab('personalinfo')} 
                  className="bg-[#1A56DB] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => setIsPassModal(true)} 
                  className="border border-gray-200 px-6 py-2.5 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-50"
                >
                  Change Password
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-[#E5E7EB]/50 p-1.5 rounded-2xl flex gap-1 w-full md:w-fit overflow-x-auto">
              {['Dashboard', 'Personal Info', 'Filing History', 'Documents'].map((t) => {
                const key = t.toLowerCase().replace(' ', '');
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      activeTab === key ? 'bg-white shadow-md text-black' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* Tab Views */}
            {activeTab === 'dashboard' && <Dashboard stats={stats} />}
            {activeTab === 'personalinfo' && <PersonalInfo />}
            {activeTab === 'filinghistory' && <FilingHistory />}
            {activeTab === 'documents' && <Documents />}

          </div>
        </main>
      </div>

      <PasswordModal isOpen={isPassModal} onClose={() => setIsPassModal(false)} />
    </div>
  );
}