'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NavigationItem } from '@/lib/navigation';

interface SidebarProps {
  navigationItems?: NavigationItem[];
}

const iconMap: Record<string, React.ReactNode> = {};

export function Sidebar({ navigationItems = [] }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 overflow-y-auto bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">LinSupport</span>
      </div>
      <nav className="mt-4 px-3">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium mb-1 transition-colors',
              pathname === item.href
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
              item.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <span>{item.name}</span>
            {item.badge ? (
              <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{item.badge}</span>
            ) : null}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

