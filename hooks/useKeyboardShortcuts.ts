'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useNavigationHelpers } from './useNavigationHelpers';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: () => void;
  description: string;
}

/**
 * Hook to register keyboard shortcuts for navigation
 */
export function useKeyboardShortcuts(enabled = true) {
  const nav = useNavigationHelpers();

  // Default navigation shortcuts
  const shortcuts = useMemo<KeyboardShortcut[]>(() => [
    {
      key: 'd',
      ctrl: true,
      action: () => nav.goToDashboard(),
      description: 'Go to Dashboard',
    },
    {
      key: 't',
      ctrl: true,
      action: () => nav.goToTickets(),
      description: 'Go to Tickets',
    },
    {
      key: 'k',
      ctrl: true,
      action: () => nav.goToKB(),
      description: 'Go to Knowledge Base',
    },
    {
      key: 'n',
      ctrl: true,
      action: () => nav.goToConversations(),
      description: 'Go to Conversations',
    },
    {
      key: 'r',
      ctrl: true,
      action: () => nav.goToReports(),
      description: 'Go to Reports',
    },
    {
      key: 'c',
      ctrl: true,
      action: () => nav.goToCRM(),
      description: 'Go to CRM',
    },
    {
      key: ',',
      ctrl: true,
      action: () => nav.goToSettings(),
      description: 'Go to Settings',
    },
    {
      key: '[',
      ctrl: true,
      action: () => nav.goBack(),
      description: 'Go Back',
    },
    {
      key: ']',
      ctrl: true,
      action: () => nav.goForward(),
      description: 'Go Forward',
    },
  ], [nav]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    const matchedShortcut = shortcuts.find((shortcut) => {
      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatches = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey;
      const altMatches = shortcut.alt ? event.altKey : !event.altKey;
      const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey;

      return keyMatches && ctrlMatches && altMatches && shiftMatches;
    });

    if (matchedShortcut) {
      event.preventDefault();
      matchedShortcut.action();
    }
  }, [enabled, shortcuts]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);

  return { shortcuts };
}

/**
 * Get keyboard shortcut display string
 */
export function getShortcutDisplay(shortcut: KeyboardShortcut): string {
  const keys: string[] = [];

  if (shortcut.ctrl || shortcut.meta) {
    keys.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
  }
  if (shortcut.alt) {
    keys.push(navigator.platform.includes('Mac') ? '⌥' : 'Alt');
  }
  if (shortcut.shift) {
    keys.push('⇧');
  }

  keys.push(shortcut.key.toUpperCase());

  return keys.join('+');
}



