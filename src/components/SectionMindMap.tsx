import React, { useState } from 'react';
import { 
  Network, 
  HelpCircle, 
  Lightbulb, 
  ChevronDown, 
  Maximize2, 
  X, 
  Sparkles, 
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { ChapterSection } from '../types';
import { getMindMapForSection, MindMapKeywordNode, MindMapBranch } from '../data/mindMapData';

interface SectionMindMapProps {
  section: ChapterSection;
  onNavigateToEvidence?: (page: number, quoteKo?: string) => void;
}

export const SectionMindMap: React.FC<SectionMindMapProps> = ({ 
  section,
  onNavigateToEvidence 
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [exploredNodes, setExploredNodes] = useState<Record<string, boolean>>({});

  const mindMap = getMindMapForSection(section.id);

  const toggleNodeExplored = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExploredNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const getBranchColorStyles = (theme: MindMapBranch['colorTheme']) => {
    switch (theme) {
      case 'emerald':
        return {
          bgLight: 'bg-emerald-50/80',
          border: 'border-emerald-200',
          borderActive: 'border-emerald-400',
          accent: 'text-emerald-700',
          badge: 'bg-emerald-600 text-white',
          chip: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          pillHover: 'hover:border-emerald-400 hover:bg-emerald-50'
        };
      case 'amber':
        return {
          bgLight: 'bg-amber-50/80',
          border: 'border-amber-200',
          borderActive: 'border-amber-400',
          accent: 'text-amber-700',
          badge: 'bg-amber-600 text-white',
          chip: 'bg-amber-100 text-amber-800 border-amber-300',
          pillHover: 'hover:border-amber-400 hover:bg-amber-50'
        };
      case 'purple':
        return {
          bgLight: 'bg-purple-50/80',
          border: 'border-purple-200',
          borderActive: 'border-purple-400',
          accent: 'text-purple-700',
          badge: 'bg-purple-600 text-white',
          chip: 'bg-purple-100 text-purple-800 border-purple-300',
          pillHover: 'hover:border-purple-400 hover:bg-purple-50'
        };
      case 'rose':
        return {
          bgLight: 'bg-rose-50/80',
          border: 'border-rose-200',
          borderActive: 'border-rose-400',
          accent: 'text-rose-700',
          badge: 'bg-rose-600 text-white',
          chip: 'bg-rose-100 text-rose-800 border-rose-300',
          pillHover: 'hover:border-rose-400 hover:bg-rose-50'
        };
      case 'indigo':
        return {
          bgLight: 'bg-indigo-50/80',
          border: 'border-indigo-200',
          borderActive: 'border-indigo-400',
          accent: 'text-indigo-700',
          badge: 'bg-indigo-600 text-white',
          chip: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          pillHover: 'hover:border-indigo-400 hover:bg-indigo-50'
        };
      case 'blue':
      default:
        return {
          bgLight: 'bg-blue-50/80',
          border: 'border-blue-200',
          borderActive: 'border-blue-400',
          accent: 'text-blue-700',
          badge: 'bg-blue-600 text-white',
          chip: 'bg-blue-100 text-blue-800 border-blue-300',
          pillHover: 'hover:border-blue-400 hover:bg-blue-50'
        };
    }
  };

  const renderMindMapContent = (inModal = false) => (
    <div className="space-y-4">
      {/* Central Question Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white rounded-xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-200">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>소단원 핵심 탐구 화두 (Central Inquiry)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold leading-snug tracking-tight">
              "{mindMap.bigQuestion}"
            </h3>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-[11px] bg-white/20 px-2.5 py-1 rounded-full text-blue-100 font-mono">
              {mindMap.branches.length}개 핵심 줄기 · {mindMap.branches.reduce((acc, b) => acc + b.nodes.length, 0)}개 질문 노드
            </span>
            {!inModal && (
              <button
                onClick={() => setIsFullscreen(true)}
                className="hidden sm:flex items-center space-x-1 bg-white/10 hover:bg-white/20 active:scale-95 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border border-white/20"
                title="전체화면으로 마인드맵 탐색"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>크게 보기</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Structured Mind Map Branch Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {mindMap.branches.map((branch) => {
          const colors = getBranchColorStyles(branch.colorTheme);

          return (
            <div 
              key={branch.id}
              className={`rounded-xl border ${colors.border} ${colors.bgLight} p-4 shadow-2xs flex flex-col space-y-3.5 transition-all`}
            >
              {/* Branch Header */}
              <div className="flex items-center justify-between border-b pb-2 border-gray-200/60">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${colors.badge}`} />
                  <h4 className="font-bold text-gray-900 text-sm">
                    {branch.title}
                  </h4>
                </div>
                <span className="text-[10px] font-semibold text-gray-400 font-mono">
                  {branch.titleEn}
                </span>
              </div>

              {/* Keyword Nodes inside this branch */}
              <div className="space-y-3">
                {branch.nodes.map((node) => {
                  const isNodeActive = activeNodeId === node.id;
                  const isExplored = !!exploredNodes[node.id];

                  return (
                    <div
                      key={node.id}
                      onClick={() => setActiveNodeId(prev => prev === node.id ? null : node.id)}
                      className={`bg-white rounded-lg border transition-all cursor-pointer p-3 select-none ${
                        isNodeActive 
                          ? `${colors.borderActive} shadow-md ring-2 ring-blue-100` 
                          : 'border-gray-200 hover:border-blue-300 shadow-2xs'
                      }`}
                    >
                      {/* Node Keyword & Badges */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-2 min-w-0">
                          <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${
                            isExplored ? 'bg-emerald-100 text-emerald-700' : colors.chip
                          }`}>
                            {isExplored ? <CheckCircle2 className="w-3.5 h-3.5" /> : '?'}
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                            {node.keyword}
                          </span>
                        </div>

                        {node.keywordEn && (
                          <span className="text-[10px] text-gray-400 font-mono hidden sm:inline shrink-0">
                            {node.keywordEn}
                          </span>
                        )}
                      </div>

                      {/* Always show the core inquiry question (brief, curiosity-provoking) */}
                      <div className="mt-2 text-xs text-gray-700 leading-relaxed flex items-start space-x-1.5 font-medium">
                        <HelpCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${colors.accent}`} />
                        <span>{node.question}</span>
                      </div>

                      {/* Expanded Spark Clue & Interaction (Revealed when clicked or active) */}
                      {isNodeActive ? (
                        <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-2 animate-in fade-in duration-150">
                          <div className="bg-amber-50/70 border border-amber-200/80 rounded-md p-2 text-[11px] text-amber-900 leading-snug flex items-start space-x-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-semibold text-amber-950">탐구 힌트: </strong>
                              <span>{node.hint}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            {node.conceptPage && onNavigateToEvidence && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNavigateToEvidence(node.conceptPage || 429);
                                }}
                                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>교재 p.{node.conceptPage}에서 단서 찾기</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={(e) => toggleNodeExplored(node.id, e)}
                              className={`ml-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer flex items-center space-x-1 ${
                                isExplored
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              <span>{isExplored ? '✓ 탐구 완료' : '궁금해요! 🤔'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-gray-400">
                          <span>클릭하여 탐구 힌트 확인</span>
                          <span className="font-mono text-blue-500">자세히 보기 ➔</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-[11px] text-gray-500 pt-1">
        💡 <em>마인드 맵은 모든 답을 주지 않고 호기심과 질문의 뼈대를 제공합니다. 노드를 클릭해 질문을 확인하고 교재 본문에서 답을 직접 탐색해 보세요!</em>
      </div>
    </div>
  );

  return (
    <>
      {/* Primary Section Mind Map Card in Main View */}
      <div className="my-5 bg-gradient-to-r from-indigo-50/70 via-blue-50/50 to-white border border-indigo-200/80 rounded-xl p-4 shadow-2xs transition-all duration-200">
        {/* Header Banner */}
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
              className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white flex items-center justify-center font-bold shadow-xs shrink-0 cursor-pointer transition-all relative group/btn"
              title={isExpanded ? '마인드 맵 접기' : '마인드 맵 열기 (클릭 시 펼침)'}
              aria-label="마인드 맵 토글"
            >
              <Network className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-indigo-700 border border-indigo-200 flex items-center justify-center shadow-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-3 h-3" />
              </span>
            </button>
            <div>
              <h4 className="font-bold text-gray-900 text-sm flex items-center space-x-1.5 group-hover:text-indigo-700 transition-colors">
                <span>단원 구조 마인드 맵</span>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  키워드 구조 & 탐구 질문
                </span>
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                소단원의 전체 맥락을 한눈에 파악하고, 스스로 질문을 던지며 능동적으로 학습을 시작합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-indigo-100 animate-in fade-in duration-200">
            {renderMindMapContent(false)}
          </div>
        )}
      </div>

      {/* Fullscreen Mind Map Exploration Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-gray-900 text-base">
                  {section.titleKo} · 전체 구조 마인드 맵
                </h3>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto flex-1">
              {renderMindMapContent(true)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
