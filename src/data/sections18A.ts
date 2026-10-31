import { ChapterSection } from '../types';

export const sections18A: ChapterSection[] = [
  {
    id: 'intro-killer-air',
    category: 'intro',
    numberBadge: '0',
    lessonTag: '단원 소개 · 서론',
    titleKo: '살인자 공기 (Killer Air) & 대기의 소중함',
    titleEn: 'Killer Air & The Importance of Earth\'s Atmosphere',
    breadcrumb: 'Chapter 18 · 서론 · 살인자 공기 (Killer Air)',
    pages: [429],
    objectives: [
      '지구 대기의 정의와 인류 생존에 미치는 필수적인 역할을 이해한다.',
      '급격한 도시화로 인한 대기 오염(스모그, 미세먼지)의 심각성과 인체 유해성을 파악한다.',
      '세계보건기구(WHO) 기준 연간 550만 명 이상의 조기 사망을 유발하는 대기 오염의 원인(자연적 vs 인위적)을 구분한다.'
    ],
    interactiveSpec: {
      type: 'code_preview',
      missionTitle: '미션 1 · 대기 오염 물질과 도시 환경 영향 분석',
      missionNumber: '18-0',
      stepTotal: 4,
      tabs: [
        {
          id: 'tab-smog',
          label: '① 스모그 & 인위적 오염원 분석',
          codeSnippet: `// [도심 대기 오염 시뮬레이션 모델]
const urbanPollutionSources = {
  fossilPowerPlants: { emission: "SOx, NOx, Particulates", hazard: "High" },
  automobiles: { emission: "CO, HC, NOx, Smog precursor", hazard: "Severe" },
  industrialPlants: { emission: "VOCs, Toxic aerosols", hazard: "High" }
};
/* ① 연간 전 세계 조기 사망자: 약 550만 명 */
const annualMortalityGlobal = 5500000;
function checkAirQuality(city) {
  return "Haze & Smog Alert: Indoor air can be even worse than outdoor!";
}`,
          description: '자동차, 화석연료 발전소에서 뿜어져 나오는 유독 가스와 미세입자가 도시를 뒤덮는 스모그 현상을 분석합니다.'
        },
        {
          id: 'tab-natural',
          label: '② 자연적 오염원 (화산, 라돈, 꽃가루)',
          codeSnippet: `// [자연적 대기 오염원 분류]
const naturalSources = [
  { name: "Volcanoes", impact: "Ash, SO2, volcanic haze" },
  { name: "Radioactive Radon", impact: "Ground seepage, indoor lung hazard" },
  { name: "Wildfires", impact: "Massive soot & carbon particulates" },
  { name: "Molds & Pollen", impact: "Respiratory allergens, asthma triggers" }
];
/* ② 자연적 오염원 또한 호흡을 방해하는 치명적 요소 */
console.log("Natural pollutants contribute significantly to background levels.");`,
          description: '화산 폭발, 방사성 라돈, 산불, 곰팡이 및 꽃가루 등 자연계에서 발생하는 호흡기 유해 요소를 검토합니다.'
        },
        {
          id: 'tab-solution',
          label: '③ 공기 질 개선 및 정화 대책',
          codeSnippet: `// [대기 정화 및 배출 저감 솔루션]
const cleanAirSolutions = {
  transportation: "Transition to zero-emission electric vehicles",
  energy: "Replace coal-fired plants with renewable solar/wind/hydro",
  filtration: "Indoor HEPA + carbon filtration systems",
  monitoring: "Real-time atmospheric modeling & early warnings"
};
/* ③ 공기 관리(Air Care): 지구를 지키는 인간의 청지기 책임 */
console.log("Taking care of our air preserves life for future generations.");`,
          description: '전기차 보급, 석탄화력 대체, 실내 공기 정화 등 인류가 실천해야 할 공기 관리(Air Care) 방안입니다.'
        }
      ],
      defaultTabId: 'tab-smog',
      bottomInsight: '인구 증가와 도시화로 인해 대기 오염은 단순한 불편을 넘어 매년 550만 명의 생명을 앗아가는 중대한 보건 위기입니다. 실외뿐만 아니라 실내 공기 또한 오염될 수 있음을 인식해야 합니다.'
    },
    contentKo: [
      '지구의 인구가 증가함에 따라 도시들은 점점 더 거대해지고 있습니다. 인간이 지구상에 번성하도록 의도되었지만, 우리 도시들은 심각한 성장통을 겪고 있습니다.',
      '세계 주요 도시(뉴욕, 베이징, 멕시코시티, 뉴델리 등)의 대기 오염은 위험 수위에 도달했습니다.',
      '대기 오염은 호흡을 방해하거나 인체에 해를 끼치는 기체 또는 미세입자가 공기 중으로 유입될 때 발생합니다. 화산, 산불, 방사성 라돈, 곰팡이나 꽃가루 같은 자연적 오염원도 존재합니다.',
      '그러나 현대 도시에서는 자동차와 화석연료 발전소가 대기 오염의 양대 주범입니다. 이들이 배출하는 오염물질은 수많은 세계 도시를 뒤덮는 연무(스모그, Smog)의 원인이 됩니다.',
      '대기 오염은 단순히 불쾌한 수준에 그치지 않고 사람의 목숨을 앗아갑니다. 대기 오염으로 인해 전 세계적으로 매년 약 550만 명이 사망하며, 실내 공기 오염이 실외보다 더욱 위험한 경우도 많습니다.'
    ],
    contentEn: [
      'As Earth\'s population increases, our cities are getting bigger. God intends to see our planet filled with His image bearers. But our cities are having some growing pains. Air pollution is skyrocketing in the biggest cities around the world, cities like New York, Beijing, Mexico City, and New Delhi.',
      'Air pollution forms when gases or particles that enter the air interfere with breathing or are hazardous in other ways. Sometimes these come from natural sources, like volcanoes, forest fires, radioactive radon, or even molds and pollen. But in the city, automobiles and fossil fuel power plants are the two main culprits. They are the source of the haze called smog that settles over so many of the world\'s cities.',
      'Air pollution isn\'t just an inconvenience. It also kills people. And it doesn\'t just stay outside; sometimes indoor air pollution is even worse! Air pollution kills about 5.5 million people a year. Take a breath—we have work to do!'
    ]
  },
  {
    id: 'sec-18-1',
    category: '18A',
    numberBadge: '1',
    lessonTag: '18A · 1교시',
    titleKo: '18.1 공기 관리 (Air Care) & 행성별 대기 비교',
    titleEn: '18.1 Air Care & Planetary Atmospheres',
    breadcrumb: '18A · 18.1 · 공기 관리 (Air Care)',
    pages: [429],
    objectives: [
      '대기(Atmosphere)의 과학적 정의(행성을 둘러싼 기체 외피)를 명확히 이해한다.',
      '태양계 주요 천체(목성, 화성, 금성, 달)의 대기 구성과 지구 대기를 비교 분석한다.',
      '인간 활동이 대기 질에 미치는 영향과 배출 저감 기술(전기차 등)의 필요성을 파악한다.'
    ],
    interactiveSpec: {
      type: 'planetary_calc',
      missionTitle: '미션 1 · 태양계 행성과 지구의 대기 조성 비교 분석',
      missionNumber: '18-1',
      stepTotal: 4,
      tabs: [
        {
          id: 'earth',
          label: '① 지구 (Earth)',
          codeSnippet: `// 지구 대기 성분 (생명 거주 가능 최적 상태)
const EarthAtmosphere = {
  nitrogen: "78.08%",
  oxygen: "20.95%",
  argon: "0.93%",
  carbonDioxide: "0.04% (변동 가능)",
  waterVapor: "0 ~ 5% (지역별 차이)",
  surfacePressure: "1.0 atm (1013 hPa)",
  breathable: true,
  notes: "생명체가 호흡하고 불꽃이 폭주하지 않는 정밀한 산소 희석 비율"
};`,
          description: '지구는 78% 질소와 21% 산소로 이루어져 생명체가 호흡하기에 이상적이며 온화한 기후를 유지합니다.'
        },
        {
          id: 'venus-mars',
          label: '② 금성(Venus) & 화성(Mars)',
          codeSnippet: `// 금성과 화성의 대기 비교 (CO2 지배형)
const VenusAtmosphere = {
  primary: "CO2 (96.5%)",
  secondary: "N2 (3.5%)",
  clouds: "황산(Sulfuric Acid) 방울 구름",
  surfacePressure: "92 atm (지구의 92배)",
  surfaceTemp: "약 467°C (극단적 온실효과)",
  breathable: false
};
const MarsAtmosphere = {
  primary: "CO2 (95%)",
  secondary: "N2 (2.6%), Ar (1.9%)",
  surfacePressure: "0.006 atm (지구의 1% 미만)",
  breathable: false
};`,
          description: '금성과 화성은 모두 이산화탄소가 95% 이상이며, 금성은 황산 구름과 고압, 화성은 극도로 희박합니다.'
        },
        {
          id: 'jupiter-moon',
          label: '③ 목성(Jupiter) & 달(Moon)',
          codeSnippet: `// 목성과 달의 대기 환경
const JupiterAtmosphere = {
  primary: "수소(H2) 약 89%",
  secondary: "헬륨(He) 약 10%",
  clouds: "암모니아(Ammonia, NH3) 얼음 결정 구름",
  breathable: false,
  notes: "거대 가스 행성으로 신선한 공기 호흡 불가"
};
const MoonAtmosphere = {
  pressure: "10^-14 atm (측정 불가능할 정도로 희박)",
  status: "실질적 진공 상태",
  breathable: false
};`,
          description: '목성은 수소/헬륨과 유독한 암모니아 얼음 구름, 달은 대기가 거의 없는 진공 상태입니다.'
        }
      ],
      defaultTabId: 'earth',
      bottomInsight: '목성(수소·헬륨·암모니아 얼음), 금성·화성(이산화탄소, 금성은 황산 포함), 달(거의 진공)과 비교할 때, 지구 대기는 생명체가 호흡하고 번성할 수 있도록 유일무이하게 정밀하게 설계되어 있습니다.'
    },
    contentKo: [
      '우리의 대기(Atmosphere)는 지구를 둘러싸고 있는 기체의 외피(envelope of gases)이며, 지구상의 생명체에게 절대적으로 중요합니다.',
      '태양계의 다른 행성들을 살펴보면 지구 대기의 특별함이 더욱 두드러집니다.',
      '목성의 대기는 대부분 수소(Hydrogen)와 헬륨(Helium)으로 이루어져 있고, 암모니아(Ammonia) 얼음 결정 구름이 떠 있습니다. 이곳에서는 신선한 공기를 한 모금도 들이켤 수 없습니다.',
      '화성(Mars)이나 금성(Venus)은 어떨까요? 두 행성의 대기는 대부분 이산화탄소(CO2)로 가득 차 있으며, 금성의 공기는 심지어 농축된 황산(Sulfuric acid)을 함유하고 있습니다!',
      '지구와 가까운 달(Moon)은 측정 가능한 대기가 아예 존재하지 않는 진공에 가깝습니다. 오직 지구의 대기만이 생명체가 살아가는 데 필요한 기체들을 최적의 비율로 제공합니다. 성경 이사야 45:18은 하나님이 지구를 사람이 거주할 수 있도록 창조하셨다고 선언합니다.',
      '하지만 공기가 너무 오염되면 생명체가 병들고 죽게 됩니다. 따라서 과학자들은 공기 중으로 배출되는 유독 입자와 유해 가스를 줄이는 방안을 적극적으로 모색하고 있습니다.',
      '제조업, 자동차 및 트럭, 석탄 화력 발전소의 배출량을 줄이는 노력이 대표적입니다. 화석연료를 사용하지 않는 무공해 전기차(Electric vehicles, 그림 18-1)와 친환경 발전소 개발도 그 일환입니다.'
    ],
    contentEn: [
      'Our atmosphere, the envelope of gases that surrounds our planet, is crucial to life on Earth. Consider some of the other planetary bodies in our solar system. Jupiter\'s atmosphere is mostly hydrogen and helium, with clouds of ammonia ice crystals. Have fun trying to get a breath of fresh air there. You\'re not going to do much better on Mars or Venus, which have atmospheres made mostly of carbon dioxide. Venus\'s so-called air contains sulfuric acid! Closer to home, the moon is even worse. It hardly has a measurable atmosphere at all. Earth\'s atmosphere provides the gases that creatures here need to live. The Bible says that God created our earth to be inhabited (Isa. 45:18). But if our air gets too polluted, living things can get sick and die.',
      'We need to take care of our air. Scientists are looking for ways to reduce the toxic particles and harmful gases that people release into the air. Cutting back on emissions from manufacturing, from cars and trucks, and from coal-fired power plants is part of this. Developing vehicles and power plants that don\'t use fossil fuels at all is another way, though some pollutants are unavoidable. But we should try to work on ways to filter and clean the air we breathe, both indoors and outside. First, though, let\'s learn about the atmosphere so that we can better understand the challenges we face.'
    ],
    marginNotes: [
      {
        originalText: "Jupiter: mostly hydrogen and helium, with clouds of ammonia ice crystals. Mars or Venus: mostly made of CO2.",
        translation: "목성: 대부분 수소와 헬륨, 암모니아 얼음 결정 구름. 화성 또는 금성: 대부분 CO2로 이루어짐.",
        context: "교재 429페이지 우측 하단 필기 메모"
      }
    ]
  },
  {
    id: 'sec-18-2',
    category: '18A',
    numberBadge: '2',
    lessonTag: '18A · 2교시',
    titleKo: '18.2 대기의 기원 (Origin of the Atmosphere)',
    titleEn: '18.2 Origin of the Atmosphere: Old-Earth vs. Young-Earth',
    breadcrumb: '18A · 18.2 · 대기의 기원 (Origin of the Atmosphere)',
    pages: [429, 430],
    objectives: [
      '오랜 지구 진화론 모델(Old-Earth Story, 45억 년 역사)의 초기 대기 형성 및 산소 대폭발 과정을 분석한다.',
      '성경적 젊은 지구 창조론 모델(Young-Earth Story, 창조주간 2~6일)의 대기 형성과 노아 홍수 영향을 검토한다.',
      '원시 생명 탄생 가설(밀러-유리 실험)의 실험적 한계와 논란점을 객관적으로 비교한다.'
    ],
    interactiveSpec: {
      type: 'code_preview',
      missionTitle: '미션 2 · 대기의 기원에 대한 두 가지 세계관 비교 시뮬레이션',
      missionNumber: '18-2',
      stepTotal: 4,
      tabs: [
        {
          id: 'old-earth',
          label: '① 오랜 지구 이야기 (Old-Earth: 45억 년 진화)',
          codeSnippet: `// [오랜 지구 모델: 45억 년 대기 진화 연표]
const OldEarthTimeline = {
  era1_4_5Ga: "지구 형성, 용융 상태, 미행성 충돌 및 달 형성 충돌로 전 지구 재용융",
  era2_EarlyAtmo: "수소와 헬륨 위주의 고온 대기 (유리 산소 없음, 생명 지탱 불가)",
  era3_VolcanicComet: "화산 폭발로 수증기, CO2, 질소 방출 / 혜성 충돌로 바다 형성",
  era4_FirstLife: "비생명체에서 혐기성 박테리아 출현 (산소가 없어야 유기 복합 분자 보존 가능)",
  era5_Cyanobacteria: "남세균(시아노박테리아) 진화 -> 광합성 시작 -> 산소 방출",
  era6_2_4Ga_Catastrophe: "산소 대참사(Oxygen Catastrophe): 혐기성 생물 대량 멸종 및 호기성 대기 전환"
};
/* ① 세속 과학자들은 광합성 유기체가 오늘날의 산소 풍부 대기를 만들었다고 믿음 */`,
          description: '무산소 원시 대기에서 혐기성 생명 탄생, 남세균 진화 및 24억 년 전 산소 대재앙을 거치는 자연주의적 진화 모델입니다.'
        },
        {
          id: 'young-earth',
          label: '② 젊은 지구 이야기 (Young-Earth: 성경적 창조)',
          codeSnippet: `// [성경적 젊은 지구 모델: 창조 주간과 역사]
const YoungEarthModel = {
  Day2: "궁창(Firmament / Expanse) 형성: 궁창 위의 물과 궁창 아래의 물 분리 (창 1:6-8)",
  Day3: "대기가 식물 창조에 맞추어 완전하게 정비됨 (CO2와 수증기 공급)",
  Day5_6: "동물과 인류 창조: 호흡에 완벽한 산소/질소 비율 구비 (창조 후 '심히 좋았더라')",
  TheFall: "인류의 타락: 대기 자체의 급격한 변화는 없었음",
  TheFlood: "노아의 홍수: 격렬한 화산 활동과 지각 변동으로 대기 화학, 기상, 기후대 영구 변화",
  CurrentStatus: "심판을 겪었음에도 대기는 하나님의 세심한 설계와 사랑을 입증함"
};
/* ② 지적 설계와 창조주 하나님의 목적론적 관점 */`,
          description: '창조 주간 2~3일에 생명체를 위해 목적을 가지고 완벽하게 지어졌으며, 노아 홍수를 통해 변화되었다는 모델입니다.'
        },
        {
          id: 'urey-miller',
          label: '③ 밀러-유리 실험 (Urey-Miller Experiment 심화)',
          codeSnippet: `// [밀러-유리 실험 (1953) 시뮬레이션]
const UreyMillerExp = {
  gasesUsed: ["Methane (CH4)", "Ammonia (NH3)", "Water Vapor (H2O)", "Hydrogen (H2)"],
  energySource: "전기 스파크 (원시 번개 모사)",
  outcome: "아미노산 등 유기 화합물(생명의 전구체) 소량 합성",
  criticalIssues: [
    "실제 지구 원시 대기는 환원성이 아니었을 가능성이 매우 높음",
    "합성된 아미노산은 생명체에 필요한 L-형뿐만 아니라 D-형이 50:50으로 혼합된 라세미체",
    "유리 산소가 미량이라도 존재했다면 유기물 즉각 산화 파괴",
    "유기물 합성이 곧 생명 탄생을 의미하지는 않음"
  ]
};`,
          description: '수소, 메탄, 수증기, 암모니아에 전기를 가해 아미노산을 합성했으나, 원시 대기 조건 가정과 생명 기원 설명에 중대한 결함이 있습니다.'
        }
      ],
      defaultTabId: 'old-earth',
      bottomInsight: '오랜 지구 모델은 45억 년에 걸쳐 무생물에서 혐기성 세균, 남세균의 광합성과 24억 년 전 산소 대재앙을 통해 대기가 형성되었다고 보며, 젊은 지구 모델은 창조 주간 동안 목적에 맞게 완전하게 조성된 후 노아 홍수를 겪었다고 설명합니다.'
    },
    contentKo: [
      '[오랜 지구 이야기 (The Old-Earth Story)]',
      '오랜 지구 과학자들에 따르면 지구는 45억 년 전에 형성되기 시작했습니다. 초기 지구는 얇은 지각으로 덮인 작고 녹아내린 마그마 덩어리였습니다. 행성 탄생 후 수억 년 안에 달을 형성한 대충돌이 발생하여 전 지구가 다시 녹았습니다.',
      '지구가 냉각되면서 주로 가벼운 기체인 수소와 헬륨으로 채워진 뜨거운 대기가 모여들었습니다. 이 기체들은 그 자체로는 생명을 유지할 수 없었으며, 초기 대기에는 유리 산소(Free oxygen, O2)가 전혀 없었습니다.',
      '이후 수많은 화산 분출이 대기 조성을 바꾸었습니다. 수증기와 함께 탄소 및 질소 화합물이 모여들었고, 혜성 충돌로 인한 얼음 폭격이 바다와 대기에 물과 기타 화합물을 더했습니다.',
      '진화론자들은 지구 역사 최초 10억 년 동안 무생물에서 생명체가 저절로 나타났다고 믿습니다(화학진화). 이 생명체는 산소가 없는 환경에서 살 수 있는 혐기성 박테리아(Anaerobic bacteria)였습니다. 산소가 있었다면 가장 단순한 세포를 이루는 복잡한 유기 분자들이 산화되어 파괴되었을 것이기 때문입니다.',
      '자외선이 수증기를 분해해 소량의 산소를 만들었으나 광물과 반응해 소모되었습니다. 이후 산소를 발생시키는 시아노박테리아(Cyanobacteria, 남세균)가 진화했습니다.',
      '약 24억 년 전 표면 암석이 더 이상 산소를 흡수할 수 없게 되자 여분의 산소가 대기로 유입되었고 산소 농도가 급증했습니다. 이 사건을 산소 대참사(Oxygen catastrophe)라고 부르며, 수많은 혐기성 생명체가 멸종하고 호기성 복합 생명체가 진화하는 계기가 되었다고 주장합니다.',
      '[젊은 지구 이야기 (The Young-Earth Story)]',
      '성경적 젊은 지구 관점은 훨씬 단순하고 명쾌합니다. 성경 창세기에 따르면 하나님께서 창조 주간 둘째 날(Day 2) 물 가운데 궁창(Firmament, 대기권)을 만드사 궁창 위의 물과 궁창 아래의 물로 나누셨습니다(창 1:6-8).',
      '셋째 날(Day 3) 식물 창조를 앞두고 대기는 식물이 필요로 하는 이산화탄소와 수증기를 머금게 되었고, 다섯째·여섯째 날 창조된 동물과 인류의 호흡을 위한 산소가 완벽하게 준비되었습니다.',
      '하나님께서는 대기를 포함한 모든 창조 세계를 "보시기에 심히 좋았더라(very good)"고 평가하셨습니다. 인류의 타락(The Fall) 이후에도 대기 자체는 유지되었으나, 노아의 대홍수(The Flood) 기간 엄청난 화산 활동과 지각 변동은 지구 대기의 화학 조성, 기상 패턴, 기후대를 전 지구적으로 깊이 변화시켰습니다.'
    ],
    contentEn: [
      'According to old-earth scientists, the earth began forming more than 4.5 billion years ago. The early earth was a smaller, molten ball covered by a thin crust. Within several hundred million years of the planet\'s birth, a moon-forming collision occurred and melted the entire earth again. As the earth cooled from this collision, gaseous materials gathered into an atmosphere that was hot and contained mainly the light gases hydrogen and helium, which on their own can\'t support life. No free oxygen was present in the early atmosphere. The emissions of numerous volcanoes changed its composition. Water vapor together with carbon and nitrogen compounds began to collect. Ice from comet bombardments added water and other compounds to the oceans and atmosphere.',
      'Sometime during the first billion years of Earth\'s existence, evolutionists believe that life appeared from nonlife. These life forms were anaerobic bacteria that could live in the absence of oxygen. Biochemists believe that oxygen would have destroyed the complex molecules needed to build even the simplest cell. Even so, ultraviolet light from the sun broke down some water vapor into oxygen and hydrogen. This oxygen quickly reacted with minerals in the rocks, so the simple bacteria were not harmed. Oxygen levels were probably less than 1% of today\'s levels. But along the way, oxygen-producing organisms called cyanobacteria evolved.',
      'Around 2.4 billion years ago, the surface rocks had reacted with as much oxygen as they could, so the extra oxygen collected in the atmosphere, and the oxygen levels in the air jumped. This oxygen catastrophe killed off most of the anaerobic organisms, and paved the way for more advanced forms of life to evolve. Secular scientists believe that photosynthetic organisms are responsible for the modern oxygen-rich atmosphere we have today.',
      'A biblical young-earth view of the atmosphere\'s origin is much simpler. To be completely honest, we don\'t know when God created the atmosphere because it is not mentioned in the Creation story in the Bible. We can assume that when God formed the firmament (or great expanse) between the waters above and the waters below on Day 2 (Gen. 1:6–8), He also created the atmosphere in preparation for the creation of plants on Day 3. Plants needed atmospheric carbon dioxide and water vapor to live, and all the other creatures and humans definitely needed to breathe during the remaining three days of the Creation week.',
      'God made the atmosphere "very good," along with the rest of His creation. Even the Fall probably didn\'t noticeably change the atmosphere. But the Flood did. Volcanic activity and changes in the sizes and shapes of the oceans deeply affected the earth\'s atmosphere. We can still see the effects of these changes today in the atmospheric chemistry, weather patterns, and climate zones all over the world. But though God judged our world, it still bears signs of His design and loving care. The atmosphere is one grand exhibit of this.'
    ],
    sidebar: {
      titleKo: '진화론 실험: 밀러-유리 실험 (Experiment in Evolution)',
      titleEn: 'Experiment in Evolution: The Urey-Miller Experiment',
      contentKo: [
        '유리-밀러 실험에 대해 들어보셨습니까? 두 진화론자(해럴드 유리와 스탠리 밀러)는 원시 지구 대기에서 생명이 어떻게 진화했는지를 모사하는 실험을 수행했습니다.',
        '그들은 수소, 일산화탄소/이산화탄소, 메탄, 수증기, 암모니아 혼합 기체를 밀폐 용기에 넣고 인공 번개(전기 스파크)를 일으켰습니다. 그 결과 "생명의 전구체"라 불리는 아미노산 몇 종류를 합성해 냈고, 진화론자들은 자신들의 이론에 중대한 승리라고 환호했습니다.',
        '하지만 이 실험에는 치명적인 문제점들이 있습니다. 실제 원시 대기의 구성비가 실험과 달랐으며, 합성된 물질은 생명체가 전혀 활용할 수 없는 독성 타르와 D/L형 불완전 혼합물이었고, 외부의 지적 개입 없이는 분해를 막을 수 없었습니다.'
      ],
      contentEn: [
        'Have you heard of the Urey-Miller experiment? Two evolutionists did an experiment in which they simulated how life could have evolved in Earth\'s early atmosphere. They took a mixture of hydrogen, carbon dioxide, methane, water vapor, and ammonia and sparked electricity in it. They produced what they called "the precursors of life." Evolutionists called it a victory for their theory. But there are some major problems with this experiment.'
      ]
    },
    marginNotes: [
      {
        originalText: "life appeared from nonlife -> Old = 2.4 billion years ago, smaller than Young",
        translation: "무생물에서 생명 출현 -> 오랜 지구 모델 = 24억 년 전 산소 급증",
        context: "교재 430페이지 하단 메모"
      }
    ]
  },
  {
    id: 'sec-18-3',
    category: '18A',
    numberBadge: '3',
    lessonTag: '18A · 3교시',
    titleKo: '18.3 대기 성분별 구분 (동질권 vs 이질권) & 우주 스카이다이빙',
    titleEn: '18.3 Atmospheric Regions by Composition & Space Skydiving',
    breadcrumb: '18A · 18.3 · 대기 성분별 구분 (Homosphere & Heterosphere)',
    pages: [431, 432, 433],
    objectives: [
      '기체 성분의 균일성에 따른 동질권(Homosphere, 0~80km)과 층상 분리된 이질권(Heterosphere, 80km 이상)의 특성을 파악한다.',
      '대기 표층 조성(질소 78%, 산소 21%, 아르곤 및 기타 1%)과 산소 희석의 생명 유지 목적을 이해한다.',
      '이질권의 원자량 순서 기체 배열(N2 -> O2 -> O -> He -> H2)을 분석한다.',
      '조셉 키팅거(1960)와 펠릭스 바움가르트너(2012)의 초고고도 우주 스카이다이빙 사례를 물리학·생리학적으로 고찰한다.'
    ],
    interactiveSpec: {
      type: 'atmosphere_layers',
      missionTitle: '미션 3 · 고도에 따른 대기 성분 분리 및 우주 엘리베이터 탐험',
      missionNumber: '18-3',
      stepTotal: 4,
      tabs: [
        {
          id: 'homosphere',
          label: '① 동질권 (Homosphere: 0 ~ 80 km)',
          codeSnippet: `// [동질권 (Homosphere) 성분 및 물리적 상태]
const Homosphere = {
  altitude: "0 km (해수면) ~ 80 km",
  mixing: "바람과 대류에 의해 균일하게 혼합된 상태",
  mainComponents: {
    nitrogen_N2: "78.08% (분자량 28, 산소 희석 및 화재 방지)",
    oxygen_O2: "20.95% (분자량 32, 호흡 및 대사 활동)",
    argon_Ar: "0.93% (비활성 기체)",
    otherGases: "약 0.04% (CO2: 0~2% 변동, H2O: 0~5% 변동)"
  },
  humanPhysiology: {
    at_3km: "저기압으로 인해 여압(Pressurized oxygen) 필요",
    above_3km: "산소 부족으로 뇌 기능 저하, 반응 속도 둔화, 우주복 착용 필수"
  }
};`,
          description: '해수면부터 80km까지 바람과 기상 현상으로 인해 기체들이 고르게 섞여 균일한 조성을 유지합니다.'
        },
        {
          id: 'heterosphere',
          label: '② 이질권 (Heterosphere: 80 ~ 1000+ km)',
          codeSnippet: `// [이질권 (Heterosphere) 원자량/분자량별 중력 층상 분리]
const HeterosphereLayers = [
  { altitude: "80 ~ 200 km", gas: "분자 질소 (N2)", weight: 28, note: "가장 아래층의 무거운 분자" },
  { altitude: "200 ~ 300 km", gas: "분자 산소 (O2)", weight: 32, note: "해리되지 않은 산소 분자" },
  { altitude: "300 ~ 800 km", gas: "원자 산소 (O)", weight: 16, note: "자외선에 의해 해리된 원자" },
  { altitude: "800 ~ 1000 km", gas: "헬륨 (He)", weight: 4, note: "매우 가벼운 비활성 원자" },
  { altitude: "1000+ km (우주 경계)", gas: "분자 수소 (H2)", weight: 2, note: "가장 가벼운 기체, 우주로 탈출" }
];
/* 질소 분자(28)는 수소 분자(2)보다 14배 무겁습니다 */`,
          description: '바람이 없는 초고고도에서 기체들이 분자량/원자량에 따라 층층이 분리되어 층상 구조를 형성합니다.'
        },
        {
          id: 'skydiving',
          label: '③ 우주 스카이다이빙 사례 연구 (Baumgartner 2012)',
          codeSnippet: `// [초고고도 스카이다이빙 데이터]
const SkydivingRecords = {
  JosephKittinger_1960: {
    altitude: "31,300 m (31.3 km)",
    freeFallTime: "4분 36초",
    achievement: "당시 최고 고도 유인 기구 및 최장 자유낙하 기록"
  },
  FelixBaumgartner_2012: {
    date: "2012년 10월 14일 (척 예거 음속 돌파 65주년)",
    jumpAltitude: "39,040 m (39.04 km - 성층권 상부)",
    freeFallDistance: "36,529 m",
    freeFallTime: "4분 20초",
    topSpeed: "1,345 km/h (마하 1.25, 인류 최초 맨몸 음속 돌파!)",
    capsuleMethod: "초대형 헬륨 풍선 기구"
  }
};`,
          description: '성층권 39km에서 뛰어내려 음속을 돌파한 역사적 낙하 실험과 극한 대기 환경의 신체 보호 요건입니다.'
        }
      ],
      defaultTabId: 'homosphere',
      bottomInsight: '동질권(0~80km)은 균일 혼합 대기로 78% 질소가 21% 산소를 희석하여 폭발적 연소를 방지하며, 이질권(80km 이상)은 바람이 없어 질소(N2)→산소(O2)→원자산소(O)→헬륨(He)→수소(H2) 순으로 원자량에 따라 차곡차곡 층을 이룹니다.'
    },
    contentKo: [
      '[성분에 따른 대기 구역]',
      '당신이 NASA의 새로운 "우주 엘리베이터(Space Elevator)"의 첫 탑승객이 되어 지표면에서 우주로 올라간다고 상상해 보십시오. 우주복이 필요할까요? 어떤 옷을 입어야 할까요?',
      '지표면 근처에서 질소(N2)는 대기의 4분의 3 이상(약 78%)을 차지합니다. 질소는 다른 물질과 쉽게 반응하지 않는 비활성 기체이며 무독성입니다. 질소의 핵심적인 역할 중 하나는 산소를 생명 유지에 가장 적합한 농도(약 21%)로 희석하여 전 지구적인 화재 폭발 위험을 막아주는 것입니다!',
      '해수면 부근의 건조 공기 조성은 질소 약 78%, 산소 약 21%, 아르곤·이산화탄소·헬륨·수소 등 기타 기체가 약 1%를 차지합니다. 이산화탄소는 0% 미만에서 2% 약간 넘게, 수증기는 0%에서 5%까지 변동할 수 있습니다.',
      '[동질권 (Homosphere: 0 ~ 80 km)]',
      '우주 엘리베이터를 타고 상승할 때, 고도 80 km까지는 바람과 기상 현상에 의해 기체들이 완벽하게 뒤섞입니다. 기체들이 분리되거나 침전되지 않으므로 이 균일한 기체 혼합 영역을 동질권(Homosphere, 접두사 homo-는 "동일한, 유사한"을 의미)이라 부릅니다.',
      '그러나 고도 3 km에 이르면 대기압이 낮아져 산소 호흡 장치가 필요합니다. 3 km 이상에서는 공기 밀도가 너무 낮아 뇌에 산소 공급이 부족해져 판단이 흐려지고 반응 속도가 급격히 둔화됩니다.',
      '[이질권 (Heterosphere: 80 ~ 1000+ km)]',
      '고도 80 km를 넘어서면 바람이 거의 존재하지 않기 때문에, 기체들이 원자량 및 분자량에 따라 층을 이루어 분리됩니다. 이 구역을 이질권(Heterosphere, hetero-는 "다른, 분리된"을 의미)이라 부릅니다.',
      '가장 무거운 분자 질소(N2, 분자량 28)가 가장 아래(80~200km)에 위치하고, 그 위로 분자 산소(O2, 200~300km), 원자 산소(O, 300~800km), 헬륨(He, 800~1000km), 그리고 가장 가벼운 분자 수소(H2, 분자량 2, 1000km 이상) 순서로 층을 형성합니다. 질소 분자는 수소 분자보다 14배나 무겁습니다.',
      '[사례 연구: 우주 스카이다이빙 (Case Study: Skydiving from Space)]',
      '1960년 조셉 키팅거(Joseph Kittinger)는 31,300 m 고도에서 기구를 타고 뛰어내려 52년 동안 최장 자유낙하 기록을 보유했습니다.',
      '2012년 10월 14일, 펠릭스 바움가르트너(Felix Baumgartner)는 여압 우주복을 입고 헬륨 기구에 매달린 캡슐을 타고 39,040 m(약 39 km, 성층권)까지 상승했습니다.',
      '그는 36,529 m를 4분 20초 동안 자유낙하하며 최고 속도 1,345 km/h를 기록해 맨몸으로 음속을 돌파하는 세계 신기록을 수립했습니다. 키팅거는 당시 미션 통제 센터 요원으로 참여했습니다.'
    ],
    contentEn: [
      'You are a pioneering meteorologist, taking a trip to explore Earth\'s atmosphere from the ground to space in person! You are one of the first passengers in NASA\'s new space elevator. But you need some information about the atmosphere before your trip. Will you need supplemental oxygen? How should you dress? Sounds like you will learn much about the layers of the atmosphere!',
      'We can study the earth\'s atmosphere in several different ways. For example, we may be interested in its composition, that is, the kinds of gases it contains. Different atoms make up different chemical elements. Nitrogen makes up more than three-fourths of the atmosphere near the earth\'s surface. It doesn\'t easily react with other chemicals, so it exists as a pure element in air and isn\'t poisonous. One of its main purposes is to dilute oxygen to the concentration that is best for life while avoiding a fire hazard! This is not an accident of Earth\'s geologic history; it is evidence of God\'s wonderful design.',
      'We know that the atmosphere near the ground is a mixture of gases. Its volume is about 21% oxygen, 78% nitrogen, and 1% other gases such as argon, carbon dioxide, helium, and hydrogen. The portions of all these gases near the earth\'s surface are almost constant, except for carbon dioxide and water vapor. Carbon dioxide may vary between nearly 0% to a little more than 2%. Water vapor may vary from almost 0% to 5%.',
      'As we travel upward in our space elevator we notice that the composition of the atmosphere changes. All the gases that make up air are thoroughly mixed together in the lowest part of the atmosphere by winds and weather. They don\'t separate, settle out, or form layers. We call this uniform mix of gases the homosphere. It stretches upward to an altitude of 80 km. However, starting at about 3 km, you would need to breathe pressurized oxygen. Above 3 km, there is too little pressure for air to supply all the oxygen you need. Your brain starts acting fuzzy and your reactions slow down. That\'s why you are wearing a space suit for your trip!',
      'As we travel above the homosphere, air composition changes. In this region, called the heterosphere, the atmosphere has several layers of different gases. Since there is little wind at these altitudes, gases settle out by their atomic weights—with the heaviest gases nearer the bottom. From lowest to highest altitude, they are molecular nitrogen (N2), molecular oxygen (O2), atomic oxygen (O), helium (He), and molecular hydrogen (H2). This order makes sense, since the nitrogen molecule is fourteen times as heavy as the hydrogen molecule.'
    ],
    sidebar: {
      titleKo: '우주 스카이다이빙의 탐구 질문 (Questions to Consider)',
      titleEn: 'Questions to Consider: Skydiving from Space',
      contentKo: [
        '1. 펠릭스는 39,040 m(성층권)에서 낙하를 시작했습니다.',
        '2. 성층권 상부는 약 0°C이며 아래로 내려오며 대류권 계면(-55°C)에서 가장 차가운 공기를 통과합니다.',
        '3. 39km 고도는 여전히 동질권(Homosphere) 내부이므로 기체 구성비(질소 78%, 산소 21%)는 지표면과 동일하지만, 기압이 지표면의 1% 미만으로 극도로 희박합니다.',
        '4. 대기권 내부에 있었음에도 혈액이 끓는 비등 현상(암스트롱 한계)을 막고, 산소 결핍과 영하 55°C의 극한 추위로부터 생명을 보호하기 위해 여압 우주복이 필수적이었습니다.'
      ],
      contentEn: [
        '1. At 39,040 m, from which layer of the atmosphere did Felix start his jump? (Stratosphere)',
        '2. Where within the layers of the atmosphere would these men have traveled through the coldest air? (Tropopause at ~11 km, -55°C)',
        '3. What is the composition of the air through which they traveled? (Homosphere: 78% N2, 21% O2, but extremely low pressure)',
        '4. Why did they need space suits for their jumps if they were within the atmosphere the entire time? (Protection from hypoxia, Armstrong limit boiling, extreme cold and friction)'
      ]
    },
    marginNotes: [
      {
        originalText: "Carbon dioxide -> between nearly 0% to a little more than 2%. Water vapor -> almost 0% to 5%.",
        translation: "이산화탄소 -> 거의 0%에서 2% 조금 넘음. 수증기 -> 거의 0%에서 5%.",
        context: "교재 433페이지 좌측 상단 필기"
      },
      {
        originalText: "1000km: molecular hydrogen (H2) [lighter gases] -> 800km: helium (He) -> 300km: atomic oxygen (O) -> 200km: molecular oxygen (O2) -> molecular nitrogen (N2) [heavy gases] -> 80km homosphere",
        translation: "이질권 층상 구조: 수소(H2) -> 헬륨(He) -> 원자산소(O) -> 산소(O2) -> 질소(N2) [무거운 기체]",
        context: "교재 433페이지 우측 하단 필기 다이어그램"
      }
    ]
  },
  {
    id: 'sec-18-4',
    category: '18A',
    numberBadge: '4',
    lessonTag: '18A · 4교시',
    titleKo: '18.4 기온에 따른 5개 대기층 (대류권 ~ 외기권)',
    titleEn: '18.4 Temperature Layers of the Atmosphere',
    breadcrumb: '18A · 18.4 · 기온에 따른 대기층 (Temperature Layers)',
    pages: [433, 434, 435, 436],
    objectives: [
      '기온 변화에 따른 5개 대기층(대류권, 성층권, 중간권, 열권, 외기권)의 명칭과 경계면을 구분한다.',
      '대류권의 기온 감률(Lapse rate, 고도 1km당 약 -6.5°C 감소)과 대류 현상을 계산한다.',
      '성층권의 오존 흡수로 인한 기온 상승과 제트기류(최대 400km/h)의 특성을 파악한다.',
      '중간권의 최저 기온(-90°C), 열권의 초고온(650~1250°C) 및 우주선 열 방출 대책을 비교한다.'
    ],
    interactiveSpec: {
      type: 'temperature_graph',
      missionTitle: '미션 4 · 5개 대기층의 고도별 기온 변화 곡선 인터랙티브 분석',
      missionNumber: '18-4',
      stepTotal: 4,
      tabs: [
        {
          id: 'troposphere',
          label: '① 대류권 (Troposphere: 0 ~ 11 km)',
          codeSnippet: `// [대류권 (Troposphere) 물리량 및 기온 감률 계산]
const Troposphere = {
  altitudeThickness: {
    poles: "약 9 km",
    continentalUS: "약 11 ~ 12 km",
    equator: "약 16 ~ 17 km (열팽창)"
  },
  lapseRate: -6.5, // 고도 1km 상승 시 6.5°C 감소
  tropopauseTemp: -55, // 대류권계면 기온: 약 -55°C
  weather: "수증기와 활발한 열 대류로 비, 눈, 바람 등 모든 기상 현상 발생",
  calculateTemp: function(altKm) {
    if (altKm > 11) return -55;
    return 15 + (this.lapseRate * altKm); // 지표 15°C 기준
  }
};`,
          description: '기온 감률(1km당 -6.5°C)에 따라 상공으로 갈수록 추워지며, 지구 기상 현상의 대부분이 일어납니다.'
        },
        {
          id: 'stratosphere',
          label: '② 성층권 (Stratosphere: 11 ~ 50 km)',
          codeSnippet: `// [성층권 (Stratosphere) 특성]
const Stratosphere = {
  altitude: "11 km ~ 약 50 km",
  tempChange: "-55°C에서 상승하여 성층권계면(Stratopause)에서 약 0°C 도달",
  reason: "오존층이 태양 자외선을 흡수하여 열에너지로 변환",
  weather: "수증기와 먼지가 없어 구름이 생기지 않음 (시정 수백 km)",
  jetStreams: {
    speed: "최대 400 km/h (시속 400킬로미터)",
    application: "여객기가 제트기류를 타고 비행하여 속도 증가 및 연료 절약"
  }
};`,
          description: '오존층의 자외선 흡수로 기온이 0°C까지 상승하며, 구름이 없고 고속 제트기류가 붑니다.'
        },
        {
          id: 'meso-thermo',
          label: '③ 중간권 & 열권 (Mesosphere & Thermosphere)',
          codeSnippet: `// [중간권과 열권의 극한 기온 프로파일]
const Mesosphere = {
  altitude: "50 km ~ 약 80 km (중간권계면 Mesopause)",
  tempMin: -90, // 지구 대기권 중 가장 차가운 최저 기온 (-90°C)
  features: "수증기 없음 -> 날씨 없음 / 유성이 타기 시작 / 야광운(Noctilucent clouds)"
};
const Thermosphere = {
  altitude: "80 km ~ 약 500 km (열권계면 Thermopause)",
  dayTemp: "650°C ~ 1250°C (태양 방사선 직접 흡수)",
  humanSensation: "기체 입자가 극도로 희박하여 그늘에서는 열 전달이 안 돼 춥고, 햇빛에서는 통구이 위험",
  issAltitude: "약 400 km (국제우주정거장 궤도)"
};`,
          description: '중간권은 대기권 최저 영하 90°C까지 떨어지며, 열권은 1250°C까지 올라가지만 기체가 희박합니다.'
        }
      ],
      defaultTabId: 'troposphere',
      bottomInsight: '기온 프로파일: 대류권(감소, -55°C까지) → 성층권(오존 가열로 상승, 0°C) → 중간권(급감, 대기 최저 -90°C) → 열권(자외선 직접 흡수로 1250°C까지 급상승)의 지그재그 패턴을 보입니다.'
    },
    contentKo: [
      '[기온에 따른 대기의 5개 층]',
      '우주 엘리베이터를 타고 올라가다 보면 외부 온도계 수치가 극적으로 변하는 것을 알 수 있습니다. 지구 대기는 기온 변화율에 따라 5개의 뚜렷한 층으로 구분됩니다.',
      '1. 대류권 (Troposphere): 지표면에서 시작하여 극지방에서는 약 9 km, 중위도에서는 11~12 km, 적도에서는 16~17 km까지 이어집니다. 지구의 거의 모든 기상 현상(눈, 비, 구름)이 발생하는 곳입니다. 고도가 높아질수록 기온은 1 km 상승할 때마다 약 6.5°C씩 낮아지는데, 이를 "기온 감률(Lapse rate)"이라고 합니다. 약 11 km 지점에 도달하면 기온 하강이 멈추는데, 이곳을 "대류권계면(Tropopause, 약 -55°C)"이라 합니다.',
      '대류권 하부의 따뜻한 공기는 밀도가 낮아 상승하고, 상부의 찬 공기는 밀도가 높아 가라앉으면서 활발한 열적 대류 혼합(Thermal mixing)이 지속됩니다.',
      '2. 성층권 (Stratosphere): 대류권계면에서부터 약 50 km 고도까지 뻗어 있습니다. 구름과 먼지가 없으며, 기온은 -55°C에서 시작하여 성층권계면(Stratopause)에서 약 0°C까지 상승합니다(오존층의 자외선 흡수 때문). 또한 시속 400 km에 달하는 강력한 바람인 "제트기류(Jet streams)"가 불어 장거리 비행기가 이를 이용해 속도를 높이고 연료를 절감합니다.',
      '3. 중간권 (Mesosphere): 성층권계면에서부터 약 80 km의 중간권계면(Mesopause)까지입니다. 기온은 다시 고도에 따라 급격히 하강하여 지구 대기권에서 가장 낮은 온도인 약 -90°C에 도달합니다! 기체 혼합비는 균일하지만 수증기가 없어 기상 현상이 없습니다. 여름철 상공에서는 푸르스름한 야광운(Noctilucent clouds)이 관측되기도 합니다.',
      '4. 열권 (Thermosphere): 80 km에서부터 약 500 km의 열권계면(Thermopause)까지입니다. 기체 분자들이 태양의 방사선을 직접 흡수하여 낮 동안 온도가 650°C에서 1250°C까지 치솟습니다. 하지만 기체 입자가 극도로 희박하기 때문에 우주복에 접촉하여 열을 전달할 입자가 거의 없어, 그늘에 서 있으면 열기를 느끼지 못하고 오히려 차갑습니다.',
      '우주선은 열을 반사하기 위해 백색 페인트나 거울 표면을 사용하며, 과도한 열을 우주로 방출하는 냉각 핀(Fins)을 장착합니다.',
      '5. 외기권 (Exosphere): 열권 위의 전이 지대로 행성 간 우주 공간과 맞닿아 있습니다. 기체 입자가 너무 희박하여 분자 충돌 없이 지구 중력을 벗어나 우주로 날아갑니다.'
    ],
    contentEn: [
      'In addition to changes in composition, you also notice that the temperature probe on the exterior of the space elevator is indicating significant change as you travel upward through the atmosphere. The atmosphere has five distinct temperature layers. Air temperature changes within a layer, warming or cooling with altitude at different rates.',
      'The lowest layer of the atmosphere is the troposphere. This zone begins at the earth\'s surface and extends upward to about 9 km over the North and South Poles, to about 11–12 km over the continental United States, and to 16–17 km over the Equator. This is where most of Earth\'s weather happens. In the troposphere, temperature drops with increasing altitude. The temperature lowers about 6.5°C for every kilometer increase in altitude. Atmospheric scientists call this kind of steady change in temperature a lapse rate. At approximately 11 km, the temperature stops changing. This upper boundary of the troposphere is the tropopause. Here, the temperature is a chilly -55°C.',
      'The cold air at the top of the troposphere is dense and tends to sink. The warm air at the bottom of the troposphere is less dense, rises, and is replaced by the colder air settling from above. This process constantly mixes air in the troposphere. Rising warm air carries moisture that forms clouds and rain. Sinking cold air brings clear, cooler weather. This kind of thermal mixing happens only in the troposphere.',
      'The second temperature layer, the stratosphere, extends from the top of the troposphere to about 50 km. The stratosphere is free of clouds and dust. In this layer, the temperature increases from about -55°C at the bottom, to about 0°C at the top. Some winds in the stratosphere blow as fast as 400 kph in paths called jet streams. Aircraft sometimes fly with these jet streams to increase their speed and to save fuel. The upper boundary of the stratosphere is the stratopause.',
      'As the elevator travels into the mesosphere, you notice that air temperature again decreases with altitude. The coldest temperature of the atmosphere, -90°C, occurs at the top of the mesosphere. Like the troposphere and the stratosphere, the mesosphere is a uniform mix of gases. The mesosphere ends at the mesopause about 80 km above the earth.',
      'Passing through 80 km, your elevator enters the last true layer of the atmosphere—the thermosphere, which extends to the thermopause at about 500 km. Scattered atmospheric atoms and molecules absorb the sun\'s full radiation. Daytime temperatures range from 650°C to 1250°C at the highest part of the thermosphere. In spite of the high temperatures, you would not feel warm in the thermosphere as long as you stayed in the shadow of your elevator vehicle. The molecules are so widely separated that too few would contact your suit to transfer heat. However, you would cook in direct sunlight without an insulated space suit!',
      'The transitional zone—not a true layer—between the atmosphere and interplanetary space is the exosphere. Gases in this layer can escape from Earth\'s gravity into space.'
    ],
    marginNotes: [
      {
        originalText: "tropopause: tropo- (to turn or change) + -pause (L. pausa-stop)",
        translation: "대류권계면: tropo-(변하다, 돌다) + -pause(정지)",
        context: "교재 433페이지 어원 설명 메모"
      },
      {
        originalText: "difference: mesosphere -> no moisture, so no weather. troposphere -> has moisture, so there is weather.",
        translation: "차이점: 중간권 -> 수증기 없음, 따라서 날씨 없음. 대류권 -> 수증기 있음, 따라서 날씨 발생.",
        context: "교재 434페이지 하단 메모"
      }
    ]
  },
  {
    id: 'sec-18-5',
    category: '18A',
    numberBadge: '5',
    lessonTag: '18A · 5교시',
    titleKo: '18.5 대기의 물질 순환 (탄소 순환 & 질소 순환)',
    titleEn: '18.5 Cycles and the Atmosphere: Carbon & Nitrogen',
    breadcrumb: '18A · 18.5 · 대기의 순환 (Cycles and the Atmosphere)',
    pages: [437, 438],
    objectives: [
      '탄소 순환(광합성, 호흡, 분해, 해양 저장소, 화석연료)에서 대기 중 이산화탄소의 저장소 역할을 규명한다.',
      '질소 순환(번개 방전, 질소 고정 세균, 암모늄, 아질산염, 질산염, 탈질 세균)의 화학적 변환 경로를 추적한다.',
      '하버-보슈법(Haber-Bosch Process)의 화학 공정과 현대 농업 식량 생산 증대에 미친 파급 효과를 설명한다.'
    ],
    interactiveSpec: {
      type: 'carbon_cycle',
      missionTitle: '미션 5 · 전 지구 탄소 및 질소 순환 경로 시뮬레이터',
      missionNumber: '18-5',
      stepTotal: 4,
      tabs: [
        {
          id: 'carbon',
          label: '① 탄소 순환 (The Carbon Cycle)',
          codeSnippet: `// [탄소 순환 경로 및 저장소]
const CarbonCycle = {
  atmosphericReservoir: "대기 중 CO2 (약 0.04%, 핵심 교환 통로)",
  fluxes: {
    photosynthesis: "식물이 대기 중 CO2를 흡수하여 포도당 등 유기 탄소 화합물 합성",
    respiration: "동물과 식물이 호흡을 통해 CO2를 다시 대기로 배출",
    decay: "생물 사체와 배설물이 박테리아에 의해 분해되며 토양과 대기로 환원",
    oceanDissolution: "해수에 CO2가 용해되어 탄산칼슘(CaCO3) 조개껍데기 및 해양 퇴적물 형성",
    fossilFuels: "지질학적 압력으로 매장된 탄화수소(석탄, 석유) 연소 시 CO2 방출"
  }
};`,
          description: '식물의 광합성과 생물의 호흡, 해양 용해, 사체 분해 및 화석연료 연소를 통한 탄소의 이동입니다.'
        },
        {
          id: 'nitrogen',
          label: '② 질소 순환 (The Nitrogen Cycle)',
          codeSnippet: `// [질소 순환 화학적 단계]
const NitrogenCycle = {
  atmosphericReservoir: "대기 질소 분자(N2, 78%) - 삼중 결합으로 불활성",
  pathway: [
    "1. 질소 고정(Nitrogen Fixing): 콩과 식물 뿌리혹박테리아 또는 번개 방전으로 N2를 암모늄(NH4+)으로 전환",
    "2. 질화 작용(Nitrification): 질화세균이 암모늄을 아질산염(NO2-) 거쳐 질산염(NO3-)으로 산화",
    "3. 식물 흡수(Assimilation): 식물이 질산염을 흡수하여 단백질과 유전자(DNA) 합성",
    "4. 동물 섭취 및 배설: 먹이사슬 이동 후 분해자가 암모니아로 분해",
    "5. 탈질 작용(Denitrification): 탈질세균이 질산염을 다시 N2 기체로 환원하여 대기로 방출"
  ]
};`,
          description: '대기 중 78% 질소를 생명체가 이용할 수 있도록 고정하고 순환시키는 박테리아와 번개의 역할입니다.'
        },
        {
          id: 'haber-bosch',
          label: '③ 하버-보슈법 (Haber-Bosch Process)',
          codeSnippet: `// [공기에서 빵을 만든 프리츠 하버와 카를 보슈 (1913)]
const HaberBoschReaction = {
  equation: "N2(g) + 3H2(g) <=> 2NH3(g)  [고온 450°C, 고압 200atm, 철 촉매]",
  impact: {
    fertilizer: "공기 중의 질소를 대량의 인공 질소 비료(암모니아)로 전환",
    cropYield: "농작물 생산성 4배(400%) 이상 비약적 향상",
    significance: "단일 인류 과학 발견 중 세계 인구 부양에 가장 크게 기여"
  }
};`,
          description: '공기 중의 질소를 인공 비료로 만들어 지구 인구 부양 능력을 4배로 끌어올린 혁신적인 화학 공정입니다.'
        }
      ],
      defaultTabId: 'carbon',
      bottomInsight: '탄소와 질소는 생명체 유지에 필수적이며, 대기는 거대한 저장소 역할을 합니다. 순수한 질소(N2)는 결합이 강해 직접 흡수하지 못하므로 토양 속 세균이나 번개 고정을 거쳐야만 식물이 흡수할 수 있습니다.'
    },
    contentKo: [
      '[대기와 물질 순환]',
      '생명체는 탄소, 질소, 물과 같은 핵심 화학물질을 필요로 합니다. 이 자원들이 재활용되지 않는다면 지구상의 생명체는 존재할 수 없습니다. 대기는 전 지구적 영양소 순환에서 중추적인 역할을 담당합니다.',
      '[탄소 순환 (The Carbon Cycle)]',
      '탄소 순환은 탄소가 생명체에서 환경의 탄소 저장소로, 그리고 다시 생명체로 끊임없이 이동하는 과정입니다. 대기 중의 이산화탄소(CO2)는 핵심적인 탄소 저장소입니다.',
      '식물은 광합성(Photosynthesis)을 통해 대기 중의 이산화탄소를 흡수하여 조직을 만들고 복합 탄소 화합물 형태의 열매를 맺습니다. 동물과 사람이 식물을 섭취하면 탄소 화합물이 몸의 일부가 되고 에너지를 얻기 위해 분해되며, 호흡을 통해 다시 이산화탄소가 대기로 방출됩니다.',
      '생명체가 죽어 썩으면 사체의 탄소 화합물이 토양 탄소 저장소로 들어갑니다. 또한 이산화탄소와 탄소 화합물은 지표수와 지하수에 녹아 호수와 바다로 유입됩니다. 해양 퇴적물(탄산칼슘 CaCO3)과 지질학적 화석연료(석탄, 석유)도 탄소 순환의 중요한 축입니다.',
      '[질소 순환 (The Nitrogen Cycle)]',
      '대기는 전 지구 질소 순환에서 가장 거대한 질소 저장소(전체 대기의 78%)입니다. 하지만 순수한 질소 기체(N2)는 삼중 결합으로 매우 안정하여 생명체의 화학 반응에 직접 참여하지 못합니다.',
      '대기 중 질소가 생명체에 쓰이려면 암모니아(NH3)나 유기 질소 화합물로 전환되는 "질소 고정(Fixed nitrogen)" 과정을 거쳐야 합니다. 콩과 식물의 뿌리나 토양, 해양에 서식하는 특수 질소 고정 박테리아(Nitrogen-fixing bacteria)가 이 일을 담당합니다.',
      '또한 대기 중의 강력한 번개(Lightning)는 공기 중의 질소 분자를 쪼개어 산소와 결합시킴으로써 질소 화합물을 만들어 비와 함께 토양에 공급합니다.',
      '식물이 흡수 가능한 형태(질산염 NO3-)로 전환된 질소는 먹이사슬을 거쳐 단백질을 형성하고, 생물의 배설물과 사체는 분해자를 거치며, 탈질 박테리아(Denitrifying bacteria)에 의해 다시 질소 기체로 환원되어 대기로 돌아갑니다.'
    ],
    contentEn: [
      'As you have learned in earlier chapters, key chemicals needed by living things are recycled in the natural environment. For example, organisms require carbon, nitrogen, and water, among other things. If these resources were not replenished by recycling, supporting the present amount of life on Earth would not be possible. What role does the atmosphere play in global nutrient cycles?',
      'The flow of carbon from living things to the carbon reservoirs in the environment and back again is what the carbon cycle is all about. Atmospheric carbon dioxide is a key carbon reservoir in the carbon cycle. Plants use the gas during photosynthesis to build their tissues and produce fruits made of complex carbon compounds. When animals and people eat the plants, they take in the carbon compounds, which become part of their tissues. Some of the food we eat is broken down for energy, and, as part of this process, carbon dioxide is exhaled into the atmosphere.',
      'After living things die and decay, their carbon compounds enter the soil carbon reservoir. Remember that carbon dioxide and carbon compounds can dissolve in surface water and groundwater, and can ultimately enter lakes and even the ocean. The freshwater and marine carbon cycles both take part in the overall movement of carbon through the environment. So there is a flow of carbon between living things, the earth, water, and the atmosphere.',
      'The atmosphere is the largest nitrogen reservoir for the global nitrogen cycle. Air has lots of nitrogen, but most living things cannot directly use that element in life processes. Pure nitrogen does not easily take part in chemical reactions, like biological processes. Atmospheric nitrogen must be converted to organic or fixed nitrogen compounds, such as ammonia (NH3), by special nitrogen-fixing bacteria. These bacteria live in the soil, in special plants that provide a home for them, and in aquatic and marine environments. Another source of fixed nitrogen in the atmosphere is lightning. Lightning breaks down nitrogen in the air and combines it with oxygen. The new compounds that form are another starting point for the nitrogen cycle.'
    ],
    sidebar: {
      titleKo: '공기에서 아스파라거스까지 (From Air to Asparagus)',
      titleEn: 'From Air to Asparagus: The Haber-Bosch Process',
      contentKo: [
        '토양에서 식물이 얼마나 자랄 수 있는지를 결정하는 핵심 제한 요소는 영양분, 특히 식물의 성장에 필수적인 "유기 질소(Organic nitrogen)"입니다.',
        '1913년 독일 화학자 프리츠 하버(Fritz Haber)와 카를 보슈(Carl Bosch)는 공기 중의 질소를 인공 비료로 바꾸는 방법, 즉 "하버-보슈법(Haber-Bosch Process)"을 개발했습니다.',
        '이는 박테리아가 하던 일을 화학 공학적으로 실현한 것으로, 농부들은 전례 없이 막대한 양의 식량을 재배할 수 있게 되었습니다.',
        '오늘날 하버-보슈법으로 생산된 비료 덕분에 인류는 4배 더 효율적으로 식량을 생산할 수 있으며, 이 발견은 인류 역사상 전 세계 인구 증가에 가장 크게 기여한 단일 과학적 발견으로 꼽힙니다.'
      ],
      contentEn: [
        'One of the main limitations on how much food people can grow is nutrients in the soil. Organic nitrogen is key, since it is plant food. In 1913 German chemists Fritz Haber and Carl Bosch introduced a method, called the Haber-Bosch Process, that turns nitrogen in the air into artificial fertilizer. This is the same thing that bacteria do! Suddenly, it was possible to grow much larger quantities of food than ever before. Today, fertilizer made by the Haber-Bosch Process allows us to produce food four times more efficiently. This process probably has contributed more to growing the population today than any other single human discovery.'
      ]
    },
    marginNotes: [
      {
        originalText: "Q: Cold air down, Warm air up. Why does air down when latitude up? Daytime: Process: warm land -> cold sea -> Land breeze.",
        translation: "질문: 찬 공기 하강, 따뜻한 공기 상승. 왜 고위도로 갈수록 하강할까? 낮: 육지 가열 -> 해풍/육풍 메커니즘",
        context: "교재 437페이지 우측 상단 필기 메모"
      }
    ]
  }
];
