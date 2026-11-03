export type SectionCategory = 
  | 'intro'
  | '18A'
  | '18B'
  | '18C'
  | 'review';

export interface ReviewQuestion {
  id: number;
  questionNumber: string;
  type: 'short_answer' | 'multiple_choice' | 'true_false' | 'essay';
  question: string;
  questionEn: string;
  options?: string[];
  optionsEn?: string[];
  correctAnswer: string | number | boolean;
  correctAnswerEn?: string;
  explanation: string;
  explanationEn?: string;
  evidenceQuoteEn?: string;
  evidenceQuoteKo?: string;
  page: number;
}

export interface KeyTerm {
  term: string;
  termEn: string;
  page: number;
  definitionKo: string;
  definitionEn: string;
}

export interface CustomWord {
  id: string;
  word: string;
  meaning: string;
  contextSentence?: string;
  sourceSectionTitle?: string;
  sourcePage?: number;
  addedAt: number;
  isMemorized: boolean;
}

export type HighlightColor = 
  | 'yellow' 
  | 'mint' 
  | 'pink' 
  | 'underline-red' 
  | 'underline-blue';

export interface TextHighlight {
  id: string;
  sectionId: string;
  lang?: 'ko' | 'en';
  paragraphIndex?: number;
  text: string;
  color: HighlightColor;
  createdAt: string | number;
  counterpartId?: string; // Linked highlight in opposite language for bilingual matching
}

export interface MarginNote {
  originalText: string;
  translation: string;
  context: string;
}

export interface InteractiveSpec {
  type: 
    | 'code_preview' 
    | 'atmosphere_layers' 
    | 'planetary_calc' 
    | 'chemical_pie' 
    | 'temperature_graph' 
    | 'carbon_cycle' 
    | 'nitrogen_cycle' 
    | 'ozone_reaction' 
    | 'ionosphere_radio' 
    | 'magnetosphere_solar' 
    | 'heat_transfer' 
    | 'greenhouse_sim'
    | 'quiz_interactive';
  missionTitle: string;
  missionNumber: string;
  stepTotal: number;
  tabs: {
    id: string;
    label: string;
    codeSnippet?: string;
    description: string;
  }[];
  defaultTabId: string;
  bottomInsight: string;
}

export interface ChapterSection {
  id: string;
  category: SectionCategory;
  numberBadge: string;
  titleKo: string;
  titleEn: string;
  breadcrumb: string;
  pages: number[];
  objectives: string[];
  interactiveSpec: InteractiveSpec;
  contentKo: string[];
  contentEn: string[];
  sidebar?: {
    titleKo: string;
    titleEn: string;
    contentKo: string[];
    contentEn: string[];
  };
  marginNotes?: MarginNote[];
  questions?: ReviewQuestion[];
}

export interface JournalFeedback {
  score: number; // 0 to 100
  level: 'mastered' | 'good' | 'growing' | 'review_needed';
  levelLabel: string;
  summary: string;
  coveredPoints: { title: string; detail: string }[];
  missingPoints: { title: string; detail: string; relatedPage?: number }[];
  studyGuide: { step: string; action: string; linkHint?: string }[];
}

export interface VoiceJournalEntry {
  id: string;
  sectionId: string;
  sectionTitleKo: string;
  sectionTitleEn: string;
  recordedAt: number;
  durationSeconds: number;
  transcript: string;
  audioDataUrl?: string;
  feedback: JournalFeedback;
}

export interface BlogComment {
  id: string;
  postId?: string;
  summaryId?: string;
  authorId: string;
  authorEmail?: string;
  authorPhotoUrl?: string;
  authorRole: 'parent' | 'friend' | 'teacher' | 'student';
  authorName: string;
  avatarEmoji?: string;
  content: string;
  createdAt: number;
  likes?: number;
}

export interface BlogPost {
  id: string;
  sectionId: string;
  sectionTitleKo: string;
  sectionTitleEn: string;
  title: string;
  authorId: string;
  authorEmail?: string;
  authorPhotoUrl?: string;
  authorName: string;
  createdAt: number;
  updatedAt?: number;
  content: string;
  tags?: string[];
  understandingLevel?: 'great' | 'good' | 'review_needed';
  imageUrl?: string;
  imageCaption?: string;
  comments: BlogComment[];
  likes: number;
}

export interface MemberProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'parent' | 'teacher';
  schoolGrade?: string;
  createdAt: number;
  lastLoginAt?: number;
}

export interface MemberLearningRecord {
  userId: string;
  userEmail: string;
  displayName: string;
  completedSectionIds: string[];
  visitHistory: Record<string, { title: string; lastVisitedAt: number; count: number }>;
  quizScores: Record<string, { correct: number; total: number; scorePercent: number; updatedAt: number }>;
  customVocabulary: CustomWord[];
  textHighlights: TextHighlight[];
  lastSyncedAt: string;
  updatedAt: number;
}

