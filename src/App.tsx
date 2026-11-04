import React, { useState, useEffect, useRef } from 'react';
import { allChapterSections } from './data/chapter18Data';
import { keyTermsList, chapterSummaryPoints } from './data/reviewAndGlossary';
import { ChapterSection, CustomWord, TextHighlight } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TextbookReader } from './components/TextbookReader';
import { ActivityTabStrip } from './components/ActivityTabStrip';
import { ChapterSummaryTermsSection } from './components/ChapterSummaryTermsSection';
import { QuizView } from './components/QuizView';
import { GlossaryPageView } from './components/GlossaryPageView';
import { MyLearningRecordView } from './components/MyLearningRecordView';
import { TrackSelectModal } from './components/TrackSelectModal';
import { AuthModal } from './components/AuthModal';
import { 
  initMemberAuth, 
  signOutMember, 
  MemberSessionData 
} from './services/firebaseAuth';
import { 
  saveMemberLearningRecord, 
  loadMemberLearningRecord 
} from './services/memberLearningService';
import { LearningHistoryData } from './services/googleDriveService';
import { loadAllBlogPosts } from './services/studyBlogService';
import { loadAllVoiceJournals } from './services/voiceJournalService';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Bookmark, 
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

  // Member Auth state
  const [user, setUser] = useState<MemberSessionData | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSyncingToFirebase, setIsSyncingToFirebase] = useState<boolean>(false);
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

  // Text Highlights & Underlines
  const [textHighlights, setTextHighlights] = useState<TextHighlight[]>(() => {
    try {
      const saved = localStorage.getItem('ch18_text_highlights');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track Selector modal state
  const [isTrackSelectOpen, setIsTrackSelectOpen] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string>('full');

  // Debounce ref for auto-saving to Firebase
  const autoSaveTimeoutRef = useRef<any>(null);

  // Active section
  const currentSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const currentIndex = sections.findIndex((s) => s.id === activeSectionId);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Function to load member learning record from Firebase and merge into state
  const syncMemberDataFromCloud = async (userId: string) => {
    try {
      const record = await loadMemberLearningRecord(userId);
      if (record) {
        if (Array.isArray(record.completedSectionIds) && record.completedSectionIds.length > 0) {
          setCompletedIds(record.completedSectionIds);
          localStorage.setItem('ch18_completed_sections', JSON.stringify(record.completedSectionIds));
        }
        if (record.visitHistory && Object.keys(record.visitHistory).length > 0) {
          setVisitHistory(record.visitHistory);
          localStorage.setItem('ch18_visit_history', JSON.stringify(record.visitHistory));
        }
        if (record.quizScores && Object.keys(record.quizScores).length > 0) {
          setQuizScores(record.quizScores);
          localStorage.setItem('ch18_quiz_scores', JSON.stringify(record.quizScores));
        }
        if (Array.isArray(record.customVocabulary) && record.customVocabulary.length > 0) {
          setCustomWords(record.customVocabulary);
          localStorage.setItem('ch18_custom_vocabulary', JSON.stringify(record.customVocabulary));
        }
        if (Array.isArray(record.textHighlights) && record.textHighlights.length > 0) {
          setTextHighlights(record.textHighlights);
          localStorage.setItem('ch18_text_highlights', JSON.stringify(record.textHighlights));
        }
        if (record.lastSyncedAt) {
          setLastSyncedAt(record.lastSyncedAt);
          localStorage.setItem('ch18_last_synced_at', record.lastSyncedAt);
        }
      }
    } catch (e) {
      console.warn('Failed to sync member data from cloud:', e);
    }
  };

  // Initialize Member Auth on mount
  useEffect(() => {
    const unsubscribe = initMemberAuth(
      (currentMember) => {
        const session = currentMember as MemberSessionData;
        setUser(session);
        if (session.uid) {
          syncMemberDataFromCloud(session.uid);
        }
      },
      () => {
        setUser(null);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
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

  // Sync completion to localStorage & auto-save to Firebase
  useEffect(() => {
    try {
      localStorage.setItem('ch18_completed_sections', JSON.stringify(completedIds));
    } catch (e) {
      console.error(e);
    }

    if (user?.uid) {
      triggerCloudAutoSave();
    }
  }, [completedIds]);

  // Sync custom words to localStorage & auto-save to Firebase
  useEffect(() => {
    try {
      localStorage.setItem('ch18_custom_vocabulary', JSON.stringify(customWords));
    } catch (e) {
      console.error(e);
    }

    if (user?.uid) {
      triggerCloudAutoSave();
    }
  }, [customWords]);

  // Sync text highlights to localStorage & auto-save to Firebase
  useEffect(() => {
    try {
      localStorage.setItem('ch18_text_highlights', JSON.stringify(textHighlights));
    } catch (e) {
      console.error(e);
    }

    if (user?.uid) {
      triggerCloudAutoSave();
    }
  }, [textHighlights]);

  // Sync quiz scores to localStorage & auto-save to Firebase
  useEffect(() => {
    try {
      localStorage.setItem('ch18_quiz_scores', JSON.stringify(quizScores));
    } catch (e) {
      console.error(e);
    }

    if (user?.uid) {
      triggerCloudAutoSave();
    }
  }, [quizScores]);

  // Auto-save debounced helper
  const triggerCloudAutoSave = () => {
    if (!user?.uid) return;
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await saveMemberLearningRecord(user.uid, {
          userEmail: user.email,
          displayName: user.displayName,
          completedSectionIds: completedIds,
          visitHistory,
          quizScores,
          customVocabulary: customWords,
          textHighlights,
        });
        if (result.lastSyncedAt) {
          setLastSyncedAt(result.lastSyncedAt);
          localStorage.setItem('ch18_last_synced_at', result.lastSyncedAt);
        }
      } catch (err) {
        console.warn('Auto save notice:', err);
      }
    }, 1200);
  };

  // Manual save to Firebase
  const handleManualSyncToFirebase = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsSyncingToFirebase(true);
    try {
      const result = await saveMemberLearningRecord(user.uid, {
        userEmail: user.email,
        displayName: user.displayName,
        completedSectionIds: completedIds,
        visitHistory,
        quizScores,
        customVocabulary: customWords,
        textHighlights,
      });
      if (result.lastSyncedAt) {
        setLastSyncedAt(result.lastSyncedAt);
        localStorage.setItem('ch18_last_synced_at', result.lastSyncedAt);
      }
      showToast('Firebase 클라우드에 학습 이력이 안전하게 저장되었습니다!');
    } catch (error) {
      console.error('Manual sync error:', error);
      showToast('저장 중 문제가 발생했습니다. 브라우저 로컬 저장소에 안전하게 보관 중입니다.');
    } finally {
      setIsSyncingToFirebase(false);
    }
  };

  const handleAuthSuccess = (session: MemberSessionData) => {
    setUser(session);
    syncMemberDataFromCloud(session.uid);
    showToast(`${session.displayName}님, 환영합니다! Firebase 회원 학습 이력이 연동되었습니다.`);
  };

  const handleSignOut = async () => {
    await signOutMember();
    setUser(null);
    showToast('로그아웃되었습니다.');
  };

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

  const handleExportBackup = () => {
    try {
      const payload = {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        studentName: user?.displayName || '회원',
        history: {
          userId: user?.uid || 'guest',
          userEmail: user?.email || '',
          displayName: user?.displayName || '회원',
          lastSyncedAt: new Date().toISOString(),
          completedSectionIds: completedIds,
          visitHistory: visitHistory,
          quizScores: quizScores
        },
        customVocabulary: customWords,
        textHighlights: textHighlights,
        blogPosts: loadAllBlogPosts(),
        voiceJournals: loadAllVoiceJournals()
      };
      const jsonStr = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `science_ch18_backup_${(user?.displayName || 'member').replace(/[^a-zA-Z0-9가-힣]/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('학습 이력 백업 파일(.json)이 다운로드되었습니다.');
    } catch (e) {
      console.error(e);
      showToast('백업 파일 생성 중 오류가 발생했습니다.');
    }
  };

  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const raw = e.target?.result as string;
        const data = JSON.parse(raw);
        if (data.history) {
          if (Array.isArray(data.history.completedSectionIds)) {
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
        if (Array.isArray(data.customVocabulary)) {
          setCustomWords(data.customVocabulary);
          localStorage.setItem('ch18_custom_vocabulary', JSON.stringify(data.customVocabulary));
        }
        if (Array.isArray(data.textHighlights)) {
          setTextHighlights(data.textHighlights);
          localStorage.setItem('ch18_text_highlights', JSON.stringify(data.textHighlights));
        }
        if (data.blogPosts && typeof data.blogPosts === 'object') {
          localStorage.setItem('ch18_study_blog_posts', JSON.stringify(data.blogPosts));
        }
        if (data.voiceJournals && typeof data.voiceJournals === 'object') {
          localStorage.setItem('ch18_voice_journals', JSON.stringify(data.voiceJournals));
        }
        showToast('백업 파일에서 모든 학습 기록을 성공적으로 복원했습니다!');
      } catch (err) {
        console.error('Failed to import backup:', err);
        showToast('유효하지 않은 백업 파일 형식입니다.');
      }
    };
    reader.readAsText(file);
  };

  const toggleSectionCompletion = (id: string) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleOpenGlossary = (tab: 'key-terms' | 'custom-words' | 'flashcards' = 'key-terms') => {
    setGlossaryTab(tab);
    setCurrentViewMode('glossary');
    setActiveTopTab('glossary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMyRecord = () => {
    setCurrentViewMode('my-record');
    setActiveTopTab('my-record');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopTab = (tab: string) => {
    setActiveTopTab(tab);
    if (tab === 'home') {
      setCurrentViewMode('study');
      setActiveSectionId(sections[0].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'intro') {
      setCurrentViewMode('study');
      setActiveSectionId('intro-killer-air');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === '18A') {
      setCurrentViewMode('study');
      setActiveSectionId('sec-18-1-air-care');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === '18B') {
      setCurrentViewMode('study');
      setActiveSectionId('sec-18-6-ozone');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === '18C') {
      setCurrentViewMode('study');
      setActiveSectionId('sec-18-9-radiant-sun');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'glossary') {
      handleOpenGlossary('key-terms');
    } else if (tab === 'review-30') {
      setCurrentViewMode('study');
      setActiveSectionId('sec-chapter-review-30');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'my-record') {
      handleOpenMyRecord();
    }
  };

  const handleAddCustomWord = (wordData: Omit<CustomWord, 'id' | 'addedAt' | 'isMemorized'>) => {
    const existing = customWords.find((w) => w.word.toLowerCase() === wordData.word.toLowerCase());
    if (existing) {
      showToast(`'${wordData.word}' 단어가 이미 용어 사전에 등록되어 있습니다.`);
      return;
    }
    const newWord: CustomWord = {
      ...wordData,
      id: `word-${Date.now()}`,
      addedAt: Date.now(),
      isMemorized: false
    };
    setCustomWords((prev) => [newWord, ...prev]);
    showToast(`'${wordData.word}' 단어가 나만의 용어 사전에 추가되었습니다!`);
  };

  const handleToggleCustomMemorized = (id: string) => {
    setCustomWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMemorized: !w.isMemorized } : w))
    );
  };

  const handleDeleteCustomWord = (id: string) => {
    setCustomWords((prev) => prev.filter((w) => w.id !== id));
    showToast('단어가 삭제되었습니다.');
  };

  const goToNextSection = () => {
    if (currentIndex < sections.length - 1) {
      setActiveSectionId(sections[currentIndex + 1].id);
      setCurrentViewMode('study');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevSection = () => {
    if (currentIndex > 0) {
      setActiveSectionId(sections[currentIndex - 1].id);
      setCurrentViewMode('study');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavigateToEvidence = (pageNumber: number) => {
    const targetSec = sections.find((s) => s.pages.includes(pageNumber));
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
  const isReviewOrSummarySection = 
    currentSection.category === 'review' || 
    currentSection.id === 'sec-summary-terms' || 
    currentSection.id === 'sec-chapter-review-30' ||
    currentSection.id === 'sec-18a-review' ||
    currentSection.id === 'sec-18b-review' ||
    currentSection.id === 'sec-18c-review' ||
    currentSection.id.includes('-review');

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

      {/* 1. Top Navigation Bar with Member Login */}
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
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      {/* Main Container: Left Sidebar + Right Scrollable Main Content */}
      <div className="flex-1 flex max-w-[1720px] w-full mx-auto relative">
        {/* Left Sidebar */}
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

        {/* Right Main Content Canvas */}
        <main className={`flex-1 min-w-0 p-3.5 sm:p-6 lg:p-10 ${isSidebarOpen ? 'max-w-5xl' : 'max-w-6xl'} mx-auto transition-all duration-200`}>
          {/* ======================================================== */}
          {/* 1. In-Page My Learning Record View (Firebase Cloud Sync) */}
          {/* ======================================================== */}
          {currentViewMode === 'my-record' ? (
            <MyLearningRecordView
              user={user}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
              onSignOut={handleSignOut}
              onExportBackup={handleExportBackup}
              onImportBackup={handleImportBackup}
              onManualSyncToFirebase={handleManualSyncToFirebase}
              isSyncingToFirebase={isSyncingToFirebase}
              history={currentHistoryPayload}
              customWords={customWords}
              sections={sections}
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
            /* 2. In-Page Glossary & My Vocabulary View                 */
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
              {/* Breadcrumb strip */}
              <div className="bg-blue-50/70 border border-blue-100 rounded px-4 py-2.5 text-xs text-blue-700 font-medium mb-5 flex items-center justify-between">
                <div className="flex items-center space-x-2 truncate">
                  <span className="font-bold text-blue-900">{currentSection.titleEn}</span>
                  <span className="text-blue-300">·</span>
                  <span className="truncate text-blue-600">{currentSection.titleKo}</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] text-blue-500 font-mono">
                  {user && (
                    <span className="hidden sm:inline text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-sans">
                      ● Firebase 실시간 저장 활성화
                    </span>
                  )}
                  <span>교재 {currentSection.pages.join(', ')}p</span>
                </div>
              </div>

              {/* Action Header Banner */}
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

                {/* Steps tracker */}
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

              {/* Title Area */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black text-white font-bold text-base sm:text-lg rounded flex items-center justify-center shrink-0 shadow-xs">
                      {currentSection.numberBadge}
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        {currentSection.titleEn}
                      </h1>
                      <h2 className="text-sm sm:text-base font-semibold text-blue-700 mt-1 flex items-center space-x-1.5">
                        <span>{currentSection.titleKo}</span>
                      </h2>
                    </div>
                  </div>

                  {/* Right tools */}
                  <div className="flex items-center space-x-3 shrink-0 pt-1">
                    <button
                      onClick={() => handleOpenGlossary('custom-words')}
                      className="text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded font-semibold hidden sm:inline-flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                      <span>Vocabulary ({customWords.length})</span>
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

                {/* 목표 Box */}
                <div className="border-l-4 border-blue-600 bg-gray-50/80 p-4 rounded-r my-5 text-xs sm:text-sm text-gray-800 leading-relaxed shadow-2xs">
                  <span className="font-bold text-gray-900 block sm:inline mr-2">
                    목표:
                  </span>
                  <span>
                    {currentSection.objectives.join(' ')}
                  </span>
                </div>
              </div>

              {/* [교재 원문 & 활동 탭 스트립] */}
              {!isReviewOrSummarySection && (
                <>
                  <TextbookReader
                    section={currentSection}
                    onAddCustomWord={handleAddCustomWord}
                    customWords={customWords}
                    highlights={textHighlights}
                    onSaveHighlight={handleSaveHighlight}
                    onDeleteHighlight={handleDeleteHighlight}
                    onClearSectionHighlights={handleClearSectionHighlights}
                  />

                  {/* [활동 탭 스트립] */}
                  <ActivityTabStrip 
                    section={currentSection} 
                    user={user} 
                    onOpenAuthModal={() => setIsAuthModalOpen(true)} 
                  />
                </>
              )}

              {/* [18. Summary & Key Terms 전용 요약 및 용어 사전 뷰] */}
              {currentSection.id === 'sec-summary-terms' && (
                <ChapterSummaryTermsSection
                  summaryPoints={chapterSummaryPoints}
                  keyTerms={keyTermsList}
                  customWords={customWords}
                  onAddCustomWord={handleAddCustomWord}
                  onNavigateToEvidence={handleNavigateToEvidence}
                />
              )}

              {/* Quiz view */}
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
                <div />

                <div className="flex items-center space-x-2">
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
                  className={`flex items-center justify-center w-10 h-9 rounded text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                    currentIndex === sections.length - 1
                      ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                      : 'text-white bg-blue-600 hover:bg-blue-700'
                  }`}
                  aria-label="다음 섹션"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Member Sign Up & Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Track Selector Modal */}
      <TrackSelectModal
        isOpen={isTrackSelectOpen}
        onClose={() => setIsTrackSelectOpen(false)}
        currentTrack={currentTrack}
        onSelectTrack={(track) => setCurrentTrack(track)}
      />

      {/* Floating Outline Toggle Button for Mobile */}
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
