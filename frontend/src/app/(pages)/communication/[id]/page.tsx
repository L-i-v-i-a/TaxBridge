// app/communication/[id]/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, Paperclip, Bot, Headphones, Smile, X, Loader2, WifiOff } from 'lucide-react';
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

export default function ChatRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const { socket, isConnected } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [conversationType, setConversationType] = useState<'AI' | 'AGENT'>('AGENT');
  const [uploading, setUploading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial history
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('access_token');
      if (!id) return;

      try {
        const res = await fetch(`http://localhost:3000/chat/conversations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          setConversationType(data.type);
        } else {
          // If conversation not found, go back
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
      // Join room
      socket.emit('joinConversation', id);

      // Listen for new messages
      socket.on('newMessage', (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, id]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const uploadRes = await fetch('http://localhost:3000/chat/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      const uploadData = await uploadRes.json();

      if (uploadData.files && uploadData.files[0]) {
        // Send file message via socket
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
      await fetch(`http://localhost:3000/chat/messages/${messageId}/react`, {
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
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${conversationType === 'AI' ? 'bg-[#0D23AD]' : 'bg-orange-500'}`}>
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
        <main className="flex-1 overflow-y-auto pt-32 pb-24 bg-gray-100">
          <div className="max-w-3xl mx-auto px-4 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center mt-10">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                <p>No messages yet.</p>
                <p className="text-sm">Say hello! 👋</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm relative group ${
                    msg.senderType === 'USER' 
                      ? 'bg-[#0D23AD] text-white rounded-br-sm' 
                      : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                  }`}>
                    {msg.type === 'IMAGE' && msg.fileUrl && (
                      <img src={`http://localhost:3000/${msg.fileUrl}`} alt="Attachment" className="rounded-lg mb-2 max-w-full" />
                    )}
                    {msg.type === 'FILE' && msg.fileUrl && (
                      <a href={`http://localhost:3000/${msg.fileUrl}`} target="_blank" rel="noreferrer" className="underline block mb-1">
                        📎 {msg.content}
                      </a>
                    )}
                    {msg.type === 'TEXT' && <p>{msg.content}</p>}
                    <span className={`text-[10px] block mt-1 ${msg.senderType === 'USER' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    {/* Reactions */}
                    <div className="absolute -bottom-4 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => handleReaction(msg.id, '👍')} className="bg-white border px-1.5 py-0.5 rounded text-xs shadow">👍</button>
                       <button onClick={() => handleReaction(msg.id, '❤️')} className="bg-white border px-1.5 py-0.5 rounded text-xs shadow ml-1">❤️</button>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-200 p-4 z-20">
          <div className="max-w-3xl mx-auto flex items-center space-x-3">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            >
              {uploading ? <Loader2 size={20} className="animate-spin" /> : <Paperclip size={20} />}
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="w-full px-4 py-3 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#0D23AD]"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Smile size={20} />
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-3 bg-[#0D23AD] text-white rounded-full hover:bg-[#0a1b8a] transition shadow-md disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}