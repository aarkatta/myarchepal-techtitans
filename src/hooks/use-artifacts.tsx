import { useState, useEffect } from 'react';
import { ArtifactsService, Artifact } from '@/services/artifacts';
import { OfflineQueueService } from '@/services/offline-queue';
import { OfflineCacheService } from '@/services/offline-cache';
import { useNetworkStatus } from '@/hooks/use-network';

// Interface for offline artifacts (slightly different structure)
interface OfflineArtifact extends Omit<Artifact, 'id'> {
  id: string;
  isOffline: true;
  localImagePath?: string;
  status: 'pending';
}

export const useArtifacts = () => {
  const [artifacts, setArtifacts] = useState<(Artifact | OfflineArtifact)[]>([]);
  const [offlineCount, setOfflineCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingCachedData, setUsingCachedData] = useState(false);
  const { isOnline } = useNetworkStatus();

  const fetchArtifacts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Always try to get offline queued artifacts
      let offlineArtifacts: OfflineArtifact[] = [];
      try {
        const queue = await OfflineQueueService.getQueue();
        offlineArtifacts = queue.map((item: any) => ({
          ...item,
          id: `offline-${item.id}`,
          isOffline: true as const,
        }));
        setOfflineCount(offlineArtifacts.length);
        console.log(`📴 Found ${offlineArtifacts.length} offline artifacts`);
      } catch (offlineError) {
        console.warn('Could not fetch offline queue:', offlineError);
      }

      // Try to fetch online artifacts or use cache
      let onlineArtifacts: Artifact[] = [];
      if (isOnline) {
        try {
          onlineArtifacts = await ArtifactsService.getAllArtifacts();
          console.log(`🌐 Fetched ${onlineArtifacts.length} online artifacts`);
          setUsingCachedData(false);

          // Cache the artifacts for offline use
          await OfflineCacheService.cacheArtifactsList(onlineArtifacts);
        } catch (onlineError) {
          console.error('Error fetching online artifacts:', onlineError);

          // Try to use cached data on error
          const cached = await OfflineCacheService.getCachedArtifactsList();
          if (cached.data) {
            onlineArtifacts = cached.data;
            setUsingCachedData(true);
            console.log(`📦 Using ${cached.data.length} cached artifacts after error`);
          } else if (offlineArtifacts.length === 0) {
            setError('Failed to load artifacts. Please check your connection.');
          }
        }
      } else {
        // Offline mode - try to get cached data
        console.log('📴 Offline mode - checking cache');
        const cached = await OfflineCacheService.getCachedArtifactsList();
        if (cached.data) {
          onlineArtifacts = cached.data;
          setUsingCachedData(true);
          console.log(`📦 Using ${cached.data.length} cached artifacts in offline mode`);
        } else {
          console.log('📴 No cached artifacts available');
        }
      }

      // Merge offline and online artifacts (offline first to show pending items at top)
      const mergedArtifacts = [...offlineArtifacts, ...onlineArtifacts];
      setArtifacts(mergedArtifacts);

    } catch (error) {
      console.error('Error fetching artifacts:', error);
      setError('Failed to load artifacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtifacts();
  }, [isOnline]); // Re-fetch when online status changes

  return {
    artifacts,
    offlineCount,
    loading,
    error,
    usingCachedData,
    fetchArtifacts,
    refetch: fetchArtifacts,
    isOnline
  };
};