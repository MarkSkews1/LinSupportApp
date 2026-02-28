'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb navigation component
 * If items are not provided, generates breadcrumbs from the current pathname
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname);

  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm', className)}
    >
      {/* Home Icon */}
      <Link
        href="/dashboard"
        className="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Dashboard"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;

        return (
          <React.Fragment key={item.href}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-900 font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

/**
 * Generate breadcrumb items from pathname
 * Converts /tickets/123 to [{ label: 'Tickets', href: '/tickets' }, { label: '123', href: '/tickets/123' }]
 */
function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  // Remove leading/trailing slashes and split
  const segments = pathname.split('/').filter(Boolean);

  // Skip if on dashboard
  if (segments.length === 0 || segments[0] === 'dashboard') {
    return [];
  }

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  segments.forEach((segment) => {
    currentPath += `/${segment}`;

    // Format the label (capitalize first letter, handle special cases)
    const label = formatSegmentLabel(segment);

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

/**
 * Format a path segment into a readable label
 */
function formatSegmentLabel(segment: string): string {
  // Common abbreviations
  const labelMap: Record<string, string> = {
    'kb': 'Knowledge Base',
    'crm': 'CRM',
  };

  // Check if it's a known abbreviation
  if (labelMap[segment.toLowerCase()]) {
    return labelMap[segment.toLowerCase()];
  }

  // Check if it's a UUID or ID (all numbers/letters with hyphens)
  if (/^[a-f0-9-]{20,}$/i.test(segment) || /^\d+$/.test(segment)) {
    return `#${segment.substring(0, 8)}${segment.length > 8 ? '...' : ''}`;
  }

  // Replace hyphens and underscores with spaces, capitalize words
  return segment
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


