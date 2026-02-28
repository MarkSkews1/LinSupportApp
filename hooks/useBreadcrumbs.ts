'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { type BreadcrumbItem } from '@/components/layout/Breadcrumbs';

/**
 * Hook to generate breadcrumbs for common routes
 * Can be used in pages to provide custom breadcrumbs to the layout
 */
export function useBreadcrumbs(customItems?: BreadcrumbItem[]): BreadcrumbItem[] {
  const pathname = usePathname();

  return useMemo(() => {
    if (customItems) {
      return customItems;
    }

    // Generate breadcrumbs based on pathname
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length === 0 || segments[0] === 'dashboard') {
      return [];
    }

    const breadcrumbs: BreadcrumbItem[] = [];
    let currentPath = '';

    segments.forEach((segment) => {
      currentPath += `/${segment}`;

      // Skip IDs in breadcrumbs (they'll be shown as the page title)
      if (/^[a-f0-9-]{20,}$/i.test(segment) || /^\d+$/.test(segment)) {
        return;
      }

      const label = formatLabel(segment);

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    });

    return breadcrumbs;
  }, [pathname, customItems]);
}

function formatLabel(segment: string): string {
  const labelMap: Record<string, string> = {
    'kb': 'Knowledge Base',
    'crm': 'CRM',
    'tickets': 'Tickets',
    'conversations': 'Conversations',
    'reports': 'Reports',
    'settings': 'Settings',
    'dashboard': 'Dashboard',
  };

  return labelMap[segment.toLowerCase()] ||
    segment
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

