'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface TabItem {
  name: string;
  href: string;
  count?: number;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: TabItem[];
  className?: string;
}

/**
 * Tab navigation component for detail pages
 * Example: Ticket detail page with Overview, Comments, History tabs
 */
export function TabNavigation({ tabs, className }: TabNavigationProps) {
  const pathname = usePathname();

  return (
    <div className={cn('border-b border-gray-200', className)}>
      <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const isDisabled = tab.disabled || false;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors',
                isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={isDisabled}
            >
              {tab.name}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={cn(
                    'ml-3 inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-900'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/**
 * Compact version of tab navigation for smaller spaces
 */
export function CompactTabNavigation({ tabs, className }: TabNavigationProps) {
  const pathname = usePathname();

  return (
    <div className={cn('border-b border-gray-200 bg-white', className)}>
      <nav className="flex space-x-4 px-4" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const isDisabled = tab.disabled || false;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'py-3 px-3 text-sm font-medium rounded-t-lg transition-colors',
                isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                isActive
                  ? 'bg-gray-50 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={isDisabled}
            >
              {tab.name}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-2 text-xs text-gray-500">
                  ({tab.count})
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

