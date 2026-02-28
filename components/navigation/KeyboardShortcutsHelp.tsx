'use client';

import React, { useState, useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getShortcutDisplay, type KeyboardShortcut } from '@/hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  shortcuts?: KeyboardShortcut[];
}

/**
 * Keyboard shortcuts help dialog
 * Shows available keyboard shortcuts to users
 * Triggered by pressing '?' or Shift+/
 */
export function KeyboardShortcutsHelp({ shortcuts }: KeyboardShortcutsHelpProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Default shortcuts if none provided
  const defaultShortcuts: KeyboardShortcut[] = [
    { key: 'd', ctrl: true, action: () => {}, description: 'Go to Dashboard' },
    { key: 't', ctrl: true, action: () => {}, description: 'Go to Tickets' },
    { key: 'k', ctrl: true, action: () => {}, description: 'Go to Knowledge Base' },
    { key: 'n', ctrl: true, action: () => {}, description: 'Go to Conversations' },
    { key: 'r', ctrl: true, action: () => {}, description: 'Go to Reports' },
    { key: 'c', ctrl: true, action: () => {}, description: 'Go to CRM' },
    { key: ',', ctrl: true, action: () => {}, description: 'Go to Settings' },
    { key: '[', ctrl: true, action: () => {}, description: 'Go Back' },
    { key: ']', ctrl: true, action: () => {}, description: 'Go Forward' },
    { key: '?', shift: true, action: () => {}, description: 'Show keyboard shortcuts' },
  ];

  const displayShortcuts = shortcuts || defaultShortcuts;

  // Listen for '?' key to open help
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        setIsOpen(true);
      }
      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-30"
        aria-label="Show keyboard shortcuts"
        title="Keyboard shortcuts (Shift+?)"
      >
        <Keyboard className="h-5 w-5" />
      </button>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-900/50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Keyboard className="h-6 w-6 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Keyboard Shortcuts
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid gap-4">
              {displayShortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="text-sm text-gray-700">
                    {shortcut.description}
                  </span>
                  <kbd className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-md">
                    {getShortcutDisplay(shortcut)}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Tip:</strong> Press <kbd className="px-2 py-1 text-xs font-semibold bg-white border border-blue-200 rounded">Shift+?</kbd> anytime to view this help.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end p-6 border-t border-gray-200">
            <Button onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

