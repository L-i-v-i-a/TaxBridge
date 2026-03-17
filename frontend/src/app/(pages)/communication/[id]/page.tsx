// app/(pages)/communication/[id]/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Paperclip, Bot, Headphones, Smile, Loader2, WifiOff, User } from 'lucide-react';
import Topbar from '../../../../../components/dashboard/Topbar';
import Sidebar from '../../../../../components/dashboard/Sidebar';
import { useSocket } from '../../../../../hooks/useSocket';

interface Message {
  id: string;
  content: string;
  senderType: 'USER' | 'ADMIN' | 'AI';
  type: 'TEXT' | 'IMAGE' | 'FILE';
  fileUrl?: string;
  reactions?: { userId: string; emoji: string }[];
  createdAt: string;
}

interface UserProfile {
  name: string;
  email: string;
  profilePicture: string | null;
}

export default function ChatRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const { socket, isConnected } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [conversationType, setConversationType] = useState<'AI' | 'AGENT'>('AGENT');
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false); 

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const res = await fetch('https://backend-production-c062.up.railway.app/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setCurrentUser(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch initial history
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('access_token');
      if (!id || !token) return;

      try {
        const res = await fetch(`https://backend-production-c062.up.railway.app/chat/conversations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          setConversationType(data.type);
        } else {
          router.push('/communication');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [id, router]);

  // Socket listeners
  useEffect(() => {
    if (socket && id) {
      socket.emit('joinConversation', id);
      socket.on('newMessage', (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      // Listen for AI Typing Indicator
      socket.on('ai_typing', (data: { isTyping: boolean }) => {
        setIsAiTyping(data.isTyping);
      });

      return () => {
        socket.off('newMessage');
        socket.off('ai_typing');
      };
    }
  }, [socket, id]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]); 

  const handleSend = () => {
    if (!input.trim()) return;
    if (!socket || !isConnected) {
      alert('Connecting to server... please wait.');
      return;
    }

    socket.emit('sendMessage', {
      conversationId: id,
      content: input,
      type: 'TEXT',
    });
    setInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('files', file);
    try {
      const uploadRes = await fetch('https://backend-production-c062.up.railway.app/chat/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (uploadData.files && uploadData.files[0]) {
        socket.emit('sendMessage', {
          conversationId: id,
          content: file.name,
          type: file.type.startsWith('image') ? 'IMAGE' : 'FILE',
          fileUrl: uploadData.files[0].url,
        });
      }
    } catch (err) {
      console.error(err);
      alert('File upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    const token = localStorage.getItem('access_token');
    try {
      await fetch(`https://backend-production-c062.up.railway.app/chat/messages/${messageId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emoji }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getSenderInfo = (type: 'USER' | 'ADMIN' | 'AI') => {
    if (type === 'USER') {
      return {
        name: currentUser?.name || 'You',
        avatar: currentUser?.profilePicture ? (
          <img src={currentUser.profilePicture} alt="You" className="w-full h-full object-cover" />
        ) : (
          <User size={16} />
        ),
        color: 'bg-[#0D23AD]'
      };
    }
    if (type === 'AI') {
      return { name: 'TaxGPT', avatar: <Bot size={16} />, color: 'bg-purple-600' };
    }
    return { name: 'Support Agent', avatar: <Headphones size={16} />, color: 'bg-orange-500' };
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar />
        
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 mt-16 fixed top-0 right-0 left-0 md:left-64 z-20">
          <button onClick={() => router.push('/communication')} className="mr-4 hover:bg-gray-100 p-2 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${conversationType === 'AI' ? 'bg-purple-600' : 'bg-orange-500'}`}>
            {conversationType === 'AI' ? <Bot size={20} /> : <Headphones size={20} />}
          </div>
          <div className="ml-3">
            <h2 className="font-semibold text-gray-900">
              {conversationType === 'AI' ? 'TaxGPT Assistant' : 'Support Agent'}
            </h2>
            <p className={`text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              {isConnected ? 'Online' : 'Connecting...'}
            </p>
          </div>
        </div>

        {/* Connection Warning */}
        {!isConnected && (
          <div className="fixed top-32 right-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow-md z-50 text-sm flex items-center">
            <WifiOff size={16} className="mr-2" /> Reconnecting...
          </div>
        )}

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto pt-32 pb-32 bg-[#F8F9FC]">
          <div className="max-w-4xl mx-auto px-6 space-y-8">
            
            {/* CORRECTED TERNARY LOGIC */}
            {loading ? (
              <div className="flex justify-center items-center mt-10">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            ) : (messages.length === 0 && !isAiTyping) ? (
              <div className="text-center text-gray-400 mt-20">
                <p>No messages yet.</p>
                <p className="text-sm">Say hello! 👋</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => {
                  const isUser = msg.senderType === 'USER';
                  const sender = getSenderInfo(msg.senderType);
                  return (
                    <div key={msg.id} className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 ${sender.color}`}>
                        {sender.avatar}
                      </div>

                      {/* Message Content */}
                      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        <span className="text-xs text-gray-500 mb-1 px-1 font-medium">
                          {sender.name}
                        </span>
                        
                        <div className={`p-3 rounded-2xl shadow-sm relative group ${
                          isUser
                            ? 'bg-[#0D23AD] text-white rounded-br-sm'
                            : 'bg-white text-gray-700 rounded-bl-sm border border-gray-100'
                        }`}>
                          {msg.type === 'IMAGE' && msg.fileUrl && <img src={`https://backend-production-c062.up.railway.app/${msg.fileUrl}`} alt="Attachment" className="rounded-lg mb-2 max-w-full" />}
                          {msg.type === 'FILE' && msg.fileUrl && <a href={`https://backend-production-c062.up.railway.app/${msg.fileUrl}`} target="_blank" rel="noreferrer" className="underline block mb-1">📎 {msg.content}</a>}
                          {msg.type === 'TEXT' && <p className="leading-relaxed text-[15px]">{msg.content}</p>}
                          <span className={`text-[10px] block mt-1 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          
                          {/* Reactions */}
                          <div className={`absolute -bottom-4 ${isUser ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1`}>
                            <button onClick={() => handleReaction(msg.id, '👍')} className="bg-white border px-1.5 py-0.5 rounded text-xs shadow hover:scale-110 transition">👍</button>
                            <button onClick={() => handleReaction(msg.id, '❤️')} className="bg-white border px-1.5 py-0.5 rounded text-xs shadow hover:scale-110 transition">❤️</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* AI Typing Indicator */}
                {isAiTyping && (
                  <div className="flex items-end gap-3 flex-row">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 bg-purple-600">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm">
                       <div className="flex gap-1">
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                       </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <div className="fixed bottom-6 right-6 left-6 md:left-[18rem] z-20">
           <div className="max-w-4xl mx-auto bg-white rounded-full border border-gray-200 shadow-lg p-2 flex items-center gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button className="p-2 text-gray-400 hover:text-gray-600" onClick={() => fileInputRef.current?.click()}>
              {uploading ? <Loader2 size={22} className="animate-spin" /> : <Paperclip size={22} />}
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
              <Smile size={22} />
            </button>

            <button
              onClick={handleSend}
              disabled={!input.trim()}
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