'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { TicketPriority } from '@/types';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

const priorityConfig: Record<TicketPriority, { label: string; variant: 'default' | 'secondary' | 'success' | 'error' | 'warning' | 'outline' }> = {
  [TicketPriority.LOW]: { label: 'Low', variant: 'secondary' },
  [TicketPriority.MEDIUM]: { label: 'Medium', variant: 'default' },
  [TicketPriority.HIGH]: { label: 'High', variant: 'warning' },
  [TicketPriority.URGENT]: { label: 'Urgent', variant: 'error' },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority] ?? { label: priority, variant: 'outline' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

