'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

interface Conversation {
  _id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  status: 'active' | 'waiting' | 'closed';
  assignedAgentId?: string;
  assignedAgentName?: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  messages: Array<{
    senderId: string;
    senderName: string;
    senderRole: 'customer' | 'agent' | 'manager' | 'admin';
    content: string;
    timestamp: Date;
    read: boolean;
  }>;
}

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: string;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading?: boolean;
  selectedConversationId?: string;
}

export function ConversationList({
  conversations,
  currentUserId,
  onSelectConversation,
  isLoading = false,
  selectedConversationId,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conversation) => {
        const isSelected = conversation._id === selectedConversationId;
        const unreadCount = conversation.messages.filter(
          (m) => !m.read && m.senderId !== currentUserId
        ).length;

        return (
          <button
            key={conversation._id}
            onClick={() => onSelectConversation(conversation)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              isSelected
                ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {conversation.customerName}
              </span>
              {unreadCount > 0 && (
                <span className="ml-1 flex-shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-600 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {conversation.subject}
            </p>
            {conversation.lastMessage && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                {conversation.lastMessage}
              </p>
            )}
            <span
              className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                conversation.status === 'active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : conversation.status === 'waiting'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {conversation.status}
            </span>
          </button>
        );
      })}
    </div>
  );
}

