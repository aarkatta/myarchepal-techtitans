import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getAuth, Auth, indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Capacitor } from '@capacitor/core';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// Check if we have valid configuration
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId;

if (!isConfigValid) {
  console.warn('⚠️ Firebase configuration is missing or invalid!');
  console.warn('Please check your .env file and ensure all Firebase variables are set.');
}

// Initialize Firebase
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

try {
  console.log('🔧 Initializing Firebase with config:', {
    apiKey: firebaseConfig.apiKey ? '✅ Set' : '❌ Missing',
    authDomain: firebaseConfig.authDomain ? '✅ Set' : '❌ Missing',
    projectId: firebaseConfig.projectId ? '✅ Set' : '❌ Missing',
    storageBucket: firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing',
    messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Set' : '❌ Missing',
    appId: firebaseConfig.appId ? '✅ Set' : '❌ Missing'
  });

  const isNative = Capacitor.isNativePlatform();
  console.log('📱 Running on:', isNative ? 'Native (Capacitor)' : 'Web Browser');

  app = initializeApp(firebaseConfig);

  // Initialize Firestore with settings optimized for mobile
  db = getFirestore(app);

  // For native platforms, use indexedDB persistence for auth to avoid GAPI issues
  if (isNative) {
    auth = initializeAuth(app, {
      persistence: indexedDBLocalPersistence
    });
    console.log('🔐 Auth initialized with indexedDB persistence (native)');
  } else {
    auth = getAuth(app);
    console.log('🔐 Auth initialized with default persistence (web)');
  }

  storage = getStorage(app);

  console.log('✅ Firebase initialized successfully');
  console.log('🔥 Firestore database instance:', db ? '✅ Created' : '❌ Failed');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  console.error('Config values:', firebaseConfig);
}

export { db, auth, storage };
export default app;