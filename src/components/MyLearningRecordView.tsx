import React, { useState, useRef } from 'react';
import { ChapterSection, CustomWord, VoiceJournalEntry } from '../types';
import { LearningHistoryData } from '../services/googleDriveService';
import { loadAllVoiceJournals } from '../services/voiceJournalService';
import { 
  User as UserIcon, 
  CloudUpload, 
  BookOpen, 
  Bookmark, 
  Clock, 
  ArrowLeft, 
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
  UserPlus,
  LogIn,
  GraduationCap
} from 'lucide-react';

interface MyLearningRecordViewProps {
  user: { uid: string; displayName?: string | null; email?: string | null; role?: string; schoolGrade?: string } | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  onExportBackup?: () => void;
  onImportBackup?: (file: File) => void;
  onManualSyncToFirebase?: () => void;
  isSyncingToFirebase?: boolean;
  history: LearningHistoryData;
  customWords: CustomWord[];
  sections: ChapterSection[];
  onBackToStudy: () => void;
  onGoToSection: (sectionId: string) => void;
}

export const MyLearningRecordView: React.FC<MyLearningRecordViewProps> = ({
  user,
  onOpenAuthModal,
  onSignOut,
  onExportBackup,
  onImportBackup,
  onManualSyncToFirebase,
  isSyncingToFirebase = false,
  history,
  customWords,
  sections,
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
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span className="font-semibold">회원 개인 학습 센터</span>
          <span className="text-blue-300">·</span>
          <span>내 학습 이력 & Firebase 실시간 관리</span>
        </div>
        <button
          onClick={onBackToStudy}
          className="text-xs text-blue-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>교재 본문으로 돌아가기</span>
        </button>
      </div>

      {/* Account Status Hero Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        {user ? (
          <div className="flex flex-wrap items-center justify-between gap-5">
            {/* User Profile Info */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || '회'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {user.displayName || '회원'}
                  </h2>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Firebase 회원 계정 연동됨</span>
                  </span>
                  {user.role && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                      {user.role === 'student' ? '학생' : user.role === 'parent' ? '학부모' : '선생님'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{user.email || user.uid}</p>
                <div className="flex items-center space-x-2 text-[11px] text-gray-400 mt-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    최근 클라우드 저장: {history.lastSyncedAt ? new Date(history.lastSyncedAt).toLocaleString('ko-KR') : '실시간 자동 동기화 활성화됨'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: Sync & Backup & Signout */}
            <div className="flex flex-wrap items-center gap-2">
              {onManualSyncToFirebase && (
                <button
                  onClick={onManualSyncToFirebase}
                  disabled={isSyncingToFirebase}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <CloudUpload className="w-4 h-4" />
                  <span>{isSyncingToFirebase ? 'Firebase 저장 중...' : '지금 클라우드에 저장'}</span>
                </button>
              )}

              {onExportBackup && (
                <button
                  onClick={onExportBackup}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                  title="학습 이력 파일 백업 (.json)"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>백업 다운로드</span>
                </button>
              )}

              <button
                onClick={onSignOut}
                className="flex items-center space-x-1 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-gray-200 transition-colors cursor-pointer"
                title="로그아웃"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        ) : (
          /* When NOT signed in */
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-gray-900 text-xl">
                회원 가입하고 나만의 학습 이력을 안전하게 관리하세요
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                회원으로 등록하시면 <strong>교재 완독 진도, 퀴즈 채점 결과, 나만의 용어 사전, 본문 형광펜 밑줄, 학습 정리</strong>가 Firebase에 안전하게 보관되어 언제든 이어서 공부할 수 있습니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenAuthModal}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>회원가입 / 로그인하기</span>
              </button>
            </div>

            {/* Offline JSON Backup & Restore Actions */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-w-2xl mx-auto flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2 text-xs text-gray-700">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-semibold">파일 직접 백업/복원:</span>
                <span className="text-gray-500">JSON 파일로 내보내거나 불러올 수 있습니다.</span>
              </div>
              <div className="flex items-center space-x-2">
                {onExportBackup && (
                  <button
                    onClick={onExportBackup}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 text-xs font-semibold text-gray-700 rounded-lg shadow-2xs cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>내보내기</span>
                  </button>
                )}
                {onImportBackup && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 text-xs font-semibold text-gray-700 rounded-lg shadow-2xs cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>불러오기</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Completion */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-1">
              <span>단원 완료율</span>
              <BookOpen className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">{progressPercent}%</span>
              <span className="text-xs text-gray-400">({completedCount} / {sections.length})</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-3">
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stat 2: Voice Journals */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-1">
              <span>음성 학습 일기</span>
              <Mic className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">{journalList.length}</span>
              <span className="text-xs text-gray-400">개 섹션 녹음</span>
            </div>
          </div>
          <div className="text-[11px] text-gray-400 mt-3">
            AI 성취도 평균: {journalList.length > 0 ? `${Math.round(journalList.reduce((acc, curr) => acc + curr.feedback.score, 0) / journalList.length)}점` : '0점'}
          </div>
        </div>

        {/* Stat 3: Custom Vocabulary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-1">
              <span>나만의 용어 사전</span>
              <Bookmark className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{customWords.length}</span>
              <span className="text-xs text-gray-400">개 단어 스크랩</span>
            </div>
          </div>
          <div className="text-[11px] text-gray-400 mt-3">
            암기 완료: {customWords.filter(w => w.isMemorized).length}개
          </div>
        </div>

        {/* Stat 4: Visited Sections */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium mb-1">
              <span>방문한 섹션 수</span>
              <Clock className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-600">{Object.keys(history.visitHistory).length}</span>
              <span className="text-xs text-gray-400">개 섹션 학습</span>
            </div>
          </div>
          <div className="text-[11px] text-gray-400 mt-3">
            자주 복습하며 개념을 다지고 있습니다.
          </div>
        </div>
      </div>

      {/* Voice Journal Recorded List */}
      {journalList.length > 0 && (
        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm sm:text-base">스스로 말하는 음성 학습 일기 모음</h3>
                <p className="text-xs text-gray-500">아이가 각 섹션을 읽고 스스로 정리하여 녹음한 음성과 AI 선생님의 진단 피드백입니다.</p>
              </div>
            </div>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              총 {journalList.length}개 기록됨
            </span>
          </div>

          <div className="space-y-3">
            {journalList.map((journal) => {
              const isPlaying = playingAudioId === journal.id;
              const hasAudio = !!journal.audioDataUrl;
              return (
                <div key={journal.id} className="bg-white border border-amber-200/80 rounded-xl p-4 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-gray-900">{journal.sectionTitleKo}</span>
                      <span className="text-[11px] text-gray-400">· {new Date(journal.recordedAt).toLocaleString('ko-KR')}</span>
                      <span className="text-[11px] text-gray-400">· 녹음 시간: {journal.durationSeconds}초</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        journal.feedback.score >= 80 ? 'bg-emerald-100 text-emerald-800' :
                        journal.feedback.score >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {journal.feedback.levelLabel} ({journal.feedback.score}점)
                      </span>

                      {hasAudio && (
                        <button
                          onClick={() => handleTogglePlayAudio(journal.id, journal.audioDataUrl)}
                          className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                            isPlaying
                              ? 'bg-amber-600 text-white'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isPlaying ? '일시정지' : '녹음 듣기'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => onGoToSection(journal.sectionId)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                      >
                        해당 단원 이동 →
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-gray-700 mb-2.5">
                    <span className="font-bold text-gray-500 block mb-0.5">🗣️ 아이가 말한 내용:</span>
                    <p className="italic">"{journal.transcript}"</p>
                  </div>

                  <div className="text-xs text-amber-900 bg-amber-50/60 rounded-lg p-2.5 flex items-start space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-800">선생님 피드백: </span>
                      <span>{journal.feedback.summary}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section Completion & Review Questions Record Grid */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900 text-base">단원별 학습 및 퀴즈 완료 현황</h3>
          </div>
          <span className="text-xs text-gray-500">클릭하여 해당 섹션으로 이동할 수 있습니다.</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sections.map((section) => {
            const isCompleted = history.completedSectionIds.includes(section.id);
            const visitData = history.visitHistory[section.id];
            const quizScore = history.quizScores[section.id];
            const hasQuiz = section.questions && section.questions.length > 0;

            return (
              <div
                key={section.id}
                onClick={() => onGoToSection(section.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-blue-50/40 border-blue-200 hover:border-blue-400'
                    : 'bg-gray-50/50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-blue-600 bg-blue-100/60 px-2 py-0.5 rounded">
                      {section.numberBadge}
                    </span>
                    {isCompleted ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>완독</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-gray-400">학습 전</span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{section.titleKo}</h4>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{section.titleEn}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                  <span>방문: {visitData ? `${visitData.count}회` : '0회'}</span>
                  {hasQuiz && (
                    <span className={`font-semibold ${quizScore ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {quizScore ? `퀴즈 ${quizScore.scorePercent}점` : '퀴즈 미응시'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
