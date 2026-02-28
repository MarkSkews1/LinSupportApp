'use client';

import Link from 'next/link';
import { LifeBuoy } from 'lucide-react';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/portal" className="flex items-center gap-2">
              <LifeBuoy className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Support Portal
              </span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/portal"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Home
              </Link>
              <Link
                href="/portal/tickets"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                My Tickets
              </Link>
              <Link
                href="/portal/kb"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Knowledge Base
              </Link>
              <Link
                href="/portal/submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Submit Ticket
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            © 2026 LinSupport. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

