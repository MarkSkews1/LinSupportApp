'use client';

import React, { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NavigationItem } from '@/lib/navigation';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { type BreadcrumbItem } from './Breadcrumbs';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from '@/components/navigation/KeyboardShortcutsHelp';

interface AppShellProps {
  children: ReactNode;
  userName?: string;
  userEmail?: string;
  navigationItems: NavigationItem[];
  breadcrumbs?: BreadcrumbItem[];
  enableKeyboardShortcuts?: boolean;
}

export function AppShell({
  children,
  userName,
  userEmail,
  navigationItems,
  breadcrumbs,
  enableKeyboardShortcuts = true
}: AppShellProps) {
  // Enable keyboard shortcuts for navigation
  const { shortcuts } = useKeyboardShortcuts(enableKeyboardShortcuts);

  return (
    <NavigationProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar navigationItems={navigationItems} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header userName={userName} userEmail={userEmail} breadcrumbs={breadcrumbs} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
        {enableKeyboardShortcuts && <KeyboardShortcutsHelp shortcuts={shortcuts} />}
      </div>
    </NavigationProvider>
  );
}

