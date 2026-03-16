'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Send, Paperclip, Bot, Headphones, 
  Mic, Loader2, WifiOff, Phone, Video, User 
} from 'lucide-react';
import Topbar from '../../../../../components/dashboard/Topbar';
import Sidebar from '../../../../../components/dashboard/Sidebar';
import { useSocket } from '../../../../../hooks/useSocket';

interface UserProfile {
  name: string;
  profilePicture: string | null;
}

interface Message {
  id: string;
  content: string;
  senderType: 'USER' | 'ADMIN' | 'AI';
  type: 'TEXT' | 'IMAGE' | 'FILE';
  fileUrl?: string;
  createdAt: string;
}

export default function ChatRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const { socket, isConnected } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [conversationType, setConversationType] = useState<'AI' | 'AGENT'>('AGENT');
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Fetch User Profile and Chat History
  useEffect(() => {
    const initPage = async () => {
      const token = localStorage.getItem('access_token');
      if (!token || !id) return;

      try {
        // Fetch current user profile
        const profileRes = await fetch('http://localhost:3000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUserProfile(profileData);
        }

        // Fetch messages
        const res = await fetch(`http://localhost:3000/chat/conversations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          setConversationType(data.type);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [id]);

  // Socket listener
  useEffect(() => {
    if (socket && id) {
      socket.emit('joinConversation', id);
      socket.on('newMessage', (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });
      return () => { socket.off('newMessage'); };
    }
  }, [socket, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const token = localStorage.getItem('access_token');
    const content = input;
    setInput('');
    setSending(true);

    try {
      await fetch('http://localhost:3000/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversationId: id, content, type: 'TEXT' }),
      });
    } catch (err) {
      alert('Failed to send message');
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FC]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar />
        
        {/* Chat Header */}
        <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 mt-16 fixed top-0 right-0 left-0 md:left-64 z-20">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {conversationType === 'AI' ? 'TaxbridgeAI' : 'Agents'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2.5 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100">
              <Phone size={20} />
            </button>
            <button className="p-2.5 bg-gray-50 text-gray-600 rounded-full hover:bg-gray-100">
              <Video size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto pt-40 pb-32 bg-[#F8F9FC]">
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            {messages.map((msg) => {
              const isUser = msg.senderType === 'USER';
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Sender Info - Name and Pic above message */}
                  <div className={`flex items-center mb-2 gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-8 h-8 rounded-full bg-[#0D23AD] overflow-hidden flex items-center justify-center border-2 border-white shadow-sm">
                      {isUser ? (
                        userProfile?.profilePicture ? <img src={userProfile.profilePicture} alt="" className="w-full h-full object-cover" /> : <User size={14} className="text-white" />
                      ) : (
                        conversationType === 'AI' ? <Bot size={14} className="text-white" /> : <Headphones size={14} className="text-white" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-800">
                        {isUser ? (userProfile?.name || 'You') : (conversationType === 'AI' ? 'Agent' : 'Support')}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm ${
                    isUser 
                      ? 'bg-blue-50/50 text-gray-700 border border-blue-100/50 rounded-tr-none' 
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.type === 'TEXT' && <p className="leading-relaxed text-[15px]">{msg.content}</p>}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <div className="fixed bottom-6 right-6 left-6 md:left-[18rem] z-20">
          <div className="max-w-4xl mx-auto bg-white rounded-full border border-gray-200 shadow-lg p-2 flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Paperclip size={22} />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message TaxbridgeAI..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 py-2 text-sm focus:outline-none"
            />

            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Mic size={22} />
            </button>

            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="p-2.5 bg-[#0D23AD] text-white rounded-full hover:bg-blue-800 transition disabled:opacity-50"
            >
              <Send size={20} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}