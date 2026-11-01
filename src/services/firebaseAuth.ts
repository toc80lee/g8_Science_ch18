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

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
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
  isPopupBlocked: boolean;
  isPopupClosed: boolean;
}

export const parseAuthError = (error: any): AuthErrorInfo => {
  const code = error?.code || 'auth/unknown-error';
  const originalMessage = error?.message || String(error);
  const currentDomain = typeof window !== 'undefined' ? window.location.hostname : '';
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';

  if (code === 'auth/unauthorized-domain' || originalMessage.includes('unauthorized-domain')) {
    return {
      code,
      originalMessage,
      domain: currentDomain,
      isUnauthorizedDomain: true,
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

  if (code === 'auth/popup-blocked' || originalMessage.includes('popup-blocked')) {
    return {
      code,
      originalMessage,
      domain: currentDomain,
      isUnauthorizedDomain: false,
      isPopupBlocked: true,
      isPopupClosed: false,
      friendlyTitle: '브라우저 팝업 차단됨',
      friendlyDescription: '브라우저 설정에서 구글 로그인 팝업 창이 차단되었습니다. 주소창 우측 상단의 팝업 차단 아이콘을 눌러 허용해 주세요.'
    };
  }

  if (code === 'auth/popup-closed-by-user' || originalMessage.includes('popup-closed-by-user')) {
    return {
      code,
      originalMessage,
      domain: currentDomain,
      isUnauthorizedDomain: false,
      isPopupBlocked: false,
      isPopupClosed: true,
      friendlyTitle: '로그인 팝업이 닫힘',
      friendlyDescription: '사용자 또는 브라우저에 의해 구글 로그인 팝업 창이 닫혔습니다. 다시 시도해 주세요.'
    };
  }

  return {
    code,
    originalMessage,
    domain: currentDomain,
    isUnauthorizedDomain: false,
    isPopupBlocked: false,
    isPopupClosed: false,
    friendlyTitle: '구글 로그인 실패',
    friendlyDescription: `구글 인증 중 오류가 발생했습니다 (${code}). 잠시 후 다시 시도하시거나 게스트 모드를 이용해 주세요.`
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
    if (!credential?.accessToken) {
      throw new Error('Google OAuth 액세스 토큰을 가져오지 못했습니다.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-in error details:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Creates a local Guest user profile so children can study and save records
 * without experiencing login blocks while Vercel domain whitelisting is completed.
 */
export const createGuestUser = (name = '학습자 (게스트)'): { user: User; accessToken: string } => {
  const guestUser = {
    uid: 'guest-' + Date.now(),
    email: 'guest@student.local',
    displayName: name,
    photoURL: null,
    isAnonymous: true,
  } as unknown as User;

  cachedAccessToken = 'guest-local-token';
  return {
    user: guestUser,
    accessToken: cachedAccessToken
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
  cachedAccessToken = null;
};
