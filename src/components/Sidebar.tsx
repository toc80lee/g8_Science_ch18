import React from 'react';
import { ChapterSection } from '../types';
import { Check, Search, BookMarked, HelpCircle } from 'lucide-react';

interface SidebarProps {
  sections: ChapterSection[];
  activeSectionId: string;
  completedSectionIds: string[];
  onSelectSection: (sectionId: string) => void;
  onOpenGlossary: (tab?: 'key-terms' | 'custom-words' | 'flashcards') => void;
  onOpenMyRecord: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  customWordsCount: number;
  isGlossaryActive?: boolean;
  activeGlossaryTab?: 'key-terms' | 'custom-words' | 'flashcards';
  isMyRecordActive?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeSectionId,
  completedSectionIds,
  onSelectSection,
  onOpenGlossary,
  onOpenMyRecord,
  searchQuery,
  setSearchQuery,
  customWordsCount,
  isGlossaryActive = false,
  activeGlossaryTab = 'key-terms',
  isMyRecordActive = false,
}) => {
  // Group sections logically into sidebar categories like reference screenshot
  const introSections = sections.filter(s => s.category === 'intro');
  const sections18A = sections.filter(s => s.category === '18A');
  const sections18B = sections.filter(s => s.category === '18B');
  const sections18C = sections.filter(s => s.category === '18C');
  const reviewSections = sections.filter(s => s.category === 'review');

  const filteredSections = searchQuery.trim()
    ? sections.filter(s => 
        s.titleKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.breadcrumb.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  const renderSectionItem = (section: ChapterSection, displayIndex: number) => {
    const isActive = section.id === activeSectionId;
    const isCompleted = completedSectionIds.includes(section.id);

    return (
      <button
        key={section.id}
        onClick={() => onSelectSection(section.id)}
        className={`w-full text-left flex items-center justify-between py-2 px-3 text-xs sm:text-sm transition-colors ${
          isActive
            ? 'bg-gray-100 font-bold text-gray-900 border-l-4 border-blue-600 pl-2.5'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
        }`}
      >
        <div className="flex items-center space-x-2 truncate">
          <span className="text-gray-400 font-mono text-xs w-4 text-right shrink-0">
            {displayIndex}
          </span>
          <span className="truncate">{section.titleKo}</span>
        </div>
        {isCompleted && (
          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1" />
        )}
      </button>
    );
  };

  return (
    <aside className="w-64 sm:w-72 border-r border-gray-200 bg-white flex flex-col h-[calc(100vh-3.5rem)] sticky top-14 overflow-hidden select-none">
      {/* Quick Search */}
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="단원 및 개념 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-blue-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-5">
        {filteredSections ? (
          <div>
            <div className="px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              검색 결과 ({filteredSections.length})
            </div>
            {filteredSections.map((s, idx) => renderSectionItem(s, idx + 1))}
          </div>
        ) : (
          <>
            {/* 1. 과정 / 시작 */}
            <div>
              <div className="px-4 text-[11px] font-semibold text-gray-400 tracking-wider mb-1">
                과정 개요
              </div>
              <button
                onClick={() => onSelectSection(introSections[0]?.id || sections[0].id)}
                className={`w-full text-left py-1.5 px-4 text-xs sm:text-sm ${
                  activeSectionId === introSections[0]?.id
                    ? 'bg-gray-100 font-bold text-gray-900 border-l-4 border-blue-600 pl-3'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                · 메인 홈페이지
              </button>
              <button
                onClick={() => onSelectSection('intro-killer-air')}
                className={`w-full text-left py-1.5 px-4 text-xs sm:text-sm ${
                  activeSectionId === 'intro-killer-air'
                    ? 'bg-gray-100 font-bold text-gray-900 border-l-4 border-blue-600 pl-3'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                · 살인자 공기 (Killer Air)
              </button>
            </div>

            {/* 2. 18A 대기란 무엇인가? */}
            <div>
              <div className="px-4 text-[11px] font-semibold text-gray-400 tracking-wider mb-1">
                18A · 대기란 무엇인가?
              </div>
              {sections18A.map((s, idx) => renderSectionItem(s, idx + 1))}
            </div>

            {/* 3. 18B 대기의 특별 구역 */}
            <div>
              <div className="px-4 text-[11px] font-semibold text-gray-400 tracking-wider mb-1">
                18B · 대기의 특별 구역
              </div>
              {sections18B.map((s, idx) => renderSectionItem(s, idx + 6))}
            </div>

            {/* 4. 18C 대기 중의 에너지 */}
            <div>
              <div className="px-4 text-[11px] font-semibold text-gray-400 tracking-wider mb-1">
                18C · 대기 중의 에너지
              </div>
              {sections18C.map((s, idx) => renderSectionItem(s, idx + 10))}
            </div>

            {/* 5. 단원 총괄 및 평가 */}
            <div>
              <div className="px-4 text-[11px] font-semibold text-gray-400 tracking-wider mb-1">
                총괄 평가 & 복습
              </div>
              {reviewSections.map((s, idx) => renderSectionItem(s, idx + 14))}
            </div>

            {/* 6. 참고 */}
            <div>
              <div className="px-4 text-[11px] font-semibold text-gray-400 tracking-wider mb-1">
                참고 & 용어 사전
              </div>
              <button
                onClick={() => onOpenGlossary('key-terms')}
                className={`w-full text-left py-2 px-3 text-xs sm:text-sm flex items-center justify-between transition-colors ${
                  isGlossaryActive && activeGlossaryTab === 'key-terms'
                    ? 'bg-gray-100 font-bold text-gray-900 border-l-4 border-blue-600 pl-2.5'
                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <BookMarked className="w-3.5 h-3.5 text-blue-600 mr-1" />
                  <span>21개 핵심 용어 사전</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">21</span>
              </button>

              <button
                onClick={() => onOpenGlossary('custom-words')}
                className={`w-full text-left py-2 px-3 text-xs sm:text-sm flex items-center justify-between transition-colors ${
                  isGlossaryActive && activeGlossaryTab === 'custom-words'
                    ? 'bg-amber-50 font-bold text-amber-950 border-l-4 border-amber-600 pl-2.5'
                    : 'text-gray-700 hover:bg-amber-50 hover:text-amber-900 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="text-amber-500 font-bold mr-1">★</span>
                  <span className="font-medium text-amber-900">나만의 용어 사전</span>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                  {customWordsCount}
                </span>
              </button>

              <button
                onClick={onOpenMyRecord}
                className={`w-full text-left py-2 px-3 text-xs sm:text-sm flex items-center justify-between transition-colors ${
                  isMyRecordActive
                    ? 'bg-blue-50 font-bold text-blue-900 border-l-4 border-blue-600 pl-2.5'
                    : 'text-gray-700 hover:bg-blue-50/50 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <span className="text-blue-600 font-bold mr-1">📁</span>
                  <span className="font-medium text-gray-900">내 학습 기록 & Drive</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">
                  MY
                </span>
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
