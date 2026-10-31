export interface PageImageInfo {
  pageNumber: number;
  imageSrc: string;
  title: string;
  keyIllustrations: string[];
}

export const textbookPageImages: Record<number, PageImageInfo> = {
  429: {
    pageNumber: 429,
    imageSrc: '/assets/textbook_images/ch18_img_02.jpg',
    title: 'Chapter 18 단원 표지 & 도입: 살인자 공기 (Killer Air)',
    keyIllustrations: [
      '지구 대기를 뚫고 떠오르는 태양과 푸른 대기층 원경',
      '도노라(Donora) 아연 제련소 굴뚝과 1948년 스모그 참사 현장'
    ]
  },
  430: {
    pageNumber: 430,
    imageSrc: '/assets/textbook_images/ch18_img_04.jpg',
    title: '18.1 대기의 구성 & 18.2 대기의 기원',
    keyIllustrations: [
      '기체 조성비 원그래프: 질소 78%, 산소 21%, 아르곤 0.9%',
      '원시 대기와 남세균(Cyanobacteria) 화석 스트로마톨라이트'
    ]
  },
  431: {
    pageNumber: 431,
    imageSrc: '/assets/textbook_images/ch18_img_06.jpg',
    title: '18.3 질소 순환 (The Nitrogen Cycle) & 화학 비료',
    keyIllustrations: [
      '대기-토양-생물 간의 질소 순환 상세 다이어그램 (뿌리혹박테리아)',
      '벼락에 의한 질소 고정 사진 및 프리츠 하버의 인공 합성 비료 공장'
    ]
  },
  432: {
    pageNumber: 432,
    imageSrc: '/assets/textbook_images/ch18_img_08.jpg',
    title: '18.4 기온에 따른 5개 대기층: 대류권 & 성층권',
    keyIllustrations: [
      '펠릭스 바움가르트너의 성층권 39km 초음속 낙하 실사 사진',
      '대류권과 성층권의 온도 및 고도 경계면 (대류권계면 11km)'
    ]
  },
  433: {
    pageNumber: 433,
    imageSrc: '/assets/textbook_images/ch18_img_10.jpg',
    title: '기온 감률 (Lapse Rate) & 5개 층 온도 변화 곡선',
    keyIllustrations: [
      '고도 0~140km 전체 기온 감률 지그재그(W자형) 정밀 그래프',
      '대류권(-6.5°C/km), 성층권 승온, 중간권 극저온(-90°C), 열권 급상승'
    ]
  },
  434: {
    pageNumber: 434,
    imageSrc: '/assets/textbook_images/ch18_img_12.jpg',
    title: '중간권, 열권, 외기권 & 유성(별똥별)',
    keyIllustrations: [
      '중간권에서 마찰열로 타오르는 유성(Meteor) 사진',
      '국제우주정거장(ISS) 궤도와 희박한 열권의 분자 운동'
    ]
  },
  435: {
    pageNumber: 435,
    imageSrc: '/assets/textbook_images/ch18_img_14.jpg',
    title: '18.5 화학 성분에 따른 대기층 (균질권 & 이질권)',
    keyIllustrations: [
      '고도 80km를 경계로 한 균질권과 이질권 층상 구조도',
      '분자량에 따라 층층이 나뉜 질소층-산소층-헬륨층-수소층 도표'
    ]
  },
  436: {
    pageNumber: 436,
    imageSrc: '/assets/textbook_images/ch18_img_16.jpg',
    title: '18.6 특별 구역: 오존층 (Ozone Layer)과 자외선 차단',
    keyIllustrations: [
      '고도 20~50km 성층권 오존 분자(O₃)의 자외선(UV) 흡수 메커니즘',
      '자외선 파장대별(UV-A, UV-B, UV-C) 투과도 및 인체 피부 영향'
    ]
  },
  437: {
    pageNumber: 437,
    imageSrc: '/assets/textbook_images/ch18_img_18.jpg',
    title: '남극 오존홀 (Ozone Hole) & 프레온가스(CFCs)',
    keyIllustrations: [
      '위성 관측 남극 상공 보라색 오존 결손 구멍(오존홀) 실제 지도',
      '염소 원자 촉매에 의한 연쇄 파괴 반응식 다이어그램'
    ]
  },
  438: {
    pageNumber: 438,
    imageSrc: '/assets/textbook_images/ch18_img_20.jpg',
    title: '18.7 전리층 (Ionosphere)과 단파 무선 통신',
    keyIllustrations: [
      '지표 송신소에서 발사된 단파(HF) 라디오 전파가 전리층에 반사되는 경로',
      '낮과 밤의 전리층 전자 밀도 변화와 D/E/F층 구조도'
    ]
  },
  439: {
    pageNumber: 439,
    imageSrc: '/assets/textbook_images/ch18_img_22.jpg',
    title: '18.8 자기권 (Magnetosphere) & 밴앨런 방사선대',
    keyIllustrations: [
      '지구 자기장과 태양풍의 충돌: 지구를 감싸는 도넛 모양 밴앨런대',
      '익스플로러 1호 위성 관측선과 고에너지 하전 입자 포획 원리'
    ]
  },
  440: {
    pageNumber: 440,
    imageSrc: '/assets/textbook_images/ch18_img_24.jpg',
    title: '오로라 현상 (Aurora Borealis & Australis)',
    keyIllustrations: [
      '극지방 하늘을 수놓은 녹색과 붉은색 오로라 커튼 실사 사진',
      '태양 플레어 폭발과 지구 지자기 폭풍 유입 경로'
    ]
  },
  441: {
    pageNumber: 441,
    imageSrc: '/assets/textbook_images/ch18_img_26.jpg',
    title: '18.9 대기 중의 에너지: 전자기 스펙트럼과 태양 상수',
    keyIllustrations: [
      '태양광선의 파장별 에너지 분포: 가시광선, 적외선, 자외선',
      '태양 상수 (1.36 kW/m²) 측정 원리와 대기 외곽의 단위 면적'
    ]
  },
  442: {
    pageNumber: 442,
    imageSrc: '/assets/textbook_images/ch18_img_28.jpg',
    title: '지구의 복사 평형 (Earth’s Energy Budget)',
    keyIllustrations: [
      '태양광선 100% 입사: 대기/구름 반사 32%, 지표 흡수 50%, 대기 흡수 18%',
      '지표 복사열과 대기 재복사(온실효과) 수지 다이어그램'
    ]
  },
  443: {
    pageNumber: 443,
    imageSrc: '/assets/textbook_images/ch18_img_30.jpg',
    title: '온실효과 (Greenhouse Effect)와 지구 기온 유지',
    keyIllustrations: [
      '실제 유리 온실의 열 가둠 원리와 지구 대기의 온실효과 비교',
      '온실효과가 없을 때(-18°C)와 있을 때(+15°C)의 지구 표면 비교'
    ]
  },
  444: {
    pageNumber: 444,
    imageSrc: '/assets/textbook_images/ch18_img_32.jpg',
    title: '주요 온실기체 (수증기, CO₂, 메탄) 비교',
    keyIllustrations: [
      '온실기체별 온실효과 기여도: 수증기(H₂O) 60~70%, CO₂ 20~25%',
      '산업혁명 이후 이산화탄소 농도 상승 곡선 (킬링 곡선)'
    ]
  },
  445: {
    pageNumber: 445,
    imageSrc: '/assets/textbook_images/ch18_img_34.jpg',
    title: '18.10 열의 이동: 복사, 전도, 대류',
    keyIllustrations: [
      '캠프파이어로 보는 열전달 3요소: 불꽃 빛(복사), 쇠꼬챙이(전도), 연기(대류)',
      '뜨거워진 지표면이 인접한 하층 공기를 전도로 가열하는 원리'
    ]
  },
  446: {
    pageNumber: 446,
    imageSrc: '/assets/textbook_images/ch18_img_36.jpg',
    title: '대류 세포 (Convection Currents)와 기상 순환',
    keyIllustrations: [
      '따뜻한 공기 상승과 차가운 공기 하강으로 형성되는 순환 고리',
      '해륙풍과 적도-극지방 대순환의 기초 대류 모델'
    ]
  },
  447: {
    pageNumber: 447,
    imageSrc: '/assets/textbook_images/ch18_img_38.jpg',
    title: '단원 핵심 요약 & 21개 핵심 용어 정리',
    keyIllustrations: [
      'Chapter 18 전체 단원 마인드맵과 주요 공식',
      '21개 핵심 과학 용어 어원 및 정의 총괄표'
    ]
  },
  448: {
    pageNumber: 448,
    imageSrc: '/assets/textbook_images/ch18_img_40.jpg',
    title: '18A 단원 평가 복습 문제 (1~9번)',
    keyIllustrations: [
      '대기 구성 비율 및 5개 층상 구조 기온 그래프 판독 문제',
      '질소 순환과 하버-보슈법 개념 확인 문항'
    ]
  },
  449: {
    pageNumber: 449,
    imageSrc: '/assets/textbook_images/ch18_img_42.jpg',
    title: '18B 단원 평가 복습 문제 (1~8번)',
    keyIllustrations: [
      '오존층 생성/분해 반응식과 남극 오존홀 발생 원인 문제',
      '전리층의 전파 반사 및 밴앨런대 방사선 트랩 구조 문항'
    ]
  },
  450: {
    pageNumber: 450,
    imageSrc: '/assets/textbook_images/ch18_img_44.jpg',
    title: '18C 단원 평가 복습 문제 (1~7번)',
    keyIllustrations: [
      '태양 복사 에너지 수지 다이어그램 해석 문제',
      '복사, 전도, 대류 구별 및 온실효과 계산 문항'
    ]
  },
  451: {
    pageNumber: 451,
    imageSrc: '/assets/textbook_images/ch18_img_46.jpg',
    title: 'Chapter 18 종합 복습 평가 30제 (True/False 20~30번)',
    keyIllustrations: [
      '진위 판별 True/False 20~30번 정밀 채점 문항',
      '심화 서술형 문제 및 단원 총정리 피드백'
    ]
  }
};

export function getPageImagesForSection(pages: number[]): PageImageInfo[] {
  return pages
    .map(p => textbookPageImages[p])
    .filter((img): img is PageImageInfo => Boolean(img));
}
