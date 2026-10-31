import { KeyTerm, ReviewQuestion } from '../types';

export const keyTermsList: KeyTerm[] = [
  {
    term: "대기",
    termEn: "atmosphere",
    page: 429,
    definitionKo: "지구 또는 다른 천체를 둘러싸고 있는 기체들의 외피(envelope of gases).",
    definitionEn: "The envelope of gases that surrounds a planet or celestial body."
  },
  {
    term: "동질권",
    termEn: "homosphere",
    page: 433,
    definitionKo: "지표면에서 고도 약 80km까지 바람과 기상에 의해 기체들이 균일하게 섞여 일정한 성분비를 유지하는 대기 구역.",
    definitionEn: "The zone of a uniform mixture of gases closest to the earth's surface; extends from ground level to an altitude of about 80 km."
  },
  {
    term: "이질권",
    termEn: "heterosphere",
    page: 433,
    definitionKo: "동질권 상부(80km 이상)에서 기체들이 원자량/분자량에 따라 여러 층으로 분리되어 존재하는 대기 구역.",
    definitionEn: "The zone of the earth's atmosphere above the homosphere consisting of distinct layers of different gases; extends from about 80 km to interplanetary space."
  },
  {
    term: "대류권",
    termEn: "troposphere",
    page: 433,
    definitionKo: "지표면에서 시작하여 약 9~17km까지 이어지는 최하층 대기로, 거의 모든 기상 현상이 발생하고 고도에 따라 기온이 감소함.",
    definitionEn: "The lowest temperature layer of Earth's atmosphere extending from ground level to about 11 km; where most weather occurs and temperature decreases with altitude."
  },
  {
    term: "기온 감률",
    termEn: "lapse rate",
    page: 433,
    definitionKo: "대류권에서 고도가 1km 증가할 때마다 기온이 일정하게 약 6.5°C씩 낮아지는 비율.",
    definitionEn: "The steady change in temperature with altitude, approximately 6.5°C decrease per kilometer in the troposphere."
  },
  {
    term: "성층권",
    termEn: "stratosphere",
    page: 434,
    definitionKo: "대류권계면에서 약 50km까지 이어지는 층으로, 구름과 먼지가 없으며 오존의 자외선 흡수로 고도에 따라 기온이 상승함.",
    definitionEn: "The temperature layer of Earth's atmosphere above the troposphere and below the mesosphere, extending from about 11 km to about 50 km; temperature increases with altitude."
  },
  {
    term: "제트기류",
    termEn: "jet stream",
    page: 434,
    definitionKo: "성층권 하부에서 시속 최대 400km로 좁은 통로를 따라 빠르게 부는 강력한 편서풍 기류.",
    definitionEn: "One of several belts of high-speed winds in the stratosphere that wind eastward around the earth at speeds up to 400 kph."
  },
  {
    term: "중간권",
    termEn: "mesosphere",
    page: 434,
    definitionKo: "성층권계면(약 50km)에서 80km까지의 층으로, 고도에 따라 기온이 감소하여 대기권 최저 기온(-90°C)을 기록함.",
    definitionEn: "The temperature layer of Earth's atmosphere above the stratosphere and below the thermosphere, extending from about 50 km to 80 km; coldest atmospheric temperatures occur here."
  },
  {
    term: "열권",
    termEn: "thermosphere",
    page: 436,
    definitionKo: "중간권계면(80km)에서 약 500km까지의 대기층으로, 기체 분자가 태양 방사선을 흡수하여 주간 기온이 650~1250°C까지 치솟음.",
    definitionEn: "The temperature layer of Earth's atmosphere above the mesosphere, extending from 80 km to about 500 km; daytime temperatures are very high as scattered molecules absorb solar radiation."
  },
  {
    term: "외기권",
    termEn: "exosphere",
    page: 436,
    definitionKo: "열권 위의 전이 지대로, 기체 입자가 극도로 희박하여 행성 간 공간으로 자유롭게 탈출하는 영역.",
    definitionEn: "Region of the atmosphere above the thermosphere (above 500 km) where the atmosphere thins into interplanetary space and particles escape Earth's gravity."
  },
  {
    term: "오존층",
    termEn: "ozone layer",
    page: 440,
    definitionKo: "성층권(약 20~50km)에 위치한 오존(O3) 농집 구역으로, 유해한 태양 자외선(UV)을 흡수하여 생명체를 보호함.",
    definitionEn: "A layer of concentrated ozone (O3) in the stratosphere that shields the earth from harmful ultraviolet light from the sun."
  },
  {
    term: "전리층",
    termEn: "ionosphere",
    page: 442,
    definitionKo: "고도 75~500km의 이온화된 원자층으로, AM 및 단파 라디오 통신 전파를 반사하고 마이크로파를 통과시킴.",
    definitionEn: "A region of the earth's atmosphere in the thermosphere (75 to 500 km) containing a high concentration of ions and free electrons; useful for reflecting radio waves."
  },
  {
    term: "자기권",
    termEn: "magnetosphere",
    page: 442,
    definitionKo: "지구의 자기장이 지배하는 공간(60,000~160,000km)으로, 태양풍의 치명적인 하전 입자들을 포획하고 방어함.",
    definitionEn: "The geomagnetic field that surrounds the earth, extending 60,000 to 160,000 km, that protects living organisms from the damage of the solar wind."
  },
  {
    term: "태양 상수",
    termEn: "solar constant",
    page: 445,
    definitionKo: "지구 대기 최상단에 수직으로 입사하는 태양 복사 에너지의 유율로, 약 1.367 kW/m²임.",
    definitionEn: "The rate of the flow of radiant energy from the sun that reaches through space to the top of the earth's atmosphere, about 1.367 kW/m²."
  },
  {
    term: "복사",
    termEn: "radiation",
    page: 447,
    definitionKo: "전자기파(주로 적외선이나 가시광선) 형태로 매질 없이 공간을 통해 에너지가 전달되는 방식.",
    definitionEn: "The emission and propagation of energy in the form of electromagnetic waves; one of three methods of heat transfer."
  },
  {
    term: "전도",
    termEn: "conduction",
    page: 447,
    definitionKo: "물질 간의 직접 접촉을 통해 분자들의 충돌로 열(운동 에너지)이 전달되는 방식.",
    definitionEn: "Heat transfer by direct contact between two substances; kinetic energy passes between colliding molecules."
  },
  {
    term: "대류",
    termEn: "convection",
    page: 447,
    definitionKo: "가열된 유체(공기)가 팽창하여 밀도가 낮아져 상승하고 차가운 유체가 하강하는 밀도 차이에 의한 순환 열전달 방식.",
    definitionEn: "The transfer of thermal energy by the flow of a fluid caused by differences in density in a gravitational field."
  },
  {
    term: "온실 효과",
    termEn: "greenhouse effect",
    page: 448,
    definitionKo: "단파장 태양광은 투과시키고 지표면이 방출하는 장파장 적외선은 대기 중 기체가 흡수하여 지표 기온을 보온하는 효과.",
    definitionEn: "Warming of the lower atmosphere as it traps and absorbs infrared energy emitted by the ground and water from absorbed sunlight."
  },
  {
    term: "온실 가스",
    termEn: "greenhouse gas",
    page: 448,
    definitionKo: "온실 효과를 일으키는 대기 중의 기체들로, 주로 수증기(H2O)와 이산화탄소(CO2)가 대표적임.",
    definitionEn: "Normal atmospheric gases such as water vapor, carbon dioxide, and methane that contribute to the greenhouse effect."
  }
];

export const chapterSummaryPoints: string[] = [
  "대도시 인구 증가에 따른 주요 과제 중 하나는 대기 오염(스모그, 미세먼지)을 최소화하는 것입니다.",
  "인류는 대기를 지혜롭게 돌보고 청지기로서 관리해야 할 책임을 하나님께 부여받았습니다.",
  "대기는 지구를 둘러싼 기체 외피이며, 대기가 없다면 지구상의 생명체는 살아갈 수 없습니다.",
  "오랜 지구 진화론자들은 초기 지구가 독성 무산소 대기로 시작하여 24억 년 전 시아노박테리아 등의 광합성 진화로 오늘날의 산소 대기가 되었다고 주장합니다.",
  "성경적 창조론자들은 하나님께서 창조 주간 둘째 날 궁창을 지으사 셋째 날 식물과 넷째~여섯째 날 동물과 인간의 생명 유지에 완벽한 대기를 마련하셨다고 봅니다.",
  "대기를 구성하는 두 가지 핵심 원소는 산소(21%)와 질소(78%)입니다.",
  "기체 성분의 균일성에 따라 대기는 하부의 '동질권(Homosphere, 0~80km)'과 상부의 '이질권(Heterosphere, 80km 이상)'으로 구분됩니다.",
  "온도 프로파일에 따라 대기는 대류권, 성층권, 중간권, 열권, 외기권의 5개 층으로 분류됩니다.",
  "탄소와 질소 같은 필수 영양소는 대기, 땅, 바다, 생명체 사이를 끊임없이 재활용되며 순환합니다.",
  "오존층(성층권)과 자기권(지구 외부 6만~16만 km)은 우주와 태양에서 오는 치명적인 유해 방사선과 입자들을 차단하는 특수 구역입니다.",
  "전리층은 지구 곡면을 따라 단파 라디오 통신을 반사하는 유용한 이온층입니다.",
  "태양 상수(1.367 kW/m²)로 도달하는 태양 복사 에너지 중 일부는 구름과 대기에 반사/흡수되고, 지표면이 50% 이상을 흡수하여 복사·전도·대류 및 온실 효과로 대기를 데웁니다."
];

export const questions18A: ReviewQuestion[] = [
  {
    id: 101,
    questionNumber: "18A-1",
    type: "short_answer",
    question: "대기 중의 오염 물질을 줄이기 위해 우리가 할 수 있는 실천 방안들은 무엇인가요?",
    questionEn: "What are some ways that we can reduce pollutants in the atmosphere?",
    correctAnswer: "전기차 도입, 석탄 화력 발전 대체 및 신재생에너지 전환, 배출가스 정화 필터 장착, 대중교통 이용",
    explanation: "화석연료를 쓰지 않는 전기 자동차 개발, 공장과 발전소의 배출가스 저감 필터링 기술, 석탄 발전 축소 등이 교재에 제시되어 있습니다.",
    page: 429
  },
  {
    id: 102,
    questionNumber: "18A-2",
    type: "essay",
    question: "대기의 기원에 대한 두 가지 주요 관점(오랜 지구 vs 젊은 지구)을 비교 설명하세요.",
    questionEn: "Compare the two views of the atmosphere's origin.",
    correctAnswer: "오랜 지구: 45억 년 전 무산소 원시 대기에서 혐기성 생물 출현 후 24억 년 전 시아노박테리아 광합성으로 산소 축적 / 젊은 지구: 창조 주간(Day 2 궁창) 하나님이 생명체에 맞게 완전하게 조성",
    explanation: "오랜 지구 관점은 자연주의적 진화와 오랜 시간에 걸친 산소 축적을 말하며, 젊은 지구 관점은 창조주의 목적론적 설계를 강조합니다.",
    page: 430
  },
  {
    id: 103,
    questionNumber: "18A-3",
    type: "short_answer",
    question: "성분에 따른 대기의 두 구역을 명시하고, 각 구역을 이루는 기체 특징을 설명하세요.",
    questionEn: "Sketch and label the two different composition regions of the atmosphere, including the layers that make them up.",
    correctAnswer: "동질권(Homosphere: 0~80km, 기체가 균일하게 혼합) / 이질권(Heterosphere: 80km 이상, 원자량 순서로 N2, O2, O, He, H2 층상 분리)",
    explanation: "동질권은 바람에 의해 잘 섞여 있고, 이질권은 바람이 없어 중력과 원자량에 따라 가벼운 기체가 상층부에 위치합니다.",
    page: 432
  },
  {
    id: 104,
    questionNumber: "18A-4",
    type: "short_answer",
    question: "대류권이 다른 모든 온도 대기층과 구별되는 가장 결정적인 차이점은 무엇인가요?",
    questionEn: "Explain how the troposphere is different from all the other temperature layers in the atmosphere.",
    correctAnswer: "수증기를 머금고 활발한 열 대류(Thermal mixing)가 일어나 모든 날씨(기상 현상)가 발생한다는 점",
    explanation: "대류권은 지표면 가열로 인한 대류와 풍부한 수증기 덕분에 비, 눈, 구름 등 기상 현상이 일어나는 유일한 층입니다.",
    page: 433
  },
  {
    id: 105,
    questionNumber: "18A-5",
    type: "short_answer",
    question: "인간은 성층권의 제트기류(Jet stream)를 어떻게 지혜롭게 활용하여 통치(Dominion)할 수 있나요?",
    questionEn: "How can we exercise wise dominion by using the jet streams in the stratosphere?",
    correctAnswer: "장거리 항공기가 제트기류를 타고 비행함으로써 비행 속도를 높이고 연료를 대폭 절약함",
    explanation: "시속 최대 400km의 제트기류를 순방향으로 타면 여객기의 이동 시간을 단축하고 탄소 배출과 연료 소비를 줄일 수 있습니다.",
    page: 434
  },
  {
    id: 106,
    questionNumber: "18A-6",
    type: "short_answer",
    question: "중간권은 대기의 온도층 중에서 어떤 독특한 특징을 가지고 있나요?",
    questionEn: "How is the mesosphere unique among the temperature layers of the atmosphere?",
    correctAnswer: "대기권 전체에서 가장 차가운 최저 기온(약 -90°C)을 기록함",
    explanation: "중간권 상단(중간권계면)은 약 -90°C로 지구 대기권에서 가장 온도가 낮습니다.",
    page: 434
  },
  {
    id: 107,
    questionNumber: "18A-7",
    type: "short_answer",
    question: "낮 동안 가장 뜨거운 온도를 나타내는 대기의 진정한 층은 어디인가요?",
    questionEn: "Which true layer of the atmosphere has the hottest daytime temperatures?",
    correctAnswer: "열권 (Thermosphere, 주간 650°C ~ 1250°C)",
    explanation: "열권의 기체 입자들은 태양 복사선을 직접 흡수하여 주간에 1250°C까지 치솟습니다.",
    page: 436
  },
  {
    id: 108,
    questionNumber: "18A-8",
    type: "short_answer",
    question: "대기 중에 질소가 78%나 풍부함에도 불구하고 식물이 공기 중에서 직접 질소를 흡수하여 조직을 만들 수 없는 이유는 무엇인가요?",
    questionEn: "Why can't plants get nitrogen directly out of the air to use for building tissues?",
    correctAnswer: "대기 질소(N2)는 결합이 매우 강한 비활성(inert) 상태이므로, 질소 고정 세균이나 번개에 의해 화합물로 전환되어야만 흡수 가능하기 때문",
    explanation: "순수 질소 분자는 삼중 공유결합으로 매우 안정하여 화학반응에 쉽게 참여하지 못합니다.",
    page: 438
  },
  {
    id: 109,
    questionNumber: "18A-9",
    type: "true_false",
    question: "(True or False) 대기 온도는 지표면에서 외기권까지 고도가 높아짐에 따라 지속적이고 매끄럽게 감소한다.",
    questionEn: "(True or False) Atmospheric temperature decreases continuously and smoothly with altitude from the ground to the exosphere.",
    correctAnswer: false,
    explanation: "False! 대기 온도는 대류권(감소) -> 성층권(상승) -> 중간권(감소) -> 열권(상승)으로 지그재그 패턴을 보입니다.",
    page: 435
  }
];

export const questions18B: ReviewQuestion[] = [
  {
    id: 201,
    questionNumber: "18B-1",
    type: "short_answer",
    question: "대기의 세 가지 특수 구역(또는 영역)의 이름을 제시하세요.",
    questionEn: "Name three special layers or regions of the atmosphere.",
    correctAnswer: "오존층 (Ozone layer), 전리층 (Ionosphere), 자기권 (Magnetosphere)",
    explanation: "18B 단원에서 다루는 세 가지 특수 구역은 오존층, 전리층, 자기권입니다.",
    page: 439
  },
  {
    id: 202,
    questionNumber: "18B-2",
    type: "essay",
    question: "일반적으로 대기의 특수 구역들은 지구 생명체를 보호하는 데 어떻게 도움을 주나요?",
    questionEn: "In general, how do some of the special layers of the atmosphere help protect life on Earth?",
    correctAnswer: "오존층은 유해 자외선 차단, 전리층은 전파 반사 및 고에너지 흡수, 자기권은 태양풍의 치명적인 방사선 입자를 차단",
    explanation: "이 특수 구역들은 우주와 태양에서 오는 유해 광선과 플라스마 입자들을 완벽히 걸러내는 다층 방어막입니다.",
    page: 440
  },
  {
    id: 203,
    questionNumber: "18B-3",
    type: "short_answer",
    question: "대기 중에서 오존(Ozone)이 형성되는 과정을 화학적으로 설명하세요.",
    questionEn: "Explain how ozone forms in the atmosphere.",
    correctAnswer: "자외선이 산소 분자(O2)를 원자 산소(O)로 쪼개고, 자유 산소 원자가 다른 산소 분자와 결합하여 오존(O3)을 형성함",
    explanation: "O2 + UV -> O + O, 이후 O + O2 -> O3 반응이 연속적으로 일어납니다.",
    page: 439
  },
  {
    id: 204,
    questionNumber: "18B-4",
    type: "short_answer",
    question: "과학자들이 오존층 파괴에 대해 크게 우려한 이유는 무엇인가요?",
    questionEn: "Why are scientists concerned about the ozone layer?",
    correctAnswer: "오존층이 얇아지면 지표면으로 유입되는 자외선이 증가하여 피부암, 백내장, 생태계 및 해양 식물플랑크톤 파괴를 유발하기 때문",
    explanation: "자외선은 DNA 손상과 암을 유발하며 먹이사슬의 기초인 플랑크톤을 죽입니다.",
    page: 441
  },
  {
    id: 205,
    questionNumber: "18B-5",
    type: "short_answer",
    question: "NASA가 국제우주정거장(ISS)의 우주비행사들과 교신할 때 장파 라디오 통신을 사용하지 않는 이유는 무엇인가요?",
    questionEn: "Why wouldn't NASA want to use long-wave radio communications to stay in contact with astronauts in the International Space Station?",
    correctAnswer: "장파 라디오 전파는 전리층(Ionosphere)에 반사되어 우주로 빠져나가지 못하기 때문에, 전리층을 통과하는 마이크로파를 써야 함",
    explanation: "전리층은 장파와 AM 전파를 지표면으로 반사시키므로 외우주와 교신하려면 마이크로파가 필수적입니다.",
    page: 442
  },
  {
    id: 206,
    questionNumber: "18B-6",
    type: "short_answer",
    question: "태양의 태양풍에서 날아온 대부분의 하전 입자들은 자기권의 어디에 갇히게 되나요?",
    questionEn: "Where do most of the sun's solar wind particles end up trapped in the magnetosphere?",
    correctAnswer: "밴 앨런 복사대 (Van Allen belts)",
    explanation: "제임스 밴 앨런이 발견한 도넛 형태의 밴 앨런 복사대에 포획됩니다.",
    page: 442
  },
  {
    id: 207,
    questionNumber: "18B-7",
    type: "short_answer",
    question: "우주여행자가 밴 앨런대의 위험한 방사선 피폭을 피할 수 있는 세 가지 방법은 무엇인가요?",
    questionEn: "State three ways that space travelers can avoid too much dangerous radiation exposure from the Van Allen belts.",
    correctAnswer: "1. 두터운 차폐벽(Heavily shielded) 장착, 2. 복사대를 매우 신속하게 통과, 3. 복사대를 우회하는 궤적 비행",
    explanation: "교재 본문에 방사선 차폐벽 구축 및 빠른 속도로 통과하는 대책이 명시되어 있습니다.",
    page: 443
  },
  {
    id: 208,
    questionNumber: "18B-8",
    type: "true_false",
    question: "(True or False) 전리층은 현대 마이크로파 위성 통신에 있어 중요한 보조 수단이다.",
    questionEn: "(True or False) The ionosphere is an important aid to modern microwave satellite communications.",
    correctAnswer: false,
    explanation: "False! 전리층은 마이크로파를 반사하지 않고 통과시킵니다. 마이크로파 통신은 전리층에 반사되는 것이 아니라 직진 통과하는 특성을 활용합니다.",
    page: 442
  }
];

export const questions18C: ReviewQuestion[] = [
  {
    id: 301,
    questionNumber: "18C-1",
    type: "short_answer",
    question: "지구 표면이 흡수하는 복사 에너지의 대부분은 어떤 종류의 전자기파인가요?",
    questionEn: "What kinds of radiant energy make up most of what the earth's surface receives?",
    correctAnswer: "가시광선 (Visible light)과 적외선 (Infrared wavelengths)",
    explanation: "태양 복사 에너지는 주로 가시광선과 적외선 대역에 집중되어 있습니다.",
    page: 445
  },
  {
    id: 302,
    questionNumber: "18C-2",
    type: "short_answer",
    question: "태양 상수의 값은 얼마이며, 그것은 어디에서 측정되나요?",
    questionEn: "What is the solar constant? Where is it measured?",
    correctAnswer: "약 1.367 kW/m², 지구 대기 최상단(우주 경계면)에서 측정됨",
    explanation: "대기 필터링을 거치기 전 대기 최상단에서 수직 입사하는 태양 에너지의 유율입니다.",
    page: 445
  },
  {
    id: 303,
    questionNumber: "18C-3",
    type: "essay",
    question: "태양의 복사 에너지가 대기를 통과하여 지표면에 도달할 때 일어나는 분배 과정을 설명하세요.",
    questionEn: "Make a sketch that shows what happens to the sun's radiant energy as it passes through the earth's atmosphere to the earth's surface.",
    correctAnswer: "구름과 미립자가 최대 32% 우주로 반사, 구름/먼지/수증기가 최대 18% 대기 흡수, 지표면(육지와 물)이 50% 이상 흡수",
    explanation: "대기 수지: 32% 반사, 18% 대기 흡수, 50%+ 지표 흡수.",
    page: 446
  },
  {
    id: 304,
    questionNumber: "18C-4",
    type: "essay",
    question: "태양이 대기를 데우는 3가지 방식(복사, 전도, 대류)을 비교 설명하세요.",
    questionEn: "Compare the three different ways that the sun warms the atmosphere.",
    correctAnswer: "복사: 지표가 흡수한 열을 적외선으로 재방출 / 전도: 지표면과 공기 분자의 직접 충돌 접촉 가열 / 대류: 데워진 가벼운 공기가 상승하고 찬 공기가 하강하는 순환류",
    explanation: "복사는 전자기파, 전도는 직접 접촉 분자 충돌, 대류는 유체의 수직 밀도 순환 이동입니다.",
    page: 447
  },
  {
    id: 305,
    questionNumber: "18C-5",
    type: "essay",
    question: "온실 효과(The Greenhouse Effect)를 상세히 서술하세요.",
    questionEn: "Describe the greenhouse effect.",
    correctAnswer: "단파장 태양광은 대기를 쉽게 통과하여 지표를 데우고, 지표가 방출하는 장파장 열적외선을 대기 중 온실가스가 포획하여 지구를 따뜻하게 보온하는 현상",
    explanation: "온실의 유리처럼 단파는 통과시키고 장파 열은 대기 중에 가두어 온도를 유지합니다.",
    page: 448
  },
  {
    id: 306,
    questionNumber: "18C-6",
    type: "short_answer",
    question: "온실 효과에 가장 크게 기여하는 두 가지 기체는 무엇인가요?",
    questionEn: "Which two gases contribute most to the greenhouse effect?",
    correctAnswer: "수증기 (Water vapor, 1위)와 이산화탄소 (Carbon dioxide, 2위)",
    explanation: "자연 온실효과 기여도가 가장 큰 기체는 수증기이며 그다음이 이산화탄소입니다.",
    page: 448
  },
  {
    id: 307,
    questionNumber: "18C-7",
    type: "true_false",
    question: "(True or False) 다른 조건이 모두 일정할 때, 온실 효과 때문에 흐린 하늘 아래 지표면 온도가 맑은 하늘보다 더 따뜻할 수 있다.",
    questionEn: "(True or False) All other conditions remaining the same, temperatures on the ground under cloudy skies could be warmer than under clear skies because of the greenhouse effect.",
    correctAnswer: true,
    explanation: "True! 구름(수증기)은 지표면에서 복사되는 적외선 열을 강력하게 차단하여 밤에 기온이 떨어지는 것을 막아줍니다.",
    page: 449
  }
];

export const fullChapterReviewQuestions: ReviewQuestion[] = [
  {
    id: 1,
    questionNumber: "1",
    type: "short_answer",
    question: "대기 오염(Air pollution)이란 무엇이며, 왜 그것이 심각한 문제인가요?",
    questionEn: "What is air pollution? Why is it a problem?",
    correctAnswer: "호흡을 방해하거나 유해한 기체 또는 미립자가 공기 중으로 유입되는 현상으로, 전 세계에서 매년 550만 명의 조기 사망을 초래하기 때문",
    explanation: "도시 스모그와 유독 물질은 호흡기 및 심혈관 질환을 유발하여 사망에 이르게 합니다.",
    page: 429
  },
  {
    id: 2,
    questionNumber: "2",
    type: "essay",
    question: "지구의 대기는 태양계의 다른 행성(목성, 금성, 화성, 달)과 어떻게 다르며, 이것이 왜 중요한가요?",
    questionEn: "What makes Earth's atmosphere different from those surrounding other bodies in our solar system? Why is this significant?",
    correctAnswer: "다른 행성은 수소/헬륨(목성)이나 유독한 고농도 CO2/황산(금성, 화성), 진공(달)인 반면, 지구는 78% 질소와 21% 산소로 생명체가 호흡하고 살아가기에 완벽하게 조성되어 있음",
    explanation: "지구의 독특한 대기는 생명체 거주를 위한 창조주의 정밀한 설계(이사야 45:18)를 증거합니다.",
    page: 429
  },
  {
    id: 3,
    questionNumber: "3",
    type: "short_answer",
    question: "대기의 기원에 대한 두 가지 이론(진화론적 오랜 지구 vs 성경적 젊은 지구)의 기초가 되는 전제를 한 단어로 각각 서술하세요.",
    questionEn: "In one word for each, state the underlying basis for the two theories of the atmosphere's origin.",
    correctAnswer: "오랜 지구: 우연/진화(Evolution / Chance) / 젊은 지구: 창조/설계(Creation / Design)",
    explanation: "오랜 지구는 자연주의적 진화에 기반하며, 젊은 지구는 성경적 창조에 기반합니다.",
    page: 430
  },
  {
    id: 4,
    questionNumber: "4",
    type: "short_answer",
    question: "오랜 지구 과학자들은 대기 중의 산소가 어디에서 처음 비롯되었다고 주장하나요?",
    questionEn: "From where do old-earth scientists think the oxygen in our atmosphere first came?",
    correctAnswer: "자외선에 의한 수증기 분해 및 광합성을 하는 시아노박테리아(Cyanobacteria, 남세균)의 진화",
    explanation: "초기 지구에는 유리 산소가 없었으며 시아노박테리아의 광합성 활동으로 산소가 축적되었다고 주장합니다.",
    page: 430
  },
  {
    id: 5,
    questionNumber: "5",
    type: "short_answer",
    question: "대기 중 기체들의 부피 백분율을 비교하는 막대그래프를 그릴 때, 주요 성분의 비율은 어떻게 되나요?",
    questionEn: "Create a bar graph that compares the percentage by volume of the gases in the atmosphere.",
    correctAnswer: "질소(N2) 약 78%, 산소(O2) 약 21%, 아르곤 및 기타 기체 약 1%",
    explanation: "질소 78%, 산소 21%, 아르곤 0.93%, 기타 미량 기체 0.07%로 구성됩니다.",
    page: 433
  },
  {
    id: 6,
    questionNumber: "6",
    type: "short_answer",
    question: "이질권(Heterosphere)에서 더 가벼운 기체들이 상층부에 위치하는 이유는 무엇인가요?",
    questionEn: "Why are lighter gases higher up in the atmosphere?",
    correctAnswer: "고도 80km 이상에서는 바람이 거의 없어 기체들이 고르게 섞이지 못하고 중력과 원자량에 따라 분리되기 때문",
    explanation: "가벼운 기체(헬륨, 수소)는 부력과 낮은 원자량으로 인해 상층에 머물고 무거운 기체는 하부에 침강합니다.",
    page: 433
  },
  {
    id: 7,
    questionNumber: "7",
    type: "short_answer",
    question: "이질권(Heterosphere, 80km 이상)과 겹치는 온도 대기층은 어느 층들인가요?",
    questionEn: "Use Figure 18-6 to find what temperature layers lie in the heterosphere.",
    correctAnswer: "열권 (Thermosphere)과 외기권 (Exosphere)",
    explanation: "동질권(0~80km)은 대류권, 성층권, 중간권을 포함하며, 이질권은 80km 이상의 열권과 외기권을 포함합니다.",
    page: 435
  },
  {
    id: 8,
    questionNumber: "8",
    type: "short_answer",
    question: "기온 감률(Lapse rate)이란 무엇인가요?",
    questionEn: "What is a lapse rate?",
    correctAnswer: "대류권에서 고도가 1km 상승할 때마다 기온이 약 6.5°C씩 낮아지는 비율",
    explanation: "고도 증가에 따른 정상적인 기온 하강 비율을 의미합니다.",
    page: 433
  },
  {
    id: 9,
    questionNumber: "9",
    type: "short_answer",
    question: "대류권계면(Tropopause) 위의 성층권에서 대기 온도는 어떻게 변하나요?",
    questionEn: "What happens to atmospheric temperature above the tropopause in the stratosphere?",
    correctAnswer: "오존층이 자외선을 흡수하여 고도가 높아질수록 기온이 약 0°C까지 상승함",
    explanation: "오존 분자의 자외선 흡수로 열이 발생하여 성층권은 고도에 따라 기온이 역전되어 상승합니다.",
    page: 434
  },
  {
    id: 10,
    questionNumber: "10",
    type: "essay",
    question: "\"우리가 지구의 대기를 연구할 때, 피조물을 향한 하나님의 돌보심에 찬양하게 된다\"는 진술을 뒷받침하여 서술하세요.",
    questionEn: "Defend the following statement: 'When we study the earth's atmosphere, we are led to praise God for His care for His creatures.'",
    correctAnswer: "질소 희석으로 화재 방지, 산소로 호흡 유지, 오존층으로 자외선 차단, 전리층과 자기권으로 태양풍과 우주선 방어, 온실효과로 온화한 기온 유지 등 완벽한 다층 방어 체계를 갖추었기 때문",
    explanation: "대기의 모든 물리화학적 특성이 생명체 번성을 위해 정밀하게 조정되어 있음을 보여줍니다.",
    page: 431
  },
  {
    id: 11,
    questionNumber: "11",
    type: "short_answer",
    question: "탄소 순환에서 핵심적인 탄소 저장소는 어디인가요?",
    questionEn: "What is the key carbon reservoir in the carbon cycle?",
    correctAnswer: "대기 중의 이산화탄소 (Atmospheric CO2)와 해양 및 토양",
    explanation: "대기 중의 CO2는 식물 광합성과 생물 호흡의 핵심 교환 매개체입니다.",
    page: 437
  },
  {
    id: 12,
    questionNumber: "12",
    type: "short_answer",
    question: "식물이 흡수할 수 있는 유기 또는 고정 질소(Fixed nitrogen)는 자연계에서 어디로부터 오는가요?",
    questionEn: "Where does organic or fixed nitrogen come from?",
    correctAnswer: "토양 및 콩과 식물 뿌리의 질소 고정 박테리아와 대기 중의 번개 방전",
    explanation: "질소 고정 세균과 번개가 N2 삼중결합을 분해하여 암모니아와 질산염 화합물을 만듭니다.",
    page: 438
  },
  {
    id: 13,
    questionNumber: "13",
    type: "short_answer",
    question: "오존층과 전리층은 각각 어떤 온도 대기층과 겹치나요?",
    questionEn: "Using Figure 18-6, identify which temperature layers overlap the ozone layer and the ionosphere.",
    correctAnswer: "오존층은 성층권(Stratosphere)에 위치하며, 전리층은 열권(Thermosphere, 75~500km)과 겹침",
    explanation: "오존층은 20~50km의 성층권, 전리층은 75~500km의 열권 하부에 형성됩니다.",
    page: 435
  },
  {
    id: 14,
    questionNumber: "14",
    type: "short_answer",
    question: "대기의 특수 구역 중 가시광선 파장을 완전히 차단하거나 흡수, 반사하는 층이 있나요? 우리는 이를 어떻게 알 수 있나요?",
    questionEn: "Do any of the special layers of the atmosphere completely block, absorb, or reflect visual light wavelengths? How do we know?",
    correctAnswer: "아니오, 없습니다. 태양의 가시광선은 지표면에 도달하여 우리가 낮에 세상을 볼 수 있고 식물이 광합성을 할 수 있기 때문입니다.",
    explanation: "대기는 가시광선에 대해 투명(transparent)하여 지표면까지 통과시킵니다.",
    page: 445
  },
  {
    id: 15,
    questionNumber: "15",
    type: "short_answer",
    question: "지구 대기가 들어오는 태양 복사 에너지에 대해 완전히 투명하지 않은 이유는 무엇인가요?",
    questionEn: "Why is the earth's atmosphere not completely transparent to incoming solar radiant energy?",
    correctAnswer: "구름, 먼지, 수증기, 오존 등이 자외선과 적외선 일부를 흡수하고 반사하기 때문",
    explanation: "대기 필터링으로 인해 자외선과 적외선 일부가 차단되어 지표면을 보호합니다.",
    page: 445
  },
  {
    id: 16,
    questionNumber: "16",
    type: "short_answer",
    question: "일반적으로 태양 상수는 대기 상단에서 지표면으로 내려오면서 어떻게 변화하나요?",
    questionEn: "In general, how does the solar constant change from the top of the atmosphere to the surface?",
    correctAnswer: "대기 상단(1.367 kW/m²)에서 구름의 반사(최대 32%)와 대기 흡수(18%)로 인해 지표면에 도달하는 복사 강도는 감소함",
    explanation: "대기를 통과하며 산란, 반사, 흡수되므로 지표면에는 약 60~75%만 도달합니다.",
    page: 445
  },
  {
    id: 17,
    questionNumber: "17",
    type: "essay",
    question: "복사(Radiation), 전도(Conduction), 대류(Convection)의 일상생활 속 예시를 교재에 나온 것 외에 각각 2가지씩 제시하세요.",
    questionEn: "Make three columns titled Radiation, Conduction, and Convection. Write two everyday examples in each column that are different from those mentioned in the text.",
    correctAnswer: "복사: 캠프파이어 모닥불 열기, 전자레인지 가열 / 전도: 뜨거운 냄비 손잡이 화상, 얼음 조각을 손에 쥐었을 때 손이 차가워짐 / 대류: 에어컨 냉기가 바닥으로 가라앉음, 주전자 속 물이 끓는 순환",
    explanation: "열전달의 3대 메커니즘을 일상생활의 과학적 사례로 적용할 수 있습니다.",
    page: 447
  },
  {
    id: 18,
    questionNumber: "18",
    type: "short_answer",
    question: "이산화탄소는 \"온실 효과\"에 어떻게 기여하나요?",
    questionEn: "How does carbon dioxide contribute to the 'greenhouse effect'?",
    correctAnswer: "지표면에서 우주로 빠져나가려는 장파장 열적외선을 흡수하여 다시 지표로 재방출함으로써 대기를 보온함",
    explanation: "CO2 분자는 적외선 파장의 진동 에너지 흡수에 매우 효과적인 온실가스입니다.",
    page: 448
  },
  {
    id: 19,
    questionNumber: "19",
    type: "short_answer",
    question: "대기 중에 하나님께서 지표면을 열과 추위의 극단으로부터 보호하기 위해 사용하신 장치들은 무엇인가요?",
    questionEn: "What features in the atmosphere does God use to protect His creatures on Earth from extremes of heat and cold?",
    correctAnswer: "낮에는 구름과 대기의 햇빛 반사 및 흡수로 과열을 막고, 밤에는 온실가스(수증기, CO2)의 온실효과로 급격한 냉각을 방지함",
    explanation: "대기의 적절한 열용량과 온실효과가 일교차를 완화시켜 온화한 환경을 유지합니다.",
    page: 449
  },
  {
    id: 20,
    questionNumber: "20",
    type: "true_false",
    question: "(True or False) 그리스도인들은 세상이 인구 과잉(overpopulated)이 되고 있다는 점을 우려해야 한다.",
    questionEn: "(True or False) Christians should be concerned that the world is getting overpopulated with people.",
    correctAnswer: false,
    explanation: "False! 하나님은 인류가 번성하여 땅에 충만하라고 축복하셨으며(문화 명령), 문제는 자원의 고갈이 아니라 지혜로운 청지기적 관리입니다.",
    page: 429
  },
  {
    id: 21,
    questionNumber: "21",
    type: "true_false",
    question: "(True or False) 그리스도인들은 대기 오염을 줄이는 기술에 관심을 가져야 한다.",
    questionEn: "(True or False) Christians should be interested in technology that reduces air pollution.",
    correctAnswer: true,
    explanation: "True! 생명을 보호하고 이웃을 사랑하며 지구를 지혜롭게 다스리는 통치 직분(Dominion)의 일환입니다.",
    page: 429
  },
  {
    id: 22,
    questionNumber: "22",
    type: "true_false",
    question: "(True or False) 대기의 기원에 대한 오랜 지구 모델은 성운설(nebular hypothesis)과 밀접하게 연관되어 있다.",
    questionEn: "(True or False) The old-earth model for the origin of the atmosphere is closely related to the nebular hypothesis.",
    correctAnswer: true,
    explanation: "True! 회전하는 가스와 먼지 성운에서 지구가 형성되고 충돌을 거쳐 대기가 진화했다는 이론입니다.",
    page: 429
  },
  {
    id: 23,
    questionNumber: "23",
    type: "true_false",
    question: "(True or False) 가장 낮은 온도를 가진 모든 대기 온도층은 바람이 불고 균일한 기체 혼합물을 가지고 있다.",
    questionEn: "(True or False) All the atmospheric temperature layers with the lowest temperatures have winds and a uniform mixture of gases.",
    correctAnswer: true,
    explanation: "True! 대류권과 최저 온도를 가진 중간권(-90°C)은 모두 동질권(0~80km) 내에 위치하여 균일 혼합과 바람이 존재합니다.",
    page: 434
  },
  {
    id: 24,
    questionNumber: "24",
    type: "true_false",
    question: "(True or False) 열권(Thermosphere)은 우리가 경험하는 기상 현상의 대부분이 일어나는 곳이다.",
    questionEn: "(True or False) The thermosphere is where most of the weather that we experience occurs.",
    correctAnswer: false,
    explanation: "False! 날씨 현상의 대부분은 최하층인 대류권(Troposphere)에서 발생합니다.",
    page: 433
  },
  {
    id: 25,
    questionNumber: "25",
    type: "true_false",
    question: "(True or False) 따뜻한 공기와 찬 공기의 지속적인 혼합은 오직 대류권에서만 일어난다.",
    questionEn: "(True or False) The continual mixing of warm and cold air occurs only in the troposphere.",
    correctAnswer: true,
    explanation: "True! 수직 대류 혼합은 하부가 따뜻하고 상부가 차가운 대류권 고유의 특징입니다.",
    page: 434
  },
  {
    id: 26,
    questionNumber: "26",
    type: "true_false",
    question: "(True or False) 외기권(Exosphere)은 대부분 수소(hydrogen)로 구성되어 있다.",
    questionEn: "(True or False) The exosphere is mostly hydrogen.",
    correctAnswer: true,
    explanation: "True! 가장 가벼운 기체인 분자 수소(H2)와 헬륨이 최외각 외기권의 주요 성분입니다.",
    page: 432
  },
  {
    id: 27,
    questionNumber: "27",
    type: "true_false",
    question: "(True or False) 탄소 순환과 질소 순환은 기본적으로 동일하지만 다른 원소를 포함할 뿐이다.",
    questionEn: "(True or False) The carbon and nitrogen cycles are basically the same but involve different elements.",
    correctAnswer: false,
    explanation: "False! 탄소는 식물이 직접 CO2를 흡수하지만, 질소는 N2를 직접 흡수하지 못하고 박테리아나 번개의 복잡한 고정 작용을 거쳐야 합니다.",
    page: 438
  },
  {
    id: 28,
    questionNumber: "28",
    type: "true_false",
    question: "(True or False) 임의의 주어진 날에 지구 표면에 도달하는 태양 에너지의 양은 적도나 북극권이나 동일하다.",
    questionEn: "(True or False) The amount of solar energy reaching the earth's surface on any given day is the same at the Equator as at the Arctic Circle.",
    correctAnswer: false,
    explanation: "False! 적도는 태양광이 거의 수직으로 입사해 에너지가 집중되지만, 북극권은 비스듬히 입사하여 훨씬 적은 에너지만 받습니다.",
    page: 446
  },
  {
    id: 29,
    questionNumber: "29",
    type: "true_false",
    question: "(True or False) 태양 에너지는 주로 전도(conduction)를 통해 지구에 도달한다.",
    questionEn: "(True or False) The sun's energy reaches the earth mainly through conduction.",
    correctAnswer: false,
    explanation: "False! 진공 우주 공간을 통과하므로 복사(Radiation, 전자기파)를 통해 도달합니다.",
    page: 445
  },
  {
    id: 30,
    questionNumber: "30",
    type: "true_false",
    question: "(True or False) 이산화탄소는 온실가스이기 때문에 공기 오염 물질이다.",
    questionEn: "(True or False) Carbon dioxide is an air pollutant because it is a greenhouse gas.",
    correctAnswer: false,
    explanation: "False! 교재 'Carbon Dioxide = Air Pollutant?' 심화에서 다루듯, CO2는 식물 광합성에 없어서는 안 될 필수 영양소이자 자연 온실효과를 지탱하는 필수 기체입니다.",
    page: 448
  }
];
