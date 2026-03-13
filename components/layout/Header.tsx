'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  className?: string;
}

export function Header({ userName, userEmail, className }: HeaderProps) {
  return (
    <header className={cn('flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800', className)}>
      <div />
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
          {userName?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div className="hidden sm:block">
          {userName && <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{userName}</p>}
          {userEmail && <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>}
        </div>
      </div>
    </header>
  );
}

