// SSO Helper Library for LinSupport
// Manages SSO sessions from lin-suite-app

import { cookies } from 'next/headers';

export interface SSOUser {
  id: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

export interface SSOSession {
  user: SSOUser;
  token: string;
  authenticated: boolean;
}

/**
 * Check if the current session is SSO authenticated
 */
export async function isSSO(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('sso_authenticated')?.value === 'true';
}

/**
 * Get the SSO user information
 */
export async function getUser(): Promise<SSOUser | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('sso_user')?.value;

  if (!userCookie) {
    return null;
  }

  try {
    return JSON.parse(userCookie) as SSOUser;
  } catch (error) {
    console.error('Failed to parse SSO user cookie:', error);
    return null;
  }
}

/**
 * Get the SSO access token
 */
export async function getToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('kinde_token')?.value || null;
}

/**
 * Get the complete SSO session
 */
export async function getSession(): Promise<SSOSession | null> {
  const authenticated = await isSSO();
  const user = await getUser();
  const token = await getToken();

  if (!authenticated || !user || !token) {
    return null;
  }

  return {
    user,
    token,
    authenticated,
  };
}

/**
 * Validate SSO token with Kinde
 */
export async function validateToken(token: string): Promise<SSOUser | null> {
  try {
    const kindeIssuerUrl = process.env.KINDE_ISSUER_URL;

    if (!kindeIssuerUrl) {
      throw new Error('KINDE_ISSUER_URL is not configured');
    }

    const response = await fetch(`${kindeIssuerUrl}/oauth2/v2/user_profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();
    return {
      id: user.sub || user.id,
      email: user.email,
      given_name: user.given_name,
      family_name: user.family_name,
      picture: user.picture,
    };
  } catch (error) {
    console.error('Token validation failed:', error);
    return null;
  }
}

/**
 * Clear the SSO session
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('kinde_token');
  cookieStore.delete('sso_user');
  cookieStore.delete('sso_authenticated');
}

