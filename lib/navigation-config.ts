import { NavigationItem } from './navigation';

/**
 * Main navigation configuration with role-based access control
 *
 * Roles:
 * - admin: Full access to all features
 * - manager: Access to reports, settings, and all agent features
 * - agent: Access to tickets, conversations, knowledge base
 * - undefined/[]: Accessible to all authenticated users
 *
 * Note: Icons are specified as strings and resolved on the client side
 */
export const navigationConfig: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    roles: ['*'], // Accessible to all authenticated users
  },
  {
    name: 'Tickets',
    href: '/tickets',
    icon: 'Ticket',
    roles: ['*'], // All users can view tickets
  },
  {
    name: 'Conversations',
    href: '/conversations',
    icon: 'MessageSquare',
    roles: ['agent', 'manager', 'admin'],
  },
  {
    name: 'Knowledge Base',
    href: '/kb',
    icon: 'BookOpen',
    roles: ['*'], // All users can access KB
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: 'BarChart3',
    roles: ['manager', 'admin'], // Only managers and admins
  },
  {
    name: 'CRM',
    href: '/crm',
    icon: 'Users',
    roles: ['agent', 'manager', 'admin'],
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: 'Settings',
    roles: ['manager', 'admin'], // Only managers and admins
  },
];

/**
 * Get navigation items filtered by user roles
 * This is a helper that can be used server-side
 */
export function getNavigationForRoles(userRoles: string[]): NavigationItem[] {
  return navigationConfig.filter(item => {
    // If no roles specified, accessible to all
    if (!item.roles || item.roles.length === 0) return true;

    // If '*' in roles, accessible to all
    if (item.roles.includes('*')) return true;

    // Check if user has any required role
    return userRoles.some(role => item.roles?.includes(role));
  });
}

