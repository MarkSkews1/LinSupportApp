'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Ticket, MessageSquare, BookOpen, BarChart3, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Conversations', href: '/conversations', icon: MessageSquare },
  { name: 'Knowledge Base', href: '/kb', icon: BookOpen },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'CRM', href: '/crm', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-gray-900">
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
        <h1 className="text-xl font-bold text-white">LinSupport</h1>
      </div>
      <nav className="flex-1 flex flex-col gap-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Return to Suite Button */}
      <div className="p-4 border-t border-gray-800">
        <Link
          href={process.env.NEXT_PUBLIC_LINSUITE_URL || 'http://localhost:3000'}
          className="flex items-center justify-center gap-x-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Return to Suite
        </Link>
      </div>
    </div>
  );
}

