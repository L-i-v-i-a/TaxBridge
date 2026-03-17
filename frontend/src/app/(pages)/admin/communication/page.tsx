'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Headphones, Loader2, User, Circle, AlertCircle } from 'lucide-react';
// Adjust imports based on your actual project structure
import Topbar from '../../../../../components/admin/AdminTopbar';
import Sidebar from '../../../../../components/admin/AdminSidebar';
import { useSocket } from '../../../../../hooks/useSocket';

interface Conversation {
  id: string;
  type: 'AI' | 'AGENT';
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  messages: { content: string }[];
}

export default function AdminSupportPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const { socket, isConnected } = useSocket();

  // Fetch list of support conversations
  useEffect(() => {
    // --- DEBUGGING: Check if Token has Admin privileges ---
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('DEBUG: Token Payload', payload);
        if (!payload.isAdmin) {
          console.warn('WARNING: User is not an Admin according to the token!');
          setDebugMode(true); // Show warning in UI
        } else {
          console.log('SUCCESS: Admin token detected.');
          setDebugMode(false);
        }
      } catch (e) {
        console.error('Error parsing token', e);
      }
    }
    // ------------------------------------------------------

    fetchConversations();
  }, []);

  // Listen for new tickets or updates via Socket.io
  useEffect(() => {
    if (socket) {
      socket.on('notification', (data: any) => {
        console.log('New activity in support channel');
        fetchConversations();
      });
    }
  }, [socket]);

  const fetchConversations = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      const res = await fetch('https://backend-production-c062.up.railway.app/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Fetched Conversations:', data); // See what backend returns
        setConversations(data);
      } else {
        console.error('Failed to fetch conversations', res.status);
      }
    } catch (err) {
      console.error('Failed to fetch conversations', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 mt-16 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Support Center</h1>
              <p className="text-gray-500">Manage user support requests and live chats.</p>
            </div>

            {/* Debug Warning */}
            {debugMode && (
              <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r flex items-start">
                <AlertCircle className="text-yellow-600 mr-3 mt-0.5 shrink-0" size={20} />
                <div>
                  <h3 className="text-yellow-800 font-medium">Admin Privileges Not Detected</h3>
                  <p className="text-yellow-700 text-sm">
                    Your login token does not have <code>isAdmin: true</code>. Please verify your backend Auth logic.
                    The list below may appear empty because the API thinks you are a regular user.
                  </p>
                </div>
              </div>
            )}

            {/* Conversation List Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="font-semibold text-gray-800">Active Tickets</h2>
                <div className="flex items-center space-x-2">
                   <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                   <span className="text-xs text-gray-500">{isConnected ? 'Connected' : 'Reconnecting...'}</span>
                </div>
              </div>

              {loading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Headphones className="mx-auto mb-2" size={32} />
                  <p>No support tickets open.</p>
                  <p className="text-sm">Waiting for users to request help...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => router.push(`/admin/communication/${conv.id}`)}
                      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                          {conv.user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {conv.user.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-gray-400">{conv.user.email}</p>
                          <p className="text-sm text-gray-500 truncate max-w-xs mt-1">
                            {conv.messages[0]?.content || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="text-xs text-gray-400 block">
                            {new Date(conv.updatedAt).toLocaleDateString()}
                         </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}