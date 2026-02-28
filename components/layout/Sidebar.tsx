'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavigationItem } from '@/lib/navigation';
import { isNavItemActive } from '@/lib/navigation';
import { useNavigation } from '@/contexts/NavigationContext';
import { getIcon } from '@/lib/icon-map';

interface SidebarProps {
  navigationItems: NavigationItem[];
}

export function Sidebar({ navigationItems }: SidebarProps) {
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu } = useNavigation();

  // Close mobile menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900/80 z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-gray-900 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 shrink-0 px-4 bg-gray-900">
          <h1 className="text-xl font-bold text-white">LinSupport</h1>

          {/* Close button (mobile only) */}
          <button
            onClick={closeMobileMenu}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-y-1 px-3 py-4 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = isNavItemActive(pathname, item.href);
            const isDisabled = item.disabled || false;
            const Icon = getIcon(item.icon); // Resolve icon on client side

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                )}
                aria-disabled={isDisabled}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
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
      </aside>
    </>
  );
}

