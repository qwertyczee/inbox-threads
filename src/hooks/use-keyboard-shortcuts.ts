import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsConfig {
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
  onCompose: () => void;
  onReply: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onEscape: () => void;
  onOpenThread: () => void;
  onGoToInbox: () => void;
  onSearch: () => void;
  isComposeOpen: boolean;
  hasSelectedThread: boolean;
}

export function useKeyboardShortcuts({
  onNavigateNext,
  onNavigatePrev,
  onCompose,
  onReply,
  onArchive,
  onDelete,
  onEscape,
  onOpenThread,
  onGoToInbox,
  onSearch,
  isComposeOpen,
  hasSelectedThread,
}: KeyboardShortcutsConfig) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Allow Escape to always work
      if (event.key === 'Escape') {
        if (isComposeOpen) {
          onEscape();
        } else if (hasSelectedThread) {
          onEscape();
        }
        return;
      }

      // Don't process other shortcuts when in input fields
      if (isInputField) return;

      // Don't process shortcuts when compose is open
      if (isComposeOpen) return;

      switch (event.key.toLowerCase()) {
        case 'j':
          event.preventDefault();
          onNavigateNext();
          break;
        case 'k':
          event.preventDefault();
          onNavigatePrev();
          break;
        case 'c':
          event.preventDefault();
          onCompose();
          break;
        case 'r':
          if (hasSelectedThread) {
            event.preventDefault();
            onReply();
          }
          break;
        case 'e':
          if (hasSelectedThread) {
            event.preventDefault();
            onArchive();
          }
          break;
        case '#':
          if (hasSelectedThread) {
            event.preventDefault();
            onDelete();
          }
          break;
        case 'o':
        case 'enter':
          if (!hasSelectedThread) {
            event.preventDefault();
            onOpenThread();
          }
          break;
        case 'g':
          // Wait for next key for 'g i' combo
          break;
        case 'i':
          event.preventDefault();
          onGoToInbox();
          break;
        case '/':
          event.preventDefault();
          onSearch();
          break;
      }
    },
    [
      onNavigateNext,
      onNavigatePrev,
      onCompose,
      onReply,
      onArchive,
      onDelete,
      onEscape,
      onOpenThread,
      onGoToInbox,
      onSearch,
      isComposeOpen,
      hasSelectedThread,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
