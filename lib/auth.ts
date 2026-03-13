import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { getUser, isAuthenticated } = getKindeServerSession();
    const authed = await isAuthenticated();
    if (!authed) return null;
    const user = await getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email ?? '',
      name: [user.given_name, user.family_name].filter(Boolean).join(' ') || user.email || '',
      picture: user.picture ?? undefined,
    };
  } catch {
    return null;
  }
}

export async function getUserRoles(): Promise<string[]> {
  try {
    const { getRoles } = getKindeServerSession();
    const roles = await getRoles();
    return roles?.map((r: { key: string }) => r.key) ?? [];
  } catch {
    return [];
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const { isAuthenticated: kindeIsAuthenticated } = getKindeServerSession();
    return await kindeIsAuthenticated();
  } catch {
    return false;
  }
}

export async function getTenantId(): Promise<string | null> {
  try {
    const { getOrganization } = getKindeServerSession();
    const org = await getOrganization();
    return org?.orgCode ?? null;
  } catch {
    return null;
  }
}

