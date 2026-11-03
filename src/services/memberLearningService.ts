import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseFirestore';
import { MemberLearningRecord, CustomWord, TextHighlight } from '../types';

const LOCAL_STORAGE_KEY_PREFIX = 'ch18_member_record_';

function cleanFirestoreData<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as Partial<T>;
}

/**
 * Load member learning record from Firestore with local fallback
 */
export async function loadMemberLearningRecord(userId: string): Promise<MemberLearningRecord | null> {
  if (!userId) return null;

  try {
    const docRef = doc(db, 'learning_records', userId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      const record: MemberLearningRecord = {
        userId,
        userEmail: data.userEmail || '',
        displayName: data.displayName || '회원',
        completedSectionIds: Array.isArray(data.completedSectionIds) ? data.completedSectionIds : [],
        visitHistory: typeof data.visitHistory === 'object' && data.visitHistory ? data.visitHistory : {},
        quizScores: typeof data.quizScores === 'object' && data.quizScores ? data.quizScores : {},
        customVocabulary: Array.isArray(data.customVocabulary) ? data.customVocabulary : [],
        textHighlights: Array.isArray(data.textHighlights) ? data.textHighlights : [],
        lastSyncedAt: data.lastSyncedAt || new Date().toISOString(),
        updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
      };

      // Cache locally
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + userId, JSON.stringify(record));
      } catch (e) {
        console.warn('Local cache write failed:', e);
      }

      return record;
    }
  } catch (err) {
    console.warn(`Firestore load failed for member ${userId}, checking local cache:`, err);
  }

  // Fallback to local cache
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + userId);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Save member learning record to Firebase Firestore and localStorage
 */
export async function saveMemberLearningRecord(
  userId: string,
  record: {
    userEmail?: string;
    displayName?: string;
    completedSectionIds: string[];
    visitHistory: Record<string, { title: string; lastVisitedAt: number; count: number }>;
    quizScores: Record<string, { correct: number; total: number; scorePercent: number; updatedAt: number }>;
    customVocabulary: CustomWord[];
    textHighlights: TextHighlight[];
  }
): Promise<{ success: boolean; syncedToCloud: boolean; lastSyncedAt: string }> {
  if (!userId) return { success: false, syncedToCloud: false, lastSyncedAt: '' };

  const nowIso = new Date().toISOString();
  const nowMs = Date.now();

  const fullRecord: MemberLearningRecord = {
    userId,
    userEmail: record.userEmail || '',
    displayName: record.displayName || '회원',
    completedSectionIds: record.completedSectionIds,
    visitHistory: record.visitHistory,
    quizScores: record.quizScores,
    customVocabulary: record.customVocabulary,
    textHighlights: record.textHighlights,
    lastSyncedAt: nowIso,
    updatedAt: nowMs,
  };

  // 1. Save locally for instantaneous response
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + userId, JSON.stringify(fullRecord));
  } catch (e) {
    console.warn('Local storage write notice:', e);
  }

  // 2. Persist to Firestore
  let syncedToCloud = false;
  try {
    const docRef = doc(db, 'learning_records', userId);
    const cleaned = cleanFirestoreData({
      userId,
      userEmail: fullRecord.userEmail,
      displayName: fullRecord.displayName,
      completedSectionIds: fullRecord.completedSectionIds,
      visitHistory: fullRecord.visitHistory,
      quizScores: fullRecord.quizScores,
      customVocabulary: fullRecord.customVocabulary,
      textHighlights: fullRecord.textHighlights,
      lastSyncedAt: nowIso,
      updatedAt: nowMs,
    });
    await setDoc(docRef, cleaned, { merge: true });
    syncedToCloud = true;
  } catch (err) {
    console.warn('Firestore cloud sync notice (saved safely in local storage):', err);
  }

  return {
    success: true,
    syncedToCloud,
    lastSyncedAt: nowIso,
  };
}

/**
 * Subscribe to real-time updates for a member's learning record
 */
export function subscribeMemberLearningRecord(
  userId: string,
  onUpdate: (record: MemberLearningRecord) => void
): () => void {
  if (!userId) return () => {};

  try {
    const docRef = doc(db, 'learning_records', userId);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const record: MemberLearningRecord = {
            userId,
            userEmail: data.userEmail || '',
            displayName: data.displayName || '회원',
            completedSectionIds: Array.isArray(data.completedSectionIds) ? data.completedSectionIds : [],
            visitHistory: typeof data.visitHistory === 'object' && data.visitHistory ? data.visitHistory : {},
            quizScores: typeof data.quizScores === 'object' && data.quizScores ? data.quizScores : {},
            customVocabulary: Array.isArray(data.customVocabulary) ? data.customVocabulary : [],
            textHighlights: Array.isArray(data.textHighlights) ? data.textHighlights : [],
            lastSyncedAt: data.lastSyncedAt || new Date().toISOString(),
            updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
          };
          onUpdate(record);
        }
      },
      (err) => {
        console.warn('Snapshot listener notice for member record:', err);
      }
    );
  } catch (err) {
    console.warn('Failed to attach snapshot listener:', err);
    return () => {};
  }
}
