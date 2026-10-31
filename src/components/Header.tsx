import React from 'react';
import { ExternalLink, CheckCircle2, BookOpen, Layers, Award, User as UserIcon, CloudUpload, LogIn } from 'lucide-react';
import { ChapterSection } from '../types';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentSection: ChapterSection;
  completedSectionIds: string[];
  totalSections: number;
  activeTopTab: string;
  onSelectTopTab: (tab: string) => void;
  onOpenGlossary: (tab?: 'key-terms' | 'custom-words' | 'flashcards') => void;
  onOpenTrackSelect: () => void;
  customWordsCount: number;
  user: User | null;
  onOpenMyRecord: () => void;
  onGoogleSignIn: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  completedSectionIds,
  totalSections,
  activeTopTab,
  onSelectTopTab,
  onOpenGlossary,
  onOpenTrackSelect,
  customWordsCount,
  user,
  onOpenMyRecord,
  onGoogleSignIn
}) => {
  const completedCount = completedSectionIds.length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 text-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 h-14">
        {/* Left: Brand logo & Title identical to Google AI Studio style */}
        <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => onSelectTopTab('home')}>
          <div className="w-3.5 h-3.5 bg-blue-600 rounded-sm" />
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900 text-base tracking-tight">Everystudy with Josh</span>
            <span className="text-gray-500 text-sm font-medium hidden sm:inline">Chapter 18 지구의 대기</span>
          </div>
        </div>

        {/* Center / Right Nav Items */}
        <div className="flex items-center space-x-1 sm:space-x-3 text-gray-600">
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            <button
              onClick={() => onSelectTopTab('home')}
              className={`pb-1 text-sm transition-colors cursor-pointer ${
                activeTopTab === 'home' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'hover:text-gray-900'
              }`}
            >
              홈
            </button>
            <button
              onClick={() => onSelectTopTab('intro')}
              className={`pb-1 text-sm transition-colors cursor-pointer ${
                activeTopTab === 'intro' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'hover:text-gray-900'
              }`}
            >
              개요
            </button>
            <button
              onClick={() => onSelectTopTab('18A')}
              className={`pb-1 text-sm transition-colors cursor-pointer ${
                activeTopTab === '18A' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'hover:text-gray-900'
              }`}
            >
              18A 대기란?
            </button>
            <button
              onClick={() => onSelectTopTab('18B')}
              className={`pb-1 text-sm transition-colors cursor-pointer ${
                activeTopTab === '18B' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'hover:text-gray-900'
              }`}
            >
              18B 특별 구역
            </button>
            <button
              onClick={() => onSelectTopTab('18C')}
              className={`pb-1 text-sm transition-colors cursor-pointer ${
                activeTopTab === '18C' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'hover:text-gray-900'
              }`}
            >
              18C 대기 에너지
            </button>
            <button
              onClick={() => onOpenGlossary('key-terms')}
              className={`pb-1 text-sm transition-colors flex items-center space-x-1 cursor-pointer ${
                activeTopTab === 'glossary' ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : 'hover:text-gray-900'
              }`}
            >
              <span>용어 사전</span>
              {customWordsCount > 0 && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                  +{customWordsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectTopTab('review-30')}
              className="text-blue-600 font-medium hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>종합 30제</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Action Button: 트랙 선택 */}
          <button
            onClick={onOpenTrackSelect}
            className="hidden sm:inline-block px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded transition-colors cursor-pointer"
          >
            트랙 선택
          </button>

          {/* Progress Indicator */}
          <div className="hidden md:flex items-center space-x-2 pl-1">
            <div className="w-20 lg:w-28 bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 font-mono">
              {completedCount}/{totalSections}
            </span>
          </div>

          {/* Google User Login & My Learning Record Button */}
          <div className="pl-1 sm:pl-2 border-l border-gray-200 flex items-center space-x-2">
            {user ? (
              <button
                onClick={onOpenMyRecord}
                className={`flex items-center space-x-2 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  activeTopTab === 'my-record'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                }`}
                title="내 학습 기록 & Google Drive 동기화 보기"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full shrink-0"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {user.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                <span className="text-xs font-semibold max-w-[80px] sm:max-w-[120px] truncate">
                  {user.displayName || '내 학습기록'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Google Drive 연동됨" />
              </button>
            ) : (
              <button
                onClick={onGoogleSignIn}
                className="flex items-center space-x-1.5 px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg border border-gray-300 shadow-2xs transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>구글 로그인</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
