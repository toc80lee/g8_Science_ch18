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
  Compass, 
  Share2,
  Play
} from 'lucide-react';

interface RelatedMediaSectionProps {
  section: ChapterSection;
}

export const RelatedMediaSection: React.FC<RelatedMediaSectionProps> = ({ section }) => {
  const mediaInfo = getMediaForSection(section.id);
  const [activeFilter, setActiveFilter] = useState<'all' | 'youtube' | 'agency'>('all');

  const filteredResources = mediaInfo.resources.filter((res) => {
    if (activeFilter === 'youtube') return res.type === 'youtube';
    if (activeFilter === 'agency') return res.type === 'agency' || res.type === 'blog';
    return true;
  });

  return (
    <div className="my-8 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-blue-100 p-5 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-200">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">
                아이를 위한 추천 영상 & 과학 탐구 자료실
              </h3>
              <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                EBS · NASA · 기상청
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              교재 원문 속 어려운 과학 개념을 친근한 영상과 검증된 과학 블로그로 시각화하여 배웁니다.
            </p>
          </div>
        </div>

        {/* Filter buttons */}
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
        {filteredResources.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
          >
            {/* Image Thumbnail with source badge */}
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Source Tag Badge */}
              <div className="absolute top-2.5 left-2.5">
                <span className={`px-2 py-1 rounded text-[11px] font-bold shadow-xs ${
                  item.type === 'youtube'
                    ? 'bg-red-600 text-white'
                    : 'bg-blue-600 text-white'
                }`}>
                  {item.sourceTag}
                </span>
              </div>

              {item.durationOrReadTime && (
                <div className="absolute bottom-2.5 right-2.5 bg-black/75 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                  {item.durationOrReadTime}
                </div>
              )}

              {item.type === 'youtube' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[11px] font-bold text-gray-500 mb-1">
                  {item.source}
                </div>
                <h4 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
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

              {/* Action Button */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
                  item.type === 'youtube'
                    ? 'bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200'
                }`}
              >
                <span>{item.type === 'youtube' ? 'YouTube에서 추천 영상 시청하기' : '관련 과학 백과·자료실 바로가기'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
