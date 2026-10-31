export interface MediaResource {
  id: string;
  type: 'youtube' | 'blog' | 'agency' | 'interactive';
  title: string;
  source: string;
  sourceTag: string; // e.g. "EBS 중학", "NASA", "기상청", "YTN 사이언스"
  url: string;
  thumbnailUrl: string;
  description: string;
  learningPoints: string[];
  durationOrReadTime?: string;
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
        title: '[역사 속 과학] 낮에도 캄캄했던 죽음의 마을, 1948 도노라 스모그 참사',
        source: 'YTN 사이언스',
        sourceTag: 'YTN 사이언스',
        url: 'https://www.youtube.com/results?search_query=도노라+스모그+참사+YTN',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
        description: '지구의 공기가 어떻게 생명을 위협하는 독가스로 변했는지 실제 도노라 사건을 다룬 과학 다큐멘터리 클립입니다.',
        learningPoints: [
          '대기 오염물질(이산화황, 불소 가스)이 갇히게 된 기온 역전 현상 이해',
          '공기의 소중함과 대기 보전의 역사적 전환점 학습'
        ],
        durationOrReadTime: '약 6분 영상'
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
        durationOrReadTime: '읽는 시간 약 4분'
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
        title: '[EBS 중학 과학] 지구를 감싸는 공기, 대기의 성분과 비율',
        source: 'EBS 중학',
        sourceTag: 'EBS 중학',
        url: 'https://www.youtube.com/results?search_query=EBS+중학+대기의+성분+질소+산소',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
        description: '질소 78%, 산소 21%, 아르곤 0.9%의 비율을 시각적인 그래프와 실험으로 배우는 대표 중등 과학 강의입니다.',
        learningPoints: [
          '기체 조성비 78:21:1 암기 공식과 각 기체의 화학적 성질',
          '아르곤, 헬륨 같은 비활성 기체(Noble Gas)가 공기 중에 존재하는 이유'
        ],
        durationOrReadTime: '약 7분 영상'
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
        durationOrReadTime: '읽는 시간 약 5분'
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
        title: '[지구과학 특강] 지구 대기의 기원과 남세균의 광합성 혁명',
        source: '과학쿠키 / YTN',
        sourceTag: '과학 채널',
        url: 'https://www.youtube.com/results?search_query=지구+대기의+기원+남세균+광합성',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
        description: '지구 초기 화산 가스 방출부터 광합성 생물의 등장까지 대기 진화론 모델을 비교 분석합니다.',
        learningPoints: [
          '밀러-유리 실험의 환원성 대기 가설과 그 한계점',
          '산소 발생과 지층의 줄무늬 철광층(BIF) 형성 과정'
        ],
        durationOrReadTime: '약 10분 영상'
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
        durationOrReadTime: '읽는 시간 약 6분'
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
        title: '[EBS 과학탐구] 질소 순환과 하버-보슈법: 공기로 빵을 만든 기적',
        source: 'EBS 수능특강 / 과학다큐',
        sourceTag: 'EBS 교과연계',
        url: 'https://www.youtube.com/results?search_query=EBS+질소순환+하버보슈법',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?w=600&auto=format&fit=crop&q=80',
        description: '질소 고정 세균, 벼락에 의한 질소 고정, 그리고 인공 질소 비료 합성이 지구 생태계를 움직이는 과정을 CG 그래픽으로 보여줍니다.',
        learningPoints: [
          '공기 중 불활성 질소(N₂)가 암모늄 이온(NH₄⁺)과 질산염(NO₃⁻)으로 변하는 질소 고정',
          '탈질 세균(Denitrifying bacteria)에 의해 다시 대기로 돌아가는 순환 고리'
        ],
        durationOrReadTime: '약 8분 영상'
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
        durationOrReadTime: '읽는 시간 약 5분'
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
        title: '[EBS 중학] 대기권의 구조: 대류권, 성층권, 중간권, 열권 한 번에 외우기',
        source: 'EBS 중학',
        sourceTag: 'EBS 중등 필수',
        url: 'https://www.youtube.com/results?search_query=EBS+대기권의+구조+대류권+성층권',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
        description: '기온 감률 곡선의 지그재그(W자형) 변화 이유와 대류 현상, 기상 현상의 유무를 완벽 정리합니다.',
        learningPoints: [
          '대류권(0~11km): 수증기와 대류가 있어 비·눈 등 기상 현상 발생',
          '성층권(11~50km): 대류가 없어 비행기 항로로 쓰이며 오존층 위치',
          '중간권(50~80km): 대기권 중 최저 기온(-90°C), 유성이 타는 곳'
        ],
        durationOrReadTime: '약 9분 영상'
      },
      {
        id: 'yt-baumgartner-jump',
        type: 'youtube',
        title: '[NASA & RedBull] 성층권 39km 우주 낙하: 펠릭스 바움가르트너의 음속 돌파',
        source: 'Red Bull Stratos Official',
        sourceTag: '실제 우주 점프',
        url: 'https://www.youtube.com/results?search_query=Felix+Baumgartner+Stratos+jump',
        thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
        description: '교재 p.432에 실린 바움가르트너의 성층권 스카이다이빙 실제 4K 영상입니다. 공기가 희박한 성층권의 신비를 눈으로 직접 확인할 수 있습니다.',
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
        title: '[지구과학 II] 화학적 대기 구분: 균질권(Homosphere) vs 이질권(Heterosphere)',
        source: '수능 지구과학 인강',
        sourceTag: '심화 과학',
        url: 'https://www.youtube.com/results?search_query=지구과학+균질권+이질권',
        thumbnailUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=600&auto=format&fit=crop&q=80',
        description: '난류 혼합이 일어나는 균질권과 분자 확산으로 기체 분자량에 따라 층이 나뉘는 이질권의 차이를 도표로 설명합니다.',
        learningPoints: [
          '균질권(0~80km)의 평균 분자량 28.97 유지 원리',
          '이질권(80km 이상): 질소층 → 산소층 → 헬륨층 → 수소층 순서'
        ],
        durationOrReadTime: '약 6분 영상'
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
        title: '[NASA 고다드 우주비행센터] 남극 오존홀 관측과 몬트리올 의정서의 기적',
        source: 'NASA Goddard / YTN 사이언스',
        sourceTag: 'NASA 공식 연계',
        url: 'https://www.youtube.com/results?search_query=NASA+남극+오존홀+몬트리올의정서',
        thumbnailUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&auto=format&fit=crop&q=80',
        description: 'NASA 인공위성이 1980년대부터 매년 가을 남극 상공의 오존층 구멍을 촬영한 실제 데이터 영상입니다.',
        learningPoints: [
          'CFCs에서 분리된 염소 원자(Cl)의 촉매 반응 메커니즘',
          '전 세계 국가들이 협력하여 프레온가스를 금지한 몬트리올 의정서(1987)의 교훈'
        ],
        durationOrReadTime: '약 7분 영상'
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
        durationOrReadTime: '읽는 시간 약 4분'
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
        title: '[우주전파센터] 전리층이란 무엇인가? 라디오 전파와 우주 전파 재난',
        source: '국립전파연구원 우주전파센터',
        sourceTag: '국립기관 공식',
        url: 'https://www.youtube.com/results?search_query=우주전파센터+전리층+단파통신',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        description: '전리층의 D, E, F층 구조와 태양 흑점 폭발 시 발생하는 델린저 현상(통신 두절)을 애니메이션으로 설명합니다.',
        learningPoints: [
          '전파의 반사 원리: 마이크로웨이브(GPS/위성)는 통과하고 단파(HF)는 반사',
          '태양 플레어가 폭발할 때 전리층 교란과 무선 통신 장애'
        ],
        durationOrReadTime: '약 5분 영상'
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
        title: '[NASA] 지구 자기권과 밴앨런 방사선대: 지구의 자기 방패',
        source: 'NASA 과학 채널 / YTN',
        sourceTag: 'NASA 우주과학',
        url: 'https://www.youtube.com/results?search_query=지구+자기권+밴앨런대+NASA',
        thumbnailUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&auto=format&fit=crop&q=80',
        description: '1958년 익스플로러 1호 위성으로 제임스 밴 앨런 박사가 발견한 도넛 모양의 방사선 벨트와 오로라 생성 원리를 생생한 CG로 감상합니다.',
        learningPoints: [
          '내부 방사선대(주로 고에너지 양성자)와 외부 방사선대(고에너지 전자)',
          '자기폭풍과 인공위성 보호를 위한 우주 날씨 예보의 중요성'
        ],
        durationOrReadTime: '약 8분 영상'
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
        durationOrReadTime: '읽는 시간 약 5분'
      }
    ]
  },
  'sec-18-9-10': {
    sectionId: 'sec-18-9-10',
    conceptSummaryForKids: {
      analogyTitle: '온실효과는 지구가 덮고 있는 포근한 극세사 솜이불!',
      analogyText: '태양이 보낸 가시광선은 투명하게 들어오지만, 지표면이 데워져서 내뿜는 적외선(열)은 수증기와 이산화탄소가 꽉 붙잡아 우주로 못 빠져나가게 합니다.',
      funFact: '만약 온실효과가 전혀 없다면 지구의 평균 기온은 영하 18°C로 꽁꽁 얼어붙어 모든 바다가 얼음이 되었을 것입니다! (현재 평균 기온은 포근한 영상 15°C)'
    },
    resources: [
      {
        id: 'yt-greenhouse-ebs',
        type: 'youtube',
        title: '[EBS 중학] 태양 복사 에너지와 지구 복사 평형, 온실효과의 진실',
        source: 'EBS 중학',
        sourceTag: 'EBS 중등 과학',
        url: 'https://www.youtube.com/results?search_query=EBS+태양복사에너지+복사평형+온실효과',
        thumbnailUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
        description: '입사하는 태양 에너지 100% 중 30%는 반사되고, 70%가 흡수된 뒤 다시 적외선으로 방출되는 복사 평형 에너지 수지를 명쾌하게 설명합니다.',
        learningPoints: [
          '태양 상수 (약 1.36 kW/m² or 1.367 J/s·cm²)의 물리적 의미',
          '자연적 온실효과(수증기가 1등 공신)와 인간 활동에 의한 지구온난화의 구분'
        ],
        durationOrReadTime: '약 9분 영상'
      },
      {
        id: 'blog-noaa-climate',
        type: 'agency',
        title: '미국 해양대기청(NOAA) Climate.gov: 온실기체와 기후 변화',
        source: 'NOAA (미국 해양대기청)',
        sourceTag: 'NOAA 공식',
        url: 'https://www.climate.gov',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
        description: '이산화탄소, 메탄(CH₄), 아산화질소(N₂O), 수증기가 적외선을 흡수하여 진동하는 분자 물리학 원리를 일러스트로 보여줍니다.',
        learningPoints: [
          '온실기체 분자의 비대칭 진동과 적외선 흡수 메커니즘',
          '지구 복사 평형(Energy Budget) 다이어그램 읽는 법'
        ],
        durationOrReadTime: '읽는 시간 약 6분'
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
        title: '[EBS 중학] 열의 3가지 이동 방법: 전도, 대류, 복사 완벽 정리와 실험',
        source: 'EBS 중학',
        sourceTag: 'EBS 물리/지구과학',
        url: 'https://www.youtube.com/results?search_query=EBS+열의이동+전도+대류+복사',
        thumbnailUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=600&auto=format&fit=crop&q=80',
        description: '교실에서 할 수 있는 열전도 비교 실험, 물의 대류 현상, 적외선 열화상 카메라로 보는 복사열을 실감나게 보여줍니다.',
        learningPoints: [
          '전도: 물질을 이루는 분자의 충돌을 통한 열전달 (지표면과 인접한 공기)',
          '대류: 기체나 액체 분자가 직접 이동하면서 열을 순환 (대기 순환의 핵심)',
          '복사: 물질(매질)의 도움 없이 전자기파 빛 형태로 직접 전달 (태양열)'
        ],
        durationOrReadTime: '약 7분 영상'
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
        durationOrReadTime: '읽는 시간 약 4분'
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
      title: '[지구과학 I] 지구의 대기 전 단원 20분 총정리 (EBS 수능특강)',
      source: 'EBSi 고등',
      sourceTag: 'EBS 총정리',
      url: 'https://www.youtube.com/results?search_query=지구과학+대기권의구조+온실효과+총정리',
      thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      description: '대기 성분비, 5개 층상 구조, 오존층, 전리층, 자기권, 태양 복사 평형과 온실효과 전 과정을 한 편으로 복습하는 총괄 강의입니다.',
      learningPoints: [
        '단원 21개 핵심 개념 간의 유기적 연결고리 파악',
        '시험 및 형성평가에 자주 출제되는 그래프와 기출 선지 분석'
      ],
      durationOrReadTime: '약 22분 영상'
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
      durationOrReadTime: '읽는 시간 약 6분'
    }
  ]
};

export function getMediaForSection(sectionId: string): SectionMediaInfo {
  return relatedMediaBySection[sectionId] || generalChapterMedia;
}
