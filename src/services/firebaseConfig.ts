/**
 * Firebase Client Configuration.
 * 
 * Safe against missing local config files during CI/CD (e.g. Vercel / GitHub Actions)
 * and guards against dummy/placeholder values like "Secret value" injected by deployment UIs.
 * 
 * 1. Checks Vite environment variables (VITE_FIREBASE_*)
 * 2. Validates format (e.g. apiKey must start with 'AIza' and be >= 35 chars)
 * 3. Fallbacks to local firebase-applet-config.json if present
 * 4. Fallbacks to provisioned project credentials so runtime NEVER fails with invalid API key
 */

// Dynamically load firebase-applet-config.json if present; if deleted, glob returns empty object instead of crashing build
const configFiles = import.meta.glob<{ default: Record<string, any> }>('/firebase-applet-config.json', { eager: true });
const loadedConfigModule = configFiles['/firebase-applet-config.json'];
const localConfig: Record<string, any> = (loadedConfigModule?.default || loadedConfigModule || {}) as Record<string, any>;

// Standard project identifiers for Google Cloud / Firebase project: primeval-falcon-387715
export const DEFAULT_PROJECT_ID = 'primeval-falcon-387715';
export const DEFAULT_APP_ID = '1:195664391315:web:d447e682d849a305387166';
export const DEFAULT_API_KEY = 'AIzaSyBzKFCQGh10ccRCQxzVbKFDXvF5K4AaBG0';
export const DEFAULT_AUTH_DOMAIN = 'primeval-falcon-387715.firebaseapp.com';
export const DEFAULT_STORAGE_BUCKET = 'primeval-falcon-387715.firebasestorage.app';
export const DEFAULT_SENDER_ID = '195664391315';
export const DEFAULT_OAUTH_CLIENT_ID = '195664391315-ig2adgql9hc3bsdvcbqqlqk6ai5eps9t.apps.googleusercontent.com';
export const DEFAULT_FIRESTORE_DATABASE_ID = 'ai-studio-g8sciencechapter-670523c3-e3cf-499c-895a-27f17c6c4608';

const isSuspiciousDummyValue = (val: string): boolean => {
  const lower = val.toLowerCase().trim();
  return (
    lower === 'secret value' ||
    lower === 'secret' ||
    lower === 'undefined' ||
    lower === 'null' ||
    lower.startsWith('your_') ||
    lower.startsWith('my_') ||
    lower.includes('<') ||
    lower.includes('placeholder')
  );
};

const cleanApiKey = (val: any): string => {
  if (typeof val === 'string') {
    const s = val.trim();
    if (s.startsWith('AIza') && s.length >= 35 && !isSuspiciousDummyValue(s)) {
      return s;
    }
  }
  return DEFAULT_API_KEY;
};

const cleanProjectId = (val: any): string => {
  if (typeof val === 'string') {
    const s = val.trim();
    if (s.length >= 4 && !s.includes(' ') && !isSuspiciousDummyValue(s)) {
      return s;
    }
  }
  return DEFAULT_PROJECT_ID;
};

const cleanAppId = (val: any): string => {
  if (typeof val === 'string') {
    const s = val.trim();
    if (s.startsWith('1:') && s.length >= 20 && !isSuspiciousDummyValue(s)) {
      return s;
    }
  }
  return DEFAULT_APP_ID;
};

const cleanAuthDomain = (val: any): string => {
  if (typeof val === 'string') {
    const s = val.trim();
    if (s.includes('.') && !s.includes(' ') && !isSuspiciousDummyValue(s)) {
      return s;
    }
  }
  return DEFAULT_AUTH_DOMAIN;
};

const cleanStorageBucket = (val: any): string => {
  if (typeof val === 'string') {
    const s = val.trim();
    if (s.length > 5 && !s.includes(' ') && !isSuspiciousDummyValue(s)) {
      return s;
    }
  }
  return DEFAULT_STORAGE_BUCKET;
};

const cleanSenderId = (val: any): string => {
  if (typeof val === 'string') {
    const s = val.trim();
    if (/^\d+$/.test(s) && !isSuspiciousDummyValue(s)) {
      return s;
    }
  }
  return DEFAULT_SENDER_ID;
};

const cleanOAuthClientId = (val: any): string => {
  if (typeof val === 'string') {
    const s = val.trim();
    if (s.includes('googleusercontent.com') && !isSuspiciousDummyValue(s)) {
      return s;
    }
  }
  return DEFAULT_OAUTH_CLIENT_ID;
};

export const firebaseConfig = {
  projectId: cleanProjectId(import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId),
  appId: cleanAppId(import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId),
  apiKey: cleanApiKey(import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey),
  authDomain: cleanAuthDomain(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain),
  storageBucket: cleanStorageBucket(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket),
  messagingSenderId: cleanSenderId(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId),
  oAuthClientId: cleanOAuthClientId(import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID || localConfig.oAuthClientId),
  firestoreDatabaseId: DEFAULT_FIRESTORE_DATABASE_ID,
};

export default firebaseConfig;
