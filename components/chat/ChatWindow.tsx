'use client';

import { useState, useEffect } from 'react';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Button } from '@/components/ui/Button';
import { useSocket } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';

interface Message {
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'agent' | 'manager' | 'admin';
  content: string;
  timestamp: Date;
  read: boolean;
}

interface ChatWindowProps {
  conversationId: string;
  userId: string;
  userName: string;
  tenantId: string;
  role: string;
  initialMessages?: Message[];
  onClose?: () => void;
  className?: string;
}

export function ChatWindow({
  conversationId,
  userId,
  userName,
  tenantId,
  role,
  initialMessages = [],
  onClose,
  className,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isMinimized, setIsMinimized] = useState(false);
  const [typingUser, setTypingUser] = useState<{ userId: string; userName: string } | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    isConnected,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    on,
    off,
  } = useSocket({ userId, tenantId, role, autoConnect: true });

  // Join conversation on mount
  useEffect(() => {
    if (isConnected) {
      joinConversation(conversationId);
    }

    return () => {
      leaveConversation(conversationId);
    };
  }, [conversationId, isConnected]);

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (data: { conversationId: string; message: Message }) => {
      if (data.conversationId === conversationId) {
        setMessages((prev) => [...prev, data.message]);

        // Mark as read if window is visible
        if (document.visibilityState === 'visible') {
          markAsRead();
        }
      }
    };

    const handleTypingStart = (data: { userId: string; userName: string }) => {
      if (data.userId !== userId) {
        setTypingUser(data);

        // Clear existing timeout
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }

        // Auto-clear after 3 seconds
        const timeout = setTimeout(() => {
          setTypingUser(null);
        }, 3000);
        setTypingTimeout(timeout);
      }
    };

    const handleTypingStop = (data: { userId: string }) => {
      if (data.userId !== userId) {
        setTypingUser(null);
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }
      }
    };

    on('message:new', handleNewMessage);
    on('typing:start', handleTypingStart);
    on('typing:stop', handleTypingStop);

    return () => {
      off('message:new', handleNewMessage);
      off('typing:start', handleTypingStart);
      off('typing:stop', handleTypingStop);
    };
  }, [conversationId, userId]);

  const handleSendMessage = async (content: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Message will be added via socket event
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    startTyping(conversationId, userName);
  };

  const handleStopTyping = () => {
    stopTyping(conversationId);
  };

  const markAsRead = async () => {
    try {
      await fetch(`/api/conversations/${conversationId}/read`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg',
        isMinimized ? 'h-14' : 'h-[600px]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'w-2 h-2 rounded-full',
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            )}
          />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Live Chat
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <MessageList
            messages={messages}
            currentUserId={userId}
            typingUser={typingUser}
          />

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <MessageInput
              onSend={handleSendMessage}
              onTyping={handleTyping}
              onStopTyping={handleStopTyping}
              disabled={!isConnected}
              placeholder={
                isConnected
                  ? 'Type a message...'
                  : 'Connecting to chat...'
              }
            />
          </div>
        </>
      )}
    </div>
  );
}


