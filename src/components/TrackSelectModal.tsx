import React from 'react';
import { X, CheckCircle, BookOpen, Sparkles, Award } from 'lucide-react';

interface TrackSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: string;
  onSelectTrack: (trackId: string) => void;
}

export const TrackSelectModal: React.FC<TrackSelectModalProps> = ({
  isOpen,
  onClose,
  currentTrack,
  onSelectTrack
}) => {
  if (!isOpen) return null;

  const tracks = [
    {
      id: 'full',
      title: '정규 교과 완주 트랙 (Standard Full Track)',
      badge: '추천 코스',
      desc: '교재 1~24쪽(429~451p)의 모든 개념, 탐구 실습, 심화 칼럼 및 복습 문제를 순서대로 마스터합니다.',
      count: '총 25개 모듈'
    },
    {
      id: 'core',
      title: '핵심 물리·화학 개념 압축 트랙 (Core Science Track)',
      badge: '개념 완성',
      desc: '대기권 5대 층, 동질권/이질권, 오존층 광화학 반응, 복사·전도·대류 및 온실 효과를 집중 학습합니다.',
      count: '총 12개 모듈'
    },
    {
      id: 'exam',
      title: '시험 대비 & 문제 풀이 마스터 트랙 (Exam Prep Track)',
      badge: '성적 향상',
      desc: '18A/18B/18C 섹션별 복습 질문 및 총괄 30문항(True/False 포함)을 집중적으로 풀이합니다.',
      count: '총 54개 문항 풀이'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-gray-900 text-base">학습 트랙 선택 (Learning Tracks)</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {tracks.map((t) => {
            const isSelected = currentTrack === t.id;
            return (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTrack(t.id);
                  onClose();
                }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 text-sm">{t.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {t.badge}
                    </span>
                  </div>
                  {isSelected && <CheckCircle className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-2">{t.desc}</p>
                <div className="text-[11px] font-mono text-gray-400">{t.count}</div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
