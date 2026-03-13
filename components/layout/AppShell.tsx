'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { NavigationItem } from '@/lib/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface AppShellProps {
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
  navigationItems?: NavigationItem[];
  className?: string;
}

export function AppShell({ children, userName, userEmail, navigationItems = [], className }: AppShellProps) {
  return (
    <div className={cn('flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900', className)}>
      <Sidebar navigationItems={navigationItems} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header userName={userName} userEmail={userEmail} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

