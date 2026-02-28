'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketOptions {
  userId?: string;
  tenantId?: string;
  role?: string;
  autoConnect?: boolean;
}

interface SocketMessage {
  conversationId: string;
  message: {
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
    timestamp: Date;
    read: boolean;
  };
}

export function useSocket(options: UseSocketOptions = {}) {
  const { userId, tenantId, role, autoConnect = true } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<SocketMessage | null>(null);

  useEffect(() => {
    if (!autoConnect || !userId || !tenantId || !role) {
      return;
    }

    // Initialize socket connection
    const socketPath = '/api/socket';
    const socketUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3009';

    socketRef.current = io(socketUrl, {
      path: socketPath,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);

      // Authenticate user
      socket.emit('authenticate', { userId, tenantId, role });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Message event handlers
    socket.on('message:new', (data: SocketMessage) => {
      console.log('New message received:', data);
      setLastMessage(data);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId, tenantId, role, autoConnect]);

  const joinConversation = (conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('join:conversation', conversationId);
    }
  };

  const leaveConversation = (conversationId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('leave:conversation', conversationId);
    }
  };

  const startTyping = (conversationId: string, userName: string) => {
    if (socketRef.current?.connected && userId) {
      socketRef.current.emit('typing:start', {
        conversationId,
        userId,
        userName,
      });
    }
  };

  const stopTyping = (conversationId: string) => {
    if (socketRef.current?.connected && userId) {
      socketRef.current.emit('typing:stop', {
        conversationId,
        userId,
      });
    }
  };

  const on = (event: string, handler: (data: unknown) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  };

  const off = (event: string, handler?: (data: unknown) => void) => {
    if (socketRef.current) {
      if (handler) {
        socketRef.current.off(event, handler);
      } else {
        socketRef.current.off(event);
      }
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    lastMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    on,
    off,
  };
}


