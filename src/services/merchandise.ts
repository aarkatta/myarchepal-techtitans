import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  Timestamp,
  DocumentData,
  QuerySnapshot,
  CollectionReference
} from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';

// Merchandise interface
export interface Merchandise {
  id?: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  currency: string;
  quantity: number;
  category: string;
  createdAt?: Date | Timestamp;
  updatedAt?: Date | Timestamp;
}

// Collection reference
let merchandiseCollection: CollectionReference<DocumentData> | undefined;
try {
  if (db) {
    merchandiseCollection = collection(db, 'Merchandise');
  }
} catch (error) {
  console.error('Failed to create Merchandise collection reference:', error);
}

// Merchandise Service Class
export class MerchandiseService {
  // Get all merchandise items
  static async getAllMerchandise(): Promise<Merchandise[]> {
    try {
      if (!merchandiseCollection || !db) {
        console.warn('Firebase is not properly initialized');
        return [];
      }
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(merchandiseCollection);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Merchandise));
    } catch (error) {
      console.error('Error fetching merchandise:', error);
      throw error;
    }
  }

  // Get a single merchandise item by ID
  static async getMerchandiseById(merchandiseId: string): Promise<Merchandise | null> {
    try {
      if (!db) {
        console.warn('Firebase is not properly initialized');
        return null;
      }
      const merchandiseDoc = doc(db, 'Merchandise', merchandiseId);
      const merchandiseSnapshot = await getDoc(merchandiseDoc);

      if (merchandiseSnapshot.exists()) {
        return {
          id: merchandiseSnapshot.id,
          ...merchandiseSnapshot.data()
        } as Merchandise;
      }
      return null;
    } catch (error) {
      console.error('Error fetching merchandise:', error);
      throw error;
    }
  }

  // List all images from Firebase Storage merchandise folder
  static async getMerchandiseImagesFromStorage(): Promise<string[]> {
    try {
      if (!storage) {
        console.warn('Firebase Storage is not properly initialized');
        return [];
      }

      const merchandiseRef = ref(storage, 'merchandise');

      // Try to list all items in the merchandise folder
      const result = await listAll(merchandiseRef);

      // If folder is empty, return empty array
      if (result.items.length === 0) {
        console.warn('No items found in merchandise folder. Please upload images to Firebase Storage at /merchandise');
        return [];
      }

      const urlPromises = result.items.map(itemRef => getDownloadURL(itemRef));
      const urls = await Promise.all(urlPromises);

      return urls;
    } catch (error: any) {
      console.error('Error fetching merchandise images from storage:', error);

      // Check if it's a permissions error
      if (error.code === 'storage/unauthorized' || error.code === 'storage/unauthenticated') {
        console.error('Storage permissions error. Make sure Firebase Storage rules allow read access.');
      } else if (error.code === 'storage/object-not-found') {
        console.warn('Merchandise folder does not exist. Please create a "merchandise" folder in Firebase Storage and upload images.');
      }

      // Return empty array instead of throwing to handle case where folder doesn't exist yet
      return [];
    }
  }

  // Get all merchandise from database (no auto-creation)
  static async syncMerchandiseFromStorage(): Promise<Merchandise[]> {
    try {
      // Only return existing merchandise from database
      const allMerchandise = await this.getAllMerchandise();
      return allMerchandise;
    } catch (error) {
      console.error('Error fetching merchandise:', error);
      throw error;
    }
  }

  // Update merchandise quantity after purchase
  static async updateQuantity(merchandiseId: string, newQuantity: number): Promise<void> {
    try {
      if (!db) {
        throw new Error('Firebase is not properly initialized');
      }
      const merchandiseDoc = doc(db, 'Merchandise', merchandiseId);
      await updateDoc(merchandiseDoc, {
        quantity: newQuantity,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating merchandise quantity:', error);
      throw error;
    }
  }

  // Upload merchandise image to Firebase Storage
  static async uploadMerchandiseImage(file: File): Promise<string> {
    try {
      if (!storage) {
        throw new Error('Firebase Storage is not properly initialized');
      }

      // Create a unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `merchandise/${filename}`);

      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading merchandise image:', error);
      throw error;
    }
  }

  // Create a new merchandise item
  static async createMerchandise(merchandiseData: Omit<Merchandise, 'id' | 'createdAt' | 'updatedAt'>, imageFile: File): Promise<string> {
    try {
      if (!merchandiseCollection || !db) {
        throw new Error('Firebase is not properly initialized');
      }

      // Upload the image first
      const imageUrl = await this.uploadMerchandiseImage(imageFile);

      // Create the merchandise document
      const newMerchandise = {
        ...merchandiseData,
        imageUrl,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(merchandiseCollection, newMerchandise);

      return docRef.id;
    } catch (error) {
      console.error('Error creating merchandise:', error);
      throw error;
    }
  }
}
