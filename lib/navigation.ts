export type IconName =
  | 'LayoutDashboard'
  | 'Ticket'
  | 'MessageSquare'
  | 'BookOpen'
  | 'BarChart3'
  | 'Users'
  | 'Settings';

export interface NavigationItem {
  name: string;
  href: string;
  icon: IconName; // Changed from LucideIcon to string
  roles?: string[]; // If undefined, accessible to all authenticated users
  badge?: number; // Optional badge count
  disabled?: boolean;
}

export interface NavigationGroup {
  name: string;
  items: NavigationItem[];
}

/**
 * Check if user has any of the required roles
 * @param userRoles User's roles
 * @param requiredRoles Required roles (undefined means accessible to all)
 * @returns Boolean indicating if user has access
 */
export function hasRequiredRole(userRoles: string[], requiredRoles?: string[]): boolean {
  // If no roles required, accessible to all
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // If '*' is in required roles, accessible to all
  if (requiredRoles.includes('*')) {
    return true;
  }

  // Check if user has any of the required roles
  return userRoles.some(role => requiredRoles.includes(role));
}

/**
 * Filter navigation items based on user roles
 * @param items Navigation items
 * @param userRoles User's roles
 * @returns Filtered navigation items
 */
export function filterNavigationByRole(
  items: NavigationItem[],
  userRoles: string[]
): NavigationItem[] {
  return items.filter(item => hasRequiredRole(userRoles, item.roles));
}

/**
 * Check if a navigation item is active based on pathname
 * @param pathname Current pathname
 * @param href Item href
 * @returns Boolean indicating if item is active
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;

  // Don't mark dashboard as active for other routes
  if (href === '/dashboard') return false;

  // Check if pathname starts with href (for nested routes)
  return pathname.startsWith(href + '/');
}

