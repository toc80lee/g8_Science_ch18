import { ChapterSection } from '../types';

export const sections18B: ChapterSection[] = [
  {
    id: 'sec-18-6',
    category: '18B',
    numberBadge: '6',
    lessonTag: '18B · 1교시',
    titleKo: '18.6 오존층 (Ozone Layer) & 남극 오존 홀',
    titleEn: '18.6 Ozone Layer & The Antarctic Ozone Hole',
    breadcrumb: '18B · 18.6 · 오존층 (Ozone Layer)',
    pages: [439, 440, 441],
    objectives: [
      '성층권 상공(20~50 km)에 위치한 오존층(Ozone layer)의 형성과 자외선(UV) 차단 메커니즘을 규명한다.',
      '자외선이 산소 분자(O2)를 쪼개어 오존(O3)을 만들고, 자외선 에너지를 열로 전환하는 과정을 화학식으로 설명한다.',
      '프레온 가스(CFCs, 염화불화탄소)가 남극 성층권 얼음 구름에서 오존을 분해하는 반응 촉매 작용을 분석한다.',
      '몬트리올 의정서(Montreal Protocol) 체결과 오존층 회복을 위한 국제 환경 정책의 시사점을 고찰한다.'
    ],
    interactiveSpec: {
      type: 'ozone_reaction',
      missionTitle: '미션 6 · 성층권 오존의 생성 및 프레온가스(CFCs) 연쇄 분해 메커니즘',
      missionNumber: '18-6',
      stepTotal: 4,
      tabs: [
        {
          id: 'creation',
          label: '① 오존의 생성 (O2 + UV -> O3)',
          codeSnippet: `// [오존 생성 광화학 반응 단계]
const OzoneCreation = [
  "1단계: 고에너지 자외선(UV-C)이 산소 분자(O2)를 두 개의 원자 산소(O)로 분해",
  "        O2 + UV -> O + O",
  "2단계: 자유 원자 산소(O)가 다른 산소 분자(O2)와 즉시 결합하여 오존(O3) 형성",
  "        O + O2 -> O3",
  "3단계: 생성된 오존이 중파장 자외선(UV-B)을 흡수하여 다시 산소로 해리되며 열에너지 방출",
  "        O3 + UV-B -> O2 + O + 열(Heat)"
];
/* 자외선 에너지를 무해한 열로 전환하여 지표면 생명체를 보호합니다 */`,
          description: '자외선 에너지를 흡수하여 오존이 끊임없이 생성·분해되며 유해 자외선을 완벽히 차단합니다.'
        },
        {
          id: 'destruction',
          label: '② 프레온가스(CFCs) 오존 파괴',
          codeSnippet: `// [염화불화탄소(CFC) 촉매 연쇄 파괴 반응]
const CFCDestruction = {
  compound: "Dichlorodifluoromethane (CCl2F2 - Freon)",
  catalystStep1: "자외선이 CFC 분자에서 염소 원자(Cl)를 분리: CCl2F2 + UV -> CClF2 + Cl",
  catalystStep2: "염소 원자가 오존(O3)을 공격하여 일산화염소(ClO)와 산소 분자 생성: Cl + O3 -> ClO + O2",
  catalystStep3: "일산화염소가 산소 원자와 만나 다시 염소 원자로 재생: ClO + O -> Cl + O2",
  chainEffect: "단 1개의 염소 원자가 수만~수십만 개의 오존 분자를 연쇄 파괴!"
};`,
          description: '남극 성층권 얼음 결정 표면에서 분리된 염소 원자가 촉매 역할을 하여 오존 분자를 연속 파괴합니다.'
        },
        {
          id: 'montreal',
          label: '③ 몬트리올 의정서 & 오존층 현황',
          codeSnippet: `// [국제 환경 협약: 몬트리올 의정서]
const MontrealProtocol = {
  timeline: {
    1930: "토머스 미즐리 Jr.와 찰스 케터링이 무독성·불연성 냉매 프레온(Freon) 개발",
    1974: "몰리나 & 롤랜드 교수, CFCs의 성층권 오존 파괴 위험 경고",
    1987: "몬트리올 의정서 공식 채택 (CFC 생산 단계적 전면 금지)",
    2015: "남극 상공 오존 홀 면적 관측 및 장기 회복세 진입"
  },
  lesson: "인류의 과학 기술 개발 시 장기적인 지구 시스템 영향 평가의 중요성"
};`,
          description: '1987년 몬트리올 의정서를 통해 전 세계가 CFCs 생산을 금지하며 오존층 복원을 위해 협력했습니다.'
        }
      ],
      defaultTabId: 'creation',
      bottomInsight: '오존(O3)은 지표면 근처에서는 호흡기를 자극하는 유해 스모그이지만, 성층권(20~50km)에서는 생명체를 자외선으로부터 방어하는 필수적인 보호막입니다. 스프레이와 냉매에 쓰이던 CFCs의 염소 원자가 오존층을 파괴하여 국제적 금지 조치가 취해졌습니다.'
    },
    contentKo: [
      '[오존층 (Ozone Layer)]',
      '도심의 스모그에는 오존(Ozone)이라는 기체가 포함되어 있습니다. 오존은 지표면에서 고농도로 존재할 경우 호흡 곤란과 폐 손상을 일으키는 유독 기체입니다.',
      '하지만 성층권(고도 20~50 km) 높이 떠 있는 오존층(Ozone layer)은 지구 생명체에게 없어서는 안 될 위대한 방패입니다! 일반 산소 분자(O2)가 2개의 산소 원자로 이루어진 것과 달리, 오존(O3)은 3개의 산소 원자가 결합되어 있습니다.',
      '태양으로부터 고에너지 자외선(UV light)이 쏟아져 들어오면 산소 분자가 2개의 산소 원자로 쪼개집니다. 쪼개진 외톨이 산소 원자는 주변의 산소 분자와 즉시 결합하여 오존(O3)을 형성합니다(그림 18-10).',
      '오존 분자는 자외선 에너지를 흡수하는 능력이 일반 산소보다 훨씬 뛰어납니다. 오존층은 치명적인 자외선을 흡수하여 무해한 열(Heat)로 변환시킵니다. 이 때문에 성층권은 고도가 올라갈수록 아래의 대류권보다 따뜻해집니다(그림 18-6 참조).',
      '[남극 오존 홀 (The Ozone Hole)]',
      '1930년 토머스 미즐리 Jr.(Thomas Midgley Jr.)와 찰스 케터링(Charles Kettering)은 냉장고 냉매, 에어컨, 드라이클리닝 용매, 에어로졸 스프레이용으로 디클로로디플루오로메탄(CCl2F2, 상품명 프레온 Freon)을 개발했습니다. 무취, 무미, 불연성, 비부식성에 인체 독성이 없어 "기적의 화합물"로 불렸습니다.',
      '그러나 1970년대 과학자들은 대기 중으로 방출된 프레온가스(CFCs)가 성층권까지 올라가 오존을 심각하게 고갈시킨다는 사실을 발견했습니다.',
      '특히 매년 봄철(9~10월) 남극 상공 성층권에 극저온의 얼음 결정 구름이 형성되는데, 햇빛이 비치기 시작하면 얼음 표면에서 CFC로부터 염소(Chlorine) 원자가 튀어나와 오존 분자를 공격합니다. 단 1개의 염소 원자가 수천 개의 오존 분자를 평범한 산소 분자로 연쇄 분해합니다.',
      '이러한 위험성에 대응하여 전 세계는 1978년 미국을 필두로 1987년 "몬트리올 의정서(Montreal Protocol)"를 체결하여 CFCs의 생산과 사용을 전면 금지했습니다. CFC가 대기 중에서 완전히 사라지는 데는 수십 년이 걸리겠지만, 인류의 지혜로운 청지기 직분(Dominion)의 좋은 본보기가 되었습니다.'
    ],
    contentEn: [
      'We started this chapter mentioning smog in large cities around the world. A lot of this smog contains a gas called ozone. It\'s actually a kind of oxygen, but you couldn\'t breathe it for long. Ozone in small amounts causes lung irritation and breathing problems. In high concentrations, it can kill. But did you know that high up in the stratosphere there is a layer of ozone? There it actually helps life!',
      'This region is called the ozone layer. It extends from about 20 km to 50 km above the earth\'s surface but it is densest in the middle of this band. An ozone molecule (O3) has three atoms of oxygen bonded together. This is different from an ordinary oxygen molecule, which has just two atoms of oxygen (O2). When an oxygen molecule in the stratosphere absorbs high-energy ultraviolet light from the sun, it breaks apart. Each of these lone atoms immediately joins another oxygen molecule to form ozone. Ozone is even more efficient than oxygen molecules at absorbing ultraviolet energy. Certain kinds of ultraviolet radiation are quite dangerous to life. They can kill single-celled organisms and cause cancers and other abnormalities in most animals and humans. The ozone layer is vital for living things because it shields them from much of the sun\'s harmful ultraviolet light. It converts this energy to heat. This is why the stratosphere is warmer than the troposphere below it.',
      'However, there is a problem. Every spring, the ozone layer develops a hole above Antarctica. In the 1950s, scientists studying the atmosphere discovered the ozone layer and its shielding effect. In the early 1970s, chemists found that ozone breaks down in the presence of CFCs. They predicted that atmospheric CFCs could dangerously deplete the ozone layer.',
      'In the spring, clouds of ice crystals form in the very high cold air of the stratosphere over Antarctica. These ice crystals speed up certain chemical reactions. To deplete the ozone, you also need CFCs. Sunlight breaks off a chlorine atom from a CFC molecule. This chlorine atom reacts with ozone molecules on the surface of cloud ice crystals to break them down into just plain old oxygen. One single chlorine atom can react over and over again. These findings propelled the global community into action. The United States and several other nations banned CFC production in 1978 in what was called the Montreal Protocol.'
    ]
  },
  {
    id: 'sec-18-7',
    category: '18B',
    numberBadge: '7',
    lessonTag: '18B · 2교시',
    titleKo: '18.7 전리층 (Ionosphere) & 장거리 무선 통신',
    titleEn: '18.7 Ionosphere & Global Radio Communications',
    breadcrumb: '18B · 18.7 · 전리층 (Ionosphere)',
    pages: [442],
    objectives: [
      '고도 75 km에서 500 km까지 열권 하부에 형성되는 전리층(Ionosphere)의 물리적 생성 원리를 이해한다.',
      '태양 방사선과 우주선이 기체 분자를 이온화시켜 전리층의 하위 구역(D, E, F 영역)을 형성함을 파악한다.',
      '장파/단파/AM 전파가 전리층과 지표면 사이를 반사되어 지구 곡면 너머로 전파되는 원리를 도해한다.',
      '위성 통신과 우주선 교신에 마이크로파(Microwaves)가 사용되는 이유(전리층 통과성)를 규명한다.'
    ],
    interactiveSpec: {
      type: 'ionosphere_radio',
      missionTitle: '미션 7 · 전리층 전파 반사 및 마이크로파 위성 통신 시뮬레이터',
      missionNumber: '18-7',
      stepTotal: 4,
      tabs: [
        {
          id: 'radio-reflection',
          label: '① 단파·AM 라디오 반사 (지구 곡면 너머 통신)',
          codeSnippet: `// [전리층 전파 반사 시뮬레이션]
const RadioReflection = {
  ionosphereAltitude: "75 km ~ 500 km",
  wavesReflected: ["AM 라디오 전파", "단파(Shortwave, HF)"],
  mechanism: "자유 전자와 이온들이 도체 거울처럼 작용하여 전파를 지표면으로 굴절/반사",
  advantage: "중계 인공위성 없이도 수천 킬로미터(지구 반대편)까지 대양을 건너 방송 청취 가능",
  historicalExample: "베네수엘라 카리아쿠 섬의 기독교 선교 라디오 방송이 핀란드와 러시아까지 수신됨"
};`,
          description: '단파와 AM 전파가 전리층과 지표면 사이를 튕기며 지구의 곡률을 넘어 수천 킬로미터까지 도달합니다.'
        },
        {
          id: 'microwaves',
          label: '② 마이크로파 통과 (NASA 우주선 & 위성 통신)',
          codeSnippet: `// [마이크로파의 전리층 통과 특성]
const MicrowaveTransmission = {
  frequency: "초고주파 (GHz 대역, 마이크로파)",
  behavior: "전리층의 이온 밀도에 반사되지 않고 그대로 전리층을 관통",
  application: {
    spacecraft: "NASA가 우주비행사 및 우주 탐사선과 통신할 때 마이크로파 사용",
    gpsAndSat: "GPS 내비게이션, 기상 위성 데이터 통신",
    radar: "지상 레이더 및 기상 관측"
  }
};
/* 단파는 반사되고, 마이크로파는 통과하여 우주로 나아갑니다 */`,
          description: '마이크로파는 전리층을 뚫고 우주로 직진하므로 NASA 우주정거장(ISS) 및 위성 통신에 필수적입니다.'
        },
        {
          id: 'day-night',
          label: '③ 주간/야간 전리층 변화 (D, E, F층)',
          codeSnippet: `// [낮과 밤의 전리층 구조 변화]
const IonosphereLayers = {
  daytime: "태양광이 강해 D층(75km), E층(95km), F1/F2층(150~500km) 등 최대 4개 층 분화",
  nighttime: "태양 복사가 없어 D층과 E층이 재결합되어 소멸, 고고도 F층만 단일층으로 유지",
  nightEffect: "낮에는 D층이 전파를 흡수하지만 밤에는 F층에서 높게 반사되므로 밤에 원거리 라디오가 훨씬 선명하게 수신됨!"
};`,
          description: '밤에는 하부 흡수층(D층)이 사라져 원거리 단파 라디오 방송이 훨씬 더 멀리 깨끗하게 들립니다.'
        }
      ],
      defaultTabId: 'radio-reflection',
      bottomInsight: '전리층(75~500km)은 태양 에너지가 기체를 이온화시켜 만든 전도층으로, AM 및 단파 전파를 반사하여 지구 곡면 너머 장거리 통신을 가능케 합니다. 반면 마이크로파는 전리층을 투과하므로 우주선 통신에 사용됩니다.'
    },
    contentKo: [
      '[전리층 (Ionosphere)]',
      '오존층 위쪽의 열권 내부에는 또 하나의 놀라운 기능 영역이 존재하는데, 바로 전리층(Ionosphere)입니다.',
      '지표면 위 약 75 km에서 시작하여 500 km까지 뻗어 있는 이곳에서는 태양의 강렬한 복사선과 우주 공간에서 날아온 우주선(Cosmic rays)이 대기 중의 기체 분자들을 이온(Ions)과 자유 전자로 쪼개어 놓습니다.',
      '이 이온화된 원자층이 전리층을 형성하며, 계절과 밤낮에 따라 합쳐지거나 분리되는 최대 4개의 층(D, E, F층 등)을 갖습니다.',
      '전리층은 전파 통신 파동을 반사하는 독특한 성질을 지니고 있습니다. 20세기 후반까지 라디오 사용자들은 장거리 통신을 위해 전적으로 이 전리층 반사 효과에 의존했습니다.',
      '오늘날에도 일부 라디오 방송국과 아마추어 무선사(HAM)들은 전파 신호를 전리층에 반사시켜 둥근 지구의 곡면 너머로 신호를 보냅니다. 특히 밤에는 하부 전리층이 얇아져 단파 신호가 송신 안테나에서 수천 킬로미터 떨어진 곳까지 닿습니다.',
      '예를 들어 베네수엘라 해안 카리아쿠(Carriacou) 섬의 선교 라디오 방송은 통신 위성 없이도 핀란드와 러시아의 청취자들에게까지 전달되었습니다!',
      '그러나 전리층은 레이더나 위성 통신에 사용되는 고주파수 마이크로파(Microwaves)는 반사하지 못하고 그대로 통과시킵니다. 이것이 바로 NASA가 우주비행사나 인공위성과 교신할 때 장파가 아닌 마이크로파를 사용하는 이유입니다.'
    ],
    contentEn: [
      'Above the ozone layer, there\'s another useful zone in the thermosphere, beginning around 75 km and extending to 500 km above the ground. Here, the sun\'s rays, as well as rays from space, break some of the atmospheric gas molecules into ions. This layer of ionized atoms forms the ionosphere. The ionosphere actually contains up to four layers that combine and change between day and night and with the seasons.',
      'The ionosphere can reflect radio communication waves. Until the second half of the twentieth century, radio users depended almost entirely on this effect to communicate over long distances. Even today, some radio stations and amateur radio broadcasters send their messages around the curve of the earth by bouncing their radio signals off the ionosphere, especially at night. Some shortwave radio signals can return to Earth thousands of miles away from their transmitting antennae. For example, a Christian missionary radio station in Carriacou, an island just off the coast of Venezuela, has listeners in Finland and Russia without using communication satellites!',
      'The ionosphere doesn\'t reflect microwaves, the waves used in radar and satellite communications. They go right through. This is why NASA uses microwave signals to communicate with spacecraft.'
    ]
  },
  {
    id: 'sec-18-8',
    category: '18B',
    numberBadge: '8',
    lessonTag: '18B · 3교시',
    titleKo: '18.8 자기권 (Magnetosphere) & 밴앨런대, 오로라',
    titleEn: '18.8 Magnetosphere, Van Allen Belts & Auroras',
    breadcrumb: '18B · 18.8 · 자기권 & 밴앨런대 (Magnetosphere)',
    pages: [442, 443, 444],
    objectives: [
      '지구 반지름의 10~25배(60,000~160,000 km)까지 뻗어 있는 자기권(Magnetosphere)의 우주 방사선 방어 역할을 이해한다.',
      '1958년 제임스 밴 앨런(James Van Allen)이 익스플로러 1호로 발견한 밴앨런 복사대(Van Allen Belts)의 구조를 분석한다.',
      '태양풍의 고에너지 양성자·전자가 자기력선을 따라 극지로 유입되어 발생하는 오로라(Aurora Borealis & Australis) 원리를 규명한다.',
      '기상학자 래리 바디만(Larry Vardiman)의 대기 연구와 성경적 창조론 관점을 검토한다.'
    ],
    interactiveSpec: {
      type: 'magnetosphere_solar',
      missionTitle: '미션 8 · 자기권의 태양풍 차단 및 극광(오로라) 발광 시뮬레이션',
      missionNumber: '18-8',
      stepTotal: 4,
      tabs: [
        {
          id: 'magnetic-shield',
          label: '① 자기권의 태양풍 차단 (Magnetic Shield)',
          codeSnippet: `// [지구 자기권의 태양풍 방어 모델]
const MagnetosphereShield = {
  extent: "60,000 ~ 160,000 km (지구 반경의 10 ~ 25배)",
  solarWindHazard: "태양에서 초속 수백 km로 뿜어져 나오는 고에너지 양성자(H+) 및 전자 플라스마",
  shieldingMechanism: "로런츠 힘에 의해 하전 입자들을 지구 측면으로 비껴가게 굴절",
  significance: "자기권이 없었다면 태양풍이 대기를 모두 벗겨내고 지표면 생명체는 치사량의 방사선에 노출됨"
};`,
          description: '태양풍의 치명적인 하전 입자들을 지구 양옆으로 빗겨 흐르게 하여 지표면의 생명체를 지킵니다.'
        },
        {
          id: 'van-allen',
          label: '② 밴 앨런 복사대 (Van Allen Belts)',
          codeSnippet: `// [밴 앨런대 발견 (James Van Allen, 1958 - Explorer 1)]
const VanAllenBelts = {
  innerBelt: "고도 1,000 ~ 6,000 km (주로 고에너지 양성자 밀집 구역)",
  outerBelt: "고도 13,000 ~ 25,000 km (주로 고에너지 전자 밀집 구역)",
  astronautProtection: [
    "유인 우주선은 밴앨런대를 신속하게 통과하여 방사선 피폭 시간 최소화",
    "알루미늄 및 특수 차폐벽으로 우주인 보호",
    "태양 플레어 폭발 시 보호 구역 대피"
  ]
};`,
          description: '익스플로러 1호가 발견한 방사선 띠로, 태양풍 입자가 갇혀 있어 우주선 통과 시 특수 차폐가 필요합니다.'
        },
        {
          id: 'aurora',
          label: '③ 오로라 현상 (극광: Aurora Borealis & Australis)',
          codeSnippet: `// [오로라 발광 원리]
const AuroraPhenomenon = {
  source: "태양 플레어 폭발 시 쏟아지는 강력한 태양풍 입자가 자기력선을 타고 자극으로 침투",
  collisions: {
    atomicOxygen_Green: "고도 100~150km: 원자 산소와 충돌 -> 환상적인 에메랄드 녹색 발광",
    atomicOxygen_Red: "고도 200km 이상: 고에너지 산소 원자 -> 붉은색 오로라",
    molecularNitrogen_Purple: "고도 100km 이하: 분자 질소와 충돌 -> 보라색/진홍색 오로라"
  },
  names: {
    north: "Aurora borealis (북극광 - Aurora: 새벽, borealis: 북쪽)",
    south: "Aurora australis (남극광 - australis: 남쪽)"
  }
};`,
          description: '자기력선을 타고 극지로 쏟아진 태양풍 입자가 대기 중 산소·질소 분자와 충돌하여 내는 아름다운 빛입니다.'
        }
      ],
      defaultTabId: 'magnetic-shield',
      bottomInsight: '자기권(6만~16만 km)과 밴앨런대는 태양풍의 치사 방사선으로부터 지구를 지켜주는 보이지 않는 갑옷입니다. 태양 폭발 시 일부 입자가 자극으로 유입되어 산소·질소와 충돌하며 만들어내는 것이 바로 북극광(Aurora Borealis)과 남극광입니다.'
    },
    contentKo: [
      '[자기권 (Magnetosphere)]',
      '지구 대기의 또 다른 경이로운 특수 구역은 자기권(Magnetosphere)입니다. 자기권은 지표면 위 수천 킬로미터, 즉 지구 반경의 10~25배(60,000~160,000 km)까지 뻗어 있으며 외기권 영역을 포함합니다.',
      '1958년 미국의 첫 번째 인공위성 익스플로러 1호(Explorer 1)가 수집한 데이터를 바탕으로 제임스 밴 앨런(James Van Allen) 박사가 자기권을 발견했습니다.',
      '그의 데이터는 태양풍(Solar wind)에서 날아온 양성자와 전자의 대부분이 지구 자기장에 갇혀 도넛 형태의 고리를 이루고 있음을 보여주었습니다. 이 구역들을 발견자의 이름을 따 "밴 앨런 복사대(Van Allen belts)"라고 부릅니다.',
      '이 영역들은 극도로 위험한 고에너지 방사선 지대이므로, 우주 엘리베이터를 타고 밴앨런대 높이까지 올라간다면 치사량의 태양 방사선을 쬐게 됩니다. 따라서 우주비행사를 태운 유인 우주선은 강력한 차폐벽을 갖추거나 이 복사대를 매우 빠른 속도로 통과해야 합니다.',
      '[태양풍 차단과 오로라 (Auroras)]',
      '강력한 태양 폭풍이 불어 닥칠 때 하전 입자들이 아무런 방해 없이 지구에 충돌한다면 지상의 모든 생명체는 절멸할 것입니다. 그러나 지구의 정밀하게 설계된 자기권이 방패가 되어 폭풍의 본체를 막아냅니다(그림 18-12).',
      '태양 플레어가 폭발하여 태양풍이 유독 강해지면, 자기권에 갇혀 있던 일부 하전 입자들이 지구의 자극(Magnetic poles) 근처로 빠져나와 하부 대기로 쏟아져 들어옵니다.',
      '이 입자들이 대기 중의 기체 분자들과 충돌하면서 에너지를 빛으로 방출하는데, 이것이 바로 아름다운 "오로라(Aurora)"입니다. 북반구의 극광을 "오로라 보레알리스(Aurora borealis, 북극광)", 남반구의 극광을 "오로라 오스트랄리스(Aurora australis, 남극광)"라고 부릅니다(그림 18-13).'
    ],
    contentEn: [
      'Yet another amazing zone of the atmosphere is the magnetosphere. The magnetosphere extends thousands of kilometers above the earth\'s surface at distances equal to 10–25 earth radii or more (60,000–160,000 km). This region includes the exosphere of the earth\'s atmosphere.',
      'James Van Allen discovered the magnetosphere in 1958 using information gathered by America\'s first artificial satellite, Explorer 1. More data revealed several rings or belts where most of the protons and electrons from the sun\'s solar wind end up trapped in the earth\'s magnetic field. These regions are fairly close to the earth compared to the outer boundaries of the magnetosphere. In honor of Van Allen\'s discovery, these regions of dangerous radiation are called the Van Allen belts. If you had continued your space elevator trip to the altitude of the Van Allen belts, you would have received a lethal dose of solar radiation as you passed through. Manned spacecraft that travel through these belts of intense radiation must either be heavily shielded or move quickly past them.',
      'Do you remember Earth\'s specially designed feature of the magnetic field? Strong solar storms would be especially deadly if the charged particles could strike the earth unhindered. But the magnetosphere shields the earth from the brunt of these storms.',
      'When the solar wind is especially strong, as it is during a solar flare, some of the charged particles trapped in the magnetosphere escape near the earth\'s magnetic poles into the lower regions of the atmosphere. There they collide with gas molecules in the atmosphere, producing beautiful aurora borealis (the northern lights) and aurora australis (the southern lights) near the respective poles.'
    ],
    sidebar: {
      titleKo: '대기 과학자 래리 바디만 (Larry Vardiman, Atmosphere Scientist)',
      titleEn: 'Larry Vardiman, Atmosphere Scientist',
      contentKo: [
        '1972년 래리 바디만은 대학원생 시절 중요한 인생의 전환점을 맞았습니다. 1966년 미 공군에 입대한 후 기상 관측병으로 복무하며 구름 물리학 연구를 거쳐 콜로라도 주립대 대기과학 박사 과정에 진학했습니다.',
        '그는 교수들의 세속적 가르침과 성경 사이에서 갈등하던 중 헨리 모리스(Henry Morris)와 듀안 기시(Duane Gish) 박사를 만나 창조과학 사역에 헌신하기로 결단했습니다.',
        '박사 학위 취득 후 캘리포니아 북부 구름 시딩(인공강우) 프로젝트 책임자로 일한 뒤, 창조연구소(ICR)에서 대기과학을 연구하고 가르쳤습니다.',
        '바디만과 학생들은 노아 홍수 이전 "수증기 궁창(Water vapor canopy)" 가설을 컴퓨터 대기 모델로 정밀 시뮬레이션했습니다. 그 결과 수증기 궁창이 폭우를 일으킬 만큼 충분했다면 극단적 온실효과로 지표면이 너무 뜨거워져 생명체가 살 수 없었을 것이라는 사실을 밝혀냈습니다. 이는 성경 자체는 진리이지만 인간의 이론적 모델은 기꺼이 수정되거나 폐기될 수 있음을 보여주는 진정한 과학적 태도였습니다.'
      ],
      contentEn: [
        'Larry Vardiman was at a turning point in his life in 1972 as a graduate student. He had joined the US Air Force in 1966 with a bachelor\'s degree in Physics, worked in cloud physics, and was sent to Colorado State University for a PhD in atmospheric science.',
        'He met Henry Morris and Duane Gish, founders of the modern Creationist movement, and decided to pursue creation science. Later at ICR, he tested the water vapor canopy model using computer simulations, discovering that a canopy holding enough water would have caused a runaway greenhouse effect. These findings showed that even biblically based theories can be revised while the Bible remains true and unchanging.'
      ]
    }
  }
];
