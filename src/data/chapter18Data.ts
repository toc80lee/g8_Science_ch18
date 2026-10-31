import { ChapterSection } from '../types';
import { sections18A } from './sections18A';
import { sections18B } from './sections18B';
import { sections18C } from './sections18C';
import { 
  questions18A, 
  questions18B, 
  questions18C, 
  fullChapterReviewQuestions, 
  chapterSummaryPoints, 
  keyTermsList 
} from './reviewAndGlossary';

export const reviewSection18A: ChapterSection = {
  id: 'sec-18a-review',
  category: '18A',
  numberBadge: 'Q',
  lessonTag: '18A · 복습 평가',
  titleKo: '18A 단원 복습 질문 (Questions 1~9 풀이 & 해설)',
  titleEn: 'Section 18A Review (Questions 1–9)',
  breadcrumb: '18A · Section 18A Review · 18A 복습',
  pages: [438, 439],
  objectives: [
    '18A 단원의 핵심 개념(대기 정의, 오랜 지구/젊은 지구 기원, 동질권/이질권, 5대 온도층, 탄소/질소 순환)을 종합 점검한다.',
    '교재 438~439쪽의 9개 복습 질문을 풀고 즉각적인 모범 답안과 해설을 확인한다.'
  ],
  interactiveSpec: {
    type: 'quiz_interactive',
    missionTitle: '미션 18A · 단원 형성 평가 9문항 실시간 풀이',
    missionNumber: '18A-Q',
    stepTotal: 9,
    tabs: [
      {
        id: 'quiz-all',
        label: '① 전체 9문항 풀이 모드',
        codeSnippet: `// 18A 복습 9문항 데이터
const Section18A_Quiz = {
  totalQuestions: 9,
  coverage: ["오염 감소 방안", "기원 두 모델", "성분층 구분", "대류권 특성", "제트기류", "중간권", "열권", "질소 고정", "온도 변화 T/F"],
  passingScore: "80% 이상"
};`,
        description: '교재 18A의 9개 질문을 직접 풀고 정답과 상세 해설을 확인합니다.'
      }
    ],
    defaultTabId: 'quiz-all',
    bottomInsight: '18A의 핵심은 대기가 생명 유지를 위해 완벽하게 설계된 동질권과 이질권, 그리고 고도별 5개 기온층으로 이루어져 있다는 점입니다.'
  },
  contentKo: [
    '18A 단원을 마무리하며 교재 438~439쪽에 수록된 9개의 공식 복습 질문(Review Questions)을 해결합니다.',
    '각 질문을 클릭하여 답변을 작성하거나 선택지를 클릭하면 즉시 정답 여부와 상세한 교과 해설을 확인할 수 있습니다.'
  ],
  contentEn: [
    'Test your understanding of Section 18A with these 9 official textbook review questions from pages 438-439.',
    'Solve each question to check your knowledge of atmospheric regions, lapse rates, and nutrient cycles.'
  ],
  questions: questions18A
};

export const reviewSection18B: ChapterSection = {
  id: 'sec-18b-review',
  category: '18B',
  numberBadge: 'Q',
  lessonTag: '18B · 복습 평가',
  titleKo: '18B 단원 복습 질문 (Questions 1~8 풀이 & 해설)',
  titleEn: 'Section 18B Review (Questions 1–8)',
  breadcrumb: '18B · Section 18B Review · 18B 복습',
  pages: [444],
  objectives: [
    '18B 단원의 3대 특수 구역(오존층, 전리층, 자기권)의 위치와 기능을 총정리한다.',
    '교재 444쪽의 8개 복습 질문을 풀고 해설을 통해 개념을 정립한다.'
  ],
  interactiveSpec: {
    type: 'quiz_interactive',
    missionTitle: '미션 18B · 특수 구역 형성 평가 8문항 풀이',
    missionNumber: '18B-Q',
    stepTotal: 8,
    tabs: [
      {
        id: 'quiz-all',
        label: '① 전체 8문항 풀이 모드',
        codeSnippet: `// 18B 복습 8문항 데이터
const Section18B_Quiz = {
  totalQuestions: 8,
  coverage: ["3대 특수 구역", "생명 보호 역할", "오존 형성 메커니즘", "오존층 우려", "NASA 마이크로파", "밴앨런대 포획", "방사선 회피 3방식", "전리층 T/F"]
};`,
        description: '오존층, 전리층, 자기권, 밴앨런대, 오로라에 대한 공식 질문들을 해결합니다.'
      }
    ],
    defaultTabId: 'quiz-all',
    bottomInsight: '18B 특수 구역들은 유해 자외선 흡수(오존층), 장거리 전파 반사(전리층), 치명적 태양풍 차단(자기권)으로 지구 생명체를 완벽하게 보호합니다.'
  },
  contentKo: [
    '18B 단원 공식 복습 질문(교재 444쪽) 8문항입니다.',
    '오존층의 생성 화학 반응, 프레온가스의 영향, 전리층의 마이크로파 투과, 밴앨런 복사대의 차폐 방안을 직접 풀어보세요.'
  ],
  contentEn: [
    'Section 18B Review Questions from page 444 covering the Ozone Layer, Ionosphere, and Magnetosphere.'
  ],
  questions: questions18B
};

export const reviewSection18C: ChapterSection = {
  id: 'sec-18c-review',
  category: '18C',
  numberBadge: 'Q',
  lessonTag: '18C · 복습 평가',
  titleKo: '18C 단원 복습 질문 (Questions 1~7 풀이 & 해설)',
  titleEn: 'Section 18C Review (Questions 1–7)',
  breadcrumb: '18C · Section 18C Review · 18C 복습',
  pages: [449],
  objectives: [
    '태양 상수, 대기 에너지 수지(반사·흡수 비율), 열전달 3방식, 온실 효과의 원리를 총점검한다.',
    '교재 449쪽의 7개 복습 질문을 풀고 온실 효과의 중요성을 확인한다.'
  ],
  interactiveSpec: {
    type: 'quiz_interactive',
    missionTitle: '미션 18C · 대기 에너지 평가 7문항 풀이',
    missionNumber: '18C-Q',
    stepTotal: 7,
    tabs: [
      {
        id: 'quiz-all',
        label: '① 전체 7문항 풀이 모드',
        codeSnippet: `// 18C 복습 7문항 데이터
const Section18C_Quiz = {
  totalQuestions: 7,
  coverage: ["복사 에너지 종류", "태양 상수 정의/위치", "에너지 수지 도해", "복사·전도·대류 비교", "온실 효과 서술", "2대 온실가스", "흐린 날 기온 T/F"]
};`,
        description: '태양 복사, 대기 가열 3방식, 온실가스의 역할을 테스트합니다.'
      }
    ],
    defaultTabId: 'quiz-all',
    bottomInsight: '대기는 직접 햇빛에 의해 가열되기보다 지표면이 흡수한 에너지를 복사·전도·대류를 거쳐 온실가스가 포획함으로써 지구 기온을 생명체에 적합하게 유지합니다.'
  },
  contentKo: [
    '18C 단원 공식 복습 질문(교재 449쪽) 7문항입니다.',
    '태양 상수(1.367 kW/m²), 에너지 분배율(32% 반사, 18% 대기 흡수, 50%+ 지표 흡수), 온실 효과의 작동 방식을 점검하세요.'
  ],
  contentEn: [
    'Section 18C Review Questions from page 449 covering radiant energy, heat transfer methods, and the greenhouse effect.'
  ],
  questions: questions18C
};

export const summaryAndTermsSection: ChapterSection = {
  id: 'sec-summary-terms',
  category: 'review',
  numberBadge: '요약',
  lessonTag: '단원 총괄 · 요약 & 용어',
  titleKo: 'Chapter 18 핵심 요약 (12포인트) & 21개 주요 용어 사전',
  titleEn: 'Chapter 18 Summary & Key Terms Glossary',
  breadcrumb: 'Chapter 18 · 총괄 · 요약 및 핵심 용어',
  pages: [450],
  objectives: [
    '교재 450쪽에 수록된 12개 단원 핵심 요약 포인트를 일목요연하게 복습한다.',
    '450쪽의 21개 필수 핵심 용어(Key Terms)의 정의와 교재 페이지를 암기하고 점검한다.'
  ],
  interactiveSpec: {
    type: 'code_preview',
    missionTitle: '미션 18-총괄 · 21개 핵심 용어 플래시카드 & 요약 브라우저',
    missionNumber: '18-Summary',
    stepTotal: 2,
    tabs: [
      {
        id: 'summary',
        label: '① 단원 핵심 요약 12포인트',
        codeSnippet: `// Chapter 18 핵심 요약 정리
${chapterSummaryPoints.map((pt, i) => `// ${i + 1}. ${pt}`).join('\n')}`,
        description: 'Chapter 18의 12대 핵심 요약 명제들을 정독합니다.'
      },
      {
        id: 'terms',
        label: '② 21개 핵심 용어 색인',
        codeSnippet: `// Chapter 18 주요 용어 사전 (21 Key Terms)
const keyTermsCount = 21;
// atmosphere, homosphere, heterosphere, troposphere, lapse rate,
// stratosphere, jet stream, mesosphere, thermosphere, exosphere,
// ozone layer, ionosphere, magnetosphere, solar constant, radiation,
// conduction, convection, greenhouse effect, greenhouse gas...`,
        description: '교재 450쪽에 등재된 모든 핵심 용어들의 정확한 정의를 확인합니다.'
      }
    ],
    defaultTabId: 'summary',
    bottomInsight: '대기(Atmosphere)는 물질 순환(탄소/질소)과 다층 방어막(오존/전리/자기권), 그리고 정밀한 열 순환(온실효과)을 통해 인류의 삶을 온전히 지탱하고 있습니다.'
  },
  contentKo: [
    '교재 450쪽의 Chapter 18 Summary(12개 핵심 요약) 및 Key Terms(21개 주요 과학 용어) 전문입니다.',
    '아래의 요약과 용어 사전을 통해 대기과학의 기초 원리를 확립하세요.'
  ],
  contentEn: [
    'Complete Chapter 18 Summary with 12 key takeaways and 21 Key Terms glossary from page 450.'
  ]
};

export const fullReviewQuestionsSection: ChapterSection = {
  id: 'sec-chapter-review-30',
  category: 'review',
  numberBadge: '30제',
  titleKo: 'Chapter 18 단원 종합 복습 문제 (1~30번 전체 수록)',
  titleEn: 'Chapter 18 Review (Questions 1–30)',
  breadcrumb: 'Chapter 18 · Chapter 18 Review · 종합 평가 1~30',
  pages: [450, 451],
  objectives: [
    '교재 450~451쪽의 30문항(1~19번 서술/주관식, 20~30번 True/False)을 완벽히 마스터한다.',
    '즉각적인 정답 확인, 교과서 페이지 참조, 상세 해설을 통해 시험 대비 역량을 완성한다.'
  ],
  interactiveSpec: {
    type: 'quiz_interactive',
    missionTitle: '미션 18-최종 · 30문항 종합 마스터 테스트',
    missionNumber: '18-Final',
    stepTotal: 30,
    tabs: [
      {
        id: 'full-30',
        label: '① 전체 30문항 종합 풀이',
        codeSnippet: `// Chapter 18 전체 30문항 구성
const ChapterReview30 = {
  shortAndEssay: "1번 ~ 19번: 개념, 원리, 계산, 기원 비교",
  trueFalse: "20번 ~ 30번: 교과서 진위 판별 문항",
  totalCount: 30
};`,
        description: '교재 450~451쪽의 모든 문제를 빠짐없이 풀고 성적표를 확인합니다.'
      }
    ],
    defaultTabId: 'full-30',
    bottomInsight: '전체 30문항을 통해 지구 대기의 구조, 화학적 조성, 열전달 메커니즘, 기원에 대한 세계관 비교, 그리고 청지기적 책임까지 완벽하게 총괄 정리할 수 있습니다.'
  },
  contentKo: [
    '교재 450~451쪽에 실려 있는 Chapter 18 Review 30문항 전체입니다.',
    '1번부터 19번까지의 서술형 및 단답형 문제, 20번부터 30번까지의 True/False 문항이 모두 포함되어 있으며 각 문항마다 상세 해설과 정답이 제공됩니다.'
  ],
  contentEn: [
    'Full Chapter 18 Review Questions 1 through 30 from pages 450-451, including both conceptual/essay questions (1-19) and True/False questions (20-30).'
  ],
  questions: fullChapterReviewQuestions
};

export const allChapterSections: ChapterSection[] = [
  ...sections18A,
  reviewSection18A,
  ...sections18B,
  reviewSection18B,
  ...sections18C,
  reviewSection18C,
  summaryAndTermsSection,
  fullReviewQuestionsSection
];
