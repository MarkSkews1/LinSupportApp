'use client';

import React from 'react';
import { TicketCard } from './TicketCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { TicketStatus, TicketPriority } from '@/types';

interface Ticket {
  id: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  customerName: string;
  customerEmail: string;
  createdAt: Date;
  assignedToName?: string;
}

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick?: (id: string) => void;
}

export function TicketList({ tickets, onTicketClick }: TicketListProps) {
  if (tickets.length === 0) {
    return <EmptyState title="No tickets found" description="There are no tickets matching your criteria." />;
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} {...ticket} onClick={() => onTicketClick?.(ticket.id)} />
      ))}
    </div>
  );
}

