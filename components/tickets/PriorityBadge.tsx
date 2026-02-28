import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { TicketPriority } from '@/types';
import { AlertCircle, ArrowUp, Minus, Zap } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const configs: Record<TicketPriority, { variant: 'default' | 'secondary' | 'success' | 'warning' | 'danger'; label: string; icon: React.ReactNode }> = {
    [TicketPriority.LOW]: {
      variant: 'secondary',
      label: 'Low',
      icon: <Minus className="h-3 w-3" />,
    },
    [TicketPriority.MEDIUM]: {
      variant: 'default',
      label: 'Medium',
      icon: <ArrowUp className="h-3 w-3" />,
    },
    [TicketPriority.HIGH]: {
      variant: 'warning',
      label: 'High',
      icon: <AlertCircle className="h-3 w-3" />,
    },
    [TicketPriority.URGENT]: {
      variant: 'danger',
      label: 'Urgent',
      icon: <Zap className="h-3 w-3" />,
    },
  };

  const config = configs[priority];

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      {config.icon}
      {config.label}
    </Badge>
  );
}

