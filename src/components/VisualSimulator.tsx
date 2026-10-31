import React, { useState } from 'react';
import { ChapterSection } from '../types';
import { 
  Flame, 
  Wind, 
  Sun, 
  Shield, 
  Radio, 
  Thermometer, 
  Sparkles, 
  Globe2, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface VisualSimulatorProps {
  section: ChapterSection;
  activeTabId: string;
}

export const VisualSimulator: React.FC<VisualSimulatorProps> = ({
  section,
  activeTabId
}) => {
  // 1. Planetary Atmosphere Simulator
  const [selectedPlanet, setSelectedPlanet] = useState<'earth' | 'venus' | 'mars' | 'jupiter' | 'moon'>('earth');

  // 2. Altitude & Layer Explorer Slider
  const [altitudeKm, setAltitudeKm] = useState<number>(11);

  // 3. Greenhouse Slider
  const [ghgLevel, setGhgLevel] = useState<number>(50);

  // 4. Radio Wave Frequency Toggle
  const [waveType, setWaveType] = useState<'shortwave' | 'microwave'>('shortwave');

  // 5. Solar Wind Strength
  const [solarFlare, setSolarFlare] = useState<boolean>(false);

  // 6. Ozone Reaction Stage
  const [cfcPresent, setCfcPresent] = useState<boolean>(false);

  // Render appropriate simulator based on section type
  switch (section.interactiveSpec.type) {
    case 'planetary_calc': {
      const planetData = {
        earth: {
          name: '지구 (Earth)',
          gases: [{ name: '질소 N2', pct: 78, color: 'bg-blue-500' }, { name: '산소 O2', pct: 21, color: 'bg-emerald-500' }, { name: '기타 (Ar, CO2, H2O)', pct: 1, color: 'bg-amber-400' }],
          pressure: '1.0 atm (1013 hPa)',
          temp: '평균 15°C',
          breathable: true,
          desc: '생명체가 호흡하고 폭발적인 화재를 방지하도록 질소가 산소를 최적으로 희석한 유일한 행성.'
        },
        venus: {
          name: '금성 (Venus)',
          gases: [{ name: '이산화탄소 CO2', pct: 96.5, color: 'bg-rose-500' }, { name: '질소 N2', pct: 3.5, color: 'bg-blue-400' }],
          pressure: '92 atm (지구의 92배, 수심 900m 압력)',
          temp: '약 467°C (극단적 온실효과)',
          breathable: false,
          desc: '두터운 이산화탄소 대기와 농축된 황산 구름으로 인해 생명체 거주가 불가능함.'
        },
        mars: {
          name: '화성 (Mars)',
          gases: [{ name: '이산화탄소 CO2', pct: 95, color: 'bg-rose-500' }, { name: '질소 N2', pct: 2.6, color: 'bg-blue-400' }, { name: '아르곤 Ar', pct: 1.9, color: 'bg-gray-400' }],
          pressure: '0.006 atm (지구의 1% 미만, 희박)',
          temp: '평균 -63°C',
          breathable: false,
          desc: '대기가 너무 희박하여 액체 물이 증발하고 호흡할 수 있는 산소가 없습니다.'
        },
        jupiter: {
          name: '목성 (Jupiter)',
          gases: [{ name: '수소 H2', pct: 89, color: 'bg-indigo-400' }, { name: '헬륨 He', pct: 10, color: 'bg-purple-400' }, { name: '암모니아 NH3', pct: 1, color: 'bg-amber-500' }],
          pressure: '수천~수백만 atm (거대 가스행성)',
          temp: '영하 110°C (구름 상부)',
          breathable: false,
          desc: '수소와 헬륨, 그리고 암모니아 얼음 결정 구름으로 덮인 거대 가스 천체.'
        },
        moon: {
          name: '달 (Moon)',
          gases: [{ name: '진공 (대기 없음)', pct: 100, color: 'bg-gray-300' }],
          pressure: '0 atm (측정 불가)',
          temp: '주간 120°C / 야간 -130°C',
          breathable: false,
          desc: '중력이 약해 기체를 붙잡지 못하며 실질적인 완전 진공 상태입니다.'
        }
      };

      const curr = planetData[selectedPlanet];

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-sm flex items-center">
              <Globe2 className="w-4 h-4 text-blue-600 mr-1.5" />
              태양계 천체별 대기 조성 시뮬레이터
            </span>
            <span className="text-xs text-gray-500">교재 429페이지</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {(['earth', 'venus', 'mars', 'jupiter', 'moon'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPlanet(p)}
                className={`px-2.5 py-1 text-xs rounded font-medium transition-colors ${
                  selectedPlanet === p
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {planetData[p].name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900 text-sm">{curr.name}</h4>
              <span className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                curr.breathable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {curr.breathable ? '생명 호흡 가능 🟢' : '호흡 불가 / 치명적 🔴'}
              </span>
            </div>

            {/* Composition bar */}
            <div>
              <div className="text-xs text-gray-600 mb-1 font-medium">대기 조성 비율:</div>
              <div className="h-6 w-full bg-gray-200 rounded-md overflow-hidden flex">
                {curr.gases.map((g, i) => (
                  <div
                    key={i}
                    style={{ width: `${g.pct}%` }}
                    className={`${g.color} flex items-center justify-center text-[10px] text-white font-bold truncate px-1`}
                    title={`${g.name}: ${g.pct}%`}
                  >
                    {g.pct >= 10 ? `${g.name} ${g.pct}%` : ''}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-1.5 text-[11px] text-gray-500">
                {curr.gases.map((g, i) => (
                  <span key={i} className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-1 ${g.color}`} />
                    {g.name} ({g.pct}%)
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200">
              <div>
                <span className="text-gray-500">표면 기압:</span>{' '}
                <span className="font-semibold text-gray-800">{curr.pressure}</span>
              </div>
              <div>
                <span className="text-gray-500">표면 온도:</span>{' '}
                <span className="font-semibold text-gray-800">{curr.temp}</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 bg-white p-2.5 rounded border border-gray-100 italic">
              "{curr.desc}"
            </p>
          </div>
        </div>
      );
    }

    case 'atmosphere_layers': {
      // Altitude Explorer for Homosphere & Heterosphere + Baumgartner
      const getLayerInfo = (alt: number) => {
        if (alt <= 11) {
          return {
            sphere: '동질권 (Homosphere)',
            tempLayer: '대류권 (Troposphere)',
            molecules: 'N2 (78%), O2 (21%), Ar/CO2/H2O (1%) 균일 혼합',
            temp: `${(15 - alt * 6.5).toFixed(1)}°C (기온 감률)`,
            feature: '모든 기상 현상 발생, 따뜻한 하층과 찬 상층의 대류'
          };
        } else if (alt <= 50) {
          return {
            sphere: '동질권 (Homosphere)',
            tempLayer: '성층권 (Stratosphere)',
            molecules: '균일 질소/산소 + 오존층(O3 20~50km 집중)',
            temp: `${(-55 + ((alt - 11) / 39) * 55).toFixed(1)}°C (상승)`,
            feature: alt === 39 ? '★ 펠릭스 바움가르트너 39,040m 음속 돌파 낙하 고도!' : '오존의 자외선 흡수로 가열, 제트기류(최대 400km/h)'
          };
        } else if (alt <= 80) {
          return {
            sphere: '동질권 (Homosphere 경계)',
            tempLayer: '중간권 (Mesosphere)',
            molecules: '균일 혼합 질소/산소 (수증기 없음)',
            temp: `${(0 - ((alt - 50) / 30) * 90).toFixed(1)}°C (대기 최저 -90°C)`,
            feature: '유성이 타며 빛을 내는 영역, 야광운 관측'
          };
        } else if (alt <= 200) {
          return {
            sphere: '이질권 (Heterosphere)',
            tempLayer: '열권 (Thermosphere)',
            molecules: '분자 질소 (N2, 분자량 28) 층',
            temp: '100°C ~ 400°C',
            feature: '원자량에 따라 층상 분리 시작, 분자 질소가 하부에 위치'
          };
        } else if (alt <= 300) {
          return {
            sphere: '이질권 (Heterosphere)',
            tempLayer: '열권 (Thermosphere)',
            molecules: '분자 산소 (O2, 분자량 32) 층',
            temp: '400°C ~ 800°C',
            feature: '이온화된 산소 분자 오로라 형성'
          };
        } else if (alt <= 800) {
          return {
            sphere: '이질권 (Heterosphere)',
            tempLayer: '열권 (Thermosphere) / 전리층',
            molecules: '원자 산소 (O, 원자량 16) 층',
            temp: '650°C ~ 1250°C (국제우주정거장 ISS 400km 궤도)',
            feature: '산소 원자 오로라, 우주선 방열 핀 필요'
          };
        } else {
          return {
            sphere: '이질권 (Heterosphere) / 외기권',
            tempLayer: '외기권 (Exosphere)',
            molecules: alt < 1000 ? '헬륨 (He, 원자량 4) 층' : '분자 수소 (H2, 분자량 2) 층',
            temp: '측정 불가 (입자 희박)',
            feature: '가장 가벼운 수소가 지구 중력을 벗어나 우주로 탈출'
          };
        }
      };

      const info = getLayerInfo(altitudeKm);

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-xs sm:text-sm flex items-center">
              <Thermometer className="w-4 h-4 text-blue-600 mr-1" />
              대기층 & 우주 엘리베이터 고도 시뮬레이터
            </span>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              고도: {altitudeKm} km
            </span>
          </div>

          {/* Interactive Slider */}
          <div>
            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
              <span>0 km (지표면)</span>
              <span>80 km (동질권 경계)</span>
              <span>500 km (열권)</span>
              <span>1000 km (외기권)</span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={altitudeKm}
              onChange={(e) => setAltitudeKm(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-wrap gap-1 text-[11px]">
            <button onClick={() => setAltitudeKm(11)} className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded">
              11km (대류권계면)
            </button>
            <button onClick={() => setAltitudeKm(39)} className="px-2 py-0.5 bg-amber-100 text-amber-800 font-medium hover:bg-amber-200 rounded">
              39km (바움가르트너)
            </button>
            <button onClick={() => setAltitudeKm(50)} className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded">
              50km (성층권계면)
            </button>
            <button onClick={() => setAltitudeKm(80)} className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded">
              80km (이질권 시작)
            </button>
            <button onClick={() => setAltitudeKm(400)} className="px-2 py-0.5 bg-blue-100 text-blue-800 font-medium hover:bg-blue-200 rounded">
              400km (우주정거장 ISS)
            </button>
          </div>

          {/* Status Box */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 text-sm">{info.tempLayer}</span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {info.sphere}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-gray-700">
              <div>
                <span className="text-gray-500">예상 온도:</span>{' '}
                <span className="font-semibold text-gray-900">{info.temp}</span>
              </div>
              <div>
                <span className="text-gray-500">지배 기체:</span>{' '}
                <span className="font-semibold text-gray-900">{info.molecules.split(' ')[0]}</span>
              </div>
            </div>
            <div className="text-gray-600 border-t border-slate-200 pt-1.5">
              <span className="font-semibold text-gray-800">특징: </span>
              {info.feature}
            </div>
          </div>
        </div>
      );
    }

    case 'temperature_graph': {
      // Interactive Temperature Graph
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-xs sm:text-sm flex items-center">
              <Thermometer className="w-4 h-4 text-rose-500 mr-1" />
              대기 온도 지그재그 프로파일 (Lapse Rate)
            </span>
            <span className="text-xs text-gray-500">교재 435쪽 그림 18-6</span>
          </div>

          <div className="relative bg-gradient-to-t from-sky-50 via-indigo-50 to-purple-900 rounded border border-gray-200 p-3 h-52 flex flex-col justify-between text-xs">
            {/* Layers marker */}
            <div className="flex justify-between items-center text-white text-[11px] font-bold">
              <span>외기권 & 열권 (80 ~ 500km)</span>
              <span className="text-amber-300">최대 1250°C</span>
            </div>
            <div className="border-t border-purple-400/50 flex justify-between items-center text-purple-200 text-[10px]">
              <span>중간권 (50 ~ 80km)</span>
              <span className="text-cyan-300 font-bold">최저 -90°C (가장 차가움)</span>
            </div>
            <div className="border-t border-indigo-400/50 flex justify-between items-center text-indigo-800 text-[10px]">
              <span>성층권 (11 ~ 50km, 오존층 가열)</span>
              <span className="text-rose-600 font-bold">0°C까지 상승</span>
            </div>
            <div className="border-t border-sky-400 flex justify-between items-center text-sky-900 text-[10px]">
              <span>대류권 (0 ~ 11km, 기상 현상)</span>
              <span className="text-blue-700 font-bold">-55°C (1km당 -6.5°C 감소)</span>
            </div>
            <div className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] flex justify-between">
              <span>지표면 (해수면)</span>
              <span>약 +15°C</span>
            </div>
          </div>

          <div className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded">
            💡 <strong>핵심 원리:</strong> 지표에서 대류권계면(-55°C)까지는 하강, 성층권 오존 흡수로 0°C까지 상승, 중간권에서 대기 최저(-90°C)로 급감 후 열권에서 태양광 직접 흡수로 1250°C까지 치솟습니다.
          </div>
        </div>
      );
    }

    case 'ozone_reaction': {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-xs sm:text-sm flex items-center">
              <Shield className="w-4 h-4 text-emerald-600 mr-1" />
              오존의 생성 및 프레온가스(CFCs) 연쇄 파괴
            </span>
            <button
              onClick={() => setCfcPresent(!cfcPresent)}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                cfcPresent ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {cfcPresent ? 'CFCs 방출 상태 ⚠️' : '정상 오존층 보호 상태 🛡️'}
            </button>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-gray-200 text-xs space-y-3">
            <div>
              <div className="font-bold text-gray-900 mb-1">
                {cfcPresent ? '1. 프레온가스(CFCs) 염소 원자의 연쇄 촉매 파괴' : '1. 정상 성층권의 오존 차단 순환'}
              </div>
              <div className="bg-white p-2.5 rounded border border-gray-200 font-mono text-[11px] text-gray-800 space-y-1">
                {cfcPresent ? (
                  <>
                    <div className="text-rose-600">CCl2F2 + UV ➔ CClF2 + Cl (염소 원자 방출)</div>
                    <div className="text-rose-700 font-bold">Cl + O3 ➔ ClO + O2 (오존 파괴!)</div>
                    <div className="text-rose-600">ClO + O ➔ Cl + O2 (염소 원자 무한 재생)</div>
                    <div className="text-gray-500 text-[10px]">결과: 염소 원자 1개가 수만 개의 오존 분자를 파괴</div>
                  </>
                ) : (
                  <>
                    <div className="text-blue-600">O2 + UV-C ➔ O + O (자외선이 산소 해리)</div>
                    <div className="text-emerald-700 font-bold">O + O2 ➔ O3 (오존 분자 생성)</div>
                    <div className="text-indigo-600">O3 + UV-B ➔ O2 + O + 열(Heat 방출)</div>
                    <div className="text-gray-500 text-[10px]">결과: 유해 자외선을 흡수하여 무해한 열로 전환</div>
                  </>
                )}
              </div>
            </div>

            <div className={`p-2 rounded text-[11px] ${
              cfcPresent ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}>
              {cfcPresent ? (
                <span>남극 성층권 얼음 구름에서 염소 원자가 오존을 파괴하여 자외선 투과량이 급증합니다! (오존 홀 발생)</span>
              ) : (
                <span>오존층이 유해 자외선(UV-B, UV-C)을 99% 차단하여 지상 생명체의 DNA 손상과 피부암을 방어합니다.</span>
              )}
            </div>
          </div>
        </div>
      );
    }

    case 'ionosphere_radio': {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-xs sm:text-sm flex items-center">
              <Radio className="w-4 h-4 text-purple-600 mr-1" />
              전리층 전파 반사 vs 마이크로파 위성 통신
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() => setWaveType('shortwave')}
                className={`px-2 py-0.5 text-xs rounded font-medium ${
                  waveType === 'shortwave' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                단파·AM 라디오
              </button>
              <button
                onClick={() => setWaveType('microwave')}
                className={`px-2 py-0.5 text-xs rounded font-medium ${
                  waveType === 'microwave' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                마이크로파 (위성)
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded p-3 h-44 text-white relative flex flex-col justify-between overflow-hidden text-xs">
            {/* Ionosphere bar */}
            <div className="bg-purple-500/40 border border-purple-400 p-1.5 rounded text-[11px] text-center font-bold">
              전리층 (Ionosphere, 75 ~ 500 km) · 이온화된 가스층
            </div>

            {/* Orbit / Satellite */}
            <div className="text-right text-[10px] text-cyan-300 pr-2">
              🛰️ NASA 위성 & 우주정거장 ISS (고도 400km)
            </div>

            {/* Simulation Path */}
            <div className="text-center font-mono text-[11px] py-1 bg-black/40 rounded">
              {waveType === 'shortwave' ? (
                <span className="text-amber-300">
                  송신소 📡 ➔ [전리층 반사 ↩️] ➔ [지표면 ↩️] ➔ 지구 곡면 너머 수천 km 수신!
                </span>
              ) : (
                <span className="text-cyan-300">
                  송신소 📡 ➔ [전리층 직진 관통 ⬆️] ➔ 🛰️ 인공위성/우주정거장 직접 도달!
                </span>
              )}
            </div>

            {/* Ground */}
            <div className="bg-emerald-900 p-1 rounded text-[10px] text-center text-emerald-200">
              🌍 둥근 지구 표면 (Ground)
            </div>
          </div>

          <p className="text-[11px] text-gray-600">
            {waveType === 'shortwave'
              ? '단파와 AM 전파는 전리층의 자유 전자와 이온에 반사되어 둥근 지구 반대편(수천 km)까지 전파됩니다.'
              : '마이크로파는 전리층을 뚫고 통과하므로 NASA가 우주비행사나 통신위성과 교신할 때 사용됩니다.'}
          </p>
        </div>
      );
    }

    case 'greenhouse_sim': {
      // Greenhouse Effect Simulator
      const earthTemp = Math.round(-18 + (ghgLevel / 100) * 33);

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-xs sm:text-sm flex items-center">
              <Sun className="w-4 h-4 text-amber-500 mr-1" />
              온실가스(수증기 & CO2) 농도 시뮬레이터
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              earthTemp < 0 ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              지구 평균 기온: {earthTemp > 0 ? `+${earthTemp}` : earthTemp}°C
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
              <span>0% (온실가스 전무)</span>
              <span>50% (현재 자연 균형: +15°C)</span>
              <span>100% (과열 온실)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={ghgLevel}
              onChange={(e) => setGhgLevel(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
            />
          </div>

          <div className="bg-amber-50/60 border border-amber-200 p-3 rounded text-xs space-y-2">
            <div className="font-semibold text-gray-900">
              온실가스 역할: 단파 가시광선 통과 ➔ 지표면 가열 ➔ 장파 적외선 흡수 포획
            </div>
            <div className="text-[11px] text-gray-700">
              {ghgLevel === 0 ? (
                <span className="text-blue-700 font-bold">
                  ❄️ 온실가스가 전혀 없으면 지구는 영하 18°C로 꽁꽁 얼어붙고 생명체가 살 수 없습니다.
                </span>
              ) : ghgLevel <= 60 ? (
                <span className="text-emerald-700 font-bold">
                  🌿 현재의 자연 온실 효과(+15°C) 덕분에 액체 상태의 물과 생명체가 번성할 수 있습니다.
                </span>
              ) : (
                <span className="text-rose-700 font-bold">
                  🔥 온실가스가 과도하게 축적되면 극지 빙하 해빙과 기후 이상이 가속화됩니다.
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    default: {
      // General Visual / Code Card
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
            <span className="font-semibold text-gray-800 text-xs sm:text-sm flex items-center">
              <Sparkles className="w-4 h-4 text-blue-600 mr-1" />
              핵심 원리 구조 분석
            </span>
            <span className="text-[11px] text-gray-500 font-mono">Chapter 18 Interactive</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-gray-700 space-y-2">
            <div className="font-bold text-gray-900">{section.titleKo}</div>
            <p className="text-[11px] leading-relaxed text-gray-600">
              {section.objectives[0] || section.interactiveSpec.bottomInsight}
            </p>
            <div className="bg-white p-2 rounded border border-gray-100 text-[11px] space-y-1">
              <span className="font-semibold text-blue-700">성취 핵심:</span>
              <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                {section.objectives.slice(0, 2).map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
  }
};
