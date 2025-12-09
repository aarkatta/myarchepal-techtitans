import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'ArchePalOfflineDB';
const DB_VERSION = 3;

// Store names
const SITES_CACHE_STORE = 'sitesCache';
const ARTIFACTS_CACHE_STORE = 'artifactsCache';
const SITE_DETAILS_CACHE_STORE = 'siteDetailsCache';
const ARTIFACT_DETAILS_CACHE_STORE = 'artifactDetailsCache';

interface CacheEntry<T> {
  id: string;
  data: T;
  cachedAt: number;
  expiresAt: number;
}

// Cache duration: 24 hours for lists, 1 week for details
const LIST_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const DETAIL_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export const OfflineCacheService = {
  async initDB(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Keep existing stores
        if (!db.objectStoreNames.contains('offlineArtifacts')) {
          db.createObjectStore('offlineArtifacts', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('offlineDiaryEntries')) {
          db.createObjectStore('offlineDiaryEntries', { keyPath: 'id', autoIncrement: true });
        }
        // Cache stores
        if (!db.objectStoreNames.contains(SITES_CACHE_STORE)) {
          db.createObjectStore(SITES_CACHE_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(ARTIFACTS_CACHE_STORE)) {
          db.createObjectStore(ARTIFACTS_CACHE_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(SITE_DETAILS_CACHE_STORE)) {
          db.createObjectStore(SITE_DETAILS_CACHE_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(ARTIFACT_DETAILS_CACHE_STORE)) {
          db.createObjectStore(ARTIFACT_DETAILS_CACHE_STORE, { keyPath: 'id' });
        }
      },
    });
  },

  // Sites List Cache
  async cacheSitesList(sites: any[]): Promise<void> {
    try {
      const db = await this.initDB();
      const now = Date.now();
      const entry: CacheEntry<any[]> = {
        id: 'sites-list',
        data: sites,
        cachedAt: now,
        expiresAt: now + LIST_CACHE_DURATION,
      };
      await db.put(SITES_CACHE_STORE, entry);
      console.log(`📦 Cached ${sites.length} sites`);
    } catch (error) {
      console.warn('Failed to cache sites list:', error);
    }
  },

  async getCachedSitesList(): Promise<{ data: any[] | null; isStale: boolean }> {
    try {
      const db = await this.initDB();
      const entry = await db.get(SITES_CACHE_STORE, 'sites-list') as CacheEntry<any[]> | undefined;

      if (!entry) {
        return { data: null, isStale: false };
      }

      const isStale = Date.now() > entry.expiresAt;
      console.log(`📦 Retrieved ${entry.data.length} cached sites (stale: ${isStale})`);
      return { data: entry.data, isStale };
    } catch (error) {
      console.warn('Failed to get cached sites:', error);
      return { data: null, isStale: false };
    }
  },

  // Artifacts List Cache
  async cacheArtifactsList(artifacts: any[]): Promise<void> {
    try {
      const db = await this.initDB();
      const now = Date.now();
      const entry: CacheEntry<any[]> = {
        id: 'artifacts-list',
        data: artifacts,
        cachedAt: now,
        expiresAt: now + LIST_CACHE_DURATION,
      };
      await db.put(ARTIFACTS_CACHE_STORE, entry);
      console.log(`📦 Cached ${artifacts.length} artifacts`);
    } catch (error) {
      console.warn('Failed to cache artifacts list:', error);
    }
  },

  async getCachedArtifactsList(): Promise<{ data: any[] | null; isStale: boolean }> {
    try {
      const db = await this.initDB();
      const entry = await db.get(ARTIFACTS_CACHE_STORE, 'artifacts-list') as CacheEntry<any[]> | undefined;

      if (!entry) {
        return { data: null, isStale: false };
      }

      const isStale = Date.now() > entry.expiresAt;
      console.log(`📦 Retrieved ${entry.data.length} cached artifacts (stale: ${isStale})`);
      return { data: entry.data, isStale };
    } catch (error) {
      console.warn('Failed to get cached artifacts:', error);
      return { data: null, isStale: false };
    }
  },

  // Site Details Cache
  async cacheSiteDetails(siteId: string, site: any): Promise<void> {
    try {
      const db = await this.initDB();
      const now = Date.now();
      const entry: CacheEntry<any> = {
        id: siteId,
        data: site,
        cachedAt: now,
        expiresAt: now + DETAIL_CACHE_DURATION,
      };
      await db.put(SITE_DETAILS_CACHE_STORE, entry);
      console.log(`📦 Cached site details: ${siteId}`);
    } catch (error) {
      console.warn('Failed to cache site details:', error);
    }
  },

  async getCachedSiteDetails(siteId: string): Promise<{ data: any | null; isStale: boolean }> {
    try {
      const db = await this.initDB();
      const entry = await db.get(SITE_DETAILS_CACHE_STORE, siteId) as CacheEntry<any> | undefined;

      if (!entry) {
        return { data: null, isStale: false };
      }

      const isStale = Date.now() > entry.expiresAt;
      console.log(`📦 Retrieved cached site: ${siteId} (stale: ${isStale})`);
      return { data: entry.data, isStale };
    } catch (error) {
      console.warn('Failed to get cached site details:', error);
      return { data: null, isStale: false };
    }
  },

  // Artifact Details Cache
  async cacheArtifactDetails(artifactId: string, artifact: any): Promise<void> {
    try {
      const db = await this.initDB();
      const now = Date.now();
      const entry: CacheEntry<any> = {
        id: artifactId,
        data: artifact,
        cachedAt: now,
        expiresAt: now + DETAIL_CACHE_DURATION,
      };
      await db.put(ARTIFACT_DETAILS_CACHE_STORE, entry);
      console.log(`📦 Cached artifact details: ${artifactId}`);
    } catch (error) {
      console.warn('Failed to cache artifact details:', error);
    }
  },

  async getCachedArtifactDetails(artifactId: string): Promise<{ data: any | null; isStale: boolean }> {
    try {
      const db = await this.initDB();
      const entry = await db.get(ARTIFACT_DETAILS_CACHE_STORE, artifactId) as CacheEntry<any> | undefined;

      if (!entry) {
        return { data: null, isStale: false };
      }

      const isStale = Date.now() > entry.expiresAt;
      console.log(`📦 Retrieved cached artifact: ${artifactId} (stale: ${isStale})`);
      return { data: entry.data, isStale };
    } catch (error) {
      console.warn('Failed to get cached artifact details:', error);
      return { data: null, isStale: false };
    }
  },

  // Site Artifacts Cache (artifacts for a specific site)
  async cacheSiteArtifacts(siteId: string, artifacts: any[]): Promise<void> {
    try {
      const db = await this.initDB();
      const now = Date.now();
      const entry: CacheEntry<any[]> = {
        id: `site-artifacts-${siteId}`,
        data: artifacts,
        cachedAt: now,
        expiresAt: now + LIST_CACHE_DURATION,
      };
      await db.put(ARTIFACTS_CACHE_STORE, entry);
      console.log(`📦 Cached ${artifacts.length} artifacts for site: ${siteId}`);
    } catch (error) {
      console.warn('Failed to cache site artifacts:', error);
    }
  },

  async getCachedSiteArtifacts(siteId: string): Promise<{ data: any[] | null; isStale: boolean }> {
    try {
      const db = await this.initDB();
      const entry = await db.get(ARTIFACTS_CACHE_STORE, `site-artifacts-${siteId}`) as CacheEntry<any[]> | undefined;

      if (!entry) {
        return { data: null, isStale: false };
      }

      const isStale = Date.now() > entry.expiresAt;
      return { data: entry.data, isStale };
    } catch (error) {
      console.warn('Failed to get cached site artifacts:', error);
      return { data: null, isStale: false };
    }
  },

  // Clear all caches
  async clearAllCaches(): Promise<void> {
    try {
      const db = await this.initDB();
      await db.clear(SITES_CACHE_STORE);
      await db.clear(ARTIFACTS_CACHE_STORE);
      await db.clear(SITE_DETAILS_CACHE_STORE);
      await db.clear(ARTIFACT_DETAILS_CACHE_STORE);
      console.log('🗑️ All caches cleared');
    } catch (error) {
      console.warn('Failed to clear caches:', error);
    }
  },
};
