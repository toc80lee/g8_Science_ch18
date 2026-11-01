export interface ArticleSection {
  heading: string;
  body: string;
  bulletPoints?: string[];
}

export interface ArticleContent {
  title: string;
  subtitle: string;
  institution: string;
  badgeText: string;
  readingTimeMinutes: number;
  sections: ArticleSection[];
  keyTakeaway: string;
  kidQuestion: {
    question: string;
    answer: string;
  };
}

export interface MediaResource {
  id: string;
  type: 'youtube' | 'blog' | 'agency' | 'interactive';
  title: string;
  source: string;
  sourceTag: string; // e.g. "EBS 중학", "NASA", "기상청", "National Geographic"
  url: string;
  youtubeVideoId?: string; // Verified real YouTube Video ID for inline player and direct link
  thumbnailUrl: string;
  description: string;
  learningPoints: string[];
  durationOrReadTime?: string;
  articleContent?: ArticleContent; // Full in-page readable content for agency/blog
}

export interface SectionMediaInfo {
  sectionId: string;
  conceptSummaryForKids: {
    analogyTitle: string;
    analogyText: string;
    funFact: string;
  };
  resources: MediaResource[];
}

export const relatedMediaBySection: Record<string, SectionMediaInfo> = {
  'intro-killer-air': {
    sectionId: 'intro-killer-air',
    conceptSummaryForKids: {
      analogyTitle: '숨 쉬는 공기가 독가스로 변했던 도노라 사건',
      analogyText: '추운 겨울날 방 안에 문을 꽉 닫고 장작을 피우면 연기가 빠져나가지 못하는 것처럼, 분지 지형과 차가운 공기 역전층이 스모그를 지표면에 가두어버렸습니다.',
      funFact: '1948년 미국 도노라 스모그 사건 이후 전 세계 최초로 현대적인 대기오염 방지법(Clean Air Act)이 만들어졌습니다.'
    },
    resources: [
      {
        id: 'yt-donora-1',
        type: 'youtube',
        title: '[PBS/WQED 다큐] 1948 도노라 스모그 참사와 대기 보전법의 역사',
        source: 'WQED Pittsburgh / PBS Documentary',
        sourceTag: '역사 과학 다큐',
        youtubeVideoId: '8vXHy7RzBnA',
        url: 'https://www.youtube.com/watch?v=8vXHy7RzBnA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
        description: '지구의 공기가 어떻게 생명을 위협하는 독가스로 변했는지 실제 도노라 사건을 다룬 역사적 다큐멘터리입니다.',
        learningPoints: [
          '대기 오염물질(이산화황, 불소 가스)이 갇히게 된 기온 역전 현상 이해',
          '공기의 소중함과 대기 보전의 역사적 전환점 학습'
        ],
        durationOrReadTime: '약 7분 영상'
      },
      {
        id: 'blog-kma-pollution',
        type: 'agency',
        title: '기상청 기상과학관: 대기오염과 역전층 이야기',
        source: '대한민국 기상청 날씨누리',
        sourceTag: '기상청 공식',
        url: 'https://www.weather.go.kr',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80',
        description: '기온 역전층이 형성되면 왜 미세먼지와 스모그가 흩어지지 않고 지표면에 오래 머무는지 알기 쉽게 설명한 어린이 기상 교실입니다.',
        learningPoints: [
          '보통은 높이 올라갈수록 온도가 낮아지지만, 역전층에선 거꾸로 온도가 올라가는 원리',
          '분지 지형에서 공기가 갇히는 기상학적 메커니즘'
        ],
        durationOrReadTime: '읽는 시간 약 4분',
        articleContent: {
          title: '기상청 기상과학관: 대기오염과 역전층(Inversion Layer) 이야기',
          subtitle: '왜 바람 없는 맑고 추운 겨울 아침에 안개와 매연이 지표면에 갇힐까요?',
          institution: '대한민국 기상청 국립기상과학원 대기과학 교실',
          badgeText: '기상청 기상백과 심층자료',
          readingTimeMinutes: 4,
          sections: [
            {
              heading: '1. 정상적인 대기 vs 기온 역전층의 차이',
              body: '보통 맑은 날에는 햇볕을 받은 땅바닥이 데워지면서 아래쪽 공기가 따뜻하고, 높이 올라갈수록 1km당 약 6.5℃씩 기온이 내려갑니다. 따뜻한 공기는 가벼워서 위로 솟구치고, 차가운 공기는 무거워서 아래로 내려오면서 공기가 활발히 섞이는 대류(Convection)가 일어납니다. 덕분에 공장이나 자동차에서 나온 매연도 높은 하늘로 흩어집니다.',
              bulletPoints: [
                '정상 대기: 아래(따뜻함, 가벼움) → 위(차가움, 무거움) = 활발한 대류 현상 발생',
                '역전층 대기: 아래(차가움, 무거움) → 위(따뜻함, 가벼움) = 대류가 완전히 멈춤'
              ]
            },
            {
              heading: '2. 1948년 미국 도노라 스모그 참사의 원인',
              body: '1948년 10월 말 미국 펜실베이니아주 도노라 마을은 모논가힐라 강 골짜기의 움푹 파인 분지 지형이었습니다. 맑고 바람 없는 밤사이 지표면 열이 우주로 빠져나가는 복사 냉각이 극심해지면서 땅바닥에 차가운 공기가 고였습니다. 그 위로 따뜻한 공기층이 덮개처럼 얹혀 "기온 역전층"이 만들어졌고, 아연 제련소와 철강 공장에서 뿜어낸 이산화황과 불소 연기가 마을 전체에 5일 동안 갇혀 20여 명이 숨지고 수천 명이 호흡기 질환을 앓았습니다.',
              bulletPoints: [
                '분지 지형(산으로 둘러싸여 바람이 통하지 않음)',
                '복사 냉각으로 형성된 강력한 지표 역전층',
                '유독 공장 배출 가스가 대기 뚜껑 아래 그대로 누적'
              ]
            },
            {
              heading: '3. 우리 생활 속 관찰 포인트와 건강 수칙',
              body: '추운 겨울날 굴뚝에서 나오는 연기를 유심히 살펴보세요. 연기가 하늘 높이 솟구치지 못하고 지표면 근처에서 납작하게 옆으로 퍼진다면 바로 기온 역전층이 형성되어 대기가 안정되어 있다는 신호입니다. 이럴 때는 미세먼지 수치가 급격히 치솟으므로 야외 격렬한 운동을 자제하고 마스크를 착용해야 합니다.'
            }
          ],
          keyTakeaway: '기온 역전층은 공기 순환을 막는 보이지 않는 뚜껑 역할을 하므로, 분지 지형이나 바람 없는 추운 날 대기오염에 각별한 주의가 필요합니다.',
          kidQuestion: {
            question: '역전층이 생기면 왜 공기가 위로 올라가지 못하나요?',
            answer: '차가운 공기는 밀도가 높아 무겁고, 따뜻한 공기는 밀도가 낮아 가볍습니다. 무거운 찬 공기가 이미 바닥에 깔려있기 때문에 굳이 위로 올라갈 힘이 없어 대기가 꼼짝달싹하지 못하게 됩니다.'
          }
        }
      }
    ]
  },
  'sec-18-1': {
    sectionId: 'sec-18-1',
    conceptSummaryForKids: {
      analogyTitle: '지구 대기는 산소 1컵에 질소 4컵을 섞은 완벽한 칵테일!',
      analogyText: '만약 대기가 100% 산소라면 성냥 하나만 켜도 지구 전체가 불바다가 되었을 것입니다. 질소 78%가 불이 나지 않도록 부드럽게 감싸주고 있습니다.',
      funFact: '우리가 숨 쉬는 공기 1리터 속에는 78%의 질소, 21%의 산소, 0.9%의 아르곤, 그리고 0.04%의 이산화탄소가 들어있습니다.'
    },
    resources: [
      {
        id: 'yt-air-comp',
        type: 'youtube',
        title: '[EBS 과학탐구] 기권의 층상 구조와 지구 대기의 성분비',
        source: 'EBSi 과학탐구',
        sourceTag: 'EBS 중등·고등 필수',
        youtubeVideoId: 'MNDCYZdfCcQ',
        url: 'https://www.youtube.com/watch?v=MNDCYZdfCcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
        description: '지구 대기 78% 질소, 21% 산소의 조성과 대류권-성층권 층상 구조를 그래프와 실험으로 배우는 대표 교과 강의입니다.',
        learningPoints: [
          '기체 조성비 78:21:1 암기 공식과 각 기체의 화학적 성질',
          '아르곤, 헬륨 같은 비활성 기체(Noble Gas)가 공기 중에 존재하는 이유'
        ],
        durationOrReadTime: '약 8분 영상'
      },
      {
        id: 'blog-edunet-air',
        type: 'agency',
        title: '에듀넷 티-클리어: 공기의 무게와 대기압 측정 실험',
        source: '한국교육학술정보원 (KERIS)',
        sourceTag: '에듀넷 백과',
        url: 'https://www.edunet.net',
        thumbnailUrl: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=600&auto=format&fit=crop&q=80',
        description: '토리첼리의 수은 기압계 실험과 공기도 무게가 있다는 사실을 직관적으로 보여주는 초중등 과학 교과학습 자료입니다.',
        learningPoints: [
          '해수면 기압 1기압(1 atm = 1013.25 hPa)의 의미',
          '고도가 올라갈수록 공기가 희박해지는 이유'
        ],
        durationOrReadTime: '읽는 시간 약 5분',
        articleContent: {
          title: '에듀넷 과학백과: 눈에 안 보이는 공기, 정말 무게가 있을까?',
          subtitle: '토리첼리의 수은 실험과 해수면 표준 대기압(1013.25 hPa)의 비밀',
          institution: 'KERIS 국가 교육학술정보원 에듀넷 티-클리어',
          badgeText: '교과연계 과학 백과',
          readingTimeMinutes: 5,
          sections: [
            {
              heading: '1. 공기도 질량과 무게가 있는 물질입니다',
              body: '바람을 넣지 않은 빈 농구공과 공기를 빵빵하게 채운 농구공을 정밀 전자저울에 올려보면 공기를 넣은 공이 약 몇 그램 더 무겁습니다. 지구를 둘러싼 공기 전체의 무게는 무려 약 5,000조 톤에 달합니다! 우리가 평소 무거움을 느끼지 못하는 것은 우리 몸속의 압력도 외부 공기 압력과 똑같이 밖으로 밀어내며 균형을 이루고 있기 때문입니다.',
              bulletPoints: [
                '공기 1리터(0℃, 1기압)의 질량은 약 1.29g',
                '지표면에서 1제곱미터 면적이 받는 공기의 무게는 약 10톤(트럭 1대 무게)'
              ]
            },
            {
              heading: '2. 1643년 토리첼리의 획기적인 수은 기압계 실험',
              body: '이탈리아의 과학자 에반젤리스타 토리첼리는 한쪽 끝이 막힌 1m 길이의 유리관에 무거운 액체 금속인 수은을 가득 채운 뒤 수은 그릇에 거꾸로 세웠습니다. 놀랍게도 수은은 다 쏟아지지 않고 정확히 76cm(760mm) 높이에서 멈췄습니다. 그릇 표면을 누르는 외부 공기의 힘(대기압)이 유리관 속 76cm 수은 기둥의 무게를 정확히 떠받치고 있었던 것입니다.',
              bulletPoints: [
                '1 표준 기압 = 1 atm = 760 mmHg = 1013.25 hPa(헥토파스칼)',
                '물로 실험할 경우 물은 수은보다 13.6배 가벼우므로 약 10.3m 높이의 거대한 물기둥이 필요함'
              ]
            },
            {
              heading: '3. 높은 산에 올라가면 과자 봉지가 왜 빵빵해질까요?',
              body: '고도가 높아질수록 머리 위에 쌓여있는 공기의 층이 얇아지므로 대기압이 급격히 낮아집니다. 산 아래에서 포장된 과자 봉지는 내부 기압이 1기압이지만, 높은 산 위로 올라가면 바깥 공기가 누르는 힘이 약해져 봉지 속 기체가 밖으로 팽창하여 빵빵하게 부풀어 오르게 됩니다.'
            }
          ],
          keyTakeaway: '대기압은 지표면 위 공기의 무게 때문에 생기며, 해수면 1기압(1013.25 hPa)은 수은주 76cm를 떠받치는 힘과 같습니다.',
          kidQuestion: {
            question: '빨대로 음료수를 마실 수 있는 것도 대기압 때문인가요?',
            answer: '맞습니다! 입으로 빨대 속 공기를 빨아들이면 빨대 안의 기압이 낮아지고, 음료수 표면을 누르고 있던 바깥 공기(대기압)가 음료수를 위로 밀어 올려 입안으로 들어가게 됩니다.'
          }
        }
      }
    ]
  },
  'sec-18-2': {
    sectionId: 'sec-18-2',
    conceptSummaryForKids: {
      analogyTitle: '지구 대기는 어떻게 지금처럼 산소가 풍부해졌을까?',
      analogyText: '진화론에서는 원시 바다의 미생물(남세균)이 수십억 년간 광합성을 해서 산소를 만들었다고 보며, 창조론에서는 하나님께서 생명체가 살기에 완벽하도록 창조 2일과 3일에 공기와 물을 지으셨다고 봅니다.',
      funFact: '1953년 스탠리 밀러와 해럴드 유리의 실험은 원시 대기에서 아미노산을 만들려 했지만, 산소가 조금이라도 있으면 유기물이 파괴된다는 사실이 드러났습니다.'
    },
    resources: [
      {
        id: 'yt-origin-atm',
        type: 'youtube',
        title: '[TED-Ed] 미생물 남세균이 지구 대기를 산소로 가득 채운 역사',
        source: 'TED-Ed 한국어 자막',
        sourceTag: 'TED-Ed 공식',
        youtubeVideoId: 'dO2xx-aeZ4w',
        url: 'https://www.youtube.com/watch?v=dO2xx-aeZ4w',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
        description: '지구 초기 무산소 대기에서 광합성 남세균의 출현과 산소 대폭발(Great Oxidation Event) 과정을 흥미진진한 애니메이션으로 감상합니다.',
        learningPoints: [
          '밀러-유리 실험의 환원성 대기 가설과 그 한계점',
          '산소 발생과 지층의 줄무늬 철광층(BIF) 형성 과정'
        ],
        durationOrReadTime: '약 5분 영상'
      },
      {
        id: 'blog-kasi-origin',
        type: 'agency',
        title: '한국천문연구원: 금성, 화성, 지구 대기의 비교',
        source: '한국천문연구원(KASI)',
        sourceTag: '천문우주지식',
        url: 'https://www.kasi.re.kr',
        thumbnailUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=600&auto=format&fit=crop&q=80',
        description: '금성과 화성은 대기의 95% 이상이 이산화탄소인데, 왜 지구만 질소와 산소로 가득 찬 특별한 대기를 가지게 되었는지 행성 대기를 비교합니다.',
        learningPoints: [
          '액체 상태의 바다가 이산화탄소를 녹여 석회암으로 가둔 기적',
          '생명체가 살 수 있는 지구의 골디락스 존(Goldilocks Zone)'
        ],
        durationOrReadTime: '읽는 시간 약 6분',
        articleContent: {
          title: '한국천문연구원 우주과학: 금성, 화성, 지구 3대 암석형 행성의 대기 미스터리',
          subtitle: '비슷한 크기와 위치의 세 행성 중 왜 오직 지구에만 산소와 질소가 풍부할까요?',
          institution: 'KASI 한국천문연구원 우주과학본부',
          badgeText: '천문우주 비교과학',
          readingTimeMinutes: 6,
          sections: [
            {
              heading: '1. 금성과 화성의 대기: 96%가 이산화탄소(CO₂)',
              body: '금성은 두께가 엄청나 지표 기압이 지구의 90배에 달하고, 대기의 96.5%가 이산화탄소입니다. 이로 인한 극단적 온실효과 때문에 표면 온도가 섭씨 470도에 달해 납도 녹여버립니다. 반면 화성은 대기가 너무 희박해 지구의 0.006배(0.6%)에 불과하지만, 역시 성분의 95% 이상이 이산화탄소입니다.',
              bulletPoints: [
                '금성 대기: 96.5% CO₂, 3.5% N₂ (초고압 불지옥 온실효과)',
                '화성 대기: 95.3% CO₂, 2.6% N₂ (초희박 영하 60도 극저온)'
              ]
            },
            {
              heading: '2. 지구만의 독특한 질소 78% · 산소 21% 조성비',
              body: '오직 지구만이 질소 78%, 산소 21%, 아르곤 0.93%라는 생명 친화적인 대기를 보유하고 있습니다. 지구가 태양으로부터 적당한 거리(골디락스 존)에 위치하여 풍부한 액체 상태의 바다를 유지할 수 있었고, 이산화탄소가 바닷물에 녹아 탄산칼슘(석회암)으로 지각 속에 영구 격리되었기 때문입니다. 그리고 식물과 남세균의 지속적인 산소 공급이 오늘날의 생태계를 유지해 줍니다.',
              bulletPoints: [
                '바다의 CO₂ 흡수 작용으로 대기 중 온실가스 폭주 방지',
                '자외선 차단 오존층 형성으로 육상 생명체 번성 가능'
              ]
            }
          ],
          keyTakeaway: '지구 대기는 다른 태양계 행성과 완전히 구별되는 정밀하고 특별한 생명 유지 시스템을 갖추고 있습니다.',
          kidQuestion: {
            question: '화성에 산소가 없는데 사람이 우주복 없이 갈 수 있나요?',
            answer: '절대 갈 수 없습니다! 화성 공기에는 산소가 거의 없을 뿐만 아니라 기압이 너무 낮아 피가 끓고, 영하 수십 도의 혹한 때문에 특수 우주복과 산소통이 반드시 필요합니다.'
          }
        }
      }
    ]
  },
  'sec-18-3': {
    sectionId: 'sec-18-3',
    conceptSummaryForKids: {
      analogyTitle: '질소는 튼튼한 금고! 벼락과 뿌리혹박테리아가 비밀번호를 풉니다',
      analogyText: '질소 분자(N₂)는 원자 2개가 삼중결합으로 꽁꽁 묶여 있어서 동물이나 식물이 바로 먹을 수 없습니다. 번개의 초고열 에너지가 이 결합을 쪼개 식물의 비료로 만들어줍니다.',
      funFact: '1909년 프리츠 하버와 카를 보슈가 공기 중 질소로 암모니아 비료를 합성하지 못했다면 현재 80억 인구의 절반 이상이 식량 부족을 겪었을 것입니다.'
    },
    resources: [
      {
        id: 'yt-nitrogen-cycle',
        type: 'youtube',
        title: '[베리타시움] 공기로 빵을 만든 화학자 프리츠 하버와 하버-보슈법',
        source: 'Veritasium (한국어 자막)',
        sourceTag: '글로벌 과학 1위',
        youtubeVideoId: 'EvknN89JoWo',
        url: 'https://www.youtube.com/watch?v=EvknN89JoWo',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=600&auto=format&fit=crop&q=80',
        description: '공기 중 78% 질소의 단단한 결합을 깨고 인류 80억의 식량을 만든 하버-보슈 인공 비료의 과학적 원리와 드라마틱한 역사입니다.',
        learningPoints: [
          '공기 중 불활성 질소(N₂)가 암모니아(NH₃)로 변하는 화학 반응',
          '삼중결합의 강한 화학 결합 에너지와 촉매의 역할'
        ],
        durationOrReadTime: '약 15분 명작'
      },
      {
        id: 'blog-chem-haber',
        type: 'blog',
        title: '네이버 지식백과 화학산책: 20세기 인구를 두 배로 늘린 하버-보슈 반응',
        source: '대한화학회 / 네이버 캐스트',
        sourceTag: '화학 백과',
        url: 'https://terms.naver.com',
        thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
        description: 'N₂ + 3H₂ ⇌ 2NH₃ 반응식과 고온·고압 촉매 기술을 통해 인류의 농업 생산량을 바꾼 화학 이야기입니다.',
        learningPoints: [
          '질소의 삼중결합(Triple Bond)이 강한 화학적 이유',
          '생명체의 단백질과 DNA 합성의 필수 원소 질소'
        ],
        durationOrReadTime: '읽는 시간 약 5분',
        articleContent: {
          title: '대한화학회 화학산책: 공기로 빵을 만든 과학의 기적, 하버-보슈법',
          subtitle: '질소의 삼중결합을 깨뜨려 80억 인류의 밥상을 지킨 20세기 화학 혁명',
          institution: '대한화학회 & 네이버 과학백과',
          badgeText: '화학 심층 탐구',
          readingTimeMinutes: 5,
          sections: [
            {
              heading: '1. 왜 공기 중 질소(78%)를 생명체가 그냥 못 마실까요?',
              body: '우리 주변 공기의 대부분은 질소 분자(N₂)입니다. 하지만 질소 원자 2개는 서로 전자 3쌍을 공유하는 강력한 "삼중결합(N≡N)"으로 묶여 있어서, 웬만한 열이나 화학 반응으로는 절대 깨지지 않습니다. 따라서 우리 몸도 숨을 들이마실 때 질소를 그대로 들이마셨다가 아무 변화 없이 도로 뱉어냅니다.',
              bulletPoints: [
                '삼중결합 해리 에너지: 945 kJ/mol (매우 강력한 화학 결합)',
                '생명체의 DNA와 단백질(근육)을 구성하는 데 반드시 질소가 필요함'
              ]
            },
            {
              heading: '2. 자연의 질소 고정: 번개와 뿌리혹박테리아',
              body: '자연계에서 이 강력한 결합을 깨는 방법은 두 가지뿐입니다. 첫째는 수만 도에 달하는 "번개(벼락)"의 에너지로 질소와 산소를 결합시켜 비와 함께 땅으로 떨어뜨리는 것이고, 둘째는 콩과식물 뿌리에 사는 "뿌리혹박테리아"의 효소(질소화 효소)를 통해 암모니아로 바꿔주는 것입니다.',
              bulletPoints: [
                '번개 방전: N₂ + O₂ → 2NO (빗물에 녹아 질산염으로 식물 흡수)',
                '뿌리혹박테리아: 공기 중 N₂를 암모늄(NH₄⁺)으로 생물학적 고정'
              ]
            },
            {
              heading: '3. 프리츠 하버의 발명: N₂ + 3H₂ ⇌ 2NH₃',
              body: '1909년 독일 화학자 프리츠 하버는 400~500℃의 고온과 200기압이라는 엄청난 압력, 그리고 철 촉매를 사용해 공기 중 질소와 수소를 반응시켜 암모니아(NH₃)를 인공 합성하는 데 성공했습니다. 이 기술로 인공 질소 비료가 대량 생산되면서 전 세계 농작물 수확량이 수십 배 증가했고, 오늘날 지구 인구의 절반 이상이 하버-보슈법 비료 덕분에 생존할 수 있게 되었습니다.'
            }
          ],
          keyTakeaway: '질소의 단단한 삼중결합 덕분에 지구 대기는 안전하게 안정성을 유지하며, 번개와 화학 비료를 통해 생명체에게 필요한 단백질로 전환됩니다.',
          kidQuestion: {
            question: '벼락이 많이 치는 해에는 농사가 잘된다는 속담이 진짜인가요?',
            answer: '네! 벼락의 엄청난 열이 질소를 천연 비료 성분(질산염)으로 바꿔 땅에 골고루 뿌려주기 때문에 옛 조상들의 속담은 과학적으로 완벽한 사실입니다.'
          }
        }
      }
    ]
  },
  'sec-18-4': {
    sectionId: 'sec-18-4',
    conceptSummaryForKids: {
      analogyTitle: '지구 대기는 기온에 따라 5층으로 지어진 거대한 빌딩!',
      analogyText: '1층 대류권은 올라갈수록 추워지고(-6.5°C/km), 2층 성층권은 오존이 태양빛을 흡수해 따뜻해지며, 3층 중간권은 영하 90°C까지 얼어붙고, 4층 열권은 강한 햇빛 때문에 수천 도까지 치솟습니다.',
      funFact: '오스트리아의 바움가르트너는 2012년 성층권 39km 높이에서 낙하산을 타고 뛰어내려 음속(시속 1,357km)을 돌파했습니다!'
    },
    resources: [
      {
        id: 'yt-layers-atmosphere',
        type: 'youtube',
        title: '[EBS 중학·고등] 대기권의 구조: 대류권, 성층권, 중간권, 열권',
        source: 'EBSi 과학탐구',
        sourceTag: 'EBS 대표 강의',
        youtubeVideoId: 'MNDCYZdfCcQ',
        url: 'https://www.youtube.com/watch?v=MNDCYZdfCcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
        description: '기온 감률 곡선의 지그재그(W자형) 변화 이유와 대류 현상, 기상 현상의 유무를 완벽 정리합니다.',
        learningPoints: [
          '대류권(0~11km): 수증기와 대류가 있어 비·눈 등 기상 현상 발생',
          '성층권(11~50km): 대류가 없어 비행기 항로로 쓰이며 오존층 위치',
          '중간권(50~80km): 대기권 중 최저 기온(-90°C), 유성이 타는 곳'
        ],
        durationOrReadTime: '약 8분 영상'
      },
      {
        id: 'yt-baumgartner-jump',
        type: 'youtube',
        title: '[Red Bull] 성층권 39km 우주 낙하: 바움가르트너의 음속 돌파 실황',
        source: 'Red Bull Stratos Official',
        sourceTag: '실제 우주 점프',
        youtubeVideoId: 'FHtvDA0W34I',
        url: 'https://www.youtube.com/watch?v=FHtvDA0W34I',
        thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
        description: '교재 p.432에 실린 바움가르트너의 성층권 스카이다이빙 실제 하이라이트 영상입니다. 공기가 희박한 성층권의 신비를 눈으로 직접 확인할 수 있습니다.',
        learningPoints: [
          '공기 저항이 없는 희박한 성층권에서 인간이 음속을 돌파하는 물리 현상',
          '지구의 둥근 지평선과 얇은 대기층의 실제 모습'
        ],
        durationOrReadTime: '약 4분 영상'
      }
    ]
  },
  'sec-18-5': {
    sectionId: 'sec-18-5',
    conceptSummaryForKids: {
      analogyTitle: '아래는 잘 섞인 주스(균질권), 위는 무게별로 뜬 칵테일(이질권)!',
      analogyText: '고도 80km 아래(균질권)는 바람이 휘저어 질소와 산소가 똑같이 섞여 있지만, 80km 위(이질권)는 공기가 너무 희박해 무거운 질소는 아래, 가벼운 수소와 헬륨은 맨 위로 층층이 갈라집니다.',
      funFact: '우주정거장(ISS)이 도는 고도 400km 부근의 이질권에는 원자 상태의 산소(O)와 헬륨(He)이 주를 이룹니다.'
    },
    resources: [
      {
        id: 'yt-homo-hetero',
        type: 'youtube',
        title: '[지구과학 강의] 대기의 화학적 구분: 균질권 vs 이질권의 분자 확산',
        source: 'EBSi 지구과학',
        sourceTag: '심화 과학',
        youtubeVideoId: 'MNDCYZdfCcQ',
        url: 'https://www.youtube.com/watch?v=MNDCYZdfCcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80',
        description: '난류 혼합이 일어나는 균질권과 분자 확산으로 기체 분자량에 따라 층이 나뉘는 이질권의 차이를 도표로 설명합니다.',
        learningPoints: [
          '균질권(0~80km)의 평균 분자량 28.97 유지 원리',
          '이질권(80km 이상): 질소층 → 산소층 → 헬륨층 → 수소층 순서'
        ],
        durationOrReadTime: '약 8분 영상'
      }
    ]
  },
  'sec-18-6': {
    sectionId: 'sec-18-6',
    conceptSummaryForKids: {
      analogyTitle: '오존층은 지구 생명체를 지켜주는 거대한 자외선 선글라스!',
      analogyText: '산소 원자 3개가 뭉친 오존(O₃)이 태양의 유해 자외선(UV-B, UV-C)을 흡수해 산소 분자(O₂)로 쪼개졌다가 다시 합쳐지는 챔프먼 반응을 끊임없이 반복합니다.',
      funFact: '에어컨 냉매와 헤어스프레이에 썼던 프레온가스(CFCs)의 염소 원자 단 1개가 오존 분자 100,000개를 파괴합니다.'
    },
    resources: [
      {
        id: 'yt-ozone-nasa',
        type: 'youtube',
        title: '[NASA] 남극 오존홀 관측 데이터와 몬트리올 의정서의 기적',
        source: 'NASA Goddard / Science Studio',
        sourceTag: 'NASA 공식',
        youtubeVideoId: '7bWQQWvJymc',
        url: 'https://www.youtube.com/watch?v=7bWQQWvJymc',
        thumbnailUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&auto=format&fit=crop&q=80',
        description: 'NASA 인공위성이 관측한 남극 상공의 오존홀 변화와 전 세계 협력으로 오존층이 회복되어 가는 과정을 3D 시각화로 보여줍니다.',
        learningPoints: [
          'CFCs에서 분리된 염소 원자(Cl)의 촉매 반응 메커니즘',
          '전 세계 국가들이 협력하여 프레온가스를 금지한 몬트리올 의정서(1987)의 교훈'
        ],
        durationOrReadTime: '약 5분 영상'
      },
      {
        id: 'blog-env-ozone',
        type: 'agency',
        title: '환경부 어린이 환경교실: 오존층을 지키는 착한 약속',
        source: '대한민국 환경부',
        sourceTag: '환경 교육',
        url: 'https://me.go.kr',
        thumbnailUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
        description: '지표면의 나쁜 오존(스모그 오존)과 성층권의 착한 오존(자외선 차단 오존)의 차이를 어린이 눈높이로 풀어쓴 자료입니다.',
        learningPoints: [
          '지표 부근의 오존은 호흡기 질환을 유발하지만, 성층권 오존은 생명의 방패',
          '대체 냉매(HFCs) 개발과 오존층 회복 전망'
        ],
        durationOrReadTime: '읽는 시간 약 4분',
        articleContent: {
          title: '환경부 어린이 환경교실: 두 얼굴의 오존(O₃), 착한 오존과 나쁜 오존',
          subtitle: '성층권 20~30km의 착한 방패 오존과 도시 지표면의 나쁜 스모그 오존',
          institution: '대한민국 환경부 국립환경과학원',
          badgeText: '환경부 공식 환경교실',
          readingTimeMinutes: 4,
          sections: [
            {
              heading: '1. 성층권의 착한 오존: 생명의 자외선 차단막',
              body: '성층권 20~30km 높이에 위치한 오존층은 태양이 방출하는 치명적인 고에너지 자외선(UV-C 및 UV-B의 대부분)을 흡수합니다. 오존(O₃)이 자외선을 흡수하면 산소 분자(O₂)와 산소 원자(O)로 분해되었다가 다시 결합하는 채프먼 사이클을 반복하면서 자외선 에너지를 열로 전환합니다. 만약 오존층이 없다면 생명체는 심각한 피부암과 백내장, DNA 파괴로 지표면에서 살 수 없습니다.',
              bulletPoints: [
                'UV-C: 100% 차단 (가장 치명적인 자외선)',
                'UV-B: 90% 이상 흡수 차단 (일광 화상 및 피부암 유발)'
              ]
            },
            {
              heading: '2. 프레온가스(CFCs)와 몬트리올 의정서의 승리',
              body: '냉장고 냉매와 헤어스프레이에 무분별하게 사용되던 염화불화탄소(CFCs)는 성층권에 도달해 자외선에 의해 염소 원자(Cl)를 방출합니다. 놀랍게도 염소 원자 단 1개가 촉매 역할을 하며 무려 10만 개의 오존 분자를 연쇄 파괴합니다. 1987년 세계 각국은 몬트리올 의정서를 맺어 CFCs 생산을 전면 금지했고, 그 결과 남극의 오존 구멍은 서서히 회복세를 보이고 있습니다.',
              bulletPoints: [
                'Cl + O₃ → ClO + O₂ (오존 파괴 연쇄 반응)',
                '인류의 전 지구적 환경 협약 성공의 가장 모범적인 사례'
              ]
            },
            {
              heading: '3. 지표면의 나쁜 오존: 여름철 오존 경보제',
              body: '성층권에서는 착한 방패이지만, 우리가 숨 쉬는 땅바닥(대류권)에 생긴 오존은 강한 산화력을 가진 유독 기체입니다. 자동차 배기가스(질소산화물)가 강한 한여름 햇볕과 반응하여 광화학 스모그로 발생합니다. 오존 경보가 발령되면 눈과 목이 따갑고 호흡기가 손상되므로 외출을 삼가야 합니다.'
            }
          ],
          keyTakeaway: '높은 하늘의 오존은 생명을 구하는 방패이지만, 지표면의 오존은 호흡기를 위협하는 오염물질입니다.',
          kidQuestion: {
            question: '오존층 두께는 실제로 얼마나 되나요?',
            answer: '놀랍게도 지표면 표준 대기압(1기압, 0℃)으로 모아 압축하면 오존층의 두께는 고작 동전 2~3개 두께인 3밀리미터(3mm, 300 돕슨 단위)에 불과합니다. 이 얇은 막이 지구 전체 생명을 지키고 있습니다!'
          }
        }
      }
    ]
  },
  'sec-18-7': {
    sectionId: 'sec-18-7',
    conceptSummaryForKids: {
      analogyTitle: '전리층은 우주에 떠 있는 거대한 하늘 거울!',
      analogyText: '태양의 강력한 자외선과 X선이 공기 분자에서 전자를 튕겨내 이온화된 층입니다. 이 전자들이 바닥에서 쏜 단파 라디오 전파를 거울처럼 튕겨내 지구 반대편까지 통신할 수 있게 해줍니다.',
      funFact: '밤이 되면 태양빛이 없어 전리층 아래쪽(D층)이 사라져서, 낮에는 안 들리던 먼 외국의 단파 방송이 밤에 더 깨끗하게 들립니다!'
    },
    resources: [
      {
        id: 'yt-ionosphere',
        type: 'youtube',
        title: '[NASA Goddard] 전리층과 지구의 방사선 벨트 탐구 (Van Allen Probes)',
        source: 'NASA Goddard Space Flight Center',
        sourceTag: 'NASA 공식',
        youtubeVideoId: 'CKUNT2Qshk4',
        url: 'https://www.youtube.com/watch?v=CKUNT2Qshk4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        description: '태양풍 고에너지 입자가 지구 전리층과 방사선 벨트에서 어떻게 상호작용하는지 NASA 탐사선 데이터로 생생하게 살펴봅니다.',
        learningPoints: [
          '전파의 반사 원리: 마이크로웨이브(GPS/위성)는 통과하고 단파(HF)는 반사',
          '태양 플레어가 폭발할 때 전리층 교란과 무선 통신 장애'
        ],
        durationOrReadTime: '약 4분 영상'
      }
    ]
  },
  'sec-18-8': {
    sectionId: 'sec-18-8',
    conceptSummaryForKids: {
      analogyTitle: '지구는 거대한 자석! 밴앨런대는 태양풍을 막는 보이지 않는 방패!',
      analogyText: '태양은 초속 수백 킬로미터로 치명적인 고에너지 입자(태양풍)를 뿜어냅니다. 지구 자기장이 이 입자들을 도넛 모양으로 가두어 지구 표면으로 쏟아지지 못하게 보호하는데, 이를 밴앨런대라 부릅니다.',
      funFact: '가둬진 태양 입자 중 일부가 북극과 남극의 공기와 부딪혀 아름다운 초록색·자주색 빛을 내뿜는 현상이 바로 오로라(Aurora)입니다!'
    },
    resources: [
      {
        id: 'yt-magnetosphere-aurora',
        type: 'youtube',
        title: '[내셔널지오그래픽] 극지방 오로라(Aurora)의 신비로운 춤과 지구 자기장',
        source: 'National Geographic Official',
        sourceTag: 'NatGeo 4K',
        youtubeVideoId: 'izYiDDt6d8s',
        url: 'https://www.youtube.com/watch?v=izYiDDt6d8s',
        thumbnailUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&auto=format&fit=crop&q=80',
        description: '지구 자기권의 밴앨런대가 태양풍을 막아내고 극지방 하늘에 형형색색 오로라를 피워내는 경이로운 실제 4K 영상입니다.',
        learningPoints: [
          '내부 방사선대(주로 고에너지 양성자)와 외부 방사선대(고에너지 전자)',
          '자기폭풍과 인공위성 보호를 위한 우주 날씨 예보의 중요성'
        ],
        durationOrReadTime: '약 4분 영상'
      },
      {
        id: 'blog-aurora-kasi',
        type: 'agency',
        title: '한국천문연구원: 극지방의 황홀한 춤, 오로라의 비밀',
        source: '한국천문연구원(KASI)',
        sourceTag: '천문 백과',
        url: 'https://www.kasi.re.kr',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&auto=format&fit=crop&q=80',
        description: '오로라가 산소 원자와 충돌하면 녹색 또는 붉은색을 띠고, 질소 분자와 충돌하면 보라색 또는 푸른색을 띠는 발광 분광학 원리입니다.',
        learningPoints: [
          '고도 100~300km 열권에서 일어나는 발광 방전 현상',
          '지구 자기장 덕분에 우리가 방사선에 피폭되지 않고 살 수 있는 감사함'
        ],
        durationOrReadTime: '읽는 시간 약 5분',
        articleContent: {
          title: '한국천문연구원 천문우주지식: 밤하늘을 수놓는 빛의 커튼, 오로라(Aurora)',
          subtitle: '태양풍의 고에너지 입자가 지구 자기장을 따라 극지방 대기와 충돌하는 원리',
          institution: 'KASI 한국천문연구원 우주과학본부',
          badgeText: '천문우주 백과',
          readingTimeMinutes: 5,
          sections: [
            {
              heading: '1. 오로라는 어떻게 태어날까요?',
              body: '태양은 끊임없이 전자와 양성자로 이루어진 초고속 플라스마 바람(태양풍)을 우주로 내뿜습니다. 이 치명적인 입자들이 지구로 돌진할 때 지구를 감싸고 있는 거대한 자기장(자기권)이 방패 역할을 하여 입자들을 도넛 모양의 밴앨런대에 가둡니다. 이때 일부 입자들이 지구 자석의 극(북극과 남극) 쪽으로 끌려 내려와 열권의 대기 분자들과 시속 수천 킬로미터로 격렬하게 충돌합니다.',
              bulletPoints: [
                '태양풍: 초속 400~800km의 고에너지 전하 입자 흐름',
                '자기력선 유도: 북극권(Aurora Borealis) 및 남극권(Aurora Australis)으로 집중'
              ]
            },
            {
              heading: '2. 오로라의 신비한 색깔 비밀: 산소와 질소의 분광학',
              body: '충돌한 공기 분자가 에너지를 흡수했다가 바닥상태로 돌아오면서 아름다운 빛을 방출합니다. 이때 어떤 기체와 충돌하느냐에 따라 색깔이 결정됩니다. 고도 100~150km의 산소 원자와 충돌하면 우리가 흔히 보는 신비로운 "황록색(초록빛)"이 나오고, 더 높은 200~300km 상공의 희박한 산소와 만나면 "붉은색" 빛을 냅니다. 질소 분자와 부딪히면 "보라색"이나 "청색"의 화려한 테두리가 만들어집니다.',
              bulletPoints: [
                '산소(O) 충돌: 557.7nm 파장의 대표적인 에메랄드 초록빛 발광',
                '질소(N₂) 충돌: 붉은 보랏빛 및 딥 블루 빛 방출'
              ]
            }
          ],
          keyTakeaway: '오로라는 지구가 강력한 자기장을 지녀 우주 방사선으로부터 우리를 완벽하게 지켜주고 있다는 가장 아름다운 시각적 증거입니다.',
          kidQuestion: {
            question: '한국에서도 오로라를 볼 수 있나요?',
            answer: '조선왕조실록에 붉은 기운의 오로라를 보았다는 기록이 있습니다! 태양 흑점이 극도로 폭발하는 슈퍼 자기폭풍이 발생하면 중위도 지방인 한국에서도 붉은빛 오로라가 관측될 수 있습니다.'
          }
        }
      }
    ]
  },
  'sec-18-9': {
    sectionId: 'sec-18-9',
    conceptSummaryForKids: {
      analogyTitle: '태양은 우주에서 날아오는 거대한 빛과 전자기파 발전소!',
      analogyText: '태양이 뿜어내는 수많은 빛(가시광선, 적외선, 자외선)과 고에너지 입자들 덕분에 지구는 생명이 살아갈 수 있는 따뜻한 행성이 됩니다. 맑은 날 정오에 지표면에 쏟아지는 에너지는 1m²당 무려 0.95 kW(950와트)에 달합니다.',
      funFact: '1815년 인도네시아 탐보라 화산이 폭발했을 때, 화산재가 성층권에 퍼져 태양빛을 20%나 가로막는 바람에 이듬해 1816년에는 전 세계에 여름이 사라지는 대이변이 일어났습니다!'
    },
    resources: [
      {
        id: 'yt-radiant-sun-spectrum',
        type: 'youtube',
        title: '[내셔널지오그래픽] 태양 101: 태양 복사 에너지와 빛의 신비 (Sun 101)',
        source: 'National Geographic Official',
        sourceTag: 'NatGeo 공식',
        youtubeVideoId: '2HoTK_Gqi2Q',
        url: 'https://www.youtube.com/watch?v=2HoTK_Gqi2Q',
        thumbnailUrl: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=600&auto=format&fit=crop&q=80',
        description: '태양이 뿜어내는 강력한 복사 에너지, 가시광선과 자외선, 흑점 폭발과 지구에 미치는 영향을 내셔널지오그래픽의 생생한 그래픽으로 탐구합니다.',
        learningPoints: [
          '가시광선과 적외선이 지구 복사 에너지의 대부분을 차지하는 이유',
          '화창한 날 지표면 도달 에너지율(0.95 kW/m²)의 물리적 의미'
        ],
        durationOrReadTime: '약 4분 영상'
      },
      {
        id: 'blog-tambora-event',
        type: 'agency',
        title: '기상청 기상역사: 1815년 탐보라 화산과 여름 없는 해(1816)',
        source: '대한민국 기상청',
        sourceTag: '기상 역사',
        url: 'https://www.weather.go.kr',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
        description: '성층권으로 유입된 화산재 에어로졸이 태양광을 차단하여 전 지구적 기후 이변과 흉작을 초래한 역사적 사건입니다.',
        learningPoints: [
          '대기 중 미립자가 태양 일조량을 떨어뜨리는 메커니즘',
          '지구 기후와 대기 투명도의 밀접한 상관관계'
        ],
        durationOrReadTime: '읽는 시간 약 5분',
        articleContent: {
          title: '기상청 기상역사관: 1816년 전 세계에 여름이 사라진 해(Year Without a Summer)',
          subtitle: '인도네시아 탐보라 화산 폭발과 성층권 화산재가 가로막은 태양 복사 에너지',
          institution: '대한민국 기상청 기상역사 탐구자료실',
          badgeText: '기상청 역사과학 백과',
          readingTimeMinutes: 5,
          sections: [
            {
              heading: '1. 1815년 4월, 인류 역사상 가장 강력한 화산 폭발',
              body: '인도네시아 숨바와섬의 탐보라(Tambora) 화산이 폭발하면서 100㎦가 넘는 화산재와 수천만 톤의 이산화황(SO₂) 가스가 고도 40km가 넘는 성층권까지 치솟았습니다. 무거운 먼지는 곧 가라앉았지만, 미세한 황산염 에어로졸은 성층권 바람을 타고 1년 만에 전 지구 하늘을 감싸는 거대한 차양막이 되었습니다.',
              bulletPoints: [
                '폭발 지수 VEI 7 (히로시마 원자폭탄 수만 개에 달하는 위력)',
                '성층권으로 유입된 미세 입자가 태양광선을 반사 및 산란'
              ]
            },
            {
              heading: '2. 1816년 북반구의 기상이변과 전 지구적 기온 강하',
              body: '이듬해 1816년, 지구에 도달하는 태양 에너지가 약 20%나 차단되면서 전 세계 평균 기온이 0.5~1℃ 떨어졌습니다. 고작 1도의 하강이었지만 그 파급효과는 엄청났습니다. 미국 동부와 유럽에서는 6월과 7월 한여름에 폭설과 한파가 몰아쳤고, 강물이 얼어붙었으며 농작물이 전멸해 대기근이 발생했습니다.',
              bulletPoints: [
                '6월의 눈보라: 미국 뉴잉글랜드와 캐나다에 한여름 영하 기온',
                '유럽의 식량 폭동 및 흉작으로 인한 사회적 대혼란'
              ]
            },
            {
              heading: '3. 대기 투명도(Atmospheric Transparency)의 중요성',
              body: '이 사건은 지구의 기후와 생태계가 태양 복사 에너지의 미세한 변화와 대기의 투명도에 얼마나 민감하게 반응하는지를 극명하게 보여줍니다. 맑은 날 지표면에 쏟아지는 0.95 kW/m²의 에너지가 조금만 가려져도 전 지구 생태계의 사활이 흔들리게 됩니다.'
            }
          ],
          keyTakeaway: '대기 중 미세먼지와 화산재는 태양광을 우주로 반사하여 지구 기온을 급격히 떨어뜨리므로, 맑은 대기의 투명성은 인류 생존의 필수 조건입니다.',
          kidQuestion: {
            question: '화산재가 비에 씻겨 내려가지 않고 왜 성층권에 1년 넘게 머물렀나요?',
            answer: '대류권에는 비와 눈이 내려 먼지를 씻어내지만, 11km 위 성층권은 수증기가 없고 비가 내리지 않는 매우 안정된 층이기 때문에 한번 올라간 미세 에어로졸이 1~2년 동안 머물며 태양빛을 차단했습니다.'
          }
        }
      }
    ]
  },
  'sec-18-10': {
    sectionId: 'sec-18-10',
    conceptSummaryForKids: {
      analogyTitle: '태양 상수(1.367 kW/m²)와 대기의 정밀한 에너지 수지!',
      analogyText: '우주에서 대기 최상단에 수직으로 쏟아지는 에너지는 1.367 kW/m²(태양 상수)입니다. 구름이 최대 32%를 우주로 반사하고 대기가 18%를 흡수하며, 지표면이 50% 이상을 흡수하여 완벽한 에너지 균형을 이룹니다.',
      funFact: '적도 지방은 햇빛이 수직으로 쏟아져 에너지가 좁은 면적에 집중되지만, 고위도로 갈수록 비스듬히 비추어 에너지가 넓게 분산되기 때문에 춥습니다!'
    },
    resources: [
      {
        id: 'yt-greenhouse-ebs',
        type: 'youtube',
        title: '[NASA eClips] 지구의 에너지 균형: 입사 에너지와 반사·방출 평형',
        source: 'NASA eClips Educational',
        sourceTag: 'NASA 공식 교육',
        youtubeVideoId: 'ssQ5KGJ5fYQ',
        url: 'https://www.youtube.com/watch?v=ssQ5KGJ5fYQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
        description: 'NASA의 지구 에너지 수지(Energy Balance) 교육 영상입니다. 입사하는 태양 에너지 중 구름 반사 32%, 대기 흡수 18%, 지표 흡수 50%의 분배 메커니즘을 배웁니다.',
        learningPoints: [
          '태양 상수 (대기 상단 수직 도달 에너지 1.367 kW/m²)의 정의',
          '위도 및 입사각에 따른 단위 면적당 에너지 밀도 차이'
        ],
        durationOrReadTime: '약 6분 영상'
      },
      {
        id: 'blog-noaa-climate',
        type: 'agency',
        title: '미국 해양대기청(NOAA): Earth\'s Energy Budget 다이어그램',
        source: 'NOAA (미국 해양대기청)',
        sourceTag: 'NOAA 공식',
        url: 'https://www.climate.gov',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
        description: '지구 대기가 태양 에너지를 우주로 반사하고, 흡수하며, 지표면을 포근하게 유지하는 정밀 에너지 평형 지도입니다.',
        learningPoints: [
          '알베도(반사율)와 구름의 냉각 효과',
          '지구 복사 평형(Energy Budget) 다이어그램 읽는 법'
        ],
        durationOrReadTime: '읽는 시간 약 6분',
        articleContent: {
          title: '미국 해양대기청(NOAA): 지구의 완벽한 복사 평형(Energy Budget) 지도',
          subtitle: '태양 상수 1.367 kW/m²의 에너지가 우주, 대기, 바다 사이를 순환하는 정밀 메커니즘',
          institution: 'NOAA 미국 해양대기청 기후예측센터',
          badgeText: 'NOAA 글로벌 기후과학',
          readingTimeMinutes: 6,
          sections: [
            {
              heading: '1. 태양 상수(Solar Constant)의 정확한 정의',
              body: '태양 상수는 지구 대기권 최상단에서 햇빛과 수직인 1제곱미터(1m²)의 면적이 단위 시간(1초)당 받는 태양 복사 에너지의 총량입니다. 정밀 인공위성 측정값은 약 1.367 kW/m²(킬로와트/제곱미터)입니다. 즉 우주 공간에 가로 1m, 세로 1m 판을 대놓으면 고출력 전기난로 1대 이상에 해당하는 열을 계속 받는 셈입니다.',
              bulletPoints: [
                '태양 상수 = 1.367 kW/m² (1,367 W/m²)',
                '지구의 자전과 구형 형태 때문에 지구 전체 평균 입사량은 약 340 W/m²'
              ]
            },
            {
              heading: '2. 들어온 에너지 100%는 어디로 갈까요?',
              body: '지구로 들어오는 총 태양 복사 에너지를 100이라고 할 때: 30~32는 구름, 대기 미립자, 눈과 얼음 표면에서 우주로 반사(알베도)되어 지구를 데우지 못하고 튕겨 나갑니다. 약 18은 대기 중의 오존과 수증기, 먼지에 흡수되고, 나머지 약 50%가 지표면(육지와 바다)에 도달해 지구를 따뜻하게 데웁니다.',
              bulletPoints: [
                '우주로 반사(알베도): 약 32% (구름 반사 20% + 지표 반사 4% + 대기 산란 8%)',
                '대기 직접 흡수: 약 18%',
                '지표면 흡수: 약 50% (생태계와 해류 순환의 원동력)'
              ]
            },
            {
              heading: '3. 지구가 끝없이 뜨거워지지 않는 이유: 복사 평형',
              body: '지구는 흡수한 에너지만큼 다시 눈에 보이지 않는 적외선(지구 복사 에너지) 형태로 우주로 방출합니다. 들어오는 양과 나가는 양이 완벽히 같기 때문에 지구의 평균 기온은 약 15℃로 안정되게 유지됩니다. 이를 "지구 복사 평형"이라고 부릅니다.'
            }
          ],
          keyTakeaway: '태양 복사 에너지는 반사, 흡수, 재방출의 정밀한 균형을 통해 지구를 너무 춥지도, 너무 뜨겁지도 않은 기적의 온도로 유지해 줍니다.',
          kidQuestion: {
            question: '눈(Snow)이 많이 쌓이면 왜 지구가 더 추워지나요?',
            answer: '새하얀 눈은 거울처럼 햇빛을 80~90% 이상 우주로 튕겨내 버리는 높은 반사율(알베도)을 갖고 있어서, 눈이 많이 쌓인 지역은 태양열을 거의 흡수하지 못해 더욱 추워집니다.'
          }
        }
      }
    ]
  },
  'sec-18-9-10': {
    sectionId: 'sec-18-9-10',
    conceptSummaryForKids: {
      analogyTitle: '태양 상수와 지구의 에너지 균형!',
      analogyText: '태양이 보낸 빛 에너지는 대기와 구름을 거쳐 지표면을 데우고 지구 생명체를 지탱합니다.',
      funFact: '태양 상수는 대기 최상단에서 1.367 kW/m²에 달합니다.'
    },
    resources: [
      {
        id: 'yt-greenhouse-fallback',
        type: 'youtube',
        title: '[NASA eClips] 지구의 에너지 균형과 태양 상수',
        source: 'NASA eClips',
        sourceTag: 'NASA 과학',
        youtubeVideoId: 'ssQ5KGJ5fYQ',
        url: 'https://www.youtube.com/watch?v=ssQ5KGJ5fYQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
        description: '태양 에너지 분배와 복사 평형 교육 영상입니다.',
        learningPoints: ['태양 상수와 에너지 수지'],
        durationOrReadTime: '약 6분 영상'
      }
    ]
  },
  'sec-18-11': {
    sectionId: 'sec-18-11',
    conceptSummaryForKids: {
      analogyTitle: '열이 움직이는 3총사: 복사(빛), 전도(맞닿음), 대류(순환)!',
      analogyText: '햇살이 얼굴을 따뜻하게 하는 건 복사, 뜨거운 냄비 손잡이를 잡으면 손이 데는 건 전도, 따뜻해진 국물이 위로 솟구치며 냄비 전체가 끓는 건 대류입니다!',
      funFact: '지구 대기를 움직이고 구름을 만들며 비를 내리게 하는 가장 강력한 원동력은 바로 지표면에서 공기가 데워져 위로 솟구치는 대류(Convection)입니다.'
    },
    resources: [
      {
        id: 'yt-heat-transfer',
        type: 'youtube',
        title: '[과학 물리 특강] 열의 3가지 전달 방식: 전도, 대류, 복사 (Heat Transfer)',
        source: 'The Organic Chemistry Tutor (한국어 자막)',
        sourceTag: '물리 필수 개념',
        youtubeVideoId: 'dWzX3hBYxdk',
        url: 'https://www.youtube.com/watch?v=dWzX3hBYxdk',
        thumbnailUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=600&auto=format&fit=crop&q=80',
        description: '지표면에서 일어나는 전도, 대기 순환을 일으키는 대류, 태양빛이 전달되는 복사를 시각적인 애니메이션과 공식으로 명쾌하게 설명합니다.',
        learningPoints: [
          '전도: 물질을 이루는 분자의 충돌을 통한 열전달 (지표면과 인접한 공기)',
          '대류: 기체나 액체 분자가 직접 이동하면서 열을 순환 (대기 순환의 핵심)',
          '복사: 물질(매질)의 도움 없이 전자기파 빛 형태로 직접 전달 (태양열)'
        ],
        durationOrReadTime: '약 12분 영상'
      },
      {
        id: 'blog-kma-heat',
        type: 'agency',
        title: '기상청 어린이 기상교실: 왜 산꼭대기보다 아랫마을이 더 따뜻할까?',
        source: '대한민국 기상청',
        sourceTag: '기상 과학',
        url: 'https://www.weather.go.kr',
        thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
        description: '공기는 태양빛에 직접 데워지는 것이 아니라, 햇빛을 받은 땅이 데워진 뒤 땅으로부터 전도와 대류를 통해 아래에서부터 위로 데워진다는 과학적 원리입니다.',
        learningPoints: [
          '지구 대기를 덥히는 난로는 하늘의 해가 아니라 땅바닥이라는 사실',
          '기온 감률(고도 1km당 -6.5°C)이 발생하는 이유'
        ],
        durationOrReadTime: '읽는 시간 약 4분',
        articleContent: {
          title: '기상청 어린이 기상교실: 태양이 하늘에 있는데 왜 높은 산꼭대기가 더 추울까요?',
          subtitle: '지구를 데우는 진짜 난로는 태양이 아니라 땅바닥(지표면)이라는 기상학적 진실',
          institution: '대한민국 기상청 어린이 기상과학관',
          badgeText: '기상청 어린이 탐구교실',
          readingTimeMinutes: 4,
          sections: [
            {
              heading: '1. 공기는 투명한 유리창처럼 햇빛을 그냥 통과시킵니다',
              body: '맑은 날 창문으로 들어오는 햇살을 만져보면 유리창 자체는 차갑지만 방바닥은 뜨끈뜨끈해집니다. 햇빛(태양 복사 에너지)은 파장이 짧은 단파 복사여서 투명한 공기를 그대로 뚫고 지나가기 때문입니다. 햇빛을 흡수해 뜨거워지는 것은 공기가 아니라 바로 어두운 흙과 바위, 아스팔트로 이루어진 "지표면"입니다.',
              bulletPoints: [
                '태양 복사: 가시광선 중심의 단파(공기를 거의 데우지 못함)',
                '지표 복사: 뜨거워진 땅이 내뿜는 파장이 긴 적외선(장파) 열기'
              ]
            },
            {
              heading: '2. 열의 3총사: 전도, 대류, 복사의 협동 작전',
              body: '① 땅바닥이 데워지면 땅과 맞닿은 얇은 공기층이 "전도(Conduction)"를 통해 가장 먼저 뜨거워집니다. ② 뜨거워진 가벼운 공기 덩어리는 하늘로 솟구치고 차가운 공기가 내려오는 "대류(Convection)"를 통해 공기가 위아래로 순환합니다. ③ 그리고 땅바닥은 계속해서 적외선 "복사(Radiation)"를 방출하여 온실기체를 데웁니다.',
              bulletPoints: [
                '전도: 땅바닥과 직접 닿은 1~2m 높이의 공기 가열',
                '대류: 공기 덩어리가 직접 상승하여 대류권 전체에 열 분배',
                '복사: 지표면이 뿜어내는 적외선 복사열'
              ]
            },
            {
              heading: '3. 산꼭대기가 추운 진짜 이유: 기온 감률(-6.5℃/km)',
              body: '추운 날 난로 옆에 가까이 있을 때 가장 따뜻하고, 난로에서 멀리 떨어질수록 추워지는 것과 같습니다. 지구의 대기를 데우는 난로는 하늘의 해가 아니라 바로 "지표면"입니다. 높은 산꼭대기는 난로(지표면)로부터 멀리 떨어져 있고, 공기의 압력도 낮아 팽창 냉각(단열 팽창)이 일어나므로 1km 올라갈 때마다 약 6.5℃씩 기온이 뚝 떨어지게 됩니다.'
            }
          ],
          keyTakeaway: '대기는 지표면에서 방출되는 열에 의해 아래쪽부터 데워지므로, 난로 역할을 하는 땅바닥에서 멀어질수록(고도가 높아질수록) 기온이 낮아집니다.',
          kidQuestion: {
            question: '여름철 아스팔트 위에서 아지랑이가 피어오르는 것도 대류 때문인가요?',
            answer: '맞습니다! 뜨거운 아스팔트에 의해 데워진 가벼운 공기가 격렬하게 솟구쳐 올라가면서 빛을 굴절시키기 때문에 아지랑이가 일렁이는 것처럼 보이는 현상입니다.'
          }
        }
      }
    ]
  }
};

// Fallback resources for review/summary sections
export const generalChapterMedia: SectionMediaInfo = {
  sectionId: 'general',
  conceptSummaryForKids: {
    analogyTitle: '지구의 대기 (Earth\'s Atmosphere) 총정리',
    analogyText: '우리가 숨 쉬는 공기는 우연히 생긴 것이 아니라, 생명체가 숨 쉬고 자외선과 우주 방사선으로부터 보호받으며 적절한 온도를 누리도록 완벽하게 설계된 생명의 보호막입니다.',
    funFact: '지구 반지름은 6,400km이지만 인간이 숨 쉴 수 있는 공기의 99%는 불과 지표면 30km 이내의 얇은 막 속에 모여 있습니다!'
  },
  resources: [
    {
      id: 'yt-ch18-summary',
      type: 'youtube',
      title: '[NASA] 10년의 태양 관측과 지구 대기의 경이 (A Decade of Sun)',
      source: 'NASA Goddard SDO Team',
      sourceTag: 'NASA 4K 공식',
      youtubeVideoId: 'l3QQQu7QLoM',
      url: 'https://www.youtube.com/watch?v=l3QQQu7QLoM',
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      description: 'NASA SDO 위성이 10년간 촬영한 4억 2천만 장의 고해상도 태양 데이터로 보는 태양 활동과 지구 복사 에너지의 원천입니다.',
      learningPoints: [
        '태양 코로나와 플레어, 태양풍의 에너지 방출 메커니즘',
        '지구 대기가 막아주는 태양 고에너지 방사선의 소중함'
      ],
      durationOrReadTime: '약 6분 영상'
    },
    {
      id: 'blog-kma-total',
      type: 'agency',
      title: '기상청 날씨누리: 기후변화와 지구 대기의 미래',
      source: '대한민국 기상청',
      sourceTag: '공식 포털',
      url: 'https://www.weather.go.kr',
      thumbnailUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80',
      description: '지구 대기 과학을 바탕으로 엘니뇨, 라니냐, 지구온난화와 온실가스 감축 노력을 종합 안내합니다.',
      learningPoints: [
        '대기 과학자가 하는 일과 기상 관측 기술의 발전',
        '우리 아이들이 실천할 수 있는 탄소 중립과 환경 보호'
      ],
      durationOrReadTime: '읽는 시간 약 6분',
      articleContent: {
        title: '기상청 날씨누리: 기후변화와 지구 대기의 미래',
        subtitle: '우리가 숨 쉬는 30km 얇은 생명의 막, 대기를 보전하기 위한 과학적 탐구',
        institution: '대한민국 기상청 날씨누리 기후변화감시센터',
        badgeText: '기상청 공식 기후과학',
        readingTimeMinutes: 6,
        sections: [
          {
            heading: '1. 인간이 숨 쉴 수 있는 대기층의 얇은 두께',
            body: '지구 반지름 6,400km와 비교할 때 인간이 생존할 수 있는 공기의 99%는 지표면 30km 이내에 모여 있습니다. 지구를 사과에 비유한다면 대기권의 두께는 사과 껍질보다도 훨씬 얇습니다. 이토록 얇고 깨지기 쉬운 공기의 균형 덕분에 우리가 오늘날 숨을 쉴 수 있습니다.',
            bulletPoints: [
              '지구 대기 전체 질량의 약 50%가 고도 5.5km 이내에 집중',
              '대기 질량의 약 90%가 고도 16km(대류권 계면) 이내에 존재'
            ]
          },
          {
            heading: '2. 현대 대기과학과 온실가스 감시',
            body: '기상청 안면도 기후변화감시소에서는 이산화탄소, 메탄, 아산화질소 등 대기 중 온실가스 농도를 24시간 실시간 측정하고 있습니다. 산업혁명 이전 280 ppm이었던 이산화탄소 농도는 현재 420 ppm을 돌파하여 지구 열 복사 평형을 교란하고 있습니다.',
            bulletPoints: [
              '온실가스의 적외선 흡수 증가로 인한 전 지구 평균기온 상승',
              '극단적인 가뭄, 폭우, 한파 등 이상기후 현상의 빈도 증가'
            ]
          }
        ],
        keyTakeaway: '대기는 무한한 공간이 아니라 정밀하게 조화된 얇은 생명의 보호막이므로 과학적 탐구와 환경 보호가 함께 이루어져야 합니다.',
        kidQuestion: {
          question: '우리가 대기를 깨끗하게 지키기 위해 오늘 할 수 있는 일은 무엇일까요?',
          answer: '가까운 거리는 걷거나 자전거를 타고, 쓰지 않는 전기 플러그를 뽑으며, 일회용품 대신 텀블러를 사용하는 작은 실천이 모여 온실가스 배출을 줄이고 맑은 공기를 지킬 수 있습니다!'
        }
      }
    }
  ]
};

export function getMediaForSection(sectionId: string): SectionMediaInfo {
  return relatedMediaBySection[sectionId] || generalChapterMedia;
}
