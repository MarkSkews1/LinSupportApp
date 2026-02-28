'use client';

import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface ChatMessageProps {
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'agent' | 'manager' | 'admin';
  content: string;
  timestamp: Date;
  read: boolean;
  isCurrentUser: boolean;
}

export function ChatMessage({
  senderName,
  senderRole,
  content,
  timestamp,
  read,
  isCurrentUser,
}: ChatMessageProps) {
  const messageDate = timestamp instanceof Date ? timestamp : new Date(timestamp);

  const getRoleBadgeVariant = () => {
    switch (senderRole) {
      case 'admin':
        return 'destructive';
      case 'manager':
        return 'default';
      case 'agent':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-1 max-w-[80%] mb-4',
        isCurrentUser ? 'ml-auto items-end' : 'mr-auto items-start'
      )}
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {senderName}
        </span>
        {senderRole !== 'customer' && (
          <Badge variant={getRoleBadgeVariant()} className="text-xs">
            {senderRole}
          </Badge>
        )}
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatDistanceToNow(messageDate, { addSuffix: true })}
        </span>
      </div>

      <div
        className={cn(
          'px-4 py-2 rounded-lg',
          isCurrentUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
      </div>

      {isCurrentUser && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {read ? '✓✓ Read' : '✓ Sent'}
        </div>
      )}
    </div>
  );
}


