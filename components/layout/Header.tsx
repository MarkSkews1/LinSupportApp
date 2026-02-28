'use client';

import React from 'react';
import { LogOut, User, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs, type BreadcrumbItem } from './Breadcrumbs';
import { useNavigation } from '@/contexts/NavigationContext';

interface HeaderProps {
  userName?: string;
  userEmail?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function Header({ userName, userEmail, breadcrumbs }: HeaderProps) {
  const { toggleMobileMenu } = useNavigation();

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <header className="bg-white border-b border-gray-200 flex flex-col">
      {/* Top bar with user info */}
      <div className="h-16 flex items-center justify-between px-4 md:px-6">
        {/* Left side - Mobile menu button and title */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden text-gray-700 hover:text-gray-900 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <h2 className="text-lg font-semibold text-gray-900 hidden sm:block">
            Support Dashboard
          </h2>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium text-gray-900">{userName || 'User'}</div>
              <div className="text-xs text-gray-500">{userEmail}</div>
            </div>
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="px-4 md:px-6 pb-3">
        <Breadcrumbs items={breadcrumbs} />
      </div>
    </header>
  );
}

