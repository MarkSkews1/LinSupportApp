'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { TicketStatus, TicketPriority } from '@/types';

interface TicketCardProps {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerName: string;
  customerEmail: string;
  createdAt: Date;
  assignedToName?: string;
  onClick?: () => void;
}

export function TicketCard({ id, subject, status, priority, customerName, createdAt, assignedToName, onClick }: TicketCardProps) {
  return (
    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1">#{id.slice(-6).toUpperCase()}</p>
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">{subject}</h3>
          <p className="text-sm text-gray-500 mt-1">{customerName}</p>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <StatusBadge status={status} />
          <PriorityBadge priority={priority} />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
        {assignedToName && <span>Assigned to: {assignedToName}</span>}
      </div>
    </Card>
  );
}

