export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function hasRole(userRoles: string[], role: Role): boolean {
  return userRoles.includes(role);
}

export function hasAnyRole(userRoles: string[], roles: Role[]): boolean {
  return roles.some((r) => userRoles.includes(r));
}

