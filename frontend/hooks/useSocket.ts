// hooks/useSocket.ts
import { useEffect, useState, useRef } from 'react';

import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const socketIo = io('http://localhost:3000/chat', {
      auth: { token: `Bearer ${token}` },
      transports: ['websocket'],
    });

    socketIo.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected');
    });

    socketIo.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  return { socket, isConnected };
};