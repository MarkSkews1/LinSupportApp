'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface NavigationContextValue {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  closeMobileMenu: () => void;
  openMobileMenu: () => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

/**
 * Navigation provider for managing sidebar and mobile menu state
 */
export function NavigationProvider({ children }: NavigationProviderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const value: NavigationContextValue = {
    isSidebarOpen,
    isMobileMenuOpen,
    toggleSidebar,
    toggleMobileMenu,
    closeSidebar,
    openSidebar,
    closeMobileMenu,
    openMobileMenu,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook to access navigation context
 */
export function useNavigation() {
  const context = useContext(NavigationContext);

  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }

  return context;
}

