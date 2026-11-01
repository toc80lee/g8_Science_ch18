export interface MindMapKeywordNode {
  id: string;
  keyword: string;
  keywordEn?: string;
  question: string;
  hint: string;
  conceptPage?: number;
}

export interface MindMapBranch {
  id: string;
  title: string;
  titleEn: string;
  colorTheme: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'indigo';
  nodes: MindMapKeywordNode[];
}

export interface SectionMindMap {
  sectionId: string;
  centralTopic: string;
  centralTopicEn: string;
  bigQuestion: string;
  branches: MindMapBranch[];
}

export const SECTION_MIND_MAPS: Record<string, SectionMindMap> = {
  'intro-killer-air': {
    sectionId: 'intro-killer-air',
    centralTopic: '살인자 공기 (Killer Air) & 지구 대기의 가치',
    centralTopicEn: 'Killer Air & Value of Atmosphere',
    bigQuestion: '보이지 않는 공기 오염이 왜 전 세계에서 매년 550만 명의 생명을 위협할까?',
    branches: [
      {
        id: 'branch-manmade',
        title: '인위적 오염원',
        titleEn: 'Anthropogenic Sources',
        colorTheme: 'rose',
        nodes: [
          {
            id: 'smog',
            keyword: '스모그 (Smog)',
            keywordEn: 'Smoke + Fog',
            question: '연기와 안개가 결합한 도심 스모그는 왜 일반 먼지보다 호흡기에 치명적일까?',
            hint: '화석연료 연소 배출물(NOx, SOx)과 햇빛이 만나 형성되는 2차 유독 입자의 특성을 살펴보세요.',
            conceptPage: 429
          },
          {
            id: 'fossil-fuels',
            keyword: '화석연료 발전소 & 자동차',
            keywordEn: 'Fossil Plants & Vehicles',
            question: '전기차로 전환하면 도시의 공기 오염이 완전히 해결될 수 있을까?',
            hint: '화석연료 발전소에서 전기를 만드는 과정의 배출원과 배터리 제조 환경 영향을 함께 생각해보세요.',
            conceptPage: 429
          }
        ]
      },
      {
        id: 'branch-natural',
        title: '자연적 오염원',
        titleEn: 'Natural Sources',
        colorTheme: 'amber',
        nodes: [
          {
            id: 'volcano-radon',
            keyword: '화산재 & 방사성 라돈',
            keywordEn: 'Volcanic Ash & Radon',
            question: '자연에서 스스로 발생하는 물질도 인간에게 치명적인 대기 오염 물질이 될 수 있을까?',
            hint: '지하 암석에서 방출되는 무색·무취의 자연 방사성 라돈 가스가 실내에 농축되는 경로를 찾아보세요.',
            conceptPage: 429
          },
          {
            id: 'indoor-air',
            keyword: '실내 공기 질 (Indoor Air)',
            keywordEn: 'Indoor Air Hazards',
            question: '밀폐된 집 안의 공기가 때로는 바깥 공기보다 더 위험할 수 있는 이유는?',
            hint: '가구의 휘발성 유기화합물(VOCs)과 환기 부족으로 인한 유해 물질 농축을 교재에서 확인해보세요.',
            conceptPage: 429
          }
        ]
      },
      {
        id: 'branch-care',
        title: '대기 보호와 청지기',
        titleEn: 'Air Care & Solutions',
        colorTheme: 'emerald',
        nodes: [
          {
            id: 'solutions',
            keyword: '배출 저감 & 필터링',
            keywordEn: 'Emission Controls & Filters',
            question: '지구의 공기를 지키기 위해 기술과 개인의 실천 중 무엇이 더 중요할까?',
            hint: '발생 원점에서의 오염 저감 기술(촉매 변환기 등)과 에너지 절약 실천의 균형을 생각해보세요.',
            conceptPage: 429
          }
        ]
      }
    ]
  },

  'sec-18-1': {
    sectionId: 'sec-18-1',
    centralTopic: '18.1 공기 관리 (Air Care)',
    centralTopicEn: '18.1 Air Care & Atmospheric Protection',
    bigQuestion: '스스로 순환하는 대기 환경에서 왜 인류의 책임 있는 관리가 필요할까?',
    branches: [
      {
        id: 'branch-pollutants',
        title: '오염 물질의 분류',
        titleEn: 'Types of Pollutants',
        colorTheme: 'rose',
        nodes: [
          {
            id: 'particulates',
            keyword: '미세입자 (Particulates)',
            keywordEn: 'Dust, Ash & Soot',
            question: '입자의 크기가 작을수록 인체 폐포 깊숙이 침투하는 이유는?',
            hint: '기관지 섬모와 점막의 자연 방어선을 통과하는 마이크로미터 단위의 물리적 특성을 떠올려보세요.',
            conceptPage: 429
          },
          {
            id: 'toxic-gases',
            keyword: '유해가스 (CO, SO2, NOx)',
            keywordEn: 'Toxic Gases',
            question: '눈에 보이지 않는 무색 기체들이 대기 중에서 산성비로 바뀌는 과정은?',
            hint: '수증기 및 햇빛과의 광화학 반응으로 형성되는 황산·질산 에어로졸을 확인해보세요.',
            conceptPage: 429
          }
        ]
      },
      {
        id: 'branch-responsibility',
        title: '관리 책임 & 대책',
        titleEn: 'Management & Stewardship',
        colorTheme: 'blue',
        nodes: [
          {
            id: 'stewardship',
            keyword: '창조 세계 청지기',
            keywordEn: 'Biblical Stewardship',
            question: '성경(이사야 45:18)에서 지구를 사람이 살도록 지으셨다는 말씀의 환경적 의미는?',
            hint: '지구가 생명 번성을 위해 정교하게 조율된 행성이며, 이를 잘 가꾸어야 할 의무를 연결해보세요.',
            conceptPage: 429
          }
        ]
      }
    ]
  },

  'sec-18-2': {
    sectionId: 'sec-18-2',
    centralTopic: '18.2 대기의 기원: 두 가지 세계관',
    centralTopicEn: '18.2 Origin of the Atmosphere',
    bigQuestion: '산소와 질소가 풍부한 오늘날의 대기는 어떻게 처음 시작되었을까?',
    branches: [
      {
        id: 'branch-old-earth',
        title: '오랜 지구 진화론 모델',
        titleEn: 'Old-Earth Evolution Model',
        colorTheme: 'purple',
        nodes: [
          {
            id: 'early-anaerobic',
            keyword: '무산소 원시 대기',
            keywordEn: 'Anaerobic Atmosphere',
            question: '진화론 학자들은 왜 초기 대기에 산소가 전혀 없었다고 주장할까?',
            hint: '생명의 기본 요소인 유기물(아미노산)이 산소가 있으면 산화되어 파괴된다는 가설을 떠올려보세요.',
            conceptPage: 429
          },
          {
            id: 'oxygen-catastrophe',
            keyword: '산소 대참사 (Oxygen Catastrophe)',
            keywordEn: 'Great Oxidation Event',
            question: '남세균이 광합성으로 산소를 뿜어냈을 때 왜 기존 생물들에게는 대재앙이었을까?',
            hint: '24억 년 전 산소에 적응하지 못한 원시 혐기성 세균들의 대량 멸종과 지표면 철 산화 현상을 보세요.',
            conceptPage: 430
          }
        ]
      },
      {
        id: 'branch-young-earth',
        title: '젊은 지구 창조론 모델',
        titleEn: 'Young-Earth Creation Model',
        colorTheme: 'emerald',
        nodes: [
          {
            id: 'firmament-day2',
            keyword: '둘째 날 궁창 (Firmament)',
            keywordEn: 'Creation Day 2',
            question: '물과 물 사이에 궁창(대기권)이 만들어졌다는 기록의 과학적 의미는?',
            hint: '진화의 오랜 시행착오가 아니라 생명이 살기에 완벽한 비율로 한순간에 설계된 조성을 묵상해보세요.',
            conceptPage: 430
          },
          {
            id: 'flood-impact',
            keyword: '노아 홍수와 화산 활동',
            keywordEn: 'Flood Cataclysm',
            question: '전 지구적 홍수 시기의 거대한 화산 분출은 대기 기후에 어떤 변화를 일으켰을까?',
            hint: '엄청난 화산재 차광 효과와 따뜻해진 해수가 결합하여 빙하기를 촉발했다는 모델을 대조해보세요.',
            conceptPage: 430
          }
        ]
      }
    ]
  },

  'sec-18-3': {
    sectionId: 'sec-18-3',
    centralTopic: '18.3 성분층: 동질권 & 이질권',
    centralTopicEn: '18.3 Composition: Homosphere & Heterosphere',
    bigQuestion: '고도 80km를 기점으로 공기가 섞이는 원리가 180도 바뀌는 이유는?',
    branches: [
      {
        id: 'branch-homo',
        title: '동질권 (Homosphere: 0~80km)',
        titleEn: 'Homosphere (Uniform Mix)',
        colorTheme: 'blue',
        nodes: [
          {
            id: 'gas-mix',
            keyword: '78% N2 + 21% O2 균일 혼합',
            keywordEn: 'Constant Proportions',
            question: '왜 무거운 산소와 가벼운 질소가 아래위로 분리되지 않고 골고루 섞여 있을까?',
            hint: '지표 가열로 인한 바람, 난류, 대류 현상이 끊임없이 기체 분자들을 휘저어주기 때문입니다.',
            conceptPage: 431
          },
          {
            id: 'optimal-oxygen',
            keyword: '산소 21%의 정밀한 설계',
            keywordEn: 'Optimal 21% Oxygen Level',
            question: '만약 산소가 25%로 올라가거나 15%로 떨어지면 지구에는 어떤 일이 벌어질까?',
            hint: '산소 농도가 높으면 전 세계 산불이 멈추지 않고, 낮으면 생물이 질식하는 정밀한 균형을 생각해보세요.',
            conceptPage: 431
          }
        ]
      },
      {
        id: 'branch-hetero',
        title: '이질권 (Heterosphere: 80km+)',
        titleEn: 'Heterosphere (Layered)',
        colorTheme: 'indigo',
        nodes: [
          {
            id: 'density-layers',
            keyword: '기체 무게별 4개 층상 배열',
            keywordEn: 'Molecular Weight Sorting',
            question: '우주 경계 이질권에서는 왜 N2 ➔ O ➔ He ➔ H 순서로 층이 나뉠까?',
            hint: '대류 운동이 완전히 사라지고 중력에 의해 무거운 분자가 아래, 가벼운 원자가 위에 뜨는 원리입니다.',
            conceptPage: 432
          }
        ]
      }
    ]
  },

  'sec-18-4': {
    sectionId: 'sec-18-4',
    centralTopic: '18.4 5대 기온층 (Temperature Layers)',
    centralTopicEn: '18.4 Atmospheric Temperature Layers',
    bigQuestion: '우주로 올라갈 때 기온은 왜 단순하게 차가워지지 않고 지그재그로 오르내릴까?',
    branches: [
      {
        id: 'branch-lower-temp',
        title: '대류권 & 성층권',
        titleEn: 'Troposphere & Stratosphere',
        colorTheme: 'blue',
        nodes: [
          {
            id: 'troposphere',
            keyword: '대류권 (0~11km, 날씨의 무대)',
            keywordEn: 'Troposphere & Lapse Rate',
            question: '비, 눈, 태풍 같은 모든 기상 현상이 오직 대류권에서만 일어나는 비밀은?',
            hint: '대기 수증기의 99%가 모여 있고 고도가 높아질수록 기온이 떨어져 대류가 발생하는 조건을 확인해보세요.',
            conceptPage: 433
          },
          {
            id: 'stratosphere',
            keyword: '성층권 & 오존층 (11~50km)',
            keywordEn: 'Stratosphere & Inversion',
            question: '성층권은 왜 위로 갈수록 온도가 다시 올라가며, 여객기는 왜 이 층으로 날까?',
            hint: '오존이 자외선을 흡수해 열을 발생시키는 메커니즘과 기류가 안정된 비행 환경을 연결해보세요.',
            conceptPage: 434
          }
        ]
      },
      {
        id: 'branch-upper-temp',
        title: '중간권, 열권 & 외기권',
        titleEn: 'Mesosphere, Thermosphere & Exosphere',
        colorTheme: 'purple',
        nodes: [
          {
            id: 'mesosphere',
            keyword: '중간권 (영하 90℃ 최저온도)',
            keywordEn: 'Mesosphere (-90°C)',
            question: '가장 차가운 중간권에서 밤하늘의 유성(별똥별)이 불타오르는 원리는?',
            hint: '열 흡수원이 없어 극도로 차갑지만, 우주 암석 조각이 마찰을 일으킬 만큼의 공기 분자가 존재합니다.',
            conceptPage: 434
          },
          {
            id: 'thermosphere',
            keyword: '열권 (수천 도의 초고온)',
            keywordEn: 'Thermosphere (Extreme Heat)',
            question: '열권 기온은 1500℃가 넘는데, 왜 우주비행사는 뜨거움을 느끼지 못하고 얼어붙을까?',
            hint: '개별 분자의 속도(온도)와 에너지를 피부로 전달할 분자의 희박한 밀도(열량)의 물리적 차이를 질문해보세요.',
            conceptPage: 435
          }
        ]
      }
    ]
  },

  'sec-18-5': {
    sectionId: 'sec-18-5',
    centralTopic: '18.5 대기 순환: 탄소 & 질소',
    centralTopicEn: '18.5 Carbon and Nitrogen Cycles',
    bigQuestion: '수십억 생명체가 쉬지 않고 소비하는데도 대기 속 성분 비율이 유지되는 순환의 비밀은?',
    branches: [
      {
        id: 'branch-carbon',
        title: '탄소 순환 (Carbon Cycle)',
        titleEn: 'Carbon Cycling',
        colorTheme: 'emerald',
        nodes: [
          {
            id: 'photosynthesis-respiration',
            keyword: '광합성과 호흡의 시소',
            keywordEn: 'Photosynthesis vs Respiration',
            question: '식물과 동물이 주고받는 산소와 이산화탄소는 어떻게 완벽한 균형추를 이룰까?',
            hint: '빛이 있을 때 CO2를 고정하는 광합성과 세포 호흡으로 방출되는 탄소의 주고받음을 추적해보세요.',
            conceptPage: 436
          },
          {
            id: 'carbon-sinks',
            keyword: '거대한 탄소 저장소 (Sinks)',
            keywordEn: 'Oceans & Carbonate Rocks',
            question: '숲보다 훨씬 더 많은 탄소를 저장하고 있는 바다와 암석의 역할은?',
            hint: '바닷물에 녹아 있는 탄산이온과 조개껍질, 석회암으로 굳어지는 지질학적 탄소 순환을 탐구해보세요.',
            conceptPage: 436
          }
        ]
      },
      {
        id: 'branch-nitrogen',
        title: '질소 순환 (Nitrogen Cycle)',
        titleEn: 'Nitrogen Cycling',
        colorTheme: 'blue',
        nodes: [
          {
            id: 'nitrogen-fixation',
            keyword: '질소 고정 (삼중 결합 분해)',
            keywordEn: 'Nitrogen Fixation (N≡N)',
            question: '공기의 78%가 질소인데도 왜 식물은 비료 없이 대기 중 질소를 먹지 못할까?',
            hint: '질소 분자의 강력한 삼중 결합을 끊어주는 콩과식물 뿌리혹박테리아와 번개의 엄청난 에너지를 찾아보세요.',
            conceptPage: 437
          }
        ]
      }
    ]
  },

  'sec-18-6': {
    sectionId: 'sec-18-6',
    centralTopic: '18.6 특별 구역: 오존층 (Ozone Layer)',
    centralTopicEn: '18.6 The Ozone Layer',
    bigQuestion: '성층권의 눈에 보이지 않는 얇은 오존층이 지구 생명체에게 왜 필수적일까?',
    branches: [
      {
        id: 'branch-shield',
        title: '자외선 차단 방패',
        titleEn: 'UV Radiation Shield',
        colorTheme: 'blue',
        nodes: [
          {
            id: 'uv-absorption',
            keyword: 'UV-B 자외선 흡수',
            keywordEn: 'UV-B Shielding Mechanism',
            question: '자외선이 오존(O3)과 충돌하면 빛 에너지는 어디로 사라질까?',
            hint: '광자가 화학 결합을 끊고 산소 분자와 원자로 나뉘면서 열 에너지로 변환되는 과정을 살펴보세요.',
            conceptPage: 440
          },
          {
            id: 'chapman-cycle',
            keyword: '산소-오존 채프먼 순환',
            keywordEn: 'Continuous Chapman Cycle',
            question: '오존층은 끊임없이 파괴되면서도 어떻게 수억 년간 유지될 수 있었을까?',
            hint: '햇빛에 의해 지속적으로 생성과 분해를 반복하는 동적 평형 상태를 생각해보세요.',
            conceptPage: 440
          }
        ]
      },
      {
        id: 'branch-hole',
        title: '오존 구멍 & 프레온 가스',
        titleEn: 'Ozone Hole & CFCs',
        colorTheme: 'rose',
        nodes: [
          {
            id: 'cfc-catalyst',
            keyword: 'CFC 염소 촉매 반응',
            keywordEn: 'Chlorine Catalytic Cycle',
            question: '단 한 개의 염소 원자가 어떻게 10만 개의 오존 분자를 연쇄 파괴할까?',
            hint: '염소가 오존을 쪼갠 뒤 자신은 소모되지 않고 다시 재생되어 다른 오존을 공격하는 촉매 작용입니다.',
            conceptPage: 441
          }
        ]
      }
    ]
  },

  'sec-18-7': {
    sectionId: 'sec-18-7',
    centralTopic: '18.7 특별 구역: 전리층 (Ionosphere)',
    centralTopicEn: '18.7 The Ionosphere',
    bigQuestion: '둥근 지구 반대편으로 전파를 보내 멀리 라디오 방송을 들을 수 있는 이유는?',
    branches: [
      {
        id: 'branch-plasma',
        title: '플라즈마와 이온화',
        titleEn: 'Ionization & Plasma State',
        colorTheme: 'purple',
        nodes: [
          {
            id: 'solar-ionization',
            keyword: '태양 복사선 이온화',
            keywordEn: 'UV & X-ray Ionization',
            question: '태양의 강력한 자외선과 X선이 공기 분자에서 전자를 튕겨내면 어떤 일이 생길까?',
            hint: '전기 전도성을 띠는 자유 전자와 양이온이 가득 찬 플라즈마 층이 형성되는 원리를 탐구해보세요.',
            conceptPage: 442
          }
        ]
      },
      {
        id: 'branch-radio',
        title: '전파 반사와 주야간 변화',
        titleEn: 'Radio Waves & Day/Night Shifts',
        colorTheme: 'indigo',
        nodes: [
          {
            id: 'radio-reflection',
            keyword: '단파 전파 반사 (Skywave)',
            keywordEn: 'Skywave Propagation',
            question: '우주로 날아가는 라디오 전파를 거울처럼 지상으로 다시 튕겨내는 거대한 거울은?',
            hint: '자유 전자 밀도가 높은 전리층 F층에서 전파가 굴절되어 지구 곡면을 따라 멀리 도달합니다.',
            conceptPage: 442
          },
          {
            id: 'day-night-shift',
            keyword: '밤에 멀리 들리는 라디오',
            keywordEn: 'Nocturnal AM Radio Boost',
            question: '왜 낮에는 안 들리던 먼 도시의 AM 라디오 방송이 깊은 밤에 갑자기 선명하게 잡힐까?',
            hint: '밤에는 전파를 흡수하던 아래쪽 D/E층이 사라지고 높은 F층만 남아 멀리 반사되기 때문입니다.',
            conceptPage: 443
          }
        ]
      }
    ]
  },

  'sec-18-8': {
    sectionId: 'sec-18-8',
    centralTopic: '18.8 특별 구역: 자기권 & 밴앨런대',
    centralTopicEn: '18.8 Magnetosphere & Van Allen Belts',
    bigQuestion: '태양이 뿜어내는 치명적인 태양풍 입자 폭풍 속에서 지구는 어떻게 보호받을까?',
    branches: [
      {
        id: 'branch-shield-magnetic',
        title: '지구 자기장의 방패',
        titleEn: 'Geomagnetic Shield',
        colorTheme: 'emerald',
        nodes: [
          {
            id: 'solar-wind',
            keyword: '태양풍 편향 (Solar Wind Shield)',
            keywordEn: 'Deflecting Solar Wind',
            question: '만약 지구 외핵 대류가 멈춰 자기장이 사라진다면 화성처럼 대기를 잃게 될까?',
            hint: '자기력선이 전하를 띤 고속 플라즈마 입자를 좌우로 튕겨내 우주로 흘려보내는 원리를 상상해보세요.',
            conceptPage: 443
          },
          {
            id: 'van-allen',
            keyword: '밴앨런대 (Van Allen Belts)',
            keywordEn: 'Trapped Radiation Belts',
            question: '도넛 모양의 거대한 방사선 포획대는 우주선을 타고 달에 갈 때 왜 위험할까?',
            hint: '지구 자기장에 갇혀 고속 나선 운동을 하는 고에너지 양성자와 전자 무리의 방사선 피폭 위험을 찾아보세요.',
            conceptPage: 444
          }
        ]
      },
      {
        id: 'branch-aurora',
        title: '신비로운 오로라 (Aurora)',
        titleEn: 'Aurora Borealis & Australis',
        colorTheme: 'purple',
        nodes: [
          {
            id: 'aurora-lights',
            keyword: '극지방 대기 발광 현상',
            keywordEn: 'Polar Atmospheric Glow',
            question: '오로라는 왜 적도가 아니라 오직 극지방 하늘에서만 춤을 추며 신비로운 빛을 낼까?',
            hint: '자기력선이 모여드는 극지방 상공으로 쏟아진 태양 입자가 산소·질소 기체와 충돌할 때 내뿜는 빛입니다.',
            conceptPage: 444
          }
        ]
      }
    ]
  },

  'sec-18-9-10': {
    sectionId: 'sec-18-9-10',
    centralTopic: '18.9 태양 복사 & 18.10 태양 상수',
    centralTopicEn: '18.9 Radiant Sun & 18.10 Solar Constant',
    bigQuestion: '1억 5천만 km 떨어진 태양 에너지는 얼마나 정밀하게 지구에 도달할까?',
    branches: [
      {
        id: 'branch-spectrum',
        title: '전자기파 스펙트럼',
        titleEn: 'Electromagnetic Spectrum',
        colorTheme: 'amber',
        nodes: [
          {
            id: 'solar-spectrum',
            keyword: '가시광선 & 적외선 중심 방출',
            keywordEn: 'Visible Light & Infrared Peak',
            question: '태양이 내뿜는 무수한 빛 중 왜 하필 가시광선이 대기창을 뚫고 지표면에 가장 많이 닿을까?',
            hint: '대기 중의 기체 분자들이 흡수하지 않고 통과시키는 파장대와 식물 광합성의 파장을 비교해보세요.',
            conceptPage: 445
          }
        ]
      },
      {
        id: 'branch-constant',
        title: '태양 상수 (Solar Constant)',
        titleEn: 'Solar Constant (1.36 kW/m²)',
        colorTheme: 'rose',
        nodes: [
          {
            id: 'goldilocks',
            keyword: '태양 상수 1.36 kW/m²',
            keywordEn: 'Precision Solar Constant',
            question: '만약 지구가 태양에 5%만 더 가깝거나 멀었다면 생명체가 존재할 수 있었을까?',
            hint: '물이 액체 상태로 존재할 수 있는 골디락스 존(생명 가능 지대)의 정밀한 궤도 조건을 질문해보세요.',
            conceptPage: 445
          }
        ]
      }
    ]
  },

  'sec-18-11': {
    sectionId: 'sec-18-11',
    centralTopic: '18.11 대기 가열 방식: 복사, 전도, 대류',
    centralTopicEn: '18.11 Atmospheric Heat Transfer',
    bigQuestion: '햇빛은 투명한 공기를 그냥 통과하는데, 공기는 어떻게 따뜻하게 데워질까?',
    branches: [
      {
        id: 'branch-conduction-radiation',
        title: '지표 가열과 전도',
        titleEn: 'Surface Absorption & Conduction',
        colorTheme: 'rose',
        nodes: [
          {
            id: 'ground-first',
            keyword: '지표면이 먼저 데워지는 원리',
            keywordEn: 'Ground-First Warming',
            question: '난로처럼 햇빛이 공기를 직접 데우는 것이 아니라 땅을 먼저 데운다는 말의 뜻은?',
            hint: '투명한 공기는 햇빛을 흡수하지 못하고, 불투명한 땅이 먼저 흡수한 뒤 위로 열을 전달합니다.',
            conceptPage: 446
          },
          {
            id: 'conduction-contact',
            keyword: '직접 접촉 열전도 (Conduction)',
            keywordEn: 'Thermal Conduction',
            question: '달궈진 아스팔트 바닥과 바로 맞닿은 최하층 공기 분자는 어떻게 에너지를 얻을까?',
            hint: '분자들의 직접적인 충돌로 열이 이동하지만, 공기 자체는 열전도율이 매우 낮다는 사실을 기억하세요.',
            conceptPage: 446
          }
        ]
      },
      {
        id: 'branch-convection',
        title: '대류와 지구 열 순환',
        titleEn: 'Thermal Convection & Air Flow',
        colorTheme: 'blue',
        nodes: [
          {
            id: 'buoyancy-flow',
            keyword: '부력에 의한 대류 (Convection)',
            keywordEn: 'Thermal Convection Currents',
            question: '따뜻해진 공기가 가벼워져 위로 솟구치고 찬 공기가 내려앉는 거대한 순환의 의미는?',
            hint: '적도의 뜨거운 열을 극지방으로 실어나르는 지구 기후 시스템의 핵심 엔진을 찾아보세요.',
            conceptPage: 447
          }
        ]
      }
    ]
  },

  'sec-18-12': {
    sectionId: 'sec-18-12',
    centralTopic: '18.12 온실 효과 (Greenhouse Effect)',
    centralTopicEn: '18.12 The Greenhouse Effect',
    bigQuestion: '자연적 온실 효과가 없었다면 지구는 왜 영하 18℃의 얼음 행성이 되었을까?',
    branches: [
      {
        id: 'branch-mechanism',
        title: '온실 담요의 원리',
        titleEn: 'Blanket Mechanism',
        colorTheme: 'emerald',
        nodes: [
          {
            id: 'trapping-infrared',
            keyword: '지구 복사 적외선 재흡수',
            keywordEn: 'Trapping Terrestrial IR',
            question: '단파장의 가시광선은 통과하고 장파장의 적외선은 가두는 온실 기체의 작동 원리는?',
            hint: '비닐하우스 유리창처럼 지표면에서 우주로 빠져나가려는 열선을 기체 분자가 흡수해 재방출합니다.',
            conceptPage: 448
          },
          {
            id: 'water-vapor-co2',
            keyword: '수증기(H2O) & 이산화탄소(CO2)',
            keywordEn: 'Water Vapor & CO2 Trapping',
            question: '온실 효과의 가장 큰 기여를 하는 기체가 이산화탄소가 아니라 수증기라는 사실의 의미는?',
            hint: '자연적 온실 효과의 60~70%는 수증기가 담당하며, 인간 활동으로 증가하는 CO2가 추가 가열을 유발합니다.',
            conceptPage: 448
          }
        ]
      },
      {
        id: 'branch-balance',
        title: '자연 온실 vs 인위적 온난화',
        titleEn: 'Natural vs Enhanced Warming',
        colorTheme: 'amber',
        nodes: [
          {
            id: 'climate-balance',
            keyword: '평균 기온 15℃ 생명 유지',
            keywordEn: 'Stable 15°C Biosphere',
            question: '온실 효과는 무조건 나쁜 것일까? 생명체가 번성하기 위한 최적의 온실 기체 농도는?',
            hint: '자연적 온실 효과가 생명의 필수 조건임을 이해하고, 급격한 인위적 증가와의 차이를 비교해보세요.',
            conceptPage: 449
          }
        ]
      }
    ]
  }
};

export const getMindMapForSection = (sectionId: string): SectionMindMap => {
  if (SECTION_MIND_MAPS[sectionId]) {
    return SECTION_MIND_MAPS[sectionId];
  }

  // Fallback for review or summary sections
  return {
    sectionId,
    centralTopic: '소단원 핵심 탐구 구조',
    centralTopicEn: 'Section Inquiry Structure',
    bigQuestion: '이 단원에서 가장 중요한 핵심 개념과 원리는 어떻게 연결되어 있을까?',
    branches: [
      {
        id: 'b-concepts',
        title: '핵심 개념',
        titleEn: 'Core Concepts',
        colorTheme: 'blue',
        nodes: [
          {
            id: 'n1',
            keyword: '개념과 원리 구조화',
            keywordEn: 'Concept Synthesis',
            question: '단원 본문에서 다룬 가장 중요한 과학 원리 두 가지는 무엇인가요?',
            hint: '교재 텍스트와 용어 사전에서 핵심 단어를 찾아 질문을 스스로 만들어보세요.',
            conceptPage: 438
          }
        ]
      },
      {
        id: 'b-questions',
        title: '스스로 탐구 질문',
        titleEn: 'Inquiry Questions',
        colorTheme: 'purple',
        nodes: [
          {
            id: 'n2',
            keyword: '스스로 던지는 질문',
            keywordEn: 'Self-Directed Inquiries',
            question: '이 원리가 실생활이나 지구 환경에 어떻게 적용될 수 있을까요?',
            hint: '배운 내용을 바탕으로 나만의 "왜 그럴까?" 가설을 세워보세요.',
            conceptPage: 439
          }
        ]
      }
    ]
  };
};
