import { ChapterSection, CustomWord } from '../types';
import { keyTermsList } from '../data/reviewAndGlossary';

// Comprehensive Earth Science and General Science Bilingual Dictionary
export const BILINGUAL_SCIENCE_DICTIONARY: Record<string, string[]> = {
  // Atmospheric Layers & Boundaries
  '대기': ['atmosphere', 'earth\'s atmosphere'],
  'atmosphere': ['대기'],
  '동질권': ['homosphere'],
  'homosphere': ['동질권'],
  '이질권': ['heterosphere'],
  'heterosphere': ['이질권'],
  '대류권': ['troposphere'],
  'troposphere': ['대류권'],
  '대류권계면': ['tropopause'],
  '대류권 계면': ['tropopause'],
  'tropopause': ['대류권계면', '대류권 계면'],
  '기온 감률': ['lapse rate'],
  '기온감률': ['lapse rate'],
  '감률': ['lapse rate'],
  'lapse rate': ['기온 감률', '기온감률', '감률'],
  '성층권': ['stratosphere'],
  'stratosphere': ['성층권'],
  '성층권계면': ['stratopause'],
  '성층권 계면': ['stratopause'],
  'stratopause': ['성층권계면', '성층권 계면'],
  '제트기류': ['jet stream', 'jet streams'],
  '제트 기류': ['jet stream', 'jet streams'],
  'jet stream': ['제트기류', '제트 기류'],
  'jet streams': ['제트기류', '제트 기류'],
  '중간권': ['mesosphere'],
  'mesosphere': ['중간권'],
  '중간권계면': ['mesopause'],
  '중간권 계면': ['mesopause'],
  'mesopause': ['중간권계면', '중간권 계면'],
  '열권': ['thermosphere'],
  'thermosphere': ['열권'],
  '열권계면': ['thermopause'],
  '열권 계면': ['thermopause'],
  'thermopause': ['열권계면', '열권 계면'],
  '외기권': ['exosphere'],
  'exosphere': ['외기권'],
  
  // Special Regions & Phenomena
  '오존층': ['ozone layer', 'layer of ozone'],
  '오존 층': ['ozone layer'],
  'ozone layer': ['오존층', '오존 층'],
  'layer of ozone': ['오존층'],
  '오존': ['ozone', 'O3'],
  'ozone': ['오존'],
  '전리층': ['ionosphere'],
  'ionosphere': ['전리층'],
  '자기권': ['magnetosphere'],
  'magnetosphere': ['자기권'],
  '밴앨런대': ['Van Allen belts', 'Van Allen belt'],
  '밴앨런 복사대': ['Van Allen belts', 'Van Allen belt'],
  'van allen belts': ['밴앨런대', '밴앨런 복사대'],
  'van allen belt': ['밴앨런대'],
  '오로라': ['aurora', 'auroras'],
  'aurora': ['오로라'],
  'auroras': ['오로라'],
  '오로라 보레알리스': ['Aurora Borealis'],
  '북극광': ['Aurora Borealis', 'aurora'],
  'aurora borealis': ['오로라 보레알리스', '북극광'],
  
  // Solar Energy, Constant & Radiation
  '복사하는 태양': ['Radiant Sun', 'the radiant sun', 'radiant sun'],
  'the radiant sun': ['복사하는 태양'],
  'radiant sun': ['복사하는 태양'],
  '태양 상수': ['solar constant', 'the solar constant'],
  '태양상수': ['solar constant', 'the solar constant'],
  'solar constant': ['태양 상수', '태양상수'],
  'the solar constant': ['태양 상수', '태양상수'],
  '태양': ['sun', 'the sun'],
  'sun': ['태양'],
  'the sun': ['태양'],
  '복사': ['radiation'],
  '복사열': ['radiant energy', 'radiation'],
  'radiation': ['복사', '복사열'],
  'radiant energy': ['복사 에너지', '복사열'],
  '복사 에너지': ['radiant energy'],
  '복사에너지': ['radiant energy'],
  '전도': ['conduction'],
  'conduction': ['전도'],
  '대류': ['convection'],
  'convection': ['대류'],
  '대류 순환': ['convection currents'],
  '대류세포': ['convection currents'],
  'convection current': ['대류', '대류 순환'],
  'convection currents': ['대류', '대류 순환'],
  '온실 효과': ['greenhouse effect', 'the greenhouse effect'],
  '온실효과': ['greenhouse effect', 'the greenhouse effect'],
  'greenhouse effect': ['온실 효과', '온실효과'],
  'the greenhouse effect': ['온실 효과', '온실효과'],
  '온실가스': ['greenhouse gases', 'greenhouse gas'],
  '온실 가스': ['greenhouse gases', 'greenhouse gas'],
  '온실 기체': ['greenhouse gases', 'greenhouse gas'],
  'greenhouse gases': ['온실가스', '온실 가스', '온실 기체'],
  'greenhouse gas': ['온실가스', '온실 가스', '온실 기체'],
  '태양풍': ['solar wind'],
  'solar wind': ['태양풍'],
  '양성자': ['protons', 'proton'],
  'protons': ['양성자'],
  'proton': ['양성자'],
  '전자': ['electrons', 'electron'],
  'electrons': ['전자'],
  'electron': ['전자'],
  '전자기파': ['electromagnetic waves', 'electromagnetic wave'],
  'electromagnetic waves': ['전자기파'],
  'electromagnetic wave': ['전자기파'],
  '빛 에너지': ['light energy'],
  'light energy': ['빛 에너지'],
  '파장': ['wavelength', 'wavelengths'],
  'wavelength': ['파장'],
  'wavelengths': ['파장'],
  '전파': ['radio waves', 'radio wave'],
  'radio waves': ['전파'],
  'radio wave': ['전파'],
  '감마선': ['gamma rays', 'gamma ray'],
  'gamma rays': ['감마선'],
  '가시광선': ['visible light', 'visible'],
  'visible light': ['가시광선'],
  '적외선': ['infrared', 'infrared band', 'infrared wavelengths'],
  'infrared': ['적외선'],
  'infrared band': ['적외선'],
  '자외선': ['ultraviolet', 'UV light', 'UV rays', 'UV'],
  'ultraviolet': ['자외선'],
  'uv light': ['자외선'],
  'uv': ['자외선'],
  '지표면': ["earth's surface", "surface of the earth"],
  '지구 표면': ["earth's surface", "surface of the earth"],
  "earth's surface": ['지표면', '지구 표면'],
  "surface of the earth": ['지표면', '지구 표면'],
  '탐보라': ['Mount Tambora', 'Tambora'],
  '탐보라 화산': ['Mount Tambora', 'Tambora'],
  'mount tambora': ['탐보라 화산', '탐보라'],
  'tambora': ['탐보라'],
  '여름 없는 해': ['year without a summer'],
  '여름이 없었던 해': ['year without a summer'],
  'year without a summer': ['여름 없는 해', '여름이 없었던 해'],
  '구름': ['clouds', 'cloud'],
  'clouds': ['구름'],
  'cloud': ['구름'],
  '반사': ['reflect', 'reflection'],
  'reflection': ['반사'],
  'reflect': ['반사'],
  '흡수': ['absorb', 'absorption', 'absorbed'],
  'absorption': ['흡수'],
  'absorb': ['흡수'],
  '수직': ['overhead', 'directly overhead', 'vertical'],
  'directly overhead': ['머리 위에', '수직으로'],
  '위도': ['latitude'],
  'latitude': ['위도'],
  '적도': ['equator'],
  'equator': ['적도'],
  '수증기': ['water vapor'],
  'water vapor': ['수증기'],
  '이산화탄소': ['carbon dioxide', 'CO2'],
  'carbon dioxide': ['이산화탄소'],
  '메탄': ['methane', 'CH4'],
  'methane': ['메탄'],
  '질소': ['nitrogen', 'N2'],
  'nitrogen': ['질소'],
  '산소': ['oxygen', 'O2'],
  'oxygen': ['산소'],
  '아르곤': ['argon'],
  'argon': ['아르곤'],
  '남세균': ['cyanobacteria'],
  '시아노박테리아': ['cyanobacteria'],
  'cyanobacteria': ['남세균', '시아노박테리아'],
  '기온': ['temperature'],
  '온도': ['temperature'],
  'temperature': ['기온', '온도'],
  '고도': ['altitude'],
  'altitude': ['고도'],
  '알베도': ['albedo'],
  'albedo': ['알베도'],
  '밀도': ['density'],
  'density': ['밀도'],
  '부력': ['buoyancy'],
  'buoyancy': ['부력']
};

// Clean text: strip surrounding punctuation, brackets, quotes
export function cleanTerm(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/^[\s"'“‘(\[<«‹]+|[\s"'”’)\]>»›,.;:!?]+$/g, '')
    .trim();
}

// Remove Korean particles for flexible matching (e.g. 대류권에서 -> 대류권, 태양 상수라고 -> 태양 상수)
export function stripKoreanParticles(term: string): string {
  if (!term) return '';
  let cleaned = term.trim();
  // Strip compound and single Korean particles repeatedly
  const particleRegex = /(이라고|이라는|이라며|이라서|에서는|에서의|에게는|에게서|으로는|으로의|까지는|부터는|보다는|처럼은|마다는|이란|에는|에도|만의|만을|보다|처럼|마다|에서|에게|으로|까지|부터|로의|이라|라고|라는|이며|하고|은|는|이|가|을|를|의|에|로|와|과|도|만|란|라)$/;
  for (let i = 0; i < 2; i++) {
    const stripped = cleaned.replace(particleRegex, '').trim();
    if (stripped.length >= 2 && stripped !== cleaned) {
      cleaned = stripped;
    }
  }
  return cleaned;
}

// Remove English leading articles and trailing punctuation (e.g. the troposphere -> troposphere, a lapse rate -> lapse rate)
export function stripEnglishArticles(term: string): string {
  if (!term) return '';
  return term
    .replace(/^(the|a|an)\s+/i, '')
    .replace(/[,.;:!?]$/, '')
    .trim();
}

/**
 * Searches the given section to find the matching term in the opposite language.
 * Supports:
 * 1. Direct parentheses bilingual extracts: "대류권 (Troposphere)", "기온 감률(Lapse rate)"
 * 2. Key Terms lookup (from textbook keyTermsList)
 * 3. Science Dictionary lookup (with particle stripping)
 * 4. Custom Vocabulary lookup
 * 5. In-section parallel bilingual bracket patterns
 */
export function findBilingualCounterpart(
  rawText: string,
  section: ChapterSection,
  customWords: CustomWord[] = []
): { text: string; lang: 'ko' | 'en' } | null {
  const cleaned = cleanTerm(rawText);
  if (!cleaned || cleaned.length < 2) return null;

  const targetParagraphsKo = section.contentKo;
  const targetParagraphsEn = section.contentEn;

  // -------------------------------------------------------------
  // STRATEGY 1: Check if selection itself contains Parenthesized Bilingual pair:
  // e.g. "대류권 (Troposphere)" or "기온 감률(Lapse rate)" or "Troposphere (대류권)"
  // -------------------------------------------------------------
  const parenMatch = cleaned.match(/^([가-힣\s]+)\s*\(([^)]+)\)$/);
  if (parenMatch) {
    const korPart = cleanTerm(parenMatch[1]);
    const engCandidate = cleanTerm(parenMatch[2]);
    // Check if the English candidate is in English content
    const foundInEn = findInText(engCandidate, targetParagraphsEn);
    if (foundInEn) return { text: foundInEn, lang: 'en' };
    if (engCandidate) return { text: engCandidate, lang: 'en' };
  }

  const parenMatchReverse = cleaned.match(/^([A-Za-z\s\-]+)\s*\(([^)]+)\)$/);
  if (parenMatchReverse) {
    const engPart = cleanTerm(parenMatchReverse[1]);
    const korCandidate = cleanTerm(parenMatchReverse[2]);
    const foundInKo = findInText(korCandidate, targetParagraphsKo);
    if (foundInKo) return { text: foundInKo, lang: 'ko' };
    if (korCandidate) return { text: korCandidate, lang: 'ko' };
  }

  const isKorean = /[가-힣]/.test(cleaned);
  const targetLang: 'ko' | 'en' = isKorean ? 'en' : 'ko';
  const targetParagraphs = isKorean ? targetParagraphsEn : targetParagraphsKo;

  // Prepare normalized candidate keys
  const strippedKor = stripKoreanParticles(cleaned);
  const strippedEng = stripEnglishArticles(cleaned);

  // -------------------------------------------------------------
  // STRATEGY 2: Check 21 Key Terms from textbook reviewAndGlossary
  // -------------------------------------------------------------
  for (const kt of keyTermsList) {
    if (isKorean) {
      const ktNorm = kt.term.replace(/\s+/g, '');
      const cleanNorm = cleaned.replace(/\s+/g, '');
      const strippedNorm = strippedKor.replace(/\s+/g, '');

      if (
        kt.term === cleaned ||
        kt.term === strippedKor ||
        ktNorm === cleanNorm ||
        ktNorm === strippedNorm ||
        cleanNorm.includes(ktNorm) ||
        strippedNorm.includes(ktNorm)
      ) {
        const found = findInText(kt.termEn, targetParagraphs);
        if (found) return { text: found, lang: 'en' };
        return { text: kt.termEn, lang: 'en' };
      }
    } else {
      const cleanLower = strippedEng.toLowerCase();
      const ktEnLower = kt.termEn.toLowerCase();
      if (
        ktEnLower === cleanLower ||
        cleanLower.includes(ktEnLower) ||
        ktEnLower.includes(cleanLower)
      ) {
        const found = findInText(kt.term, targetParagraphs);
        if (found) return { text: found, lang: 'ko' };
        return { text: kt.term, lang: 'ko' };
      }
    }
  }

  // -------------------------------------------------------------
  // STRATEGY 3: Check BILINGUAL_SCIENCE_DICTIONARY lookup
  // -------------------------------------------------------------
  const lookupKeys: string[] = [];
  if (isKorean) {
    lookupKeys.push(cleaned.toLowerCase());
    lookupKeys.push(strippedKor.toLowerCase());
    lookupKeys.push(cleaned.replace(/\s+/g, '').toLowerCase());
    lookupKeys.push(strippedKor.replace(/\s+/g, '').toLowerCase());
  } else {
    lookupKeys.push(cleaned.toLowerCase());
    lookupKeys.push(strippedEng.toLowerCase());
    lookupKeys.push(strippedEng.replace(/s$/, '').toLowerCase()); // handle plurals
  }

  for (const k of lookupKeys) {
    const candidates = BILINGUAL_SCIENCE_DICTIONARY[k];
    if (candidates && candidates.length > 0) {
      for (const cand of candidates) {
        const found = findInText(cand, targetParagraphs);
        if (found) {
          return { text: found, lang: targetLang };
        }
      }
      return { text: candidates[0], lang: targetLang };
    }
  }

  // Also check if any dictionary key is a substring of the selection
  if (isKorean) {
    for (const [k, cands] of Object.entries(BILINGUAL_SCIENCE_DICTIONARY)) {
      if (/[가-힣]/.test(k) && (cleaned.includes(k) || strippedKor.includes(k))) {
        for (const cand of cands) {
          const found = findInText(cand, targetParagraphs);
          if (found) return { text: found, lang: 'en' };
        }
        return { text: cands[0], lang: 'en' };
      }
    }
  } else {
    const lowerSel = cleaned.toLowerCase();
    for (const [k, cands] of Object.entries(BILINGUAL_SCIENCE_DICTIONARY)) {
      if (!/[가-힣]/.test(k) && lowerSel.includes(k.toLowerCase())) {
        for (const cand of cands) {
          const found = findInText(cand, targetParagraphs);
          if (found) return { text: found, lang: 'ko' };
        }
        return { text: cands[0], lang: 'ko' };
      }
    }
  }

  // -------------------------------------------------------------
  // STRATEGY 4: Check Section's bilingual bracket patterns in Korean text: e.g. "대류권 (Troposphere)"
  // -------------------------------------------------------------
  if (isKorean) {
    const termToLook = strippedKor || cleaned;
    for (const p of targetParagraphsKo) {
      // Matches: 대류권 (Troposphere) or 대류권(Troposphere)
      const regex = new RegExp(`${escapeRegExp(termToLook)}\\s*\\(([A-Za-z\\s\\-]+)\\)`, 'i');
      const m = p.match(regex);
      if (m && m[1]) {
        const engCandidate = cleanTerm(m[1]);
        const found = findInText(engCandidate, targetParagraphsEn);
        if (found) return { text: found, lang: 'en' };
        return { text: engCandidate, lang: 'en' };
      }
    }
  } else {
    const termToLook = strippedEng || cleaned;
    for (const p of targetParagraphsKo) {
      // Matches: 한국어 (English) where English matches cleaned
      const regex = new RegExp(`([가-힣\\s]+)\\s*\\([^)]*${escapeRegExp(termToLook)}[^)]*\\)`, 'i');
      const m = p.match(regex);
      if (m && m[1]) {
        const korCandidate = cleanTerm(m[1]);
        const found = findInText(korCandidate, targetParagraphsKo);
        if (found) return { text: found, lang: 'ko' };
        return { text: korCandidate, lang: 'ko' };
      }
    }
  }

  // -------------------------------------------------------------
  // STRATEGY 5: Check Custom Vocabulary Dictionary
  // -------------------------------------------------------------
  for (const cw of customWords) {
    if (isKorean) {
      if (cw.meaning.includes(cleaned) || cw.meaning.includes(strippedKor) || cw.word.includes(cleaned)) {
        const engMatch = cw.word.match(/[a-zA-Z\s]+/);
        if (engMatch) {
          const candidate = cleanTerm(engMatch[0]);
          const found = findInText(candidate, targetParagraphsEn);
          if (found) return { text: found, lang: 'en' };
          return { text: candidate, lang: 'en' };
        }
      }
    } else {
      if (cw.word.toLowerCase().includes(cleaned.toLowerCase()) || cw.word.toLowerCase().includes(strippedEng.toLowerCase())) {
        const korMatch = cw.word.match(/[가-힣\s]+/);
        if (korMatch) {
          const candidate = cleanTerm(korMatch[0]);
          const found = findInText(candidate, targetParagraphsKo);
          if (found) return { text: found, lang: 'ko' };
          return { text: candidate, lang: 'ko' };
        }
      }
    }
  }

  return null;
}

// Find case-insensitive match in array of paragraphs and return the exact substring from the text
function findInText(needle: string, paragraphs: string[]): string | null {
  const cleanNeedle = cleanTerm(needle);
  if (!cleanNeedle) return null;
  const lowerNeedle = cleanNeedle.toLowerCase();

  for (const p of paragraphs) {
    const lowerP = p.toLowerCase();
    const idx = lowerP.indexOf(lowerNeedle);
    if (idx !== -1) {
      return p.substring(idx, idx + cleanNeedle.length);
    }
  }

  // Also check without spaces if Korean (e.g. 태양상수 vs 태양 상수)
  const noSpaceNeedle = lowerNeedle.replace(/\s+/g, '');
  if (noSpaceNeedle !== lowerNeedle) {
    for (const p of paragraphs) {
      const lowerP = p.toLowerCase();
      const idx = lowerP.indexOf(noSpaceNeedle);
      if (idx !== -1) {
        return p.substring(idx, idx + noSpaceNeedle.length);
      }
    }
  }

  return null;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
