'use client';

import React from 'react';
import { LogOut, User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  userName?: string;
  userEmail?: string;
}

export function Header({ userName, userEmail }: HeaderProps) {
  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-900">Support Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{userName || 'User'}</div>
            <div className="text-xs text-gray-500">{userEmail}</div>
          </div>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

