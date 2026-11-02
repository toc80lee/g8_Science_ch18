import React, { useState, useRef } from 'react';
import { User } from 'firebase/auth';
import { ChapterSection, CustomWord, VoiceJournalEntry } from '../types';
import { LearningHistoryData, DriveFileInfo, APP_DRIVE_FOLDER_NAME } from '../services/googleDriveService';
import { loadAllVoiceJournals } from '../services/voiceJournalService';
import { 
  User as UserIcon, 
  CloudUpload, 
  CloudDownload, 
  ExternalLink, 
  BookOpen, 
  Bookmark, 
  Clock, 
  ArrowLeft, 
  FolderCheck, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Mic, 
  Play, 
  Pause, 
  Download, 
  Upload, 
  CheckCircle2, 
  KeyRound, 
  HelpCircle,
  Laptop
} from 'lucide-react';

interface MyLearningRecordViewProps {
  user: User | null;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  onStartLocalProfile?: (name: string) => void;
  onExportBackup?: () => void;
  onImportBackup?: (file: File) => void;
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
  onStartLocalProfile,
  onExportBackup,
  onImportBackup,
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

  // Load recorded voice journals
  const [voiceJournals] = useState<Record<string, VoiceJournalEntry>>(() => loadAllVoiceJournals());
  const journalList = Object.values(voiceJournals).sort((a, b) => b.recordedAt - a.recordedAt);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Quick student name input
  const [inputStudentName, setInputStudentName] = useState('Josh');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTogglePlayAudio = (id: string, audioUrl?: string) => {
    if (!audioUrl) return;
    if (playingAudioId === id) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play().then(() => {
          setPlayingAudioId(id);
        }).catch(err => {
          console.warn('Audio play failed:', err);
          setPlayingAudioId(null);
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportBackup) {
      onImportBackup(file);
    }
    // reset input
    if (e.target) e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Hidden audio element for journal playback */}
      <audio
        ref={audioRef}
        onEnded={() => setPlayingAudioId(null)}
        className="hidden"
      />

      {/* Hidden file input for JSON import */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Breadcrumb banner */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-xl px-4 py-2.5 text-xs text-blue-700 font-medium flex items-center justify-between">
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
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-xs">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || '학'}
                </div>
              )}
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {user.displayName || '학생'}
                  </h2>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                    user.isAnonymous 
                      ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                  }`}>
                    <ShieldCheck className={`w-3.5 h-3.5 ${user.isAnonymous ? 'text-amber-600' : 'text-emerald-600'}`} />
                    <span>{user.isAnonymous ? '로컬 학생 프로필 (기기에 자동 저장 중)' : 'Google 계정 로그인 됨'}</span>
                  </span>
                  {user.isAnonymous && (
                    <button
                      onClick={onGoogleSignIn}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                    >
                      구글 계정 연동
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{user.email}</p>
                <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>최근 동기화: {history.lastSyncedAt ? new Date(history.lastSyncedAt).toLocaleString('ko-KR') : '아직 Drive 동기화 전 (브라우저에 보관됨)'}</span>
                </div>
              </div>
            </div>

            {/* Actions: Sync & Load & Backup & Signout */}
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

              {onExportBackup && (
                <button
                  onClick={onExportBackup}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                  title="학습 이력 파일 백업 (.json)"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>백업 저장</span>
                </button>
              )}

              <button
                onClick={onGoogleSignOut}
                className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="프로필 종료 및 로그아웃"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* When NOT signed in: Comprehensive Options for Instant Study & Google Sync */
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <UserIcon className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-xl">
                나만의 학습 이력 관리 & 계정 시작
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                학생의 <strong>단원 진도, 퀴즈 채점 결과, 나만의 용어 사전, 본문 형광펜, 학습 정리 블로그</strong>가 안전하게 보관됩니다. 원하시는 방식으로 바로 시작하세요!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {/* Option 1: Quick Student Profile (Guaranteed 100% Works Locally) */}
              <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/30 border-2 border-emerald-300 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <Laptop className="w-3.5 h-3.5" />
                      <span>추천 · 즉시 이용 가능</span>
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">로그인 차단 없음</span>
                  </div>
                  <h4 className="font-bold text-base text-gray-900">간편 학생 이름으로 바로 시작</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    구글 로그인 승인 대기나 도메인 설정 없이도, 이름만 입력하면 즉시 개인 학습실이 활성화되며 모든 학습 기록이 이 기기 브라우저에 안전하게 자동 저장됩니다.
                  </p>

                  <div className="mt-4">
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      학생 이름 또는 닉네임:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inputStudentName}
                        onChange={(e) => setInputStudentName(e.target.value)}
                        placeholder="예: Josh, 서진, 민우"
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && onStartLocalProfile) {
                            onStartLocalProfile(inputStudentName.trim() || '학습자 (Josh)');
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (onStartLocalProfile) {
                            onStartLocalProfile(inputStudentName.trim() || '학습자 (Josh)');
                          }
                        }}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
                      >
                        시작하기 →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-emerald-700 mt-4 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>단어장, 형광펜, 오답노트, 블로그 요약 모두 100% 저장됨</span>
                </div>
              </div>

              {/* Option 2: Google Account Login for Cloud & Drive Sync */}
              <div className="bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/30 border border-blue-200 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center space-x-1 text-xs font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full">
                      <CloudUpload className="w-3.5 h-3.5" />
                      <span>클라우드 동기화</span>
                    </span>
                    <span className="text-[11px] text-blue-600 font-semibold">Google Drive</span>
                  </div>
                  <h4 className="font-bold text-base text-gray-900">Google 계정으로 로그인</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Google 계정으로 로그인하여 내 개인 Google Drive에 백업 폴더를 생성하고 다른 기기(태블릿, 모바일)와 학습 진도를 실시간으로 동기화합니다.
                  </p>

                  {/* Official Styled Sign in with Google Button */}
                  <div className="pt-4 flex justify-center">
                    <button
                      onClick={onGoogleSignIn}
                      disabled={isLoggingIn}
                      className="w-full flex items-center justify-center space-x-3 px-4 py-2.5 bg-white border border-gray-300 hover:border-blue-400 hover:shadow-xs rounded-lg transition-all cursor-pointer font-medium text-xs sm:text-sm text-gray-700"
                    >
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                      </svg>
                      <span>{isLoggingIn ? 'Google 로그인 연결 중...' : 'Sign in with Google (구글 로그인)'}</span>
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 mt-4 leading-snug">
                  * Vercel 배포 도메인은 Firebase 승인 도메인 등록 후 원활히 작동합니다.
                </div>
              </div>
            </div>

            {/* Offline JSON Backup & Restore Actions */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-gray-700">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">파일 직접 백업/복원:</span>
                <span className="text-gray-500">인터넷 연결이나 로그인 없이도 언제든 JSON 파일로 내보내고 불러올 수 있습니다.</span>
              </div>
              <div className="flex items-center space-x-2">
                {onExportBackup && (
                  <button
                    onClick={onExportBackup}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 text-xs font-semibold text-gray-700 rounded-lg shadow-2xs cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>백업 파일(.json) 다운로드</span>
                  </button>
                )}
                {onImportBackup && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 text-xs font-semibold text-gray-700 rounded-lg shadow-2xs cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>백업 파일 불러오기</span>
                  </button>
                )}
              </div>
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

      {/* Overview Statistics Cards (Visible anytime so student sees their actual work) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <div className="text-xs text-gray-500 font-medium mb-1">단원 완료율</div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-blue-600">{progressPercent}%</span>
            <span className="text-xs text-gray-400">({completedCount} / {sections.length})</span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-2xs">
          <div className="text-xs text-amber-800 font-medium mb-1 flex items-center space-x-1">
            <Mic className="w-3.5 h-3.5 text-amber-600" />
            <span>음성 학습 일기</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-amber-700">{journalList.length}</span>
            <span className="text-xs text-gray-400">개 섹션 녹음</span>
          </div>
          <p className="text-[11px] text-amber-700 mt-2">
            AI 성취도 평균: <strong className="text-amber-900">{journalList.length > 0 ? Math.round(journalList.reduce((acc, j) => acc + j.feedback.score, 0) / journalList.length) : 0}점</strong>
          </p>
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

      {/* Voice Learning Records Showcase */}
      {journalList.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50/70 via-yellow-50/40 to-white border border-amber-300 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-amber-200">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-2xs">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center space-x-2">
                  <span>스스로 말하는 음성 학습 일기 모음</span>
                  <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                    총 {journalList.length}개 기록됨
                  </span>
                </h3>
                <p className="text-xs text-gray-500">
                  아이가 각 섹션을 읽고 스스로 정리하여 녹음한 음성과 AI 선생님의 진단 피드백입니다.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5">
            {journalList.map((j) => (
              <div key={j.id} className="bg-white rounded-xl border border-amber-200 p-4 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center">
                      🎙️
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 hover:text-amber-700 cursor-pointer" onClick={() => onGoToSection(j.sectionId)}>
                        {j.sectionTitleKo}
                      </h4>
                      <div className="text-[11px] text-gray-400 flex items-center space-x-2 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(j.recordedAt).toLocaleString('ko-KR')}</span>
                        <span>·</span>
                        <span>녹음 시간: {j.durationSeconds}초</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
                      {j.feedback.levelLabel} ({j.feedback.score}점)
                    </span>

                    {j.audioDataUrl && (
                      <button
                        onClick={() => handleTogglePlayAudio(j.id, j.audioDataUrl)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-2xs cursor-pointer transition-colors"
                      >
                        {playingAudioId === j.id ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current" />
                            <span>정지</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>녹음 듣기</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => onGoToSection(j.sectionId)}
                      className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200 cursor-pointer"
                    >
                      해당 단원 이동 →
                    </button>
                  </div>
                </div>

                {/* Transcript snippet */}
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs text-gray-800 leading-relaxed font-sans">
                  <span className="font-bold text-gray-500 block mb-0.5">📝 아이가 말한 내용:</span>
                  <p className="line-clamp-2 italic">"{j.transcript}"</p>
                </div>

                {/* AI Teacher summary */}
                <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-100 text-xs text-amber-950 flex items-start space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 mr-1.5">선생님 피드백:</span>
                    <span>{j.feedback.summary}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
