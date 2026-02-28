'use client';

import React, { useState } from 'react';
import { TicketCard } from './TicketCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { ITicket, TicketStatus, TicketPriority } from '@/types';
import { Inbox, Plus } from 'lucide-react';

interface TicketListProps {
  tickets: ITicket[];
  isLoading?: boolean;
  onCreateTicket?: () => void;
}

export function TicketList({ tickets, isLoading, onCreateTicket }: TicketListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-12 w-12" />}
        title="No tickets found"
        description="Get started by creating your first support ticket."
        action={
          onCreateTicket && (
            <Button onClick={onCreateTicket}>
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          )
        }
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
      {tickets.map((ticket) => (
        <TicketCard key={ticket._id} ticket={ticket} />
      ))}
    </div>
  );
}

