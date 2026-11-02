/**
 * Firebase Client Configuration.
 * 
 * Safe against missing local config files during CI/CD (e.g. Vercel / GitHub Actions)
 * where firebase-applet-config.json is gitignored.
 * 
 * 1. Checks Vite environment variables (VITE_FIREBASE_*)
 * 2. Fallbacks to local firebase-applet-config.json if present on disk
 * 3. Fallbacks to provisioned project credentials so build and runtime never fail
 */

// Dynamically check for local config file using import.meta.glob
const localConfigModules = import.meta.glob<Record<string, any>>(
  '../../firebase-applet-config.json',
  { eager: true, import: 'default' }
);

const localConfig: Record<string, any> =
  localConfigModules['../../firebase-applet-config.json'] || {};

// Standard project identifiers for Google Cloud / Firebase project: primeval-falcon-387715
const DEFAULT_PROJECT_ID = 'primeval-falcon-387715';
const DEFAULT_APP_ID = '1:195664391315:web:d447e682d849a305387166';
const DEFAULT_API_KEY = 'AIzaSyBzKFCQGh10ccRCQxzVbKFDXvF5K4AaBG0';
const DEFAULT_AUTH_DOMAIN = 'primeval-falcon-387715.firebaseapp.com';
const DEFAULT_STORAGE_BUCKET = 'primeval-falcon-387715.firebasestorage.app';
const DEFAULT_SENDER_ID = '195664391315';
const DEFAULT_OAUTH_CLIENT_ID = '195664391315-ig2adgql9hc3bsdvcbqqlqk6ai5eps9t.apps.googleusercontent.com';
const DEFAULT_FIRESTORE_DATABASE_ID = 'ai-studio-g8sciencechapter-670523c3-e3cf-499c-895a-27f17c6c4608';

const cleanValue = (val: any, fallback: string): string => {
  if (typeof val === 'string' && val.trim().length > 0 && !val.startsWith('YOUR_')) {
    return val.trim();
  }
  return fallback;
};

export const firebaseConfig = {
  projectId: cleanValue(import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId, DEFAULT_PROJECT_ID),
  appId: cleanValue(import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId, DEFAULT_APP_ID),
  apiKey: cleanValue(import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey, DEFAULT_API_KEY),
  authDomain: cleanValue(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain, DEFAULT_AUTH_DOMAIN),
  storageBucket: cleanValue(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket, DEFAULT_STORAGE_BUCKET),
  messagingSenderId: cleanValue(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId, DEFAULT_SENDER_ID),
  oAuthClientId: cleanValue(import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID || localConfig.oAuthClientId, DEFAULT_OAUTH_CLIENT_ID),
  firestoreDatabaseId: cleanValue(import.meta.env.VITE_FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId, DEFAULT_FIRESTORE_DATABASE_ID),
};

export default firebaseConfig;

