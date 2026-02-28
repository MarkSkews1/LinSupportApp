'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export interface NavigationHelpers {
  // Route navigation
  goToTicket: (id: string) => void;
  goToConversation: (id: string) => void;
  goToArticle: (id: string) => void;
  goToCustomer: (id: string) => void;
  goToDashboard: () => void;
  goToTickets: (params?: Record<string, string>) => void;
  goToConversations: () => void;
  goToKB: () => void;
  goToReports: () => void;
  goToCRM: () => void;
  goToSettings: () => void;

  // History navigation
  goBack: () => void;
  goForward: () => void;

  // Generic navigation
  push: (href: string) => void;
  replace: (href: string) => void;
  refresh: () => void;

  // Current route info
  pathname: string;
  searchParams: URLSearchParams;
}

/**
 * Hook for programmatic navigation with helper methods
 * Provides type-safe navigation functions for common routes
 */
export function useNavigationHelpers(): NavigationHelpers {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ticket navigation
  const goToTicket = useCallback((id: string) => {
    router.push(`/tickets/${id}`);
  }, [router]);

  const goToTickets = useCallback((params?: Record<string, string>) => {
    if (params) {
      const query = new URLSearchParams(params);
      router.push(`/tickets?${query.toString()}`);
    } else {
      router.push('/tickets');
    }
  }, [router]);

  // Conversation navigation
  const goToConversation = useCallback((id: string) => {
    router.push(`/conversations/${id}`);
  }, [router]);

  const goToConversations = useCallback(() => {
    router.push('/conversations');
  }, [router]);

  // Knowledge base navigation
  const goToArticle = useCallback((id: string) => {
    router.push(`/kb/articles/${id}`);
  }, [router]);

  const goToKB = useCallback(() => {
    router.push('/kb');
  }, [router]);

  // CRM navigation
  const goToCustomer = useCallback((id: string) => {
    router.push(`/crm/customers/${id}`);
  }, [router]);

  const goToCRM = useCallback(() => {
    router.push('/crm');
  }, [router]);

  // Main route navigation
  const goToDashboard = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  const goToReports = useCallback(() => {
    router.push('/reports');
  }, [router]);

  const goToSettings = useCallback(() => {
    router.push('/settings');
  }, [router]);

  // History navigation
  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  const goForward = useCallback(() => {
    router.forward();
  }, [router]);

  // Generic navigation
  const push = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  const replace = useCallback((href: string) => {
    router.replace(href);
  }, [router]);

  const refresh = useCallback(() => {
    router.refresh();
  }, [router]);

  return {
    goToTicket,
    goToTickets,
    goToConversation,
    goToConversations,
    goToArticle,
    goToKB,
    goToCustomer,
    goToCRM,
    goToDashboard,
    goToReports,
    goToSettings,
    goBack,
    goForward,
    push,
    replace,
    refresh,
    pathname,
    searchParams,
  };
}

