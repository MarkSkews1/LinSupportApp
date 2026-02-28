'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import { Loading } from '@/components/ui/Loading';

interface Message {
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'agent' | 'manager' | 'admin';
  content: string;
  timestamp: Date;
  read: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  typingUser?: { userId: string; userName: string } | null;
}

export function MessageList({
  messages,
  currentUserId,
  isLoading = false,
  typingUser = null,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loading size="lg" text="Loading messages..." />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium mb-2">No messages yet</p>
          <p className="text-sm">Start the conversation by sending a message</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          senderId={message.senderId}
          senderName={message.senderName}
          senderRole={message.senderRole}
          content={message.content}
          timestamp={message.timestamp}
          read={message.read}
          isCurrentUser={message.senderId === currentUserId}
        />
      ))}

      {typingUser && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span className="font-medium">{typingUser.userName}</span>
          <span>is typing</span>
          <div className="flex gap-1">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

