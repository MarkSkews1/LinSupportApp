'use client';

import { useEffect, useState } from 'react';

interface UseRolesReturn {
  roles: string[];
  isLoading: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAgent: boolean;
  isManager: boolean;
  isAdmin: boolean;
}

/**
 * Client-side hook to get user roles
 * Note: This fetches roles from an API endpoint
 * For server components, use getUserRoles() from lib/auth.ts
 */
export function useRoles(): UseRolesReturn {
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/auth/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  const hasAnyRole = (checkRoles: string[]): boolean => {
    return checkRoles.some(role => roles.includes(role));
  };

  return {
    roles,
    isLoading,
    hasRole,
    hasAnyRole,
    isAgent: hasAnyRole(['agent', 'manager', 'admin']),
    isManager: hasAnyRole(['manager', 'admin']),
    isAdmin: hasRole('admin'),
  };
}

