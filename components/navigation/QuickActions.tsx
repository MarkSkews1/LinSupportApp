'use client';

import React, { type ComponentType } from 'react';
import { Plus, Search, Filter, Download, Upload, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface QuickAction {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

/**
 * Quick actions component for common page-level actions
 * Typically placed in page headers
 */
export function QuickActions({ actions, className }: QuickActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        const variant = action.variant || 'secondary';

        return (
          <Button
            key={index}
            onClick={action.onClick}
            variant={variant === 'primary' ? 'default' : variant === 'ghost' ? 'ghost' : 'secondary'}
            disabled={action.disabled}
            className="flex items-center gap-2"
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span className="hidden sm:inline">{action.label}</span>
            {!Icon && <span className="sm:hidden">{action.label}</span>}
          </Button>
        );
      })}
    </div>
  );
}

/**
 * Common quick action configurations
 */
export const commonActions = {
  createNew: (label: string, onClick: () => void): QuickAction => ({
    label,
    icon: Plus,
    onClick,
    variant: 'primary',
  }),

  search: (onClick: () => void): QuickAction => ({
    label: 'Search',
    icon: Search,
    onClick,
    variant: 'ghost',
  }),

  filter: (onClick: () => void): QuickAction => ({
    label: 'Filter',
    icon: Filter,
    onClick,
    variant: 'ghost',
  }),

  download: (onClick: () => void): QuickAction => ({
    label: 'Export',
    icon: Download,
    onClick,
    variant: 'secondary',
  }),

  upload: (onClick: () => void): QuickAction => ({
    label: 'Import',
    icon: Upload,
    onClick,
    variant: 'secondary',
  }),

  settings: (onClick: () => void): QuickAction => ({
    label: 'Settings',
    icon: Settings,
    onClick,
    variant: 'ghost',
  }),
};


