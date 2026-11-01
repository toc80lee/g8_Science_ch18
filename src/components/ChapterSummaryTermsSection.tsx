import React, { useState } from 'react';
import { KeyTerm, CustomWord } from '../types';
import { 
  BookMarked, 
  FileText, 
  Search, 
  Volume2, 
  Plus, 
  Check, 
  ExternalLink, 
  Sparkles,
  BookOpen,
  BookmarkCheck,
  Tag
} from 'lucide-react';

interface ChapterSummaryTermsSectionProps {
  summaryPoints: string[];
  keyTerms: KeyTerm[];
  customWords: CustomWord[];
  onAddCustomWord: (wordData: { word: string; meaning: string; contextSentence?: string }) => void;
  onNavigateToEvidence?: (page: number, quote?: string) => void;
}

// Category mapping helper for summary points
const summaryCategories: { tag: string; color: string }[] = [
  { tag: '대기 오염', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { tag: '청지기 사명', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { tag: '대기의 본질', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { tag: '오랜 지구 기원설', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { tag: '성경적 창조론', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { tag: '대기 성분비', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { tag: '동질권 & 이질권', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { tag: '5대 기온층', color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { tag: '탄소 & 질소 순환', color: 'bg-lime-100 text-lime-800 border-lime-200' },
  { tag: '오존층 & 자기권', color: 'bg-sky-100 text-sky-800 border-sky-200' },
  { tag: '전리층 통신', color: 'bg-violet-100 text-violet-800 border-violet-200' },
  { tag: '태양 복사 & 온실효과', color: 'bg-orange-100 text-orange-800 border-orange-200' }
];

export const ChapterSummaryTermsSection: React.FC<ChapterSummaryTermsSectionProps> = ({
  summaryPoints,
  keyTerms,
  customWords,
  onAddCustomWord,
  onNavigateToEvidence
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'terms'>('summary');
  const [searchTerm, setSearchTerm] = useState('');
  const [savedPoints, setSavedPoints] = useState<Record<number, boolean>>({});

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleSavePoint = (index: number) => {
    setSavedPoints(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const isWordCustomAdded = (termEn: string) => {
    return customWords.some(w => w.word.toLowerCase() === termEn.toLowerCase());
  };

  // Filter summary points
  const filteredSummaryPoints = summaryPoints
    .map((point, index) => ({ point, index, category: summaryCategories[index] || { tag: '핵심 개념', color: 'bg-gray-100 text-gray-800 border-gray-200' } }))
    .filter(({ point, category }) => 
      searchTerm.trim() === '' || 
      point.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.tag.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Filter key terms
  const filteredKeyTerms = keyTerms.filter(item => 
    searchTerm.trim() === '' ||
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.termEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definitionKo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definitionEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden mb-8">
      {/* Top Header & Tab Strip */}
      <div className="p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-blue-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white font-bold text-xs px-2.5 py-0.5 rounded">
                Chapter 18 총괄
              </span>
              <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                단원 핵심 요약 (Summary) & 주요 과학 용어 (Key Terms)
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              교재 450쪽 공식 총괄 요약 12포인트와 21개 필수 핵심 어휘를 일목요연하게 학습합니다.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="요약 및 용어 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-2 border-b border-gray-200 -mb-4 sm:-mb-5 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 cursor-pointer transition-all ${
              activeTab === 'summary'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>12대 단원 핵심 요약</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === 'summary' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}>
              12
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 cursor-pointer transition-all ${
              activeTab === 'terms'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <BookMarked className="w-4 h-4" />
            <span>21대 필수 핵심 용어 색인</span>
            <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
              activeTab === 'terms' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
            }`}>
              21
            </span>
          </button>
        </div>
      </div>

      {/* Tab 1: 12 Summary Points */}
      {activeTab === 'summary' && (
        <div className="p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
            <span>교재 450쪽 단원 요약 명제 (검색 결과: {filteredSummaryPoints.length}개)</span>
            <span className="text-[11px] text-blue-600">★ 클릭하여 북마크 보관</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
            {filteredSummaryPoints.map(({ point, index, category }) => {
              const isSaved = savedPoints[index];
              return (
                <div
                  key={index}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isSaved 
                      ? 'bg-amber-50/50 border-amber-300 shadow-xs' 
                      : 'bg-white hover:bg-blue-50/30 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${category.color}`}>
                        {category.tag}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSavePoint(index)}
                      className={`p-1 rounded cursor-pointer transition-colors ${
                        isSaved ? 'text-amber-600 hover:bg-amber-100' : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'
                      }`}
                      title={isSaved ? '북마크 해제' : '중요 요약으로 북마크'}
                    >
                      <BookmarkCheck className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-sans">
                    {point}
                  </p>
                </div>
              );
            })}
          </div>

          {filteredSummaryPoints.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-xs">
              검색어와 일치하는 요약 항목이 없습니다.
            </div>
          )}
        </div>
      )}

      {/* Tab 2: 21 Key Terms Glossary */}
      {activeTab === 'terms' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 pb-2 border-b border-gray-100">
            <span>교재 450쪽 공식 Key Terms (검색 결과: {filteredKeyTerms.length}개)</span>
            <span className="text-[11px] text-blue-600 font-medium">영문 발음 듣기 및 나만의 사전 등록 지원</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKeyTerms.map((termItem) => {
              const alreadyAdded = isWordCustomAdded(termItem.termEn);
              return (
                <div
                  key={termItem.termEn}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: English Term, Pronunciation, Page & Action */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <span className="text-base font-bold text-gray-900 font-serif tracking-tight">
                          {termItem.termEn}
                        </span>
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                          {termItem.term}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSpeak(termItem.termEn)}
                          className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="영어 발음 듣기"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-1.5 shrink-0">
                        <span className="text-[10px] text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                          p. {termItem.page}
                        </span>
                        {onNavigateToEvidence && (
                          <button
                            type="button"
                            onClick={() => onNavigateToEvidence(termItem.page, termItem.termEn)}
                            className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                            title={`교재 ${termItem.page}쪽 본문으로 이동`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Definitions */}
                    <div className="space-y-2 mt-2.5">
                      {/* English Definition */}
                      <div className="text-xs sm:text-[13px] text-gray-800 leading-relaxed font-serif bg-gray-50/80 p-2.5 rounded-lg border border-gray-100">
                        {termItem.definitionEn}
                      </div>

                      {/* Korean Definition */}
                      <div className="text-xs text-gray-600 leading-relaxed px-1">
                        <span className="font-semibold text-gray-700">해설: </span>
                        {termItem.definitionKo}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Tool: Add to Custom Words */}
                  <div className="mt-3.5 pt-2.5 border-t border-gray-100 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!alreadyAdded) {
                          onAddCustomWord({
                            word: termItem.termEn,
                            meaning: `${termItem.term}: ${termItem.definitionKo}`,
                            contextSentence: termItem.definitionEn
                          });
                        }
                      }}
                      disabled={alreadyAdded}
                      className={`text-xs px-2.5 py-1 rounded font-medium flex items-center space-x-1 transition-all cursor-pointer ${
                        alreadyAdded
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                          : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {alreadyAdded ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>나만의 사전에 저장됨</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3 h-3 text-amber-600" />
                          <span>나만의 사전에 등록</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredKeyTerms.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-xs">
              검색어와 일치하는 핵심 용어가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
