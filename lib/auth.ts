import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export interface AuthUser {
  id: string;
  email: string | null;
  name: string | null;
  picture: string | null;
}

export interface AuthSession {
  user: AuthUser;
  tenantId: string | null;
  roles: string[];
}

/**
 * Get the current authenticated user
 * @returns AuthUser or null if not authenticated
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) return null;

    return {
      id: user.id,
      email: user.email || null,
      name: user.given_name || user.family_name ? `${user.given_name} ${user.family_name}`.trim() : null,
      picture: user.picture || null,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get the current tenant ID from the session
 * @returns Tenant ID or null
 */
export async function getTenantId(): Promise<string | null> {
  try {
    const { getOrganization } = getKindeServerSession();
    const org = await getOrganization();
    return org?.orgCode || null;
  } catch (error) {
    console.error('Error getting tenant ID:', error);
    return null;
  }
}

/**
 * Get user roles from Kinde
 * @returns Array of role names
 */
export async function getUserRoles(): Promise<string[]> {
  try {
    const { getPermissions } = getKindeServerSession();
    const permissions = await getPermissions();
    return permissions?.permissions || [];
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
}

/**
 * Check if user is authenticated
 * @returns Boolean indicating authentication status
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const { isAuthenticated } = getKindeServerSession();
    return await isAuthenticated();
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
}

/**
 * Check if user has a specific role
 * @param role Role name to check
 * @returns Boolean indicating if user has the role
 */
export async function hasRole(role: string): Promise<boolean> {
  const roles = await getUserRoles();
  return roles.includes(role);
}

/**
 * Check if user is a support agent
 * @returns Boolean
 */
export async function isAgent(): Promise<boolean> {
  return await hasRole('agent') || await hasRole('manager') || await hasRole('admin');
}

/**
 * Check if user is a support manager
 * @returns Boolean
 */
export async function isManager(): Promise<boolean> {
  return await hasRole('manager') || await hasRole('admin');
}

/**
 * Check if user is an admin
 * @returns Boolean
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole('admin');
}

/**
 * Get full auth session with user, tenant, and roles
 * @returns AuthSession or null
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const tenantId = await getTenantId();
  const roles = await getUserRoles();

  return {
    user,
    tenantId,
    roles,
  };
}

