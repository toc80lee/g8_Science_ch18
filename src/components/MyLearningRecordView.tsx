import React from 'react';
import { User } from 'firebase/auth';
import { ChapterSection, CustomWord } from '../types';
import { LearningHistoryData, DriveFileInfo, APP_DRIVE_FOLDER_NAME } from '../services/googleDriveService';
import { 
  User as UserIcon, 
  CloudUpload, 
  CloudDownload, 
  ExternalLink, 
  CheckCircle2, 
  BookOpen, 
  Bookmark, 
  Clock, 
  ArrowLeft, 
  FolderCheck, 
  FileText, 
  Calendar,
  LogOut,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface MyLearningRecordViewProps {
  user: User | null;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  isLoggingIn: boolean;
  history: LearningHistoryData;
  customWords: CustomWord[];
  sections: ChapterSection[];
  folderId: string | null;
  driveFiles: DriveFileInfo[];
  onOpenSyncModal: () => void;
  onLoadFromDrive: () => void;
  isLoadingFromDrive: boolean;
  onBackToStudy: () => void;
  onGoToSection: (sectionId: string) => void;
}

export const MyLearningRecordView: React.FC<MyLearningRecordViewProps> = ({
  user,
  onGoogleSignIn,
  onGoogleSignOut,
  isLoggingIn,
  history,
  customWords,
  sections,
  folderId,
  driveFiles,
  onOpenSyncModal,
  onLoadFromDrive,
  isLoadingFromDrive,
  onBackToStudy,
  onGoToSection
}) => {
  const completedCount = history.completedSectionIds.length;
  const progressPercent = Math.round((completedCount / sections.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb banner */}
      <div className="bg-blue-50/70 border border-blue-100 rounded px-4 py-2.5 text-xs text-blue-700 font-medium flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <UserIcon className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold">개인 학습 센터</span>
          <span className="text-blue-300">·</span>
          <span>내 학습 이력 & Google Drive 동기화</span>
        </div>
        <button
          onClick={onBackToStudy}
          className="text-xs text-blue-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>교재 본문으로 돌아가기</span>
        </button>
      </div>

      {/* Account & Google Drive Status Hero Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        {user ? (
          <div className="flex flex-wrap items-center justify-between gap-5">
            {/* User Profile Info */}
            <div className="flex items-center space-x-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-14 h-14 rounded-full border-2 border-blue-600 shadow-xs"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {user.displayName || '학생'}
                  </h2>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                    user.isAnonymous 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <ShieldCheck className={`w-3 h-3 ${user.isAnonymous ? 'text-amber-600' : 'text-emerald-600'}`} />
                    <span>{user.isAnonymous ? '게스트 모드 (기기 로컬 저장)' : 'Google 로그인 됨'}</span>
                  </span>
                  {user.isAnonymous && (
                    <button
                      onClick={onGoogleSignIn}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline"
                    >
                      구글 계정 연동
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{user.email}</p>
                <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>최근 동기화: {history.lastSyncedAt ? new Date(history.lastSyncedAt).toLocaleString('ko-KR') : '아직 동기화되지 않음'}</span>
                </div>
              </div>
            </div>

            {/* Actions: Sync & Load & Signout */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenSyncModal}
                className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <CloudUpload className="w-4 h-4" />
                <span>Google Drive에 동기화</span>
              </button>

              <button
                onClick={onLoadFromDrive}
                disabled={isLoadingFromDrive}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <CloudDownload className="w-4 h-4 text-gray-600" />
                <span>{isLoadingFromDrive ? '불러오는 중...' : 'Drive에서 복원'}</span>
              </button>

              <button
                onClick={onGoogleSignOut}
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* When NOT signed in: Sign In Prompt with official Google Button */
          <div className="text-center py-8 space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">
                구글 계정으로 로그인하여 학습을 시작하세요
              </h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                아이의 학습 진도, 퀴즈 점수, 직접 만든 나만의 용어 사전이
                개인 Google Drive에 안전하게 저장되어 친구들과 공유하거나 다른 기기에서도 언제든 이어볼 수 있습니다.
              </p>
            </div>

            {/* Official Styled Sign in with Google Button per skill guidelines */}
            <div className="flex justify-center pt-2">
              <button
                onClick={onGoogleSignIn}
                disabled={isLoggingIn}
                className="flex items-center space-x-3 px-5 py-2.5 bg-white border border-gray-300 hover:border-gray-400 rounded-lg shadow-xs hover:shadow-sm transition-all cursor-pointer font-medium text-xs sm:text-sm text-gray-700"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>{isLoggingIn ? 'Google 로그인 중...' : 'Sign in with Google (구글로 로그인)'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Google Drive Folder & Synced Files Card */}
      {user && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center space-x-2.5">
              <FolderCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                  Google Drive 전용 학습 폴더: <span className="text-blue-600 font-mono">{APP_DRIVE_FOLDER_NAME}</span>
                </h3>
                <p className="text-xs text-gray-500">
                  사용자의 개인 Google Drive 내에 전용 폴더가 생성되어 학습 파일들이 보관됩니다.
                </p>
              </div>
            </div>

            {folderId && (
              <a
                href={`https://drive.google.com/drive/folders/${folderId}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <span>Google Drive에서 폴더 열기</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Drive files list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40">
              <div className="flex items-center space-x-2 text-blue-700 font-semibold text-xs mb-1">
                <FileText className="w-4 h-4" />
                <span>learning_history.json</span>
              </div>
              <p className="text-[11px] text-gray-600">완료한 단원, 방문 이력, 퀴즈 채점 데이터</p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
              <div className="flex items-center space-x-2 text-amber-800 font-semibold text-xs mb-1">
                <Bookmark className="w-4 h-4" />
                <span>custom_vocabulary.json</span>
              </div>
              <p className="text-[11px] text-gray-600">본문에서 스크랩한 나만의 용어 사전 ({customWords.length}개)</p>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center space-x-2 text-emerald-800 font-semibold text-xs mb-1">
                <FileText className="w-4 h-4" />
                <span>learning_report.txt</span>
              </div>
              <p className="text-[11px] text-gray-600">부모님과 공유할 수 있는 텍스트 학습 성적표</p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-xs text-gray-500 font-medium mb-1">단원 완료율</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-blue-600">{progressPercent}%</span>
            <span className="text-xs text-gray-400">({completedCount} / {sections.length} 완료)</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-xs text-gray-500 font-medium mb-1">나만의 용어 사전</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-amber-600">{customWords.length}</span>
            <span className="text-xs text-gray-400">개 단어 스크랩</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            암기 완료: <strong className="text-emerald-700">{customWords.filter(w => w.isMemorized).length}개</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-xs text-gray-500 font-medium mb-1">방문한 섹션 수</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-purple-600">
              {Object.keys(history.visitHistory).length}
            </span>
            <span className="text-xs text-gray-400">개 섹션 학습</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            자주 복습하며 개념을 다지고 있습니다.
          </p>
        </div>
      </div>

      {/* Section Study History Table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>단원별 학습 이력 및 완료 상태</span>
        </h3>

        <div className="divide-y divide-gray-100">
          {sections.map((sec, idx) => {
            const isDone = history.completedSectionIds.includes(sec.id);
            const visitInfo = history.visitHistory[sec.id];

            return (
              <div
                key={sec.id}
                className="py-3 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3 truncate">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isDone ? '✓' : idx + 1}
                  </span>
                  <div className="truncate">
                    <button
                      onClick={() => onGoToSection(sec.id)}
                      className="text-xs sm:text-sm font-semibold text-gray-800 hover:text-blue-600 truncate text-left cursor-pointer"
                    >
                      {sec.titleKo}
                    </button>
                    <div className="text-[11px] text-gray-400">
                      {visitInfo
                        ? `마지막 학습: ${new Date(visitInfo.lastVisitedAt).toLocaleDateString('ko-KR')} (총 ${visitInfo.count}회 방문)`
                        : '아직 학습하지 않음'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    isDone ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isDone ? '완료' : '학습중'}
                  </span>
                  <button
                    onClick={() => onGoToSection(sec.id)}
                    className="text-xs text-blue-600 hover:underline px-2 py-1 font-medium cursor-pointer"
                  >
                    이동
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
