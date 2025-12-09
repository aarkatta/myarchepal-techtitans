import { useEffect, useRef, useCallback, useState } from 'react';
import { useNetworkStatus } from './use-network';
import { ArtifactsService } from '@/services/artifacts';
import { OfflineQueueService } from '@/services/offline-queue';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to automatically sync offline data when network becomes available
 */
export function useOfflineSync() {
  const { isOnline } = useNetworkStatus();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const wasOffline = useRef(false);

  // Check pending items count
  const checkPendingItems = useCallback(async () => {
    try {
      const queue = await OfflineQueueService.getQueue();
      setPendingCount(queue.length);
      return queue.length;
    } catch (error) {
      console.error('Error checking pending items:', error);
      return 0;
    }
  }, []);

  // Sync offline data
  const syncOfflineData = useCallback(async () => {
    if (isSyncing) return;

    try {
      setIsSyncing(true);
      const count = await checkPendingItems();

      if (count === 0) {
        setIsSyncing(false);
        return;
      }

      console.log(`🔄 Starting sync of ${count} offline items...`);

      toast({
        title: "Syncing offline data",
        description: `Uploading ${count} item(s) saved while offline...`,
      });

      await ArtifactsService.syncOfflineData();

      // Check remaining items
      const remaining = await checkPendingItems();

      if (remaining === 0) {
        toast({
          title: "Sync complete",
          description: "All offline data has been uploaded successfully!",
        });
      } else {
        toast({
          title: "Partial sync",
          description: `${count - remaining} item(s) synced. ${remaining} item(s) still pending.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Sync failed",
        description: "Some offline data could not be synced. Will retry later.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, checkPendingItems, toast]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (!isOnline) {
      wasOffline.current = true;
    } else if (wasOffline.current) {
      // Just came back online
      wasOffline.current = false;
      syncOfflineData();
    }
  }, [isOnline, syncOfflineData]);

  // Check pending items on mount
  useEffect(() => {
    checkPendingItems();
  }, [checkPendingItems]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    syncOfflineData,
    checkPendingItems,
  };
}
