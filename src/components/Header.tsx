import React from 'react';
import { ExternalLink, CheckCircle2, BookOpen, Layers, Award, User as UserIcon, CloudUpload, LogIn, UserPlus, PanelLeft, PanelLeftClose } from 'lucide-react';
import { ChapterSection } from '../types';

interface HeaderProps {
  currentSection: ChapterSection;
  completedSectionIds: string[];
  totalSections: number;
  activeTopTab: string;
  onSelectTopTab: (tab: string) => void;
  onOpenGlossary: (tab?: 'key-terms' | 'custom-words' | 'flashcards') => void;
  onOpenTrackSelect: () => void;
  customWordsCount: number;
  user: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null; role?: string } | null;
  onOpenMyRecord: () => void;
  onOpenAuthModal: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
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
  onOpenAuthModal,
  isSidebarOpen = true,
  onToggleSidebar,
}) => {
  const completedCount = completedSectionIds.length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 text-sm">
      <div className="flex items-center justify-between px-2 sm:px-4 h-14">
        {/* Left: Sidebar Toggle + Brand logo & Title */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className={`p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer flex items-center space-x-1 ${
                isSidebarOpen
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title={isSidebarOpen ? "목차 접기 (학습 집중 모드)" : "목차 펼치기"}
              aria-label="목차 토글"
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-4 h-4 shrink-0" />
              ) : (
                <PanelLeft className="w-4 h-4 shrink-0" />
              )}
            </button>
          )}

          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer shrink-0 pl-1" onClick={() => onSelectTopTab('home')}>
            <div className="w-3.5 h-3.5 bg-blue-600 rounded-sm" />
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-bold text-gray-900 text-sm sm:text-base tracking-tight">Everystudy with Josh</span>
              <span className="text-gray-500 text-xs sm:text-sm font-medium hidden md:inline">18 지구의 대기</span>
            </div>
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
                activeTopTab === '18A' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'hover:text-gray-900'
              }`}
            >
              18A
            </button>
            <button
              onClick={() => onSelectTopTab('18B')}
              className={`pb-1 text-sm transition-colors cursor-pointer ${
                activeTopTab === '18B' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'hover:text-gray-900'
              }`}
            >
              18B
            </button>
            <button
              onClick={() => onSelectTopTab('18C')}
              className={`pb-1 text-sm transition-colors cursor-pointer ${
                activeTopTab === '18C' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : 'hover:text-gray-900'
              }`}
            >
              18C
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

          {/* Member Login & My Learning Record Button */}
          <div className="pl-1 sm:pl-2 border-l border-gray-200 flex items-center space-x-2">
            {user ? (
              <button
                onClick={onOpenMyRecord}
                className={`flex items-center space-x-2 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                  activeTopTab === 'my-record'
                    ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800'
                }`}
                title="내 회원 정보 & 학습 이력 보기"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {user.displayName?.charAt(0) || '회'}
                </div>
                <span className="text-xs font-semibold max-w-[80px] sm:max-w-[120px] truncate">
                  {user.displayName || '회원'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Firebase 클라우드 실시간 연동 중" />
              </button>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={onOpenMyRecord}
                  className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="내 학습 기록 보기"
                >
                  학습 이력
                </button>
                <button
                  onClick={onOpenAuthModal}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 shrink-0" />
                  <span>회원가입 / 로그인</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
