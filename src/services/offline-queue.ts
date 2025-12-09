import { openDB } from 'idb';
import { Filesystem, Directory } from '@capacitor/filesystem';

const DB_NAME = 'ArchePalOfflineDB';
const DB_VERSION = 3; // Must match across all services using the same DB
const STORE_NAME = 'offlineArtifacts';

export const OfflineQueueService = {
  async initDB() {
    return openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create all stores needed across the app to prevent version conflicts
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('offlineDiaryEntries')) {
          db.createObjectStore('offlineDiaryEntries', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('sitesCache')) {
          db.createObjectStore('sitesCache', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('artifactsCache')) {
          db.createObjectStore('artifactsCache', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('siteDetailsCache')) {
          db.createObjectStore('siteDetailsCache', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('artifactDetailsCache')) {
          db.createObjectStore('artifactDetailsCache', { keyPath: 'id' });
        }
      },
    });
  },

  async queueArtifact(data: any, imageBlob?: Blob) {
    const db = await this.initDB();
    let imagePath = null;

    if (imageBlob) {
      const fileName = `${Date.now()}_artifact.jpg`;
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageBlob);
      });

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data
      });
      imagePath = fileName;
    }

    await db.put(STORE_NAME, {
      ...data,
      localImagePath: imagePath,
      createdAt: new Date().toISOString(),
      status: 'pending'
    });
  },

  async getQueue() {
    const db = await this.initDB();
    return db.getAll(STORE_NAME);
  },

  async removeFromQueue(id: number, imagePath?: string) {
    const db = await this.initDB();
    await db.delete(STORE_NAME, id);
    
    if (imagePath) {
      try {
        await Filesystem.deleteFile({ path: imagePath, directory: Directory.Data });
      } catch (e) {
        console.warn('Could not delete local file', e);
      }
    }
  }
};