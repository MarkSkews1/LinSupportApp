'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { ITicket } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { User, Calendar } from 'lucide-react';

interface TicketCardProps {
  ticket: ITicket;
}

export function TicketCard({ ticket }: TicketCardProps) {
  return (
    <Link href={`/tickets/${ticket._id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono text-gray-500">{ticket.ticketNumber}</span>
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {ticket.subject}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {ticket.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{ticket.customerName}</span>
            </div>
            {ticket.assigneeName && (
              <div className="flex items-center gap-1">
                <span>→ {ticket.assigneeName}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatRelativeTime(ticket.createdAt)}</span>
          </div>
        </div>

        {ticket.tags && ticket.tags.length > 0 && (
          <div className="flex gap-2 mt-3">
            {ticket.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {ticket.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{ticket.tags.length - 3} more</span>
            )}
          </div>
        )}
      </Card>
    </Link>
  );
}

