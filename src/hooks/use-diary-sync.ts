import { useEffect, useRef, useCallback, useState } from 'react';
import { useNetworkStatus } from './use-network';
import { OfflineDiaryQueueService } from '@/services/offline-diary-queue';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to automatically sync offline diary entries when network becomes available
 */
export function useDiarySync() {
  const { isOnline } = useNetworkStatus();
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const wasOffline = useRef(false);

  // Check pending items count
  const checkPendingItems = useCallback(async () => {
    try {
      const count = await OfflineDiaryQueueService.getQueueCount();
      setPendingCount(count);
      return count;
    } catch (error) {
      console.error('Error checking pending diary items:', error);
      return 0;
    }
  }, []);

  // Sync offline diary data
  const syncOfflineDiaryData = useCallback(async () => {
    if (isSyncing) return;

    try {
      setIsSyncing(true);
      const count = await checkPendingItems();

      if (count === 0) {
        setIsSyncing(false);
        return;
      }

      console.log(`🔄 Starting sync of ${count} offline diary entries...`);

      toast({
        title: "Syncing diary entries",
        description: `Uploading ${count} entry(ies) saved while offline...`,
      });

      const result = await OfflineDiaryQueueService.syncOfflineData();

      // Check remaining items
      const remaining = await checkPendingItems();

      if (remaining === 0) {
        toast({
          title: "Sync complete",
          description: `${result.synced} diary entry(ies) uploaded successfully!`,
        });
      } else {
        toast({
          title: "Partial sync",
          description: `${result.synced} entry(ies) synced. ${remaining} entry(ies) still pending.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Diary sync error:', error);
      toast({
        title: "Sync failed",
        description: "Some diary entries could not be synced. Will retry later.",
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
      syncOfflineDiaryData();
    }
  }, [isOnline, syncOfflineDiaryData]);

  // Check pending items on mount
  useEffect(() => {
    checkPendingItems();
  }, [checkPendingItems]);

  return {
    isOnline,
    isSyncing,
    pendingCount,
    syncOfflineDiaryData,
    checkPendingItems,
  };
}
