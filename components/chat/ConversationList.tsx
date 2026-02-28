'use client';

import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { cn } from '@/lib/utils';

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
    senderRole: string;
    content: string;
    timestamp: Date;
    read: boolean;
  }>;
  unreadCount?: number;
}

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId?: string;
  onSelectConversation?: (conversation: Conversation) => void;
  isLoading?: boolean;
  selectedConversationId?: string;
}

export function ConversationList({
  onSelectConversation,
  isLoading = false,
  selectedConversationId,
  conversations,
}: ConversationListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" text="Loading conversations..." />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No conversations yet"
        description="Start a new conversation with a customer"
      />
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'waiting':
        return <Badge variant="warning">Waiting</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isSelected = conversation._id === selectedConversationId;
        const hasUnread = (conversation.unreadCount || 0) > 0;
        const lastMessageDate = conversation.lastMessageAt
          ? new Date(conversation.lastMessageAt)
          : null;

        return (
          <Card
            key={conversation._id}
            className={cn(
              'cursor-pointer hover:shadow-md transition-shadow',
              isSelected && 'ring-2 ring-blue-500',
              hasUnread && 'bg-blue-50 dark:bg-blue-900/10'
            )}
            onClick={() => onSelectConversation?.(conversation)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {conversation.customerName}
                    </h3>
                    {hasUnread && (
                      <Badge variant="destructive" className="text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {conversation.subject}
                  </p>
                </div>
                {getStatusBadge(conversation.status)}
              </div>

              {conversation.lastMessage && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <CheckCheck className="h-4 w-4 flex-shrink-0" />
                  <p className="truncate flex-1">{conversation.lastMessage}</p>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>
                  {conversation.assignedAgentName || 'Unassigned'}
                </span>
                {lastMessageDate && (
                  <span>
                    {formatDistanceToNow(lastMessageDate, { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}



