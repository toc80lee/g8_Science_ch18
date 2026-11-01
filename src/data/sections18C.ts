import { ChapterSection } from '../types';

export const sections18C: ChapterSection[] = [
  {
    id: 'sec-18-9',
    category: '18C',
    numberBadge: '9',
    titleKo: '18.9 복사하는 태양 (The Radiant Sun)',
    titleEn: '18.9 The Radiant Sun',
    breadcrumb: '18C · 18.9 The Radiant Sun · 복사하는 태양',
    pages: [445],
    objectives: [
      '지구 표면의 에너지를 공급하는 근원으로서 태양이 방출하는 전자기파와 하전 입자(태양풍)의 특성을 이해한다.',
      '전자기파 스펙트럼(전파부터 감마선까지) 중 태양 복사 에너지가 가시광선과 적외선 파장대에 집중되어 있음을 파악한다.',
      '맑은 날 지표면에 도달하는 태양 에너지율(약 0.95 kW/m²)의 물리적 의미를 학습한다.',
      '1815년 탐보라 화산 폭발로 인한 성층권 화산재 유입과 1816년 "여름 없는 해" 기후 이변 사례를 분석한다.'
    ],
    interactiveSpec: {
      type: 'code_preview',
      missionTitle: '미션 9 · 복사하는 태양: 전자기 스펙트럼과 1815년 탐보라 화산 사건',
      missionNumber: '18-9',
      stepTotal: 2,
      tabs: [
        {
          id: 'em-spectrum',
          label: '① 전자기파 스펙트럼 & 복사 에너지',
          codeSnippet: `// [태양의 방출 에너지와 전자기파 스펙트럼]
const RadiantSunEnergy = {
  primaryForms: [
    "전자기파 (Electromagnetic waves: 빛 에너지)",
    "태양풍 (Solar wind: 고에너지 양성자와 전자)"
  ],
  wavelengthSpectrum: {
    longest: "전파 (Radio waves)",
    visibleAndInfrared: "지구 도달 복사 에너지의 대부분 (가시광선 & 적외선)",
    shortest: "감마선 (Gamma rays)"
  },
  surfaceEnergyRate: "화창한 날 지표면 도달 복사열: 약 0.95 kW/m²"
};`,
          description: '태양 복사 에너지는 전파부터 감마선까지 방출되며 가시광선과 적외선 파장대에 집중되어 있습니다.'
        },
        {
          id: 'tambora-1815',
          label: '② 역사적 사례: 1815년 탐보라 화산 폭발',
          codeSnippet: `// [1815년 탐보라 화산 폭발과 '여름 없는 해' (Year Without a Summer)]
const TamboraEvent_1815 = {
  location: "인도네시아 탐보라 화산 (1815년 4월 대폭발)",
  mechanism: "성층권으로 유입된 막대한 양의 화산재와 황산염 에어로졸",
  impact: {
    solarReduction: "지표면 도달 태양광이 정상치의 80% 수준으로 급감 (20% 차단)",
    climateEffect: "1816년 북반구 전역에 한여름 눈 폭풍 및 서리 발생",
    societalImpact: "전 지구적 흉작, 대기근 및 식량 폭동 초래"
  }
};`,
          description: '1815년 탐보라 화산재가 성층권에 퍼져 태양광을 20% 차단하면서 1816년 "여름 없는 해"를 초래했습니다.'
        }
      ],
      defaultTabId: 'em-spectrum',
      bottomInsight: '태양은 가시광선과 적외선을 중심으로 엄청난 복사 에너지를 방출하며, 맑은 날 지표면 1m²당 약 0.95 kW가 도달합니다. 탐보라 화산재처럼 대기 중 미립자가 빛을 차단하면 극적인 기후 변화가 발생합니다.'
    },
    contentKo: [
      '[복사하는 태양 (The Radiant Sun)]',
      '지구 표면의 거의 모든 에너지는 직접적으로 또는 간접적으로 태양에서 옵니다. 태양은 광범위한 에너지와 하전 입자들을 방출합니다.',
      '태양이 방출하는 에너지의 대부분은 전자기파(Electromagnetic waves), 즉 빛 에너지(Light energy) 형태입니다. 또한 태양풍을 이루는 고에너지 양성자와 전자도 방출합니다.',
      '전자기파 스펙트럼에는 가장 파장이 긴 전파(Radio waves)부터 감마선(Gamma rays)까지 다양하며, 태양 복사 에너지의 대부분은 가시광선(Visible light)과 보이지 않는 적외선(Infrared wavelengths) 파장대에 집중되어 있습니다.',
      '화창한 날 태양이 머리 위에 있을 때 지표면에 도달하는 태양 에너지는 1초당 1 제곱미터당 약 0.95 kW/m²에 이릅니다.',
      '1815년 인도네시아 탐보라(Mount Tambora) 화산의 대폭발 당시 성층권으로 솟구친 화산재 먼지는 지표면 일조량을 80% 수준으로 떨어뜨렸고, 이로 인해 전 세계는 1816년에 "여름이 없었던 해(Year without a summer)"라는 극심한 기후 이변을 겪었습니다.'
    ],
    contentEn: [
      'Almost all the energy at the surface of the earth comes directly or indirectly from the sun. The sun emits a wide variety of energy and particles. Most of the sun\'s radiated energy is in the form of electromagnetic waves—light energy. The sun also emits energetic protons and electrons that make up the solar wind. These different kinds of waves vary in wavelength. Radio waves are the longest waves and gamma rays the shortest. Although the sun emits radiant energy at all wavelengths, most of the radiant energy received by the earth is in the visible and infrared wavelengths.',
      'The sun\'s energy that reaches the earth\'s surface on a typical sunny day with the sun directly overhead is about 0.95 kW/m² each second. Following the catastrophic eruption of Mount Tambora in 1815, volcanic dust reduced the surface solar illumination to 80% of that value. This very abnormal condition plunged the world into a "year without a summer."'
    ]
  },
  {
    id: 'sec-18-10',
    category: '18C',
    numberBadge: '10',
    titleKo: '18.10 태양 상수와 대기 에너지 수지 (The Solar Constant)',
    titleEn: '18.10 The Solar Constant',
    breadcrumb: '18C · 18.10 The Solar Constant · 태양 상수와 에너지 수지',
    pages: [445, 446],
    objectives: [
      '우주 공간을 지나 지구 대기 최상단에 수직으로 도달하는 태양 복사 에너지율인 태양 상수(Solar Constant, 1.367 kW/m²)의 정의와 물리적 의미를 파악한다.',
      '지구 대기의 에너지 균형(구름/먼지 반사 최대 32%, 대기 직접 흡수 최대 18%, 지표면 흡수 50%~75%)을 수치로 분석한다.',
      '남위 23.5°~북위 23.5° 적도대 수직 입사와 고위도 경사 입사에 따른 단위 면적당 에너지 밀도 분산을 이해한다.'
    ],
    interactiveSpec: {
      type: 'code_preview',
      missionTitle: '미션 10 · 태양 상수(1.367 kW/m²)와 대기 에너지 수지(Energy Budget) 계산기',
      missionNumber: '18-10',
      stepTotal: 2,
      tabs: [
        {
          id: 'solar-budget',
          label: '① 태양 상수 & 대기 에너지 분배',
          codeSnippet: `// [지구 대기 에너지 수지 (Earth Energy Budget)]
const SolarInsolation = {
  solarConstant: "1.367 kW/m² (대기 상단 수직 도달 에너지)",
  distribution: {
    cloudReflection: "최대 32% (우주로 반사 - 알베도 효과)",
    atmosphericAbsorption: "최대 18% (구름, 먼지, 수증기가 직접 흡수)",
    earthSurfaceAbsorption: "50% 이상 (육지와 바다가 흡수하여 지표 가열)",
    netReachingSurface: "맑은 날 수직 입사 시 60~75% 지표 도달"
  }
};
/* 대기 필터링 덕분에 인류는 과도한 직사광선으로부터 보호받습니다 */`,
          description: '1.367 kW/m²의 에너지가 구름 반사(32%), 대기 흡수(18%), 지표 흡수(50%+)로 분배되는 메커니즘입니다.'
        },
        {
          id: 'incident-angle',
          label: '② 위도 및 입사각 효과 (23.5° 적도대 vs 고위도)',
          codeSnippet: `// [태양광 입사각과 단위 면적당 에너지 밀도]
function calculateEnergyDensity(latitude, solarAngle) {
  // 태양 광선이 수직(90도)에 가까울수록 에너지가 좁은 면적에 집중
  // 고위도로 갈수록 비스듬하게 입사하여 넓은 면적으로 분산됨
  const sinFactor = Math.sin((solarAngle * Math.PI) / 180);
  return {
    latitudeRegion: latitude < 23.5 ? "열대 지역 (최대 에너지)" : "온대/극지방 (경사 입사)",
    relativeEnergy: (sinFactor * 100).toFixed(1) + "%"
  };
}`,
          description: '적도 부근(남위/북위 23.5° 이내)은 수직으로 입사해 에너지가 집중되고, 고위도는 경사져 에너지가 분산됩니다.'
        }
      ],
      defaultTabId: 'solar-budget',
      bottomInsight: '대기 상단에는 1.367 kW/m²의 태양 에너지가 유입되며, 구름이 최대 32%를 우주로 반사하고 대기가 18%를 흡수하며 지표면이 50% 이상을 흡수합니다. 입사각에 따라 적도는 강한 에너지를 받고 고위도는 분산됩니다.'
    },
    contentKo: [
      '[태양 상수 (The Solar Constant)]',
      '지구가 받는 태양 에너지는 태양 전체 방출량의 극히 일부분에 불과하지만, 지구상의 모든 생명을 지탱하기에 완벽하게 충분합니다.',
      '천문학자들은 우주 공간을 지나 지구 대기 최상단에 수직으로 도달하는 태양 복사 에너지의 양을 "태양 상수(The Solar Constant)"라고 부르며, 그 값은 대략 1.367 kW/m²(킬로와트/제곱미터)입니다.',
      '그러나 이 에너지가 전부 지표면에 도달하는 것은 아닙니다. 구름과 대기 중의 미립자가 들어오는 태양 에너지의 최대 32%를 우주로 반사합니다. 또한 구름, 먼지, 수증기가 추가로 18%가량을 흡수하여 대기를 약간 덥힙니다.',
      '가장 불리한 조건(흐린 날)에서는 들어오는 빛의 절반도 지표에 도달하지 못하지만, 맑은 날 태양이 머리 위에 있을 때는 태양 에너지의 60~75%가 육지와 바다로 흡수됩니다.',
      '태양 광선이 지표면에 거의 수직으로 내리쬘 때 단위 면적당 에너지 입력이 가장 큽니다. 이는 남위 23.5°에서 북위 23.5° 사이의 좁은 적도대에서만 발생하며, 고위도로 갈수록 태양 광선이 비스듬히 입사하여 에너지가 넓은 면적에 분산됩니다(그림 18-14).'
    ],
    contentEn: [
      'Although the earth receives only a tiny part of the sun\'s total energy output, it is enough to sustain all life on the planet. Astronomers call the rate of the flow of radiant energy from the sun that reaches the earth through space the solar constant. At the top of the atmosphere, 1.367 kilowatts (kW) of the sun\'s energy falls on each square meter of the atmosphere. But not all this energy makes it to the earth\'s surface.',
      'Although the sun gives off a lot of visible light, the majority of our solar energy is from the invisible infrared band. As light passes through the atmosphere, most of the short wavelength rays and some portions of the infrared are absorbed. Clouds and airborne particles in the atmosphere reflect as much as 32% of the sun\'s energy. Clouds, dust, and water vapor absorb up to another 18%. This filtering process warms the atmosphere slightly. Under the least favorable conditions, up to half the incoming light does not even reach us! However, on a sunny day with the sun directly overhead, 60–75% of the incoming solar energy can reach the earth\'s surface.'
    ]
  },
  {
    id: 'sec-18-11',
    category: '18C',
    numberBadge: '11',
    titleKo: '18.11 대기를 데우는 3가지 방식 (복사, 전도, 대류)',
    titleEn: '18.11 Warming the Atmosphere: Conduction, Convection & Radiation',
    breadcrumb: '18C · 18.11 Warming the Atmosphere · 대기 가열 방식',
    pages: [447],
    objectives: [
      '대기가 태양광 직사보다 지표면의 재복사 적외선에 의해 주로 가열되는 원리를 이해한다.',
      '열전달의 3대 메커니즘인 복사(Radiation), 전도(Conduction), 대류(Convection)의 과학적 정의와 차이점을 비교한다.',
      '기체 분자의 충돌(전도)과 밀도 차이에 의한 상승·하강 순환류(대류)가 날씨와 바람 형성에 미치는 역할을 규명한다.'
    ],
    interactiveSpec: {
      type: 'heat_transfer',
      missionTitle: '미션 10 · 대기 열전달 3요소(복사, 전도, 대류) 인터랙티브 시뮬레이션',
      missionNumber: '18-11',
      stepTotal: 4,
      tabs: [
        {
          id: 'radiation',
          label: '① 복사 (Radiation - 적외선 방출)',
          codeSnippet: `// [열전달 메커니즘 1: 복사 (Radiation)]
const RadiationHeat = {
  definition: "매개 물질 없이 전자기파(주로 열적외선) 형태로 공간을 통과하는 열전달",
  mechanism: "지표면(땅과 바다)이 흡수한 태양광을 파장이 긴 열적외선으로 변환하여 상공으로 방출",
  greenhouseGasAbsorption: "대기 중의 온실가스(수증기, CO2) 분자가 이 적외선을 매우 효율적으로 흡수하여 가열됨",
  exampleInBook: "화산 용암 지대에서 뿜어져 나오는 강렬한 열복사선을 소방복이 차단"
};`,
          description: '지표면이 흡수한 태양 에너지를 열적외선으로 재방출하여 대기 중 기체 분자가 흡수합니다.'
        },
        {
          id: 'conduction',
          label: '② 전도 (Conduction - 직접 접촉 충돌)',
          codeSnippet: `// [열전달 메커니즘 2: 전도 (Conduction)]
const ConductionHeat = {
  definition: "물질 간의 직접적인 물리적 접촉을 통해 분자들의 충돌로 운동(열) 에너지가 전달되는 방식",
  process: [
    "태양열로 뜨거워진 지표면(흙, 암석, 바닷물)과 공기 분자가 직접 충돌",
    "지표면의 활발한 원자 진동 에너지가 접촉한 기체 분자로 전파",
    "지표면과 닿아 있는 얇은 최하층 공기의 온도가 급상승"
  ],
  limitation: "공기는 열전도율이 매우 낮아서 지표면 바로 윗부분 몇 센티미터~수 미터만 직접 가열됨",
  exampleInBook: "따뜻하게 달궈진 바위 표면에 배를 깔고 체온을 덥히는 거북이들"
};`,
          description: '가열된 암석, 흙, 바다와 직접 접촉한 공기 분자가 충돌하며 열을 전달받습니다.'
        },
        {
          id: 'convection',
          label: '③ 대류 (Convection - 수직 밀도 순환류)',
          codeSnippet: `// [열전달 메커니즘 3: 대류 (Convection)]
const ConvectionHeat = {
  definition: "가열된 유체(공기) 덩어리가 밀도 차이에 의해 수직으로 이동하면서 열을 순환시키는 방식",
  fluidDynamics: [
    "복사와 전도로 가열된 하층 공기가 팽창하여 밀도가 작아짐 -> 부력으로 상공으로 상승",
    "상공의 차갑고 밀도가 큰 공기가 아래로 가라앉음 -> 빈자리를 메우며 순환류 형성",
    "상승한 따뜻한 공기는 단열 팽창하며 냉각되어 수증기가 응결 -> 구름과 강수 형성"
  ],
  efficiency: "대기권 전체를 골고루 데우는 3가지 방식 중 가장 규모가 크고 효율적인 열전달",
  exampleInBook: "호수와 지표면 상공에서 피어오르는 열대류 상승 기류"
};`,
          description: '데워져 가벼워진 공기가 위로 솟구치고 찬 공기가 가라앉으며 구름과 바람을 만듭니다.'
        }
      ],
      defaultTabId: 'radiation',
      bottomInsight: '대기는 직접 햇빛에 의해 가열되기보다 [지표면 가열 → 복사(적외선 방출) & 전도(접촉 충돌) → 대류(상승 순환)]의 3단계를 거쳐 효율적으로 데워집니다.'
    },
    contentKo: [
      '[대기를 데우는 3가지 방식]',
      '앞서 살펴보았듯이 들어오는 태양 에너지는 우리가 가장 필요로 하는 대류권 대기를 직접 가열하지 않습니다. 그렇다면 지표면 부근의 대기는 어떻게 열을 흡수할까요? 대기는 크게 세 가지 방식으로 가열됩니다.',
      '1. 복사 (Radiation): 지표면이 원래 들어온 태양 복사 에너지의 대부분을 흡수하여 열에너지로 변환시킵니다. 따뜻해진 지표면은 적외선(Infrared rays)을 다시 대기 중으로 방출합니다. 적외선은 열복사(Thermal radiation)와 같은 의미입니다. 대기 중의 기체 분자들은 햇빛보다 이 열복사 적외선을 훨씬 더 쉽게 흡수합니다.',
      '2. 전도 (Conduction): 지표면과 대기 사이의 직접적인 접촉에 의한 열전달입니다. 공기 입자들은 끊임없이 운동하며 태양열로 데워진 물, 바위, 토양 입자들과 충돌합니다. 이러한 충돌이 일어날 때 운동 에너지가 기체 입자로 전달되어 온도가 올라갑니다. 직접 접촉에 의한 열전달인 전도는 세 가지 방식 중 가장 국소적이지만 지표 바로 위 공기를 데우는 기초가 됩니다.',
      '3. 대류 (Convection): 대기 중에서 따뜻해진 공기 덩어리가 차가운 상공 영역으로 수직 이동하는 현상입니다. 대류는 호수, 바다, 지구 맨틀 내부에서도 일어나는 흔한 밀도 순환류(Density current)입니다.',
      '복사나 전도로 인해 따뜻해진 공기는 팽창하여 주변 공기보다 밀도가 낮아지고 가벼워집니다. 차갑고 밀도가 높은 공기가 아래로 밀려 내려오면서 따뜻한 공기를 대기 상공으로 밀어 올립니다. 이렇게 형성된 상승 기류를 "대류 순환류(Convection current)"라고 합니다. 대류는 열에너지를 대기 상층부로 전달할 뿐만 아니라 구름과 바람을 형성하는 핵심 동력입니다.'
    ],
    contentEn: [
      'As you just learned, the incoming solar energy doesn\'t heat the atmosphere very much where we need it—in the troposphere. So how does the atmosphere near the earth\'s surface absorb solar energy? There are three ways.',
      'Some of the light energy reflects off the earth\'s surface and heads back out into space. On its way through the atmosphere, the air absorbs some of this reflected energy. But the earth\'s surface absorbs most of the original incoming radiant energy and converts it to thermal energy. The warmed surface radiates infrared rays back into the atmosphere. Infrared rays are the same thing as thermal radiation. Gas molecules absorb heat from thermal radiation much more easily than they do from light rays.',
      'A second method of heat transfer is direct contact between the surface of the earth and the atmosphere. Gas particles in the air are in constant motion and collide with water, rock, and soil particles, which the sun\'s radiation has heated. When these collisions occur, kinetic energy transfers to the gas particles. This process raises the temperature of the air in contact with these surfaces. Heat transfer by direct contact is conduction. It is the most efficient of the three methods at the interface.',
      'The third method of heat transfer involves the vertical movement of warmed masses of air into cooler regions in the atmosphere. This process is convection. Convection is a common kind of density current similar to ones that exist in lakes, in the ocean, and within the mantle. Air warmed by radiation or conduction becomes less dense than the surrounding air. Cooler, denser air flows in under the warmer air, lifting it up into the atmosphere, forming a convection current. In addition to moving thermal energy to different levels of the atmosphere, convection currents are important in cloud and wind formation. You will learn about these in later chapters.'
    ]
  },
  {
    id: 'sec-18-12',
    category: '18C',
    numberBadge: '12',
    titleKo: '18.12 온실 효과 (The Greenhouse Effect) & 자외선과 생명',
    titleEn: '18.12 The Greenhouse Effect',
    breadcrumb: '18C · 18.12 The Greenhouse Effect · 온실 효과',
    pages: [448, 449],
    objectives: [
      '단파장 가시광선 투과와 장파장 열적외선 포획에 의한 온실 효과(Greenhouse Effect)의 물리적 메커니즘을 규명한다.',
      '지구 온실 효과에 가장 크게 기여하는 양대 온실가스인 수증기(H2O)와 이산화탄소(CO2)의 역할을 파악한다.',
      '온실 효과가 부재할 경우 지구가 겪게 될 주간 화염과 야간 영하 극저온의 불모 환경을 이해한다.',
      '자외선(UV)의 양면성(비타민 D 합성 및 살균 vs DNA 손상, 피부암, 해양 식물플랑크톤 파괴)을 분석한다.'
    ],
    interactiveSpec: {
      type: 'greenhouse_sim',
      missionTitle: '미션 12 · 온실가스 농도에 따른 지구 열 포획 시뮬레이터',
      missionNumber: '18-12',
      stepTotal: 4,
      tabs: [
        {
          id: 'greenhouse-mechanism',
          label: '① 온실 효과 메커니즘 (단파 투과 & 장파 포획)',
          codeSnippet: `// [온실 효과 (Greenhouse Effect) 물리 모델]
const GreenhouseMechanism = {
  incoming: "단파장 가시광선 (태양광) -> 대기를 쉽게 통과하여 지표면 도달",
  surfaceAction: "지표면이 단파광을 흡수하고 장파장 열적외선으로 변환하여 상공으로 재방출",
  atmosphericTrapping: {
    absorbers: ["수증기 (Water Vapor, 기여도 1위)", "이산화탄소 (CO2, 기여도 2위)"],
    effect: "빠져나가려는 적외선을 흡수하여 사방으로 재방사함으로써 지표 기온을 보온"
  },
  withoutGreenhouse: "지구 평균 기온 영하 18°C로 빙결, 낮에는 뙤약볕, 밤에는 극저온으로 생명 절멸"
};`,
          description: '단파 가시광선은 통과시키고 지표가 내뿜는 장파 적외선은 온실가스가 붙잡아 지구를 따뜻하게 유지합니다.'
        },
        {
          id: 'uv-life',
          label: '② 자외선과 생명 (UV Light and Life 심층)',
          codeSnippet: `// [자외선(UV)의 유익함과 위험성]
const UVRadiationLife = {
  beneficial: {
    vitaminD: "하루 10~15분 햇빛 노출로 뼈와 면역에 필수적인 비타민 D 합성",
    sterilization: "공기 중의 유해 박테리아 및 세균 살균",
    plantHormones: "식물 호르몬 자극 및 병충해 저항력 증진"
  },
  hazards: {
    sunburn: "엘렌의 사례: 흐린 초여름에도 자외선 화상으로 피부 손상",
    skinCancer: "DNA 돌연변이 유발 -> 미국인 5명 중 1명 피부암 발생 (연간 540만 건)",
    oceanFoodChain: "해양 기초 생산자 식물플랑크톤(산소 공급원) 광합성 억제 -> 먹이사슬 붕괴 위험"
  }
};`,
          description: '적절한 자외선은 비타민 D를 만들지만, 과도하면 피부암과 바다 식물플랑크톤 광합성을 저해합니다.'
        },
        {
          id: 'co2-debate',
          label: '③ 이산화탄소 논쟁 (오염물질 vs 식물 영양소)',
          codeSnippet: `// [CO2: 대기 오염 물질인가, 생명의 영양소인가?]
const CarbonDioxideDebate = {
  view1_Pollutant: "온실가스로서 급격한 지구 온난화 및 기후 변화를 촉진하므로 탄소 발자국 감축 요구",
  view2_PlantNutrient: "식물의 광합성에 없어서는 안 될 필수 탄소 공급원이자 농작물 생육 촉진 인자",
  conclusion: "균형 잡힌 대기 모델링과 환경에 대한 지혜로운 청지기적 통치(Wise Dominion) 필요"
};`,
          description: '기후 변화를 유발하는 온실가스이자 식물 광합성에 필수적인 영양소로서의 양면적 역할을 분석합니다.'
        }
      ],
      defaultTabId: 'greenhouse-mechanism',
      bottomInsight: '온실 효과는 지구를 거대한 자연 온실로 만들어 낮과 밤의 극단적인 온도 격차를 완화시켜 주는 필수적인 축복입니다. 수증기와 이산화탄소가 열적외선을 흡수하여 생명체가 살아가기에 완벽한 온도를 유지해 줍니다.'
    },
    contentKo: [
      '[온실 효과 (The Greenhouse Effect)]',
      '우리가 보았듯이 육지와 바다는 대기를 통과해 들어온 태양 에너지의 대부분을 흡수합니다. 하지만 지표면은 온실 효과(Greenhouse Effect)를 통해 대기를 간접적으로 따뜻하게 데웁니다.',
      '태양에서 오는 파장이 짧은 가시광선은 온실의 유리창을 통과하듯 대기를 쉽게 뚫고 들어옵니다. 따뜻해진 지표면은 이 짧은 파장의 태양 에너지를 파장이 더 긴 적외선(Infrared energy)으로 변환하여 상공으로 방출합니다.',
      '적외선 에너지는 우주로 다시 빠져나가려 하지만, 하부 대기가 이 에너지의 상당 부분을 붙잡아 흡수합니다. 이는 온실 내부에서 일어나는 일과 매우 흡사합니다. 대기를 구성하는 특정 기체들, 그중에서도 주로 수증기(Water vapor)와 이산화탄소(Carbon dioxide)가 이 열을 흡수하는 데 가장 크게 기여하며, 이 기체들을 "온실가스(Greenhouse gases)"라고 부릅니다.',
      '대기는 산소를 공급하는 것 이상의 수많은 방식으로 지구 거주자들을 보호합니다. 만약 대기가 없거나 온실 효과가 작동하지 않는다면, 우리는 낮 동안 타는 듯한 태양 복사에 통구이가 되고, 밤에는 기온이 영하 수십 도로 곤두박질칠 것입니다.',
      '반대로 대기가 태양 에너지를 전부 흡수해 버린다면 지표면에는 햇빛이 단 하루도 들지 않을 것입니다. 하나님의 지혜와 사랑은 생명체가 번성하기에 "딱 알맞은(just right)" 온실 대기를 우리에게 공급하셨습니다.'
    ],
    contentEn: [
      'As we have seen, land and water absorb most of the sun\'s energy that reaches the earth after it passes through the atmosphere. But the earth then indirectly warms the atmosphere through the greenhouse effect. The shorter wavelengths of light strike the ground after passing through the clear atmosphere, just like light passing through the glass of a greenhouse. The warmed earth changes the shorter-wave solar energy to longer-wave infrared energy. The infrared energy radiates back toward space, and the lower atmosphere traps and absorbs much of this energy. This is very similar to what happens in a greenhouse. Certain gases that make up the atmosphere, mainly water vapor and carbon dioxide, contribute most to absorbing heat. These kinds of gases are called greenhouse gases.',
      'The atmosphere helps Earth\'s inhabitants in more ways than just providing oxygen. Assuming that we could even live without an atmosphere, we would be scorched in the daytime by the sun\'s full radiation. At night, the earth\'s temperature would drop far below freezing, just like it does on other planets. On the other hand, if the atmosphere absorbed all the sun\'s energy, none of it would get to us. Think of it—no sunny days! God\'s love of beauty and of His creatures has provided us with an atmosphere that is just right for life.',
      'But we need to keep it that way. We need to create models that help us understand the atmosphere and protect its features. This is not easy. God made the earth, its atmosphere, and its processes complex. There\'s lots to do, but we have seen some success. Cities such as Los Angeles and Mexico City, that had been plagued with smog, now benefit from cleaner air because of atmospheric modeling.'
    ],
    sidebar: {
      titleKo: '생활 속 연결: 자외선과 생명 (Life Connection: UV Light and Life)',
      titleEn: 'Life Connection: UV Light and Life',
      contentKo: [
        '초여름 6월 초, 엘렌은 친구들과 신나게 해변에서 점심을 먹고 모래사장을 즐겼습니다. 시원한 바닷바람 덕분에 더위를 느끼지 못했지만 집에 돌아왔을 때 발등이 새빨갛게 익어 불타듯 쓰라렸습니다. 자외선 화상(Sunburn)을 입은 것입니다.',
        '자외선은 적외선이나 가시광선보다 파장이 짧아 눈에 보이지 않지만 강한 에너지를 지닙니다.',
        '자외선은 나쁜 점만 있는 것은 아닙니다. 하루 10~15분 햇빛을 쬐면 피부에서 비타민 D를 합성하여 칼슘 흡수와 골격 형성, 혈액 세포 발달, 면역력을 돕습니다. 또한 공기 중의 유해 세균을 죽이고 식물의 호르몬 합성을 돕습니다.',
        '그러나 과도한 자외선은 피부 세포의 노화를 촉진하고 DNA 돌연변이를 일으켜 피부암(Skin cancer)을 유발합니다(미국인 5명 중 1명꼴로 평생 한 번 피부암 발생). 또한 해양 먹이사슬의 기초이자 지구 산소의 주 공급원인 식물플랑크톤의 광합성을 저해하여 생태계 전체에 악영향을 미칩니다.'
      ],
      contentEn: [
        'Ellen was pumped! It was early June, 80° outside, and the sun was shining brightly—perfect weather for the first day at the beach. She and her friends met for lunch and some time to enjoy the sun and sand. A gentle sea-breeze kept them cool and the hours passed quickly. As she prepared to go home, Ellen noticed that her feet felt sore but thought it was just from the sand. By the time she got home, her feet were bright red, hot to the touch and very tender. She realized her mistake; she hadn\'t thought that she would need sunscreen this early in the season with the temperatures as low as they were.',
        'Considering Ellen\'s experience, we often think that UV exposure is a bad thing. But that\'s not always true. For example, some UV exposure helps our skin to make vitamin D. You need about 10–15 minutes of sunlight a day to build all the vitamin D you need for that day.',
        'However, while small amounts of UV benefit plants, larger amounts will actually stunt their growth or even kill them. UV light also has bad effects on organisms other than plants. It impairs photosynthesis in some marine organisms. These organisms, called phytoplankton, are the basis of the marine food chain, as well as a major source of the oxygen we breathe. For humans, the potential problems of overexposure go beyond sunburn. It causes skin cancers—5.4 million cases every year in the United States! A fifth of Americans will develop skin cancer at some point in their lives.'
      ]
    }
  }
];
