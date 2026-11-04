import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged, 
  User, 
  signOut,
  Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import firebaseConfig from './firebaseConfig';
import { db } from './firebaseFirestore';
import { MemberProfile } from '../types';

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

const MEMBER_PROFILE_STORAGE_KEY = 'ch18_active_member_session';

export interface MemberSessionData {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'parent' | 'teacher';
  schoolGrade?: string;
  createdAt: number;
}

// In-memory current member
let currentMemberSession: MemberSessionData | null = null;

export const getSavedMemberSession = (): MemberSessionData | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(MEMBER_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveMemberSession = (session: MemberSessionData) => {
  currentMemberSession = session;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MEMBER_PROFILE_STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save member session to localStorage', e);
  }
};

export const clearMemberSession = () => {
  currentMemberSession = null;
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(MEMBER_PROFILE_STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
};

/**
 * Initialize Member Authentication state listener
 */
export const initMemberAuth = (
  onAuthSuccess?: (user: User | MemberSessionData) => void,
  onAuthFailure?: () => void
) => {
  // Check if we have an active saved member session
  const savedSession = getSavedMemberSession();
  if (savedSession) {
    currentMemberSession = savedSession;
    if (onAuthSuccess) onAuthSuccess(savedSession);
  }

  if (!auth) {
    if (!savedSession && onAuthFailure) onAuthFailure();
    return () => {};
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      // Build session from Firebase Auth User
      const session: MemberSessionData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || '회원',
        role: 'student',
        createdAt: Date.now()
      };

      // Try fetching existing profile from Firestore to get accurate role/displayName
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const profileData = userDoc.data();
          session.displayName = profileData.displayName || session.displayName;
          session.role = profileData.role || session.role;
          session.schoolGrade = profileData.schoolGrade || session.schoolGrade;
        }
      } catch (err) {
        console.warn('Could not fetch user profile from Firestore:', err);
      }

      saveMemberSession(session);
      if (onAuthSuccess) onAuthSuccess(user);
    } else {
      const session = getSavedMemberSession();
      if (session) {
        if (onAuthSuccess) onAuthSuccess(session);
      } else {
        clearMemberSession();
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

/**
 * Sign up a new member (이메일/비밀번호 회원가입)
 */
export async function signUpMember(params: {
  email: string;
  password: string;
  displayName: string;
  role?: 'student' | 'parent' | 'teacher';
  schoolGrade?: string;
}): Promise<MemberSessionData> {
  const { email, password, displayName, role = 'student', schoolGrade = '중학교 2학년' } = params;

  if (!email || !password || password.length < 6) {
    throw new Error('이메일과 6자 이상의 비밀번호를 입력해주세요.');
  }

  const cleanName = displayName.trim() || email.split('@')[0];

  // 1. Try Firebase Auth with Email & Password
  if (auth) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user;

      try {
        await updateProfile(user, { displayName: cleanName });
      } catch {
        // non-blocking
      }

      // Save user profile to Firestore
      const profile: MemberProfile = {
        uid: user.uid,
        email: email.trim(),
        displayName: cleanName,
        role,
        schoolGrade,
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };

      try {
        await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
      } catch (e) {
        console.warn('Firestore user profile write notice:', e);
      }

      const session: MemberSessionData = {
        uid: user.uid,
        email: email.trim(),
        displayName: cleanName,
        role,
        schoolGrade,
        createdAt: Date.now()
      };
      saveMemberSession(session);
      return session;
    } catch (authError: any) {
      console.warn('Firebase Auth createUser error:', authError);

      // Handle specific Firebase Auth errors
      if (authError.code === 'auth/email-already-in-use') {
        throw new Error('이미 등록된 이메일 주소입니다. 로그인해 주세요.');
      }
      if (authError.code === 'auth/weak-password') {
        throw new Error('비밀번호는 6자 이상으로 설정해 주세요.');
      }
      if (authError.code === 'auth/invalid-email') {
        throw new Error('유효한 이메일 형식을 입력해 주세요.');
      }

      // If Firebase Auth Email provider is not enabled in Firebase Console (operation-not-allowed)
      // or network restriction, provide direct student member registration via Firestore
      if (authError.code === 'auth/operation-not-allowed' || authError.code?.includes('operation-not-allowed')) {
        console.info('Email/Password provider not yet enabled in Firebase console, falling back to Firestore member registration');
        return registerDirectFirestoreMember({ email, displayName: cleanName, role, schoolGrade });
      }

      throw authError;
    }
  }

  // Fallback if auth is not initialized
  return registerDirectFirestoreMember({ email, displayName: cleanName, role, schoolGrade });
}

/**
 * Sign in existing member (이메일/비밀번호 로그인)
 */
export async function signInMember(params: {
  email: string;
  password: string;
}): Promise<MemberSessionData> {
  const { email, password } = params;

  if (!email || !password) {
    throw new Error('이메일과 비밀번호를 모두 입력해 주세요.');
  }

  // 1. Try Firebase Auth
  if (auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = cred.user;

      const session: MemberSessionData = {
        uid: user.uid,
        email: user.email || email.trim(),
        displayName: user.displayName || email.split('@')[0],
        role: 'student',
        createdAt: Date.now()
      };

      // Fetch profile from Firestore
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const profileData = userDoc.data();
          session.displayName = profileData.displayName || session.displayName;
          session.role = profileData.role || session.role;
          session.schoolGrade = profileData.schoolGrade || session.schoolGrade;
        }
      } catch (e) {
        console.warn('User profile fetch notice:', e);
      }

      saveMemberSession(session);
      return session;
    } catch (authError: any) {
      console.warn('Firebase Auth signIn error:', authError);
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/wrong-password' || authError.code === 'auth/invalid-credential') {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      if (authError.code === 'auth/invalid-email') {
        throw new Error('유효한 이메일 형식을 입력해 주세요.');
      }
      throw authError;
    }
  }

  throw new Error('인증 시스템에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.');
}

/**
 * Direct Firestore member registration (failsafe resilient registration)
 */
async function registerDirectFirestoreMember(params: {
  email: string;
  displayName: string;
  role: 'student' | 'parent' | 'teacher';
  schoolGrade: string;
}): Promise<MemberSessionData> {
  const safeAlpha = params.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10);
  const uid = 'member_' + (safeAlpha || 'student') + '_' + Math.random().toString(36).substring(2, 8) + '_' + (Date.now() % 100000);
  const session: MemberSessionData = {
    uid,
    email: params.email,
    displayName: params.displayName,
    role: params.role,
    schoolGrade: params.schoolGrade,
    createdAt: Date.now()
  };

  try {
    await setDoc(doc(db, 'users', uid), {
      ...session,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore direct write notice:', err);
  }

  saveMemberSession(session);
  return session;
}

/**
 * Quick 1-click Student Account creation
 */
export async function quickStudentSignUp(displayName: string, schoolGrade = '중학교 2학년'): Promise<MemberSessionData> {
  const cleanName = displayName.trim() || '학습자';
  const cleanEmail = `${cleanName.toLowerCase().replace(/[^a-z0-9가-힣]/g, '')}@student.school`;
  return registerDirectFirestoreMember({
    email: cleanEmail,
    displayName: cleanName,
    role: 'student',
    schoolGrade
  });
}

/**
 * Sign out member
 */
export async function signOutMember() {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
  }
  clearMemberSession();
}
