import React, { useState } from 'react';
import { ChapterSection } from '../types';
import { getMediaForSection, MediaResource } from '../data/relatedMediaData';
import { 
  Youtube, 
  ExternalLink, 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  Globe, 
  Play, 
  ChevronDown, 
  ChevronUp,
  X,
  Clock,
  Building2,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface RelatedMediaSectionProps {
  section: ChapterSection;
  embedded?: boolean;
}

export const RelatedMediaSection: React.FC<RelatedMediaSectionProps> = ({ 
  section,
  embedded = false 
}) => {
  const mediaInfo = getMediaForSection(section.id);
  const [activeFilter, setActiveFilter] = useState<'all' | 'youtube' | 'agency'>('all');
  // Initially collapsed so children can focus on textbook reading first
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // State to track which YouTube video is currently playing directly on screen
  const [activePlayingVideoId, setActivePlayingVideoId] = useState<string | null>(null);

  // State to track which encyclopedia/agency article is opened in the reading modal
  const [activeArticleModal, setActiveArticleModal] = useState<MediaResource | null>(null);

  const filteredResources = mediaInfo.resources.filter((res) => {
    if (activeFilter === 'youtube') return res.type === 'youtube';
    if (activeFilter === 'agency') return res.type === 'agency' || res.type === 'blog';
    return true;
  });

  const handleResourceCardClick = (item: MediaResource) => {
    if (item.type === 'youtube') {
      setActivePlayingVideoId(item.id);
    } else {
      setActiveArticleModal(item);
    }
  };

  return (
    <div className={embedded ? "space-y-4" : "my-5 bg-gradient-to-r from-red-50/70 via-rose-50/50 to-white border border-red-200/80 rounded-xl p-4 shadow-2xs transition-all duration-200"}>
      {/* Embedded Sub-header or Standalone Header Banner */}
      {embedded ? (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-red-100">
          <p className="text-xs sm:text-sm text-gray-700 font-medium">
            교재 원문 속 어려운 과학 개념을 친근한 영상과 검증된 과학 블로그로 시각화하여 배웁니다.
          </p>
          <span className="text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
            EBS · NASA · 기상청 ({mediaInfo.resources.length}개 자료)
          </span>
        </div>
      ) : (
        /* Standalone Header Banner */
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
              className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center font-bold shadow-xs shrink-0 cursor-pointer transition-all relative group/btn"
              title={isExpanded ? '추천 자료 접기' : '추천 자료 확인하기 (클릭 시 펼침)'}
              aria-label="추천 자료 토글"
            >
              <Youtube className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-red-700 border border-red-200 flex items-center justify-center shadow-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-3 h-3" />
              </span>
            </button>
            <div>
              <h4 className="font-bold text-gray-900 text-sm flex items-center space-x-1.5 group-hover:text-red-700 transition-colors">
                <span>추천 자료</span>
                <span className="text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  EBS · NASA · 기상청 ({mediaInfo.resources.length}개 자료)
                </span>
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                교재 원문 속 어려운 과학 개념을 친근한 영상과 검증된 과학 블로그로 시각화하여 배웁니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Content View */}
      {(isExpanded || embedded) && (
        <div className={embedded ? "space-y-4 animate-in fade-in duration-200" : "mt-4 pt-3.5 border-t border-red-100 animate-in fade-in duration-200"}>
          {/* Filter Sub-toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-gray-100">
            <div className="text-xs font-semibold text-gray-500">
              분류별 필터:
            </div>
            <div className="flex items-center space-x-1.5 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-white text-gray-900 shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                전체 보기 ({mediaInfo.resources.length})
              </button>
              <button
                onClick={() => setActiveFilter('youtube')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer ${
                  activeFilter === 'youtube'
                    ? 'bg-white text-red-600 shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Youtube className="w-3.5 h-3.5 text-red-600" />
                <span>유튜브 영상</span>
              </button>
              <button
                onClick={() => setActiveFilter('agency')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center space-x-1 cursor-pointer ${
                  activeFilter === 'agency'
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>과학 블로그·기관</span>
              </button>
            </div>
          </div>

          {/* 1. Kid-friendly concept analogy card */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200 rounded-xl p-4 sm:p-5 mb-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-amber-500 text-white shadow-xs shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    💡 3분 아이 눈높이 개념 비유
                  </span>
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                    {mediaInfo.conceptSummaryForKids.analogyTitle}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-sans">
                  {mediaInfo.conceptSummaryForKids.analogyText}
                </p>
                <div className="flex items-center space-x-1.5 pt-1 text-[11px] font-medium text-amber-900/80">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>신기한 과학 상식:</strong> {mediaInfo.conceptSummaryForKids.funFact}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Grid of Curated Educational Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {filteredResources.map((item) => {
              const isPlayingThisVideo = activePlayingVideoId === item.id;

              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Media Container: Plays embedded video or displays clickable thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-950">
                    {isPlayingThisVideo && item.youtubeVideoId ? (
                      /* Inline Active YouTube Player */
                      <div className="relative w-full h-full bg-black flex flex-col">
                        <div className="relative flex-1 w-full h-full">
                          <iframe
                            src={`https://www.youtube.com/embed/${item.youtubeVideoId}?autoplay=1&rel=0&playsinline=1`}
                            title={item.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                          {/* Stop/Close Player overlay button */}
                          <div className="absolute top-2 right-2 flex items-center space-x-1 z-20">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActivePlayingVideoId(null);
                              }}
                              className="bg-black/85 hover:bg-red-600 text-white text-xs px-2.5 py-1 rounded-md shadow-lg flex items-center space-x-1 cursor-pointer transition-colors backdrop-blur-xs border border-white/20"
                              title="영상 재생 멈추고 닫기"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>화면 닫기</span>
                            </button>
                          </div>
                        </div>
                        {/* Quick Direct Link Assist Bar in case browser blocks iframe */}
                        <div className="bg-gray-900/90 text-gray-200 text-[11px] px-2.5 py-1 flex items-center justify-between border-t border-gray-800 z-10 shrink-0">
                          <span className="text-gray-300 truncate">재생 오류 시 YouTube 직접 시청:</span>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-400 hover:text-red-300 font-bold flex items-center space-x-1 ml-2 shrink-0"
                          >
                            <span>YouTube로 열기</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      /* Clickable Thumbnail area */
                      <div 
                        onClick={() => handleResourceCardClick(item)}
                        className="relative w-full h-full cursor-pointer group/thumb"
                        title={item.type === 'youtube' ? '화면에서 바로 영상 재생하기' : '관련 과학 백과 본문 읽기'}
                      >
                        <img
                          src={item.thumbnailUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300 opacity-90 group-hover/thumb:opacity-100"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                        {/* Source Tag Badge */}
                        <div className="absolute top-2.5 left-2.5 z-10 flex items-center space-x-1.5">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold shadow-xs ${
                            item.type === 'youtube'
                              ? 'bg-red-600 text-white'
                              : 'bg-blue-600 text-white'
                          }`}>
                            {item.sourceTag}
                          </span>
                        </div>

                        {item.durationOrReadTime && (
                          <div className="absolute bottom-2.5 right-2.5 bg-black/80 text-white text-[11px] font-mono px-2 py-0.5 rounded z-10">
                            {item.durationOrReadTime}
                          </div>
                        )}

                        {/* Center Action overlay: Play button for YouTube, BookOpen for Encyclopedia */}
                        {item.type === 'youtube' ? (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1.5 z-10">
                            <div className="w-13 h-13 rounded-full bg-red-600 group-hover/thumb:bg-red-500 text-white flex items-center justify-center shadow-2xl group-hover/thumb:scale-110 transition-all border-2 border-white/40">
                              <Play className="w-6 h-6 ml-0.5 fill-current" />
                            </div>
                            <span className="text-[11px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs group-hover/thumb:bg-red-600/90 transition-colors">
                              화면에서 바로 재생 ▶
                            </span>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1.5 z-10">
                            <div className="w-13 h-13 rounded-full bg-blue-600 group-hover/thumb:bg-blue-500 text-white flex items-center justify-center shadow-2xl group-hover/thumb:scale-110 transition-all border-2 border-white/40">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <span className="text-[11px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs group-hover/thumb:bg-blue-600/90 transition-colors">
                              📖 과학 백과 본문 바로 읽기
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content Details */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] font-bold text-gray-500 mb-1 flex items-center justify-between">
                        <span>{item.source}</span>
                        {item.type === 'youtube' && (
                          <span className="text-[10px] text-red-600 font-semibold bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                            화면 내 즉시 시청 가능
                          </span>
                        )}
                        {item.type !== 'youtube' && (
                          <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                            학습 백과 본문 탑재
                          </span>
                        )}
                      </div>
                      <h4 
                        onClick={() => handleResourceCardClick(item)}
                        className="font-bold text-gray-900 text-sm leading-snug hover:text-blue-600 cursor-pointer transition-colors"
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Learning takeaways */}
                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 space-y-1.5">
                      <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wide flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>이 자료에서 배울 핵심 포인트</span>
                      </div>
                      <ul className="space-y-1">
                        {item.learningPoints.map((point, pIdx) => (
                          <li key={pIdx} className="text-[11px] text-gray-700 flex items-start space-x-1.5">
                            <span className="text-blue-500 font-bold">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-1">
                      {item.type === 'youtube' ? (
                        <div className="grid grid-cols-2 gap-2">
                          {/* 1. Play directly in screen */}
                          <button
                            type="button"
                            onClick={() => setActivePlayingVideoId(item.id)}
                            className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-2xs ${
                              isPlayingThisVideo
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            }`}
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>{isPlayingThisVideo ? '화면 재생 중' : '화면에서 재생'}</span>
                          </button>

                          {/* 2. Open directly in YouTube */}
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 bg-gray-900 hover:bg-black text-white transition-colors cursor-pointer shadow-2xs group/ytbtn"
                            title="유튜브 새 창에서 바로 시청하기"
                          >
                            <Youtube className="w-3.5 h-3.5 text-red-400 group-hover/ytbtn:text-red-300" />
                            <span className="truncate">YouTube에서 시청</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {/* 1. Read directly on screen */}
                          <button
                            type="button"
                            onClick={() => setActiveArticleModal(item)}
                            className="py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer shadow-xs"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>본문 바로 읽기</span>
                          </button>

                          {/* 2. Link to official agency */}
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer shadow-2xs"
                            title="기상청/공식 기관 웹사이트 새 창으로 열기"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <span className="truncate">공식 기관 바로가기</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom collapse button for easy access */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
            <button
              onClick={() => setIsExpanded(false)}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              <ChevronUp className="w-4 h-4" />
              <span>추천 영상 & 자료실 접고 교재로 돌아가기</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Educational Science Encyclopedia Reader Modal */}
      {activeArticleModal && activeArticleModal.articleContent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveArticleModal(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-start justify-between gap-3 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="bg-white/20 text-white px-2 py-0.5 rounded font-bold backdrop-blur-xs">
                    {activeArticleModal.articleContent.badgeText}
                  </span>
                  <span className="text-blue-100 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>읽는 시간 약 {activeArticleModal.articleContent.readingTimeMinutes}분</span>
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {activeArticleModal.articleContent.title}
                </h3>
                <p className="text-xs text-blue-100/90 leading-relaxed font-sans">
                  {activeArticleModal.articleContent.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Article Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-gray-800 text-sm leading-relaxed font-sans">
              {/* Institution Attribution Banner */}
              <div className="flex items-center space-x-2 text-xs font-semibold text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>제공 기관: {activeArticleModal.articleContent.institution}</span>
              </div>

              {/* Article Sections */}
              {activeArticleModal.articleContent.sections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-2 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0">
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base flex items-center space-x-1.5 text-blue-900">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full inline-block mr-1"></span>
                    <span>{sec.heading}</span>
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-sm pl-3">
                    {sec.body}
                  </p>
                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <div className="mt-2.5 ml-3 bg-blue-50/60 border border-blue-100 rounded-lg p-3 space-y-1.5">
                      {sec.bulletPoints.map((bp, bpIdx) => (
                        <div key={bpIdx} className="flex items-start space-x-2 text-xs text-blue-950 font-medium">
                          <span className="text-blue-600 font-bold">✔</span>
                          <span>{bp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Kid's Curious Question & Answer */}
              {activeArticleModal.articleContent.kidQuestion && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>💡 아이들이 가장 궁금해하는 과학 질문!</span>
                  </div>
                  <div className="text-xs font-bold text-gray-900 pl-1">
                    Q. {activeArticleModal.articleContent.kidQuestion.question}
                  </div>
                  <div className="text-xs text-amber-950 bg-white/70 p-2.5 rounded-lg border border-amber-100 leading-relaxed">
                    <strong>A.</strong> {activeArticleModal.articleContent.kidQuestion.answer}
                  </div>
                </div>
              )}

              {/* Key Takeaway Box */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-emerald-900">핵심 정리 (Takeaway)</div>
                  <div className="text-emerald-950 leading-relaxed">
                    {activeArticleModal.articleContent.keyTakeaway}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <a
                href={activeArticleModal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{activeArticleModal.sourceTag} 공식 원문 웹사이트 방문</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                확인 후 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
