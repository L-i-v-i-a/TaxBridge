// app/communication/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Headphones, Loader2, MessageCircle, Search } from 'lucide-react';
import Topbar from '../../../../components/dashboard/Topbar';
import Sidebar from '../../../../components/dashboard/Sidebar';

interface Conversation {
  id: string;
  type: 'AI' | 'AGENT';
  updatedAt: string;
  messages: { content: string }[];
}

export default function CommunicationPage() {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<'AI' | 'AGENT' | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch existing conversations on load
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    
    try {
      const res = await fetch('http://localhost:3000/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const startNewChat = async (type: 'AI' | 'AGENT') => {
    setLoadingAction(type);
    const token = localStorage.getItem('access_token');

    if (!token) {
      alert('You must be logged in to start a chat.');
      setLoadingAction(null);
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/chat/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/communication/${data.id}`);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Failed to start chat'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Please check your connection.');
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 mt-16 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Communication Center</h1>
              <p className="text-gray-500">Start a new conversation or continue where you left off.</p>
            </div>

            {/* Start New Chat Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <button
                onClick={() => startNewChat('AI')}
                disabled={loadingAction !== null}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-[#0D23AD] hover:shadow-md transition-all group text-left flex items-center space-x-4 disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
                  {loadingAction === 'AI' ? <Loader2 className="animate-spin text-[#0D23AD]" size={24} /> : <Bot className="text-[#0D23AD]" size={24} />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Chat with AI</h3>
                  <p className="text-sm text-gray-500">Instant answers to tax questions.</p>
                </div>
              </button>

              <button
                onClick={() => startNewChat('AGENT')}
                disabled={loadingAction !== null}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group text-left flex items-center space-x-4 disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors shrink-0">
                  {loadingAction === 'AGENT' ? <Loader2 className="animate-spin text-orange-600" size={24} /> : <Headphones className="text-orange-600" size={24} />}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Chat with Agent</h3>
                  <p className="text-sm text-gray-500">Personalized help from experts.</p>
                </div>
              </button>
            </div>

            {/* Conversation History */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="font-semibold text-gray-800">Recent Conversations</h2>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input placeholder="Search..." className="pl-8 pr-3 py-1.5 bg-white rounded-md text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0D23AD]" />
                </div>
              </div>

              {loadingHistory ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="animate-spin text-gray-400" size={24} />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <MessageCircle className="mx-auto mb-2" size={32} />
                  <p>No conversations yet.</p>
                  <p className="text-sm">Start a new chat above!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => router.push(`/communication/${conv.id}`)}
                      className="p-4 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 ${conv.type === 'AI' ? 'bg-[#0D23AD]' : 'bg-orange-500'}`}>
                          {conv.type === 'AI' ? <Bot size={20} /> : <Headphones size={20} />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 capitalize">
                            {conv.type === 'AI' ? 'TaxGPT Assistant' : 'Support Agent'}
                          </p>
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {conv.messages[0]?.content || 'No messages yet'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className="text-xs text-gray-400 block">
                            {new Date(conv.updatedAt).toLocaleDateString()}
                         </span>
                         <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium uppercase">
                            {conv.type}
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