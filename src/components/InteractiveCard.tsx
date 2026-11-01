import React, { useState } from 'react';
import { ChapterSection } from '../types';
import { VisualSimulator } from './VisualSimulator';
import { RotateCcw, Copy, Check, FlaskConical, ChevronDown } from 'lucide-react';

interface InteractiveCardProps {
  section: ChapterSection;
  embedded?: boolean;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({ 
  section,
  embedded = false 
}) => {
  const spec = section.interactiveSpec;
  const [activeTabId, setActiveTabId] = useState<string>(spec.defaultTabId);
  const [copied, setCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const activeTab = spec.tabs.find((t) => t.id === activeTabId) || spec.tabs[0];

  const handleReset = () => {
    setActiveTabId(spec.defaultTabId);
  };

  const handleCopyCode = () => {
    if (activeTab.codeSnippet) {
      navigator.clipboard.writeText(activeTab.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={embedded ? "space-y-4" : "my-5 bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-white border border-emerald-200/80 rounded-xl p-4 shadow-2xs transition-all duration-200"}>
      {/* Standalone Header Banner */}
      {!embedded && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div 
            onClick={() => setIsExpanded(prev => !prev)}
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(prev => !prev);
              }}
              className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center font-bold shadow-xs shrink-0 cursor-pointer transition-all relative group/btn"
              title={isExpanded ? '탐구 실습 접기' : '탐구 실습 확인하기 (클릭 시 펼침)'}
              aria-label="탐구 실습 토글"
            >
              <FlaskConical className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-3 h-3" />
              </span>
            </button>
            <div>
              <h4 className="font-bold text-gray-900 text-sm flex items-center space-x-1.5 group-hover:text-emerald-700 transition-colors">
                <span>탐구 실습</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  {spec.missionNumber} · 탐구 실습 ({spec.tabs.length}개 모드)
                </span>
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                {spec.missionTitle} — 과학 모델링 코드와 시뮬레이션을 통해 직접 실험하고 탐구합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Content View */}
      {(isExpanded || embedded) && (
        <div className={embedded ? "space-y-4 animate-in fade-in duration-200" : "mt-4 pt-3.5 border-t border-emerald-100 space-y-4 animate-in fade-in duration-200"}>
          {/* Activity Card Sub-Header */}
          <div className="space-y-1.5 bg-white/70 p-3 rounded-lg border border-emerald-100">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded">
                {spec.missionNumber} · 탐구
              </span>
              <h3 className="font-bold text-gray-900 text-base">
                {spec.missionTitle}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {activeTab.description || '아래 조작 패널을 통해 대기과학의 핵심 물리·화학적 메커니즘을 시뮬레이션하고 결과를 관찰하세요. 되돌릴 때는 「원래대로」를 누릅니다.'}
            </p>
          </div>

          {/* Button tabs bar matching reference image */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
            <div className="flex flex-wrap items-center border border-gray-300 rounded overflow-hidden">
              {spec.tabs.map((tab) => {
                const isTabActive = tab.id === activeTabId;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors border-r last:border-r-0 border-gray-200 cursor-pointer ${
                      isTabActive
                        ? 'bg-emerald-50 text-emerald-700 font-bold'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Reset button matching the right-aligned '원래대로' button */}
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-400 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>원래대로</span>
            </button>
          </div>

          {/* Dual Split Pane Container (Left: Code/Data, Right: Interactive Outcome) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border border-gray-200 rounded-lg bg-white overflow-hidden shadow-xs">
            {/* Left Pane: Structured Code / Data Viewer */}
            <div className="bg-[#1e1e1e] text-gray-200 font-mono text-xs p-4 flex flex-col justify-between overflow-x-auto min-h-[300px]">
              <div>
                <div className="flex items-center justify-between text-gray-400 text-[11px] pb-2 border-b border-gray-700 mb-3">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                    <span className="ml-2 text-gray-300 font-sans">{tabPrefix(activeTab.label)} 시뮬레이션 코드 / 데이터</span>
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="hover:text-white flex items-center space-x-1 cursor-pointer"
                    title="코드 복사"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span className="text-[10px]">{copied ? '복사됨' : '복사'}</span>
                  </button>
                </div>

                <pre className="text-gray-300 whitespace-pre leading-relaxed select-text font-mono text-xs">
                  {activeTab.codeSnippet || `// [${section.titleKo}]
// 성취 목표: ${section.objectives[0] || ''}
const studyData = {
  chapter: 18,
  topic: "${section.titleEn}",
  pages: [${section.pages.join(', ')}]
};`}
                </pre>
              </div>

              <div className="pt-3 border-t border-gray-800 text-[11px] text-gray-400 flex items-center justify-between">
                <span>TypeScript / Science Model</span>
                <span className="text-gray-400">교재 {section.pages.join(', ')}페이지</span>
              </div>
            </div>

            {/* Right Pane: Live Interactive Rendered Visual Outcome */}
            <div className="p-4 bg-white flex flex-col justify-between min-h-[300px]">
              <VisualSimulator section={section} activeTabId={activeTabId} />

              {/* Sub visual card bottom note */}
              <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>실시간 인터랙티브 모델 렌더링</span>
                <span className="text-emerald-700 font-medium">Chapter 18 Simulator</span>
              </div>
            </div>
          </div>

          {/* Analytical Commentary Box below the Card */}
          <div className="bg-slate-50 border-l-4 border-slate-400 p-3.5 rounded-r text-xs sm:text-sm text-gray-700 leading-relaxed shadow-2xs">
            <span className="font-bold text-gray-900 block mb-1">
              💡 개념 심층 분석 및 비교 관점:
            </span>
            {spec.bottomInsight}
          </div>
        </div>
      )}
    </div>
  );
};

function tabPrefix(label: string): string {
  return label.split(' ')[0] || '';
}
