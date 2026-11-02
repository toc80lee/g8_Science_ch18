import React, { useState } from 'react';
import { Mic, Youtube, FlaskConical, ChevronDown, PenSquare } from 'lucide-react';
import { ChapterSection } from '../types';
import { SelfLearningVoiceJournal } from './SelfLearningVoiceJournal';
import { StudyBlogSection } from './StudyBlogSection';
import { RelatedMediaSection } from './RelatedMediaSection';
import { InteractiveCard } from './InteractiveCard';

interface ActivityTabStripProps {
  section: ChapterSection;
}

export type ActivityTabKey = 'journal' | 'blog' | 'media' | 'practice' | null;

export const ActivityTabStrip: React.FC<ActivityTabStripProps> = ({ section }) => {
  // Active tab state: defaults to null (compact header) or opens selected tab
  const [activeTab, setActiveTab] = useState<ActivityTabKey>(null);

  const handleTabToggle = (tabKey: 'journal' | 'blog' | 'media' | 'practice') => {
    setActiveTab((prev) => (prev === tabKey ? null : tabKey));
  };

  return (
    <div className="my-5 bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden transition-all duration-200">
      {/* 4-Tab Header Strip: Single row on all devices (mobile: icons only, sm+: icons + text) */}
      <div className="bg-gray-50/80 p-2 sm:p-2.5 border-b border-gray-200/80">
        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {/* Tab 1: 셀프 학습 (노란색 / Amber) */}
          <button
            type="button"
            onClick={() => handleTabToggle('journal')}
            className={`flex items-center justify-center sm:justify-start sm:space-x-2.5 p-1.5 sm:p-2.5 rounded-xl transition-all cursor-pointer text-left ${
              activeTab === 'journal'
                ? 'bg-gradient-to-r from-amber-100 via-yellow-100/90 to-amber-50 border border-amber-400 shadow-2xs ring-1 ring-amber-300/60'
                : 'bg-gradient-to-r from-amber-50/80 via-yellow-50/50 to-white border border-amber-300/80 hover:border-amber-400 hover:shadow-2xs'
            }`}
            title={activeTab === 'journal' ? '셀프 학습 접기' : '셀프 학습 열기 (클릭 시 펼침)'}
            aria-label="셀프 학습 탭"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs shrink-0 relative">
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-amber-700 border border-amber-300 flex items-center justify-center shadow-xs transition-transform duration-200 ${
                  activeTab === 'journal' ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="w-3 h-3" />
              </span>
            </div>
            <div className="hidden sm:block min-w-0">
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                셀프 학습
              </h4>
            </div>
          </button>

          {/* Tab 2: 학습 정리 (보라색 / Purple - 자기주도 학습 바로 옆 배치) */}
          <button
            type="button"
            onClick={() => handleTabToggle('blog')}
            className={`flex items-center justify-center sm:justify-start sm:space-x-2.5 p-1.5 sm:p-2.5 rounded-xl transition-all cursor-pointer text-left ${
              activeTab === 'blog'
                ? 'bg-gradient-to-r from-purple-100 via-violet-100/90 to-purple-50 border border-purple-400 shadow-2xs ring-1 ring-purple-300/60'
                : 'bg-gradient-to-r from-purple-50/80 via-violet-50/50 to-white border border-purple-200/90 hover:border-purple-300 hover:shadow-2xs'
            }`}
            title={activeTab === 'blog' ? '학습 정리 접기' : '학습 정리 열기 (클릭 시 블로그 편집기)'}
            aria-label="학습 정리 탭"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 relative">
              <PenSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-purple-700 border border-purple-200 flex items-center justify-center shadow-xs transition-transform duration-200 ${
                  activeTab === 'blog' ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="w-3 h-3" />
              </span>
            </div>
            <div className="hidden sm:block min-w-0">
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                학습 정리
              </h4>
            </div>
          </button>

          {/* Tab 3: 추천 자료 (빨간색 / Red) */}
          <button
            type="button"
            onClick={() => handleTabToggle('media')}
            className={`flex items-center justify-center sm:justify-start sm:space-x-2.5 p-1.5 sm:p-2.5 rounded-xl transition-all cursor-pointer text-left ${
              activeTab === 'media'
                ? 'bg-gradient-to-r from-red-100 via-rose-100/90 to-red-50 border border-red-400 shadow-2xs ring-1 ring-red-300/60'
                : 'bg-gradient-to-r from-red-50/70 via-rose-50/50 to-white border border-red-200/80 hover:border-red-300 hover:shadow-2xs'
            }`}
            title={activeTab === 'media' ? '추천 자료 접기' : '추천 자료 열기 (클릭 시 펼침)'}
            aria-label="추천 자료 탭"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 relative">
              <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-red-700 border border-red-200 flex items-center justify-center shadow-xs transition-transform duration-200 ${
                  activeTab === 'media' ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="w-3 h-3" />
              </span>
            </div>
            <div className="hidden sm:block min-w-0">
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                추천 자료
              </h4>
            </div>
          </button>

          {/* Tab 4: 탐구 실습 (녹색 / Green) */}
          <button
            type="button"
            onClick={() => handleTabToggle('practice')}
            className={`flex items-center justify-center sm:justify-start sm:space-x-2.5 p-1.5 sm:p-2.5 rounded-xl transition-all cursor-pointer text-left ${
              activeTab === 'practice'
                ? 'bg-gradient-to-r from-emerald-100 via-teal-100/90 to-emerald-50 border border-emerald-400 shadow-2xs ring-1 ring-emerald-300/60'
                : 'bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-white border border-emerald-200/80 hover:border-emerald-300 hover:shadow-2xs'
            }`}
            title={activeTab === 'practice' ? '탐구 실습 접기' : '탐구 실습 열기 (클릭 시 펼침)'}
            aria-label="탐구 실습 탭"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 relative">
              <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span
                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs transition-transform duration-200 ${
                  activeTab === 'practice' ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown className="w-3 h-3" />
              </span>
            </div>
            <div className="hidden sm:block min-w-0">
              <h4 className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                탐구 실습
              </h4>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Panel Content (expands when a tab is selected) */}
      {activeTab && (
        <div
          className={`p-4 sm:p-6 transition-all duration-200 ${
            activeTab === 'journal'
              ? 'bg-gradient-to-b from-amber-50/40 via-white to-white'
              : activeTab === 'blog'
              ? 'bg-gradient-to-b from-purple-50/30 via-white to-white'
              : activeTab === 'media'
              ? 'bg-gradient-to-b from-red-50/40 via-white to-white'
              : 'bg-gradient-to-b from-emerald-50/40 via-white to-white'
          }`}
        >
          {activeTab === 'journal' && (
            <SelfLearningVoiceJournal section={section} embedded={true} />
          )}
          {activeTab === 'blog' && (
            <StudyBlogSection section={section} embedded={true} />
          )}
          {activeTab === 'media' && (
            <RelatedMediaSection section={section} embedded={true} />
          )}
          {activeTab === 'practice' && (
            <InteractiveCard section={section} embedded={true} />
          )}
        </div>
      )}
    </div>
  );
};
