import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut,
  Auth
} from 'firebase/auth';
import firebaseConfig from './firebaseConfig';

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

try {
  if (firebaseConfig.apiKey) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    authInstance = getAuth(app);
  } else {
    console.warn('Firebase apiKey가 비어 있습니다.');
  }
} catch (err) {
  console.warn('Firebase 초기화 대기 중:', err);
}

export const auth = authInstance;

const provider = new GoogleAuthProvider();
// Google Drive scope for user-specific app file storage
provider.addScope('https://www.googleapis.com/auth/drive.file');
// Set custom parameters to ensure prompt selection
provider.setCustomParameters({
  prompt: 'select_account'
});

// In-memory access token cache (NOT in localStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

const STUDENT_PROFILE_STORAGE_KEY = 'ch18_active_student_profile';

export interface StoredStudentProfile {
  uid: string;
  displayName: string;
  email: string;
  createdAt: number;
}

export const getSavedStudentProfile = (): StoredStudentProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STUDENT_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveStudentProfile = (name: string, email?: string): User => {
  const cleanName = (name || '학생').trim();
  const profileId = 'student_' + cleanName.toLowerCase().replace(/[^a-z0-9가-힣]/g, '_') + '_' + (Date.now() % 10000);
  const data: StoredStudentProfile = {
    uid: profileId,
    displayName: cleanName,
    email: email || `${cleanName.toLowerCase()}@local.school`,
    createdAt: Date.now()
  };

  try {
    localStorage.setItem(STUDENT_PROFILE_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save student profile', e);
  }

  const userObj = {
    uid: data.uid,
    displayName: data.displayName,
    email: data.email,
    photoURL: null,
    isAnonymous: true,
  } as unknown as User;

  cachedAccessToken = 'local-student-token';
  return userObj;
};

export const clearSavedStudentProfile = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STUDENT_PROFILE_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  // Check if we have an active saved student profile
  const savedProfile = getSavedStudentProfile();
  if (savedProfile) {
    const localUser = {
      uid: savedProfile.uid,
      displayName: savedProfile.displayName,
      email: savedProfile.email,
      photoURL: null,
      isAnonymous: true,
    } as unknown as User;
    cachedAccessToken = 'local-student-token';
    if (onAuthSuccess) onAuthSuccess(localUser, cachedAccessToken);
  }

  if (!auth) {
    if (!savedProfile && onAuthFailure) onAuthFailure();
    return () => {};
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Logged in with Google credentials
        cachedAccessToken = 'firebase-session-token';
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      }
    } else {
      // If Firebase has no user, keep local student profile if one exists
      const profile = getSavedStudentProfile();
      if (profile) {
        const localUser = {
          uid: profile.uid,
          displayName: profile.displayName,
          email: profile.email,
          photoURL: null,
          isAnonymous: true,
        } as unknown as User;
        cachedAccessToken = 'local-student-token';
        if (onAuthSuccess) onAuthSuccess(localUser, cachedAccessToken);
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

export interface AuthErrorInfo {
  code: string;
  originalMessage: string;
  domain: string;
  friendlyTitle: string;
  friendlyDescription: string;
  solutionSteps?: string[];
  isUnauthorizedDomain: boolean;
  isApiKeyInvalid: boolean;
  isPopupBlocked: boolean;
  isPopupClosed: boolean;
}

export const isAuthCancellation = (error: any): boolean => {
  if (!error) return false;
  const code = error?.code || '';
  const originalMessage = error?.message || String(error);
  return (
    code === 'auth/popup-closed-by-user' ||
    code === 'auth/cancelled-popup-request' ||
    originalMessage.includes('popup-closed-by-user') ||
    originalMessage.includes('cancelled-popup-request')
  );
};

export const parseAuthError = (error: any): AuthErrorInfo => {
  const code = error?.code || 'auth/unknown-error';
  const originalMessage = error?.message || String(error);
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  // 1. API key invalid / restricted by HTTP referrer
  if (
    code.includes('api-key-not-valid') ||
    originalMessage.includes('api-key-not-valid') ||
    originalMessage.includes('API_KEY_HTTP_REFERRER_BLOCKED') ||
    code.includes('invalid-api-key')
  ) {
    return {
      code,
      originalMessage,
      domain: currentDomain,
      isUnauthorizedDomain: false,
      isApiKeyInvalid: true,
      isPopupBlocked: false,
      isPopupClosed: false,
      friendlyTitle: 'API 키 제한 또는 미허용 도메인 차단',
      friendlyDescription: `현재 사이트(${currentDomain})에서 전송된 요청이 Google Cloud의 API 키 웹사이트(HTTP Referrer) 제한 또는 미등록으로 인해 차단되었습니다.`,
      solutionSteps: [
        'Vercel 환경 변수 설정에서 VITE_FIREBASE_API_KEY에 "Secret value" 대신 실제 API 키(AIzaSy...)를 입력해야 합니다.',
        'Google Cloud 콘솔(사용자 인증 정보)에서 프로젝트 [primeval-falcon-387715]의 Web API 키를 클릭합니다.',
        '[애플리케이션 제한사항]을 "없음"으로 변경하거나, 웹사이트 허용 목록에 ' + currentOrigin + '/* 를 추가합니다.',
        'Firebase 콘솔 [Authentication] -> [Settings] -> [승인된 도메인]에 ' + currentDomain + ' 을 추가합니다.'
      ]
    };
  }

  // 2. Unauthorized domain in Firebase Console
  if (code === 'auth/unauthorized-domain' || originalMessage.includes('unauthorized-domain')) {
    return {
      code,
      originalMessage,
      domain: currentDomain,
      isUnauthorizedDomain: true,
      isApiKeyInvalid: false,
      isPopupBlocked: false,
      isPopupClosed: false,
      friendlyTitle: '도메인 승인 필요 (Authorized Domain)',
      friendlyDescription: `현재 접속하신 도메인(${currentDomain})이 Google Cloud / Firebase 프로젝트의 '승인된 도메인' 목록에 아직 등록되어 있지 않아 로그인이 차단되었습니다.`,
      solutionSteps: [
        'Firebase 콘솔 (https://console.firebase.google.com)에 로그인합니다.',
        '프로젝트 [primeval-falcon-387715] 선택 후 왼쪽 메뉴의 [Authentication] -> [Settings(설정)] 탭을 클릭합니다.',
        '[승인된 도메인(Authorized domains)] 섹션에서 [도메인 추가] 버튼을 클릭합니다.',
        `${currentDomain} 을 입력하고 저장합니다. (약 1분 후 바로 로그인 가능)`
      ]
    };
  }

  // 3. Browser Popup Blocked
  if (code === 'auth/popup-blocked' || originalMessage.includes('popup-blocked')) {
    return {
      code,
      originalMessage,
      domain: currentDomain,
      isUnauthorizedDomain: false,
      isApiKeyInvalid: false,
      isPopupBlocked: true,
      isPopupClosed: false,
      friendlyTitle: '브라우저 팝업 차단됨',
      friendlyDescription: '브라우저 설정에서 구글 로그인 팝업 창이 차단되었습니다. 주소창 우측의 팝업 차단 아이콘을 눌러 허용해 주세요.'
    };
  }

  // 4. Normal popup closure or user cancellation
  if (isAuthCancellation(error)) {
    return {
      code,
      originalMessage,
      domain: currentDomain,
      isUnauthorizedDomain: false,
      isApiKeyInvalid: false,
      isPopupBlocked: false,
      isPopupClosed: true,
      friendlyTitle: '로그인 취소',
      friendlyDescription: '로그인 팝업 창이 닫혔거나 취소되었습니다.'
    };
  }

  return {
    code,
    originalMessage,
    domain: currentDomain,
    isUnauthorizedDomain: false,
    isApiKeyInvalid: false,
    isPopupBlocked: false,
    isPopupClosed: false,
    friendlyTitle: '구글 로그인 안내',
    friendlyDescription: `구글 인증 중 오류가 발생했습니다 (${code}). 간편 학생 모드를 이용하시면 즉시 모든 학습 이력이 저장됩니다.`
  };
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  if (!auth) {
    throw new Error('Firebase Auth가 초기화되지 않았습니다. apiKey 구성을 확인해주세요.');
  }

  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    // Google OAuth access token is used for Google Drive operations if present
    cachedAccessToken = credential?.accessToken || 'firebase-google-token';
    // Clear local guest profile override when real Google sign in succeeds
    clearSavedStudentProfile();
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (isAuthCancellation(error)) {
      console.info('Google sign-in popup was closed or cancelled by the user.');
    } else {
      console.error('Google Sign-in error details:', error);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Creates or restores a local Student user profile so learners can study and save records
 * without experiencing login blocks while domain whitelisting is completed.
 */
export const createGuestUser = (name = '학습자 (Josh)'): { user: User; accessToken: string } => {
  const user = saveStudentProfile(name);
  return {
    user,
    accessToken: 'local-student-token'
  };
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const googleSignOut = async () => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  }
  clearSavedStudentProfile();
  cachedAccessToken = null;
};
