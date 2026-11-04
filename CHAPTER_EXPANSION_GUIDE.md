# Chapter 18 기반 멀티 단원(Chapter 19, 20, 21+) 확장 개발 가이드라인

본 문서는 **Chapter 18 (지구의 대기)** 학습 플랫폼의 검증된 구조와 UX를 100% 보존하면서, 향후 **Chapter 19(수권), Chapter 20(지권), Chapter 21(우주와 천체)** 등 새로운 단원을 신속하고 안전하게 추가·확장할 수 있도록 표준화된 데이터 구조, 컴포넌트 재사용 규칙, 그리고 Firebase 클라우드 연동 가이드를 제시합니다.

---

## 1. 플랫폼 아키텍처 원칙 (Core Architecture)

```
[ Data Layer (단원별 분리) ]
  ├── chapter18Data.ts / sections18A~C / review18 / images18
  ├── chapter19Data.ts / sections19A~C / review19 / images19  <-- 신규 추가
  └── chaptersRegistry.ts (모든 단원 중앙 등록소)
              │
              ▼
[ Core Engine (100% 재사용) ]
  ├── TextbookReader (한·영 대조, 직접/간접 형광펜, TTS 원어민 오디오, 라이트박스)
  ├── ActivityTabStrip & InteractiveCard (인터랙티브 시뮬레이터 엔진)
  ├── QuizView (객관식·주관식·진위형 채점 및 해설 모달)
  ├── SelfLearningVoiceJournal (음성 녹음 및 AI 루브릭 진단)
  ├── StudyBlogSection (Firebase 연동 전체 공유 학습 정리 및 댓글)
  └── ChapterSummaryTermsSection (핵심 용어 사전 & 종합 30제)
              │
              ▼
[ Firebase Firestore & Local Cache ]
  ├── users/{userId} (회원 계정)
  ├── learning_records/{userId} (단원별 퀴즈점수, 완료율, 하이라이트, 단어장)
  └── study_summaries/{summaryId} (단원별 sectionId / chapterId 필터링)
```

### 3대 설계 원칙
1. **단원 불가지론적 뷰 엔진 (Chapter-Agnostic Engine)**:  
   `TextbookReader`, `StudyBlogSection`, `QuizView` 등 모든 핵심 UI 컴포넌트는 특정 단원의 하드코딩된 텍스트를 갖지 않고, 넘겨받은 `ChapterSection` 및 `ChapterMeta` 데이터 객체만을 기반으로 렌더링됩니다.
2. **단원별 독립 모듈화 (Modular Data Strategy)**:  
   단원별 텍스트, 교재 삽화, 퀴즈, 핵심 용어를 독립된 파일로 격리하여 신규 단원 추가 시 기존 단원의 코드나 데이터가 손상되지 않습니다.
3. **단일 스키마 & 복합 네임스페이스 (Unified Cloud Schema)**:  
   Firebase Firestore 컬렉션(`study_summaries`, `learning_records`)은 단원이 추가되어도 스키마 변경 없이 `chapterId`와 `sectionId` 파티셔닝으로 통합 관리됩니다.

---

## 2. 데이터 구조화 방법 (Data Architecture)

### 2.1 공통 타입 확장 (`src/types.ts`)

단원 구분을 위해 카테고리(`SectionCategory`)와 챕터 메타데이터(`ChapterMeta`)를 범용적으로 정의합니다.

```typescript
// 1. 단원 메타데이터 인터페이스
export interface ChapterMeta {
  chapterNumber: number;          // 예: 18, 19, 20
  chapterTitleKo: string;         // 예: '지구의 대기', '지구의 수권과 해양'
  chapterTitleEn: string;         // 예: "The Atmosphere", "The Hydrosphere"
  totalSections: number;
  subCategories: {
    key: string;                  // 예: '19A', '19B', '19C'
    labelKo: string;              // 예: '19A 해양의 구조'
    labelEn: string;              // 예: '19A Ocean Structure'
  }[];
}

// 2. 섹션 카테고리 (동적 문자열 또는 템플릿 리터럴 확장 허용)
export type SectionCategory = 
  | 'intro'
  | 'review'
  | string; // '18A' | '18B' | '19A' | '19B' 등 단원별 파티션 지원

// 3. 단원 섹션 인터페이스 (ChapterSection)
export interface ChapterSection {
  id: string;                     // 고유 식별자 (예: 'sec-19-1-ocean-intro')
  chapterNumber?: number;         // 단원 번호 (예: 19)
  category: SectionCategory;      // 세부 범주 (예: '19A')
  numberBadge: string;            // UI 뱃지 (예: '1', '2', 'Q', '★')
  titleKo: string;                // 한국어 제목
  titleEn: string;                // 영어 교재 제목
  breadcrumb: string;             // 네비게이션 경로
  pages: number[];                // 교재 원본 페이지 (예: [450, 451])
  objectives: string[];           // 학습 목표 목록
  interactiveSpec: InteractiveSpec; // 대화형 탐구/시뮬레이션 스펙
  contentKo: string[];            // 문단별 한국어 정밀 번역
  contentEn: string[];            // 문단별 영어 원문 텍스트
  sidebar?: {                     // (선택) 교재 심화 박스
    titleKo: string;
    titleEn: string;
    contentKo: string[];
    contentEn: string[];
  };
  marginNotes?: MarginNote[];     // (선택) 교재 여백 필기 노트
  questions?: ReviewQuestion[];   // (선택) 섹션 확인 문제
}
```

---

### 2.2 디렉터리 구성 권장안

단원이 늘어남에 따라 `src/data/` 내부를 챕터별 폴더로 분리하는 구조가 가장 깔끔하고 유지보수가 용이합니다.

```
src/data/
├── chapters/
│   ├── chapter18/
│   │   ├── sections18A.ts
│   │   ├── sections18B.ts
│   │   ├── sections18C.ts
│   │   ├── reviewAndGlossary18.ts
│   │   ├── textbookPageImages18.ts
│   │   └── index.ts
│   ├── chapter19/               <-- 신규 단원 폴더
│   │   ├── sections19A.ts
│   │   ├── sections19B.ts
│   │   ├── reviewAndGlossary19.ts
│   │   ├── textbookPageImages19.ts
│   │   └── index.ts
│   └── index.ts                 <-- 전체 챕터 레지스트리 (모든 단원 Export)
├── mindMapData.ts
└── relatedMediaData.ts
```

---

### 2.3 교재 스캔 이미지 매핑 규약 (`textbookPageImages.ts`)

각 페이지 번호(`pageNumber`)를 키로 고해상도 스캔 이미지와 핵심 도표 설명을 매핑합니다.

```typescript
export interface PageImageInfo {
  pageNumber: number;
  chapterNumber: number;
  imageSrc: string;              // 정적 이미지 경로 또는 CDN URL
  title: string;
  keyIllustrations: string[];    // 해당 페이지의 핵심 도표/삽화 해설 포인트
}

// 챕터별 이미지 맵 결합
export const allPageImages: Record<number, PageImageInfo> = {
  // Chapter 18: pages 426 ~ 455
  428: {
    pageNumber: 428,
    chapterNumber: 18,
    imageSrc: '/assets/textbook/ch18/p428.png',
    title: '대기의 기원과 구성 층',
    keyIllustrations: ['동질권과 이질권 경계', '고도별 대기압 변화 도표']
  },
  // Chapter 19: pages 456 ~ 480 (신규 확장 예시)
  456: {
    pageNumber: 456,
    chapterNumber: 19,
    imageSrc: '/assets/textbook/ch19/p456.png',
    title: '해수의 염분과 온도 분포',
    keyIllustrations: ['혼합층, 수온약층, 심해층 3단계 구조', '위도별 염분도 그래프']
  }
};
```

---

### 2.4 과학 용어 한·영 매칭 사전 확장 (`src/utils/bilingualMatcher.ts`)

새 단원의 주요 학술 용어를 사전에 추가하면, 학생이 한국어 교재에서 단어를 형광펜으로 칠했을 때 영어 원문의 해당 용어가 자동으로 감지되어 한·영 동시 하이라이트가 작동합니다.

```typescript
export const BILINGUAL_SCIENCE_DICTIONARY: Record<string, string[]> = {
  // [Chapter 18 대기]
  '대기': ['atmosphere', "earth's atmosphere"],
  '대류권': ['troposphere'],
  
  // [Chapter 19 수권 - 신규 추가]
  '수권': ['hydrosphere'],
  '혼합층': ['mixed layer'],
  '수온약층': ['thermocline'],
  '심해층': ['deep zone', 'deep layer'],
  '염분': ['salinity'],
  '해류': ['ocean current', 'currents']
};
```

---

## 3. 핵심 컴포넌트 재사용 규칙 (Component Reuse)

기존 Chapter 18에서 개발된 강력한 학습 도구들은 어떤 수정도 없이 새 단원에 그대로 주입됩니다.

### 3.1 교재 뷰어 (`<TextbookReader />`)
* **역할**: 한·영 문단 대조, 단어 드래그 사전 등록, 직접/간접 형광펜(투명도 차등 적용), 원어민 TTS 오디오, 초고화질 스캔본 라이트박스 지원.
* **재사용 방법**:
```tsx
<TextbookReader
  section={currentActiveSection}             // Chapter 19의 섹션 전달
  customWords={customWords}
  highlights={textHighlights}
  onAddCustomWord={handleAddCustomWord}
  onSaveHighlight={handleSaveHighlight}
  onDeleteHighlight={handleDeleteHighlight}
/>
```
* **주의사항**:
  - `section.contentKo`와 `section.contentEn` 문단 배열의 순서와 문맥이 1:1로 대응되도록 데이터를 구성해야 TTS 및 대조 모드가 매끄럽게 동작합니다.

---

### 3.2 공유 학습 정리 및 댓글 (`<StudyBlogSection />`)
* **역할**: 학생이 학습한 내용을 정리하여 저장하면 Firebase Firestore에 동기화되어 모든 학생 및 학부모가 열람하고 피드백 댓글을 나눌 수 있습니다.
* **레이아웃 순서 규약**:  
  사용자 피드백에 따라 **[기록된 학습 정리 목록]이 상단**에 위치하고, **[나의 학습 정리 작성창]이 하단**에 위치하도록 표준화되어 있습니다.
* **재사용 방법**:
```tsx
<StudyBlogSection
  section={currentActiveSection}             // 각 단원 섹션 자동 연동
  user={currentUser}
  onOpenAuthModal={() => setIsAuthModalOpen(true)}
/>
```
* **데이터 격리 원칙**:
  `sectionId`(`sec-19-1`, `sec-19-2` 등)를 기준으로 Firestore 쿼리(`where('sectionId', '==', section.id)`)가 실행되므로 단원 간 데이터 혼선이 발생하지 않습니다.

---

### 3.3 음성 학습 일기 (`<SelfLearningVoiceJournal />`)
* **역할**: 학생이 마이크로 음성 녹음을 진행하면 텍스트로 자동 변환되고, 단원의 핵심 개념이 포함되었는지 AI 루브릭 진단을 수행합니다.
* **재사용 방법**:
```tsx
<SelfLearningVoiceJournal
  section={currentActiveSection}
  onSaveJournal={handleSaveVoiceJournal}
  savedJournals={sectionVoiceJournals}
/>
```

---

### 3.4 인터랙티브 시각화 시뮬레이터 (`<VisualSimulator />`)
* **역할**: 단원별 과학 원리를 조작형 그래픽으로 시뮬레이션합니다.
* **확장 규칙**:
  `InteractiveSpec.type`에 새 단원의 시뮬레이터 타입을 추가하고, `VisualSimulator.tsx`의 `switch-case`에 렌더러를 연결합니다.
  ```typescript
  // types.ts
  export type InteractiveSpecType =
    | 'atmosphere_layers'   // Ch.18 대기층
    | 'greenhouse_sim'      // Ch.18 온실효과
    | 'ocean_currents_sim'  // Ch.19 해류 순환 (신규)
    | 'salinity_calc';      // Ch.19 염분 계산기 (신규)
  ```

---

## 4. Firebase Firestore 연동 및 설정 규약

### 4.1 컬렉션 구조 및 멀티 단원 네임스페이스

| 컬렉션명 | Document ID | 주요 필드 | 설명 |
| :--- | :--- | :--- | :--- |
| **`users`** | `{userId}` | `uid`, `email`, `displayName`, `role`, `createdAt` | 가입 회원 기본 프로필 |
| **`learning_records`** | `{userId}` | `completedSectionIds`, `quizScores`, `customVocabulary`, `textHighlights`, `updatedAt` | 회원별 개인 학습 진행 이력 |
| **`study_summaries`** | `{summaryId}` | `id`, `chapterNumber`, `sectionId`, `title`, `content`, `authorId`, `authorName`, `createdAt`, `likes` | 전체 공개 학습 정리 게시글 |
| **`study_summaries/{id}/comments`** | `{commentId}` | `summaryId`, `authorId`, `authorName`, `content`, `createdAt` | 게시글별 댓글 |

> **중요 (Firestore 다중 단원 필터링)**:  
> `study_summaries` 문서 저장 시 `sectionId` 외에 `chapterNumber`(예: 18, 19, 20)를 필드로 함께 보관하면, 향후 단원별 모아보기 쿼리(`where('chapterNumber', '==', 19)`)를 최적화할 수 있습니다.

---

### 4.2 보안 규칙 (`firestore.rules`) 검증

현재 프로젝트의 `firestore.rules`는 구조적 유효성 검증(Validation Rule)을 통해 안전하게 작성되어 있습니다. 단원이 추가되어도 규칙 수정 없이 그대로 사용할 수 있습니다.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 1. 회원 프로필
    match /users/{userId} {
      allow read, write: if isValidId(userId);
    }

    // 2. 회원별 학습 이력
    match /learning_records/{userId} {
      allow read, write: if isValidId(userId);
    }

    // 3. 공유 학습 정리 (단원 구분 없이 sectionId 기반 유효성 통과 시 허용)
    match /study_summaries/{summaryId} {
      allow get, list: if true;
      allow create, update: if isValidId(summaryId) && isValidSummary(incoming());
      allow delete: if isValidId(summaryId);

      // 댓글 서브컬렉션
      match /comments/{commentId} {
        allow get, list: if true;
        allow create: if isValidId(commentId) && isValidComment(incoming(), summaryId);
        allow delete: if isValidId(commentId);
      }
    }
  }
}
```

---

### 4.3 로컬 스토리지 오프라인 캐시 키 네임스페이스 규칙

네트워크 오프라인 상태에서도 학습 내용이 유실되지 않도록 브라우저 `localStorage`를 사용합니다. 단원 확장을 위해 키 접두사를 동적 함수로 관리합니다:

```typescript
// src/utils/storageKeys.ts
export const getStorageKey = (chapterNumber: number, feature: string) => {
  return `ch${chapterNumber}_${feature}`;
};

// 사용 예시
localStorage.getItem(getStorageKey(18, 'completed_sections')); // ch18_completed_sections
localStorage.getItem(getStorageKey(19, 'completed_sections')); // ch19_completed_sections
localStorage.getItem(getStorageKey(19, 'quiz_scores'));         // ch19_quiz_scores
```

---

## 5. 실전 가이드: Chapter 19 신규 단원 추가 5단계

### [1단계] Chapter 19 데이터 파일 생성
`src/data/chapters/chapter19/` 디렉터리에 다음 파일들을 생성합니다:
1. `sections19A.ts`: 19A 해양의 물리적 성질 섹션 배열
2. `sections19B.ts`: 19B 해류와 대양 대순환 섹션 배열
3. `reviewAndGlossary19.ts`: 19단원 핵심 용어 사전 및 형성평가 30문항
4. `textbookPageImages19.ts`: 교재 p.456 ~ p.485 고화질 삽화 및 페이지 정보

### [2단계] 단원 통합 엔트리 작성 (`chapter19Data.ts`)
```typescript
import { ChapterSection, ChapterMeta } from '../../types';
import { sections19A } from './sections19A';
import { sections19B } from './sections19B';
import { questions19A, questions19B, chapterSummaryPoints19 } from './reviewAndGlossary19';

export const chapter19Meta: ChapterMeta = {
  chapterNumber: 19,
  chapterTitleKo: '지구의 수권과 해양',
  chapterTitleEn: 'The Hydrosphere and Oceans',
  totalSections: sections19A.length + sections19B.length + 2,
  subCategories: [
    { key: '19A', labelKo: '19A 해양의 구조', labelEn: '19A Ocean Structure' },
    { key: '19B', labelKo: '19B 해류의 순환', labelEn: '19B Ocean Currents' },
    { key: 'review', labelKo: '19단원 종합 평가', labelEn: 'Chapter 19 Assessment' }
  ]
};

export const allChapter19Sections: ChapterSection[] = [
  ...sections19A,
  ...sections19B,
  // 19단원 종합 복습 섹션
];
```

### [3단계] 단원 중앙 레지스트리 등록 (`src/data/chaptersRegistry.ts`)
```typescript
import { allChapterSections as ch18Sections } from './chapter18Data';
import { allChapter19Sections, chapter19Meta } from './chapters/chapter19';

export interface ChapterRegistryItem {
  meta: ChapterMeta;
  sections: ChapterSection[];
}

export const CHAPTER_REGISTRY: Record<number, ChapterRegistryItem> = {
  18: {
    meta: {
      chapterNumber: 18,
      chapterTitleKo: '지구의 대기',
      chapterTitleEn: 'The Atmosphere',
      totalSections: ch18Sections.length,
      subCategories: [
        { key: '18A', labelKo: '18A 대기의 구조', labelEn: '18A The Atmosphere' },
        { key: '18B', labelKo: '18B 특수 영역', labelEn: '18B Special Regions' },
        { key: '18C', labelKo: '18C 대기 에너지', labelEn: '18C Energy in Atmosphere' }
      ]
    },
    sections: ch18Sections
  },
  19: {
    meta: chapter19Meta,
    sections: allChapter19Sections
  }
};
```

### [4단계] `App.tsx`에 챕터 선택기(Chapter Selector) 연결
상단 헤더에 현재 챕터를 선택할 수 있는 드롭다운 메뉴를 연동합니다:

```tsx
// App.tsx
const [selectedChapterNumber, setSelectedChapterNumber] = useState<number>(18);

// 현재 선택된 챕터의 섹션 목록 도출
const currentChapter = CHAPTER_REGISTRY[selectedChapterNumber];
const sections = currentChapter.sections;
const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];
```

### [5단계] 빌드 및 타입 검증
터미널 또는 IDE에서 빌드 검증을 실행하여 타입 에러가 없는지 확인합니다:
```bash
npm run build
```

---

## 6. 개발 체크리스트 (Quality & Consistency Checklist)

새로운 단원을 배포하기 전 다음 사항을 점검합니다:

- [ ] **Bilingual 1:1 Matching**: `contentKo` 문단 수와 `contentEn` 문단 수가 일치하는가?
- [ ] **Interactive Spec ID**: `interactiveSpec.tabs[].id`가 고유하게 지정되었는가?
- [ ] **Page Image Range**: `pages` 배열에 명시된 페이지 번호가 `textbookPageImages`에 등록되어 있는가?
- [ ] **Glossary Terms**: 신규 단원의 주요 핵심 용어가 `reviewAndGlossary`와 `bilingualMatcher`에 누락 없이 등록되었는가?
- [ ] **Highlighter Distinction**: 형광펜 사용 시 직접 표시 단어(선명)와 간접 매칭 단어(투명도 감소)가 정상 작동하는가?
- [ ] **Study Blog Layout**: 학습 정리 화면에서 저장된 목록이 상단에, 작성 에디터가 하단에 올바르게 위치하는가?
- [ ] **Firestore Persistence**: 새로 등록한 단원의 학습 정리와 댓글이 Firebase에 정상 기록되고 실시간으로 업데이트되는가?
