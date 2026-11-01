import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { allChapterSections } from './data/chapter18Data';
import { keyTermsList } from './data/reviewAndGlossary';
import { ChapterSection, CustomWord, TextHighlight } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { InteractiveCard } from './components/InteractiveCard';
import { TextbookReader } from './components/TextbookReader';
import { RelatedMediaSection } from './components/RelatedMediaSection';
import { QuizView } from './components/QuizView';
import { GlossaryPageView } from './components/GlossaryPageView';
import { MyLearningRecordView } from './components/MyLearningRecordView';
import { DriveSyncModal } from './components/DriveSyncModal';
import { TrackSelectModal } from './components/TrackSelectModal';
import { LoginAssistModal } from './components/LoginAssistModal';
import { SelfLearningVoiceJournal } from './components/SelfLearningVoiceJournal';
import { 
  initAuth, 
  googleSignIn, 
  googleSignOut, 
  getAccessToken,
  parseAuthError,
  createGuestUser,
  AuthErrorInfo
} from './services/firebaseAuth';
import { 
  syncDataToGoogleDrive, 
  loadDataFromGoogleDrive, 
  listFolderFiles, 
  LearningHistoryData, 
  DriveFileInfo 
} from './services/googleDriveService';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Bookmark,
  BookOpen,
  Sparkles,
  CloudCheck,
  AlertCircle,
  Menu
} from 'lucide-react';

export default function App() {
  const [sections] = useState<ChapterSection[]>(allChapterSections);
  const [activeSectionId, setActiveSectionId] = useState<string>(allChapterSections[0].id);
  const [activeTopTab, setActiveTopTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Sidebar toggle state (defaults to true on desktop, false on mobile portrait for focus)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  
  // View mode: 'study' | 'glossary' | 'my-record'
  const [currentViewMode, setCurrentViewMode] = useState<'study' | 'glossary' | 'my-record'>('study');
  const [glossaryTab, setGlossaryTab] = useState<'key-terms' | 'custom-words' | 'flashcards'>('key-terms');

  // Firebase Auth state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authErrorInfo, setAuthErrorInfo] = useState<AuthErrorInfo | null>(null);
  const [isLoginAssistOpen, setIsLoginAssistOpen] = useState<boolean>(false);

  // Google Drive state
  const [driveFolderId, setDriveFolderId] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFileInfo[]>([]);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isLoadingFromDrive, setIsLoadingFromDrive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Completed sections
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ch18_completed_sections');
      return saved ? JSON.parse(saved) : ['intro-killer-air'];
    } catch {
      return ['intro-killer-air'];
    }
  });

  // Visit history tracking
  const [visitHistory, setVisitHistory] = useState<Record<string, { title: string; lastVisitedAt: number; count: number }>>(() => {
    try {
      const saved = localStorage.getItem('ch18_visit_history');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Quiz scores tracking
  const [quizScores, setQuizScores] = useState<Record<string, { correct: number; total: number; scorePercent: number; updatedAt: number }>>(() => {
    try {
      const saved = localStorage.getItem('ch18_quiz_scores');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Last synced timestamp
  const [lastSyncedAt, setLastSyncedAt] = useState<string>(() => {
    return localStorage.getItem('ch18_last_synced_at') || '';
  });

  // Custom vocabulary words
  const [customWords, setCustomWords] = useState<CustomWord[]>(() => {
    try {
      const saved = localStorage.getItem('ch18_custom_vocabulary');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'init-1',
          word: 'Lapse Rate (기온 감률)',
          meaning: '대류권에서 고도가 1km 상승할 때마다 온도가 약 6.5°C씩 감소하는 비율',
          contextSentence: 'The temperature lowers about 6.5°C for every kilometer increase in altitude. Atmospheric scientists call this kind of steady change in temperature a lapse rate.',
          sourceSectionTitle: '18.4 기온에 따른 5개 대기층',
          sourcePage: 433,
          addedAt: Date.now() - 100000,
          isMemorized: true
        },
        {
          id: 'init-2',
          word: 'Cyanobacteria (남세균)',
          meaning: '광합성을 통해 원시 대기에 산소를 최초로 대량 공급한 미생물',
          contextSentence: 'oxygen-producing organisms called cyanobacteria evolved... responsible for the modern oxygen-rich atmosphere.',
          sourceSectionTitle: '18.2 대기의 기원',
          sourcePage: 430,
          addedAt: Date.now() - 50000,
          isMemorized: false
        }
      ];
    } catch {
      return [];
    }
  });

  // Text Highlights & Underlines (본문 형광펜 & 밑줄)
  const [textHighlights, setTextHighlights] = useState<TextHighlight[]>(() => {
    try {
      const saved = localStorage.getItem('ch18_text_highlights');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync text highlights to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ch18_text_highlights', JSON.stringify(textHighlights));
    } catch (e) {
      console.error(e);
    }
  }, [textHighlights]);

  const handleSaveHighlight = (highlight: TextHighlight | TextHighlight[]) => {
    const items = Array.isArray(highlight) ? highlight : [highlight];
    setTextHighlights(prev => {
      let updated = [...prev];
      for (const item of items) {
        updated = updated.filter(h => !(h.sectionId === item.sectionId && h.text.toLowerCase() === item.text.toLowerCase()));
        updated.push(item);
      }
      return updated;
    });
  };

  const handleDeleteHighlight = (id: string | string[]) => {
    const idsToDelete = new Set(Array.isArray(id) ? id : [id]);
    setTextHighlights(prev => prev.filter(h => !idsToDelete.has(h.id)));
  };

  const handleClearSectionHighlights = (sectionId: string) => {
    setTextHighlights(prev => prev.filter(h => h.sectionId !== sectionId));
  };

  // Track Selector modal state
  const [isTrackSelectOpen, setIsTrackSelectOpen] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string>('full');

  // Active section
  const currentSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const currentIndex = sections.findIndex((s) => s.id === activeSectionId);

  // Initialize Firebase Auth on app mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Track visit when activeSectionId changes
  useEffect(() => {
    if (currentSection && currentViewMode === 'study') {
      setVisitHistory((prev) => {
        const existing = prev[currentSection.id] || { 
          title: currentSection.titleKo, 
          lastVisitedAt: Date.now(), 
          count: 0 
        };
        const updated = {
          ...prev,
          [currentSection.id]: {
            title: currentSection.titleKo,
            lastVisitedAt: Date.now(),
            count: existing.count + 1
          }
        };
        localStorage.setItem('ch18_visit_history', JSON.stringify(updated));
        return updated;
      });
    }
  }, [activeSectionId, currentViewMode]);

  // Sync completion to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ch18_completed_sections', JSON.stringify(completedIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedIds]);

  // Sync custom words to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ch18_custom_vocabulary', JSON.stringify(customWords));
    } catch (e) {
      console.error(e);
    }
  }, [customWords]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGoogleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      setUser(result.user);
      setToken(result.accessToken);
      setAuthErrorInfo(null);
      setIsLoginAssistOpen(false);
      showToast(`${result.user.displayName || '사용자'}님, 환영합니다! Google 계정으로 로그인되었습니다.`);
      
      // Auto check Drive folder
      try {
        const driveData = await loadDataFromGoogleDrive(result.accessToken);
        if (driveData.folderId) {
          setDriveFolderId(driveData.folderId);
        }
      } catch (err) {
        console.warn('Initial drive check:', err);
      }
    } catch (error: any) {
      console.error('Login failure:', error);
      const parsed = parseAuthError(error);
      setAuthErrorInfo(parsed);
      setIsLoginAssistOpen(true);
      showToast(`${parsed.friendlyTitle}: ${parsed.friendlyDescription}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGuestLogin = () => {
    const guest = createGuestUser('학습자 (게스트)');
    setUser(guest.user);
    setToken(guest.accessToken);
    setAuthErrorInfo(null);
    setIsLoginAssistOpen(false);
    showToast('게스트 모드로 시작되었습니다! 단어장, 형광펜, 퀴즈 오답이 안전하게 보관됩니다.');
  };

  const handleGoogleSignOut = async () => {
    await googleSignOut();
    setUser(null);
    setToken(null);
    setDriveFolderId(null);
    setDriveFiles([]);
    showToast('로그아웃되었습니다.');
  };

  // Sync data to Google Drive
  const handleConfirmSyncToDrive = async () => {
    if (!token && !user) {
      setIsSyncModalOpen(false);
      handleGoogleSignIn();
      return;
    }

    const activeToken = token || (await getAccessToken());
    if (!activeToken) {
      setIsSyncModalOpen(false);
      handleGoogleSignIn();
      return;
    }

    setIsSyncing(true);
    try {
      const historyPayload: LearningHistoryData = {
        userId: user?.uid || 'guest',
        userEmail: user?.email || '',
        displayName: user?.displayName || '학습자',
        lastSyncedAt: new Date().toISOString(),
        completedSectionIds: completedIds,
        visitHistory: visitHistory,
        quizScores: quizScores
      };

      const result = await syncDataToGoogleDrive(activeToken, {
        history: historyPayload,
        customVocabulary: customWords,
        textHighlights: textHighlights
      });

      setDriveFolderId(result.folderId);
      const nowStr = new Date().toISOString();
      setLastSyncedAt(nowStr);
      localStorage.setItem('ch18_last_synced_at', nowStr);

      // Refresh files list
      const files = await listFolderFiles(activeToken, result.folderId);
      setDriveFiles(files);

      setIsSyncModalOpen(false);
      showToast('Google Drive에 학습 이력, 용어 사전 및 형광펜/밑줄이 성공적으로 저장되었습니다!');
    } catch (error: any) {
      console.error('Drive Sync Error:', error);
      showToast('Google Drive 동기화 중 오류가 발생했습니다. 권한을 확인해주세요.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Load data from Google Drive
  const handleLoadFromDrive = async () => {
    const activeToken = token || (await getAccessToken());
    if (!activeToken) {
      handleGoogleSignIn();
      return;
    }

    setIsLoadingFromDrive(true);
    try {
      const data = await loadDataFromGoogleDrive(activeToken);
      if (data.folderId) setDriveFolderId(data.folderId);

      if (data.history) {
        if (data.history.completedSectionIds) {
          setCompletedIds(data.history.completedSectionIds);
        }
        if (data.history.visitHistory) {
          setVisitHistory(data.history.visitHistory);
          localStorage.setItem('ch18_visit_history', JSON.stringify(data.history.visitHistory));
        }
        if (data.history.quizScores) {
          setQuizScores(data.history.quizScores);
          localStorage.setItem('ch18_quiz_scores', JSON.stringify(data.history.quizScores));
        }
      }

      if (data.customVocabulary && data.customVocabulary.length > 0) {
        setCustomWords(data.customVocabulary);
      }

      if (data.textHighlights && Array.isArray(data.textHighlights) && data.textHighlights.length > 0) {
        setTextHighlights(data.textHighlights);
        localStorage.setItem('ch18_text_highlights', JSON.stringify(data.textHighlights));
      }

      if (data.folderId) {
        const files = await listFolderFiles(activeToken, data.folderId);
        setDriveFiles(files);
      }

      showToast('Google Drive에서 학습 이력, 단어장 및 형광펜 기록을 성공적으로 불러왔습니다!');
    } catch (error) {
      console.error('Load Error:', error);
      showToast('Google Drive에서 데이터를 불러오지 못했습니다.');
    } finally {
      setIsLoadingFromDrive(false);
    }
  };

  const toggleSectionCompletion = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open Glossary directly in the page
  const handleOpenGlossary = (tab: 'key-terms' | 'custom-words' | 'flashcards' = 'key-terms') => {
    setGlossaryTab(tab);
    setCurrentViewMode('glossary');
    setActiveTopTab('glossary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open My Learning Record in-page
  const handleOpenMyRecord = () => {
    setCurrentViewMode('my-record');
    setActiveTopTab('my-record');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCustomWord = (wordData: { 
    word: string; 
    meaning: string; 
    contextSentence?: string; 
    sourceSectionTitle?: string; 
    sourcePage?: number 
  }) => {
    const newEntry: CustomWord = {
      id: `word_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      word: wordData.word,
      meaning: wordData.meaning,
      contextSentence: wordData.contextSentence,
      sourceSectionTitle: wordData.sourceSectionTitle || currentSection.titleKo,
      sourcePage: wordData.sourcePage || currentSection.pages[0] || 429,
      addedAt: Date.now(),
      isMemorized: false
    };

    setCustomWords((prev) => [newEntry, ...prev]);
  };

  const handleToggleCustomMemorized = (id: string) => {
    setCustomWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMemorized: !w.isMemorized } : w))
    );
  };

  const handleDeleteCustomWord = (id: string) => {
    setCustomWords((prev) => prev.filter((w) => w.id !== id));
  };

  const handleSelectTopTab = (tab: string) => {
    setActiveTopTab(tab);
    if (tab === 'glossary') {
      handleOpenGlossary('key-terms');
      return;
    }
    if (tab === 'my-record') {
      handleOpenMyRecord();
      return;
    }

    setCurrentViewMode('study');
    if (tab === 'home') {
      setActiveSectionId(sections[0].id);
    } else if (tab === 'intro') {
      setActiveSectionId('intro-killer-air');
    } else if (tab === '18A') {
      setActiveSectionId('sec-18-1');
    } else if (tab === '18B') {
      setActiveSectionId('sec-18-6');
    } else if (tab === '18C') {
      setActiveSectionId('sec-18-9-10');
    } else if (tab === 'review-30') {
      setActiveSectionId('sec-chapter-review-30');
    }
  };

  const goToPrevSection = () => {
    if (currentIndex > 0) {
      setActiveSectionId(sections[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextSection = () => {
    if (currentIndex < sections.length - 1) {
      setActiveSectionId(sections[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToEvidence = (page: number, _quote?: string) => {
    const targetSec = sections.find((s) => s.pages.includes(page));
    if (targetSec) {
      setActiveSectionId(targetSec.id);
      setCurrentViewMode('study');
      setTimeout(() => {
        const el = document.getElementById('textbook-reader-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById('textbook-reader-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const isCurrentCompleted = completedIds.includes(currentSection.id);

  const currentHistoryPayload: LearningHistoryData = {
    userId: user?.uid || 'guest',
    userEmail: user?.email || '',
    displayName: user?.displayName || '학습자',
    lastSyncedAt: lastSyncedAt,
    completedSectionIds: completedIds,
    visitHistory: visitHistory,
    quizScores: quizScores
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm flex items-center space-x-2 border border-gray-700 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Navigation Bar with Google Sign-in */}
      <Header
        currentSection={currentSection}
        completedSectionIds={completedIds}
        totalSections={sections.length}
        activeTopTab={activeTopTab}
        onSelectTopTab={handleSelectTopTab}
        onOpenGlossary={handleOpenGlossary}
        onOpenTrackSelect={() => setIsTrackSelectOpen(true)}
        customWordsCount={customWords.length}
        user={user}
        onOpenMyRecord={handleOpenMyRecord}
        onGoogleSignIn={handleGoogleSignIn}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Container: Left Sidebar + Right Scrollable Main Content */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto relative">
        {/* Left Sidebar (Toggleable & Responsive drawer) */}
        <Sidebar
          sections={sections}
          activeSectionId={activeSectionId}
          completedSectionIds={completedIds}
          onSelectSection={(id) => {
            setCurrentViewMode('study');
            setActiveSectionId(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenGlossary={handleOpenGlossary}
          onOpenMyRecord={handleOpenMyRecord}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          customWordsCount={customWords.length}
          isGlossaryActive={currentViewMode === 'glossary'}
          activeGlossaryTab={glossaryTab}
          isMyRecordActive={currentViewMode === 'my-record'}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Right Main Content Canvas (Expanded width for focused reading in portrait mode) */}
        <main className={`flex-1 min-w-0 p-3.5 sm:p-6 lg:p-10 ${isSidebarOpen ? 'max-w-5xl' : 'max-w-6xl'} mx-auto transition-all duration-200`}>
          {/* ======================================================== */}
          {/* 1. In-Page My Learning Record & Drive View              */}
          {/* ======================================================== */}
          {currentViewMode === 'my-record' ? (
            <MyLearningRecordView
              user={user}
              onGoogleSignIn={handleGoogleSignIn}
              onGoogleSignOut={handleGoogleSignOut}
              isLoggingIn={isLoggingIn}
              history={currentHistoryPayload}
              customWords={customWords}
              sections={sections}
              folderId={driveFolderId}
              driveFiles={driveFiles}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
              onLoadFromDrive={handleLoadFromDrive}
              isLoadingFromDrive={isLoadingFromDrive}
              onBackToStudy={() => {
                setCurrentViewMode('study');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToSection={(secId) => {
                setActiveSectionId(secId);
                setCurrentViewMode('study');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : currentViewMode === 'glossary' ? (
            /* ======================================================== */
            /* 2. In-Page Glossary & My Vocabulary View (Non-popup)     */
            /* ======================================================== */
            <GlossaryPageView
              keyTerms={keyTermsList}
              customWords={customWords}
              activeTab={glossaryTab}
              onChangeTab={(tab) => setGlossaryTab(tab)}
              onToggleCustomMemorized={handleToggleCustomMemorized}
              onDeleteCustomWord={handleDeleteCustomWord}
              onAddCustomWord={handleAddCustomWord}
              onBackToStudy={() => {
                setCurrentViewMode('study');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          ) : (
            /* ======================================================== */
            /* 3. Regular Chapter Section Study View                   */
            /* ======================================================== */
            <>
              {/* Breadcrumb strip matching screenshot (blue tinted box) */}
              <div className="bg-blue-50/70 border border-blue-100 rounded px-4 py-2.5 text-xs text-blue-700 font-medium mb-5 flex items-center justify-between">
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-bold text-blue-900">{currentSection.titleEn}</span>
                  <span className="text-blue-300">·</span>
                  <span className="truncate text-blue-600">{currentSection.titleKo}</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] text-blue-500 font-mono">
                  {user && (
                    <span className="hidden sm:inline text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-sans">
                      ● Drive 동기화 준비됨
                    </span>
                  )}
                  <span>교재 {currentSection.pages.join(', ')}p</span>
                </div>
              </div>

              {/* Action Header Banner matching reference screenshot */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-6 shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded">
                    {currentSection.interactiveSpec.missionNumber}번
                  </span>
                  <span className="bg-blue-500 text-white font-medium text-xs px-2.5 py-1 rounded hidden sm:inline">
                    교과 본문 · 실습
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800">
                    {currentSection.interactiveSpec.missionTitle}
                  </span>
                </div>

                {/* Steps tracker matching reference image (dashes + fraction) */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {[0, 1, 2, 3].map((step) => (
                      <span
                        key={step}
                        className={`h-1 rounded-full transition-all ${
                          step === 0 ? 'w-5 bg-blue-600' : 'w-2.5 bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-gray-500">
                    1 / {currentSection.interactiveSpec.stepTotal}
                  </span>
                </div>
              </div>

              {/* Title Area: English First (Textbook original title), Korean Second */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    {/* Black square badge with number identical to reference image */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black text-white font-bold text-base sm:text-lg rounded flex items-center justify-center shrink-0 shadow-xs">
                      {currentSection.numberBadge}
                    </div>
                    <div>
                      {/* English Textbook Title in H1 */}
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        {currentSection.titleEn}
                      </h1>
                      {/* Korean Translation in H2 */}
                      <h2 className="text-sm sm:text-base font-semibold text-blue-700 mt-1 flex items-center space-x-1.5">
                        <span>{currentSection.titleKo}</span>
                      </h2>
                    </div>
                  </div>

                  {/* Right tools: Question quick link + Checkbox 완료 */}
                  <div className="flex items-center space-x-3 shrink-0 pt-1">
                    <button
                      onClick={() => handleOpenGlossary('custom-words')}
                      className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded font-semibold hidden sm:inline-flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                      <span>나만의 사전 ({customWords.length})</span>
                    </button>
                    <label className="flex items-center space-x-2 px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer text-xs font-medium text-gray-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={isCurrentCompleted}
                        onChange={() => toggleSectionCompletion(currentSection.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span>완료</span>
                    </label>
                  </div>
                </div>

                {/* 목표 (Objectives) Box with blue left bar identical to reference image */}
                <div className="border-l-4 border-blue-600 bg-gray-50/80 p-4 rounded-r my-5 text-xs sm:text-sm text-gray-800 leading-relaxed shadow-2xs">
                  <span className="font-bold text-gray-900 block sm:inline mr-2">
                    목표 · Objectives:
                  </span>
                  <span>
                    {currentSection.objectives.join(' ')}
                  </span>
                </div>
              </div>

              {/* [교재 원문 완전 수록] - 상단 우선 배치 및 하이라이트/밑줄 기능 */}
              <TextbookReader
                section={currentSection}
                onAddCustomWord={handleAddCustomWord}
                customWords={customWords}
                highlights={textHighlights}
                onSaveHighlight={handleSaveHighlight}
                onDeleteHighlight={handleDeleteHighlight}
                onClearSectionHighlights={handleClearSectionHighlights}
              />

              {/* [스스로 말하는 학습 녹음기 & AI 배운 내용 분석] (노란색 박스 - 교재 원본 바로 아래) */}
              <SelfLearningVoiceJournal
                section={currentSection}
              />

              {/* [교재 관련 추천 영상 & 과학 탐구 블로그 자료실] */}
              <RelatedMediaSection section={currentSection} />

              {/* [탐구 영어 & 과학 인터랙티브 실습 박스] */}
              <InteractiveCard section={currentSection} />

              {/* If the current section is a quiz/review module, render interactive quiz directly! */}
              {currentSection.questions && currentSection.questions.length > 0 && (
                <div className="my-8">
                  <QuizView
                    questions={currentSection.questions}
                    quizTitle={currentSection.titleKo}
                    onNavigateToEvidence={handleNavigateToEvidence}
                  />
                </div>
              )}

              {/* Bottom Pagination Buttons */}
              <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={goToPrevSection}
                  disabled={currentIndex === 0}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    currentIndex === 0
                      ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>이전 섹션</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsSyncModalOpen(true)}
                    className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                  >
                    <CloudCheck className="w-4 h-4 text-blue-600" />
                    <span>Drive에 진도 백업</span>
                  </button>

                  <button
                    onClick={() => toggleSectionCompletion(currentSection.id)}
                    className={`px-4 py-2 rounded text-xs sm:text-sm font-bold transition-colors flex items-center space-x-1.5 cursor-pointer ${
                      isCurrentCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{isCurrentCompleted ? '학습 완료됨' : '학습 완료 체크'}</span>
                  </button>
                </div>

                <button
                  onClick={goToNextSection}
                  disabled={currentIndex === sections.length - 1}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    currentIndex === sections.length - 1
                      ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'text-white bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <span>다음 섹션</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Mandatory User Confirmation Dialog for Google Drive Sync */}
      <DriveSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onConfirmSync={handleConfirmSyncToDrive}
        isSyncing={isSyncing}
        userEmail={user?.email || '로그인 필요'}
        completedCount={completedIds.length}
        customWordCount={customWords.length}
        quizScoreCount={Object.keys(quizScores).length}
      />

      {/* Track Selector Modal */}
      <TrackSelectModal
        isOpen={isTrackSelectOpen}
        onClose={() => setIsTrackSelectOpen(false)}
        currentTrack={currentTrack}
        onSelectTrack={(track) => setCurrentTrack(track)}
      />

      {/* Login Assist & Guidance Modal (Domain whitelist & Guest fallback) */}
      <LoginAssistModal
        isOpen={isLoginAssistOpen}
        errorInfo={authErrorInfo}
        onClose={() => setIsLoginAssistOpen(false)}
        onRetry={handleGoogleSignIn}
        onStartGuestMode={handleGuestLogin}
      />

      {/* Floating Outline Toggle Button for Mobile Portrait Mode */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed bottom-6 left-4 z-40 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3.5 py-2.5 rounded-full shadow-2xl border border-blue-400/40 text-xs font-bold transition-all cursor-pointer animate-in fade-in zoom-in-95 duration-200"
          title="단원 목차 및 검색 열기"
          aria-label="단원 목차 열기"
        >
          <Menu className="w-4 h-4 shrink-0" />
          <span>단원 목차</span>
        </button>
      )}
    </div>
  );
}
