import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { App } from '@capacitor/app';

/**
 * Hook to detect if running in a native Capacitor environment
 */
export function useIsNative() {
  return Capacitor.isNativePlatform();
}

/**
 * Hook to get the current platform (web, ios, android)
 */
export function usePlatform() {
  return Capacitor.getPlatform();
}

/**
 * Hook to initialize Capacitor plugins on app start
 * Call this once in your root component (App.tsx or main.tsx)
 */
export function useCapacitorInit() {
  const [isReady, setIsReady] = useState(false);
  const isNative = useIsNative();

  useEffect(() => {
    async function initCapacitor() {
      if (!isNative) {
        setIsReady(true);
        return;
      }

      try {
        // Configure status bar
        await StatusBar.setStyle({ style: Style.Light });
        if (Capacitor.getPlatform() === 'android') {
          await StatusBar.setBackgroundColor({ color: '#2563eb' });
        }

        // Configure keyboard behavior
        if (Capacitor.getPlatform() === 'ios') {
          await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
          await Keyboard.setScroll({ isDisabled: false });
        }

        // Hide splash screen after app is ready
        await SplashScreen.hide();

        setIsReady(true);
      } catch (error) {
        console.error('Error initializing Capacitor:', error);
        setIsReady(true);
      }
    }

    initCapacitor();
  }, [isNative]);

  return isReady;
}

/**
 * Hook to handle app state changes (background/foreground)
 */
export function useAppState(onResume?: () => void, onPause?: () => void) {
  const isNative = useIsNative();

  useEffect(() => {
    if (!isNative) return;

    const resumeListener = App.addListener('appStateChange', ({ isActive }) => {
      if (isActive && onResume) {
        onResume();
      } else if (!isActive && onPause) {
        onPause();
      }
    });

    return () => {
      resumeListener.then(listener => listener.remove());
    };
  }, [isNative, onResume, onPause]);
}

/**
 * Hook to handle Android back button
 */
export function useBackButton(handler: () => void) {
  const isNative = useIsNative();

  useEffect(() => {
    if (!isNative || Capacitor.getPlatform() !== 'android') return;

    const backButtonListener = App.addListener('backButton', () => {
      handler();
    });

    return () => {
      backButtonListener.then(listener => listener.remove());
    };
  }, [isNative, handler]);
}
