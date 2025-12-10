import { useState, useEffect } from 'react';
import { Network, ConnectionStatus } from '@capacitor/network';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    let listenerHandle: any = null;

    const initNetwork = async () => {
      try {
        // Get initial status
        const status = await Network.getStatus();
        setIsOnline(status.connected);
        setConnectionType(status.connectionType);

        // Add listener for changes
        listenerHandle = await Network.addListener('networkStatusChange', (status: ConnectionStatus) => {
          console.log('📶 Network status changed:', status.connected ? 'Online' : 'Offline');
          setIsOnline(status.connected);
          setConnectionType(status.connectionType);
        });
      } catch (error) {
        console.warn('Network status not available:', error);
        // Fallback to browser online status
        setIsOnline(navigator.onLine);

        // Browser fallback listeners
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    };

    initNetwork();

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, []);

  return { isOnline, connectionType };
}