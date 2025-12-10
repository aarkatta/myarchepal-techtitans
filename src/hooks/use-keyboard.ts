import { useEffect, useCallback } from 'react';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

/**
 * Hook to handle iOS keyboard issues
 * - Provides function to hide keyboard
 * - Sets up scroll behavior for keyboard
 */
export function useKeyboard() {
  const isNative = Capacitor.isNativePlatform();

  // Hide keyboard programmatically
  const hideKeyboard = useCallback(async () => {
    if (isNative) {
      try {
        await Keyboard.hide();
      } catch (error) {
        console.warn('Failed to hide keyboard:', error);
      }
    } else {
      // Web fallback - blur active element
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [isNative]);

  // Setup keyboard listeners for better scroll behavior
  useEffect(() => {
    if (!isNative) return;

    const setupKeyboard = async () => {
      try {
        // Configure keyboard behavior
        await Keyboard.setScroll({ isDisabled: false });
        await Keyboard.setAccessoryBarVisible({ isVisible: true });
        await Keyboard.setResizeMode({ mode: 'body' as any });
      } catch (error) {
        console.warn('Failed to configure keyboard:', error);
      }
    };

    setupKeyboard();
  }, [isNative]);

  return {
    hideKeyboard,
    isNative,
  };
}

/**
 * Utility to handle tapping outside input to dismiss keyboard
 */
export function setupKeyboardDismissArea(containerRef: React.RefObject<HTMLElement>) {
  const handleTap = (e: MouseEvent | TouchEvent) => {
    const target = e.target as HTMLElement;

    // Don't dismiss if tapping on an input, textarea, select, or button
    const interactiveElements = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A'];
    if (interactiveElements.includes(target.tagName)) {
      return;
    }

    // Don't dismiss if tapping on elements with specific roles
    const role = target.getAttribute('role');
    if (role === 'button' || role === 'link' || role === 'menuitem') {
      return;
    }

    // Blur active element to dismiss keyboard
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const container = containerRef.current;
  if (container) {
    container.addEventListener('touchstart', handleTap, { passive: true });
    container.addEventListener('click', handleTap);

    return () => {
      container.removeEventListener('touchstart', handleTap);
      container.removeEventListener('click', handleTap);
    };
  }
}
