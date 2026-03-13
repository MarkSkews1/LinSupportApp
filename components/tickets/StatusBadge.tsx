'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { TicketStatus } from '@/types';

interface StatusBadgeProps {
  status: TicketStatus;
}

const statusConfig: Record<TicketStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'error' | 'warning' | 'outline' }> = {
  [TicketStatus.OPEN]: { label: 'Open', variant: 'default' },
  [TicketStatus.IN_PROGRESS]: { label: 'In Progress', variant: 'warning' },
  [TicketStatus.RESOLVED]: { label: 'Resolved', variant: 'success' },
  [TicketStatus.CLOSED]: { label: 'Closed', variant: 'secondary' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, variant: 'outline' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

