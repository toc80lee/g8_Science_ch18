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
  correctAnswer: string | number | boolean;
  explanation: string;
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
  lessonTag: string;
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
