/**
 * Firebase Client Configuration.
 * 
 * Safe against missing local config files during CI/CD (e.g. Vercel / GitHub Actions)
 * where firebase-applet-config.json is gitignored.
 * 
 * 1. Checks Vite environment variables (VITE_FIREBASE_*)
 * 2. Fallbacks to local firebase-applet-config.json if present on disk
 * 3. Fallbacks to safe defaults so build never crashes
 */

// Dynamically check for local config file using import.meta.glob.
// If the file is gitignored and does not exist in Vercel, import.meta.glob returns {}
// without throwing an [UNRESOLVED_IMPORT] build error.
const localConfigModules = import.meta.glob<Record<string, any>>(
  '../../firebase-applet-config*.json',
  { eager: true, import: 'default' }
);

const localConfig: Record<string, any> =
  localConfigModules['../../firebase-applet-config.json'] ||
  localConfigModules['../../firebase-applet-config.example.json'] ||
  {};

// Default project identifiers from Google Cloud project
const DEFAULT_PROJECT_ID = 'primeval-falcon-387715';
const DEFAULT_APP_ID = '1:195664391315:web:d447e682d849a305387166';
const DEFAULT_AUTH_DOMAIN = 'primeval-falcon-387715.firebaseapp.com';
const DEFAULT_STORAGE_BUCKET = 'primeval-falcon-387715.firebasestorage.app';
const DEFAULT_SENDER_ID = '195664391315';
const DEFAULT_OAUTH_CLIENT_ID = '195664391315-ig2adgql9hc3bsdvcbqqlqk6ai5eps9t.apps.googleusercontent.com';

export const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId || DEFAULT_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId || DEFAULT_APP_ID,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || DEFAULT_AUTH_DOMAIN,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || DEFAULT_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || DEFAULT_SENDER_ID,
  oAuthClientId: import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID || localConfig.oAuthClientId || DEFAULT_OAUTH_CLIENT_ID,
};

export default firebaseConfig;
