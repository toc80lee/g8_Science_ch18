import localConfig from '../../firebase-applet-config.json';

/**
 * Firebase Client Configuration.
 * Prioritizes Vite environment variables (VITE_FIREBASE_*) if set,
 * and falls back to local configuration for seamless local development.
 * This prevents secrets from having to be hardcoded in committed git repositories.
 */
export const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig.appId || '',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig.apiKey || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || '',
  oAuthClientId: import.meta.env.VITE_FIREBASE_OAUTH_CLIENT_ID || localConfig.oAuthClientId || '',
};

export default firebaseConfig;
