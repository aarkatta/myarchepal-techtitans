import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.archepal.app',
  appName: 'ArchePal',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
    // Allow all hosts for Firebase connectivity
    allowNavigation: [
      'firestore.googleapis.com',
      'firebase.googleapis.com',
      'firebaseio.com',
      '*.firebaseio.com',
      '*.googleapis.com',
      '*.google.com'
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#2563eb',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#2563eb'
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    }
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    scheme: 'ArchePal'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
