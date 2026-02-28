import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { TicketStatus } from '@/types';

interface StatusBadgeProps {
  status: TicketStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<TicketStatus, 'default' | 'secondary' | 'success' | 'warning' | 'danger'> = {
    [TicketStatus.OPEN]: 'default',
    [TicketStatus.PENDING]: 'warning',
    [TicketStatus.IN_PROGRESS]: 'secondary',
    [TicketStatus.RESOLVED]: 'success',
    [TicketStatus.CLOSED]: 'secondary',
  };

  const labels: Record<TicketStatus, string> = {
    [TicketStatus.OPEN]: 'Open',
    [TicketStatus.PENDING]: 'Pending',
    [TicketStatus.IN_PROGRESS]: 'In Progress',
    [TicketStatus.RESOLVED]: 'Resolved',
    [TicketStatus.CLOSED]: 'Closed',
  };

  return (
    <Badge variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
}

