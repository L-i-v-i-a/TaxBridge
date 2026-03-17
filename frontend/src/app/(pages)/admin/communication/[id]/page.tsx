'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Send, User, Loader2 } from 'lucide-react';
import Topbar from '../../../../../../components/admin/AdminTopbar';
import Sidebar from '../../../../../../components/admin/AdminSidebar';
import { useSocket } from '../../../../../../hooks/useSocket';

interface Message {
  id: string;
  content: string;
  senderType: 'USER' | 'ADMIN' | 'AI';
  type: 'TEXT' | 'IMAGE' | 'FILE';
  fileUrl?: string;
  createdAt: string;
}

interface ConversationDetails {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
}

export default function AdminChatRoomPage() {
  const { id } = useParams();
  const router = useRouter();
  const { socket, isConnected } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<ConversationDetails | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch initial history
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('access_token');
      if (!id) return;

      try {
        const res = await fetch(`https://backend-production-c062.up.railway.app/chat/conversations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
          setConversation(data);
        } else {
          router.push('/admin/support');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [id, router]);

  // 2. Socket listeners (Receive Messages)
  useEffect(() => {
    if (!socket || !id) return;

    if (isConnected) {
        socket.emit('joinConversation', id);
    }

    socket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, id, isConnected]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Send Message via HTTP API
  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const token = localStorage.getItem('access_token');
    const content = input;
    setInput('');
    setSending(true);

    try {
      await fetch('https://backend-production-c062.up.railway.app/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversationId: id,
          content: content,
          type: 'TEXT',
        }),
      });
    } catch (err) {
      console.error(err);
      alert('Failed to send');
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Topbar />
        
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 mt-16 fixed top-0 right-0 left-0 md:left-64 z-20 justify-between">
          <div className="flex items-center">
            <button onClick={() => router.push('/admin/support')} className="mr-4 hover:bg-gray-100 p-2 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
            <div className="ml-3">
              <h2 className="font-semibold text-gray-900">
                {conversation?.user.name || 'Loading...'}
              </h2>
              <p className="text-xs text-gray-500">{conversation?.user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
             <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
          </div>
        </div>

        {/* Messages Area */}
        <main className="flex-1 overflow-y-auto pt-32 pb-24 bg-gray-100">
          <div className="max-w-3xl mx-auto px-4 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center mt-10">
                <Loader2 className="animate-spin text-gray-400" size={32} />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                <p>No messages in this ticket yet.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderType === 'ADMIN';
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md p-3 rounded-2xl shadow-sm ${
                      isMe 
                        ? 'bg-orange-500 text-white rounded-br-sm' 
                        : 'bg-white text-gray-800 rounded-bl-sm border border-gray-200'
                    }`}>
                      {msg.type === 'IMAGE' && msg.fileUrl && (
                        <img src={`https://backend-production-c062.up.railway.app/${msg.fileUrl}`} alt="Attachment" className="rounded-lg mb-2 max-w-full" />
                      )}
                      {msg.type === 'FILE' && msg.fileUrl && (
                        <a href={`https://backend-production-c062.up.railway.app/${msg.fileUrl}`} target="_blank" rel="noreferrer" className="underline block mb-1 text-sm">
                          📎 {msg.content}
                        </a>
                      )}
                      {msg.type === 'TEXT' && <p className="text-sm">{msg.content}</p>}
                      <span className={`text-[10px] block mt-1 text-right ${isMe ? 'text-orange-100' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Input Area */}
        <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t border-gray-200 p-4 z-20">
          <div className="max-w-3xl mx-auto flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a reply..."
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="w-full px-4 py-3 bg-gray-100 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition shadow-md disabled:opacity-50"
            >
              {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}