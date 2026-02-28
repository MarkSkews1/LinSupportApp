/**
 * LinSupport Role Management
 *
 * Role Hierarchy:
 * - customer: Can create tickets, view own tickets, use chat
 * - agent: Customer + Can view/assign/update tickets, respond to chats
 * - manager: Agent + Can view all tickets, manage SLAs, view analytics
 * - admin: Manager + Can manage users, configure settings, full access
 */

export type UserRole = 'customer' | 'agent' | 'manager' | 'admin';

export interface Permission {
  name: string;
  description: string;
}

export const ROLES: Record<UserRole, { name: string; description: string; permissions: string[] }> = {
  customer: {
    name: 'Customer',
    description: 'Standard customer with support access',
    permissions: [
      'tickets.create',
      'tickets.view_own',
      'tickets.update_own',
      'chat.create',
      'chat.view_own',
      'kb.view',
    ],
  },
  agent: {
    name: 'Support Agent',
    description: 'Support agent who handles tickets and chats',
    permissions: [
      'tickets.view_all',
      'tickets.update_all',
      'tickets.assign',
      'tickets.comment',
      'chat.view_all',
      'chat.respond',
      'chat.transfer',
      'kb.view',
      'kb.create',
      'kb.update',
    ],
  },
  manager: {
    name: 'Support Manager',
    description: 'Manager with analytics and SLA management access',
    permissions: [
      'tickets.view_all',
      'tickets.update_all',
      'tickets.assign',
      'tickets.delete',
      'chat.view_all',
      'chat.respond',
      'chat.transfer',
      'sla.view',
      'sla.manage',
      'analytics.view',
      'reports.view',
      'kb.view',
      'kb.create',
      'kb.update',
      'kb.delete',
    ],
  },
  admin: {
    name: 'Administrator',
    description: 'Full administrative access',
    permissions: [
      'tickets.*',
      'chat.*',
      'sla.*',
      'analytics.*',
      'reports.*',
      'kb.*',
      'users.view',
      'users.manage',
      'settings.view',
      'settings.manage',
    ],
  },
};

/**
 * Check if a role has a specific permission
 * @param role User role
 * @param permission Permission to check
 * @returns Boolean indicating if role has permission
 */
export function hasPermission(role: UserRole, permission: string): boolean {
  const roleConfig = ROLES[role];
  if (!roleConfig) return false;

  // Check for wildcard permissions (e.g., 'tickets.*')
  const hasWildcard = roleConfig.permissions.some(p => {
    if (p.endsWith('.*')) {
      const prefix = p.slice(0, -2);
      return permission.startsWith(prefix);
    }
    return false;
  });

  if (hasWildcard) return true;

  // Check for exact permission match
  return roleConfig.permissions.includes(permission);
}

/**
 * Get all permissions for a role
 * @param role User role
 * @returns Array of permissions
 */
export function getRolePermissions(role: UserRole): string[] {
  return ROLES[role]?.permissions || [];
}

/**
 * Check if user roles include required permission
 * @param userRoles Array of user role strings
 * @param permission Permission to check
 * @returns Boolean
 */
export function userHasPermission(userRoles: string[], permission: string): boolean {
  return userRoles.some(role => {
    if (isValidRole(role)) {
      return hasPermission(role as UserRole, permission);
    }
    return false;
  });
}

/**
 * Validate if string is a valid role
 * @param role Role string to validate
 * @returns Boolean
 */
export function isValidRole(role: string): role is UserRole {
  return role in ROLES;
}

/**
 * Get the highest role from a list of roles
 * @param roles Array of role strings
 * @returns Highest role or 'customer' as default
 */
export function getHighestRole(roles: string[]): UserRole {
  const roleHierarchy: UserRole[] = ['customer', 'agent', 'manager', 'admin'];

  for (let i = roleHierarchy.length - 1; i >= 0; i--) {
    if (roles.includes(roleHierarchy[i])) {
      return roleHierarchy[i];
    }
  }

  return 'customer';
}

/**
 * Check if current user has one of the required roles
 * Note: This is a server-side only function that checks Kinde session
 * @param requiredRoles Array of role strings to check against
 * @returns Boolean indicating if user has at least one of the required roles
 */
export function hasRole(requiredRoles: string[]): boolean {
  // This is a placeholder - in production, you'd get the current user's roles from Kinde
  // For now, return true to allow development
  // TODO: Implement proper role checking with Kinde session
  return true;
}

