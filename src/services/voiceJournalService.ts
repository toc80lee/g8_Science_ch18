import { ChapterSection, JournalFeedback, VoiceJournalEntry } from '../types';
import { GoogleGenAI } from '@google/genai';

const STORAGE_KEY = 'ch18_voice_journals';
const LIST_STORAGE_KEY = 'ch18_voice_journals_list';

/**
 * Load all stored voice journal entries as an array
 */
export const loadAllVoiceJournalList = (): VoiceJournalEntry[] => {
  try {
    const raw = localStorage.getItem(LIST_STORAGE_KEY);
    const list: VoiceJournalEntry[] = raw ? JSON.parse(raw) : [];

    // Also check legacy single-entry storage if list is empty
    if (list.length === 0) {
      const legacyRaw = localStorage.getItem(STORAGE_KEY);
      if (legacyRaw) {
        const legacyMap: Record<string, VoiceJournalEntry> = JSON.parse(legacyRaw);
        const legacyEntries = Object.values(legacyMap);
        if (legacyEntries.length > 0) {
          localStorage.setItem(LIST_STORAGE_KEY, JSON.stringify(legacyEntries));
          return legacyEntries;
        }
      }
    }
    return list;
  } catch (err) {
    console.error('Failed to load voice journals list:', err);
    return [];
  }
};

/**
 * Get all saved voice journals for a specific section (newest first)
 */
export const getJournalListForSection = (sectionId: string): VoiceJournalEntry[] => {
  const all = loadAllVoiceJournalList();
  return all
    .filter((entry) => entry.sectionId === sectionId)
    .sort((a, b) => (b.recordedAt || 0) - (a.recordedAt || 0));
};

/**
 * Save entry to list and also update legacy latest
 */
export const saveVoiceJournalToList = (entry: VoiceJournalEntry): VoiceJournalEntry[] => {
  try {
    const all = loadAllVoiceJournalList();
    // Check if updating existing
    const existingIndex = all.findIndex((e) => e.id === entry.id);
    let updated: VoiceJournalEntry[];
    if (existingIndex >= 0) {
      updated = [...all];
      updated[existingIndex] = entry;
    } else {
      updated = [entry, ...all];
    }
    localStorage.setItem(LIST_STORAGE_KEY, JSON.stringify(updated));

    // Also update legacy single-entry map
    const legacy = loadAllVoiceJournals();
    legacy[entry.sectionId] = entry;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));

    return updated.filter((e) => e.sectionId === entry.sectionId);
  } catch (err) {
    console.error('Failed to save voice journal to list:', err);
    return getJournalListForSection(entry.sectionId);
  }
};

/**
 * Delete a voice journal entry by ID
 */
export const deleteVoiceJournalFromList = (
  sectionId: string,
  entryId: string
): VoiceJournalEntry[] => {
  try {
    const all = loadAllVoiceJournalList();
    const updated = all.filter((e) => e.id !== entryId);
    localStorage.setItem(LIST_STORAGE_KEY, JSON.stringify(updated));

    // Also update legacy latest if needed
    const remainingForSection = updated.filter((e) => e.sectionId === sectionId);
    const legacy = loadAllVoiceJournals();
    if (remainingForSection.length > 0) {
      legacy[sectionId] = remainingForSection[0];
    } else {
      delete legacy[sectionId];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));

    return remainingForSection;
  } catch (err) {
    console.error('Failed to delete voice journal entry:', err);
    return getJournalListForSection(sectionId);
  }
};

/**
 * Load all stored voice journals from localStorage (Legacy map)
 */
export const loadAllVoiceJournals = (): Record<string, VoiceJournalEntry> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to load voice journals:', err);
    return {};
  }
};

/**
 * Save a single journal entry (Legacy)
 */
export const saveVoiceJournal = (entry: VoiceJournalEntry): void => {
  saveVoiceJournalToList(entry);
};

/**
 * Get the latest journal for a specific section (Legacy)
 */
export const getJournalForSection = (sectionId: string): VoiceJournalEntry | null => {
  const list = getJournalListForSection(sectionId);
  return list.length > 0 ? list[0] : null;
};

/**
 * Delete a journal entry for a section (Legacy)
 */
export const deleteVoiceJournal = (sectionId: string): void => {
  try {
    const all = loadAllVoiceJournalList();
    const updated = all.filter((e) => e.sectionId !== sectionId);
    localStorage.setItem(LIST_STORAGE_KEY, JSON.stringify(updated));

    const legacy = loadAllVoiceJournals();
    delete legacy[sectionId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
  } catch (err) {
    console.error('Failed to delete voice journal:', err);
  }
};

/**
 * Convert audio blob to base64 Data URL for persistent storage in localStorage
 */
export const blobToDataUrl = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Deterministic science curriculum rubric evaluation (Offline & immediate fallback)
 */
export const evaluateJournalOffline = (
  transcript: string,
  section: ChapterSection
): JournalFeedback => {
  const text = transcript.trim().toLowerCase();
  const objectives = section.objectives || [];
  const primaryPage = section.pages[0] || 430;

  // Extract key terms and candidate concepts from objectives and section content
  const conceptsToCheck: { label: string; keywords: string[]; detail: string }[] = [];

  // 1. Check objectives
  objectives.forEach((obj, idx) => {
    const words = obj.split(/[\s,()·/]+/).filter(w => w.length > 1 && !['이해한다', '파악한다', '분석한다', '검토한다', '확인한다'].includes(w));
    conceptsToCheck.push({
      label: `학습 목표 ${idx + 1}: ${obj.slice(0, 35)}...`,
      keywords: words.slice(0, 6).map(w => w.toLowerCase()),
      detail: obj
    });
  });

  // 2. Add section-specific terms
  const titleWords = [...section.titleKo.split(/[\s,()·/]+/), ...section.titleEn.split(/[\s,()·/]+/)].filter(w => w.length > 1);
  conceptsToCheck.push({
    label: `단원 핵심 주제 (${section.titleKo})`,
    keywords: titleWords.map(w => w.toLowerCase()),
    detail: `${section.titleKo}의 핵심 과학 원리와 의미`
  });

  // 3. Add bottom insight
  if (section.interactiveSpec?.bottomInsight) {
    const insightWords = section.interactiveSpec.bottomInsight.split(/[\s,()·/]+/).filter(w => w.length > 2);
    conceptsToCheck.push({
      label: '핵심 탐구 원리 및 시각',
      keywords: insightWords.slice(0, 5).map(w => w.toLowerCase()),
      detail: section.interactiveSpec.bottomInsight
    });
  }

  // Evaluate matches
  const covered: { title: string; detail: string }[] = [];
  const missing: { title: string; detail: string; relatedPage?: number }[] = [];

  conceptsToCheck.forEach((c) => {
    const matchCount = c.keywords.filter(kw => text.includes(kw)).length;
    const isCovered = matchCount >= 1 || (text.length > 40 && c.keywords.some(kw => text.includes(kw.slice(0, 3))));

    if (isCovered) {
      covered.push({
        title: c.label,
        detail: `언급하신 내용에서 '${c.keywords.filter(kw => text.includes(kw)).join(', ') || '관련 과학 개념'}'을(를) 바르게 짚어냈습니다.`
      });
    } else {
      missing.push({
        title: c.label,
        detail: c.detail,
        relatedPage: primaryPage
      });
    }
  });

  // Transcript length factor
  const wordCount = transcript.trim().split(/\s+/).length;
  let rawScore = Math.round((covered.length / Math.max(1, conceptsToCheck.length)) * 100);

  // Bonus for detailed elaboration
  if (wordCount >= 30 && rawScore > 0) rawScore = Math.min(100, rawScore + 15);
  else if (wordCount < 10) rawScore = Math.max(20, Math.min(rawScore, 50));

  // Determine level
  let level: JournalFeedback['level'] = 'growing';
  let levelLabel = '🌱 발전 중';
  let summary = '';

  if (rawScore >= 85) {
    level = 'mastered';
    levelLabel = '🌟 완벽 마스터 (대기과학 우수 달성)';
    summary = `훌륭합니다! ${section.titleKo}의 가장 중요한 학습 목표들을 자신의 말로 명확하게 설명해 냈습니다. 핵심 과학 개념을 깊이 있게 이해하고 있습니다.`;
  } else if (rawScore >= 65) {
    level = 'good';
    levelLabel = '👍 우수 성취 (핵심 개념 파악)';
    summary = `잘하셨습니다! 단원의 주요 뼈대를 잘 이해하고 설명했습니다. 빠진 세부 내용 몇 가지만 챙기면 완벽한 마스터가 될 수 있어요.`;
  } else if (rawScore >= 45) {
    level = 'growing';
    levelLabel = '🌱 성장 중 (주요 개념 보완 추천)';
    summary = `좋은 시작입니다! 단원의 핵심 줄기를 언급하셨지만, 아직 교재의 몇 가지 중요한 과학 용어와 원리가 빠져 있습니다.`;
  } else {
    level = 'review_needed';
    levelLabel = '📖 교재 복습 추천';
    summary = `말씀하신 내용이 다소 짧거나 단원 핵심 개념과 차이가 있습니다. 교재 본문과 삽화 도표를 천천히 다시 읽은 후 재도전해 보세요!`;
  }

  // Tailored study guides
  const studyGuide: { step: string; action: string; linkHint?: string }[] = [];

  if (missing.length > 0) {
    const firstMissing = missing[0];
    studyGuide.push({
      step: '1단계: 놓친 핵심 개념 다시 읽기',
      action: `교재 p.${primaryPage}로 돌아가서 "${firstMissing.title}" 관련 문단을 소리내어 다시 읽어보세요.`,
      linkHint: 'textbook'
    });
  }

  studyGuide.push({
    step: '2단계: 추천 영상 & 인터랙티브 실습 확인',
    action: '본문 아래의 추천 영상 또는 탐구 실습을 직접 조작하며 시각적으로 현상을 눈에 익혀보세요.',
    linkHint: 'media'
  });

  if (section.questions && section.questions.length > 0) {
    studyGuide.push({
      step: '3단계: 형성 평가 문제 풀기',
      action: `이 섹션의 복습 퀴즈를 풀면서 내가 말한 내용이 문제로 어떻게 출제되는지 점검해보세요.`,
      linkHint: 'quiz'
    });
  }

  return {
    score: rawScore,
    level,
    levelLabel,
    summary,
    coveredPoints: covered,
    missingPoints: missing,
    studyGuide
  };
};

/**
 * Intelligent AI analysis using Gemini API (@google/genai) with fallback
 */
export const analyzeVoiceJournalWithAI = async (
  transcript: string,
  section: ChapterSection
): Promise<JournalFeedback> => {
  // If transcript is very short
  if (!transcript || transcript.trim().length < 5) {
    return {
      score: 10,
      level: 'review_needed',
      levelLabel: '📖 내용 입력 필요',
      summary: '녹음된 내용이나 입력된 텍스트가 너무 짧습니다. 배운 내용을 한두 문장 이상으로 말해보세요.',
      coveredPoints: [],
      missingPoints: section.objectives.map((obj, i) => ({
        title: `목표 ${i + 1}`,
        detail: obj,
        relatedPage: section.pages[0]
      })),
      studyGuide: [
        {
          step: '다시 녹음하기',
          action: '마이크 버튼을 누르고 "이 단원에서는 ~을 배웠고 ~가 신기했어요"라고 말해보세요.'
        }
      ]
    };
  }

  // Attempt Gemini API if available
  const apiKey = 
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    '';

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
당신은 중학교 2학년 지구과학(Chapter 18 Earth's Atmosphere: 지구의 대기)을 가르치는 전문적이고 따뜻한 과학 선생님입니다.
학생이 방금 "${section.titleKo} (${section.titleEn})" 섹션을 스스로 공부한 후, 녹음기를 켜고 자신이 무엇을 배웠는지 이야기했습니다.

[교과서 단원 정보]
- 단원명: ${section.titleKo} (${section.titleEn})
- 교재 페이지: p.${section.pages.join(', ')}
- 이번 단원의 필수 학습 목표:
${section.objectives.map((o, i) => `  ${i + 1}. ${o}`).join('\n')}
- 단원 핵심 원리 및 통찰:
${section.interactiveSpec?.bottomInsight || '대기의 물리적/화학적 구조와 생명 보호 기능'}

[학생이 말한 녹음 내용]
"""
${transcript}
"""

[지시 사항]
학생이 이번 단원에서 배워야 할 내용들을 다 배웠는지 안 배웠는지를 정확하게 판단하고,
앞으로 어떻게 공부하면 좋을지 구체적인 가이드를 제공하세요.
반드시 아래 JSON 포맷으로만 응답하세요:
{
  "score": 85, // 0~100 사이의 종합 성취도 점수
  "level": "mastered" | "good" | "growing" | "review_needed", // 85이상: mastered, 65~84: good, 45~64: growing, 45미만: review_needed
  "levelLabel": "🌟 완벽 마스터" or "👍 우수 성취" or "🌱 성장 중" or "📖 교재 복습 추천",
  "summary": "학생에게 건네는 따뜻하고 명확한 1~2줄 총평",
  "coveredPoints": [
    { "title": "잘 파악한 핵심 개념 이름", "detail": "학생이 무엇을 어떻게 바르게 설명했는지 칭찬과 과학적 설명" }
  ],
  "missingPoints": [
    { "title": "아직 언급하지 않은 중요 개념", "detail": "이 개념이 왜 이번 단원에서 중요한지, 무엇을 추가로 알아야 하는지", "relatedPage": ${section.pages[0]} }
  ],
  "studyGuide": [
    { "step": "1단계: 추천 행동", "action": "교재 특정 페이지나 도표를 보며 복습할 방법", "linkHint": "textbook" | "media" | "quiz" }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text?.trim() || '';
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return {
          score: typeof parsed.score === 'number' ? parsed.score : 75,
          level: parsed.level || 'good',
          levelLabel: parsed.levelLabel || '👍 우수 성취',
          summary: parsed.summary || '학습 내용을 충실히 정리했습니다.',
          coveredPoints: Array.isArray(parsed.coveredPoints) ? parsed.coveredPoints : [],
          missingPoints: Array.isArray(parsed.missingPoints) ? parsed.missingPoints : [],
          studyGuide: Array.isArray(parsed.studyGuide) ? parsed.studyGuide : []
        };
      }
    } catch (apiError) {
      console.warn('Gemini API evaluation failed or not reachable, using offline rubric engine:', apiError);
    }
  }

  // Reliable offline curriculum rubric analysis
  return evaluateJournalOffline(transcript, section);
};
