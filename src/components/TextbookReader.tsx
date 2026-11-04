import React, { useState, useRef, useMemo } from 'react';
import { ChapterSection, CustomWord, HighlightColor, TextHighlight } from '../types';
import { getPageImagesForSection, PageImageInfo } from '../data/textbookPageImages';
import { 
  BookOpen, 
  Languages, 
  BookmarkPlus, 
  Check, 
  Plus, 
  StickyNote, 
  Sparkles,
  X,
  FileText,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Columns,
  ChevronDown,
  ExternalLink,
  Highlighter,
  Trash2,
  Palette,
  CheckCircle2,
  Underline as UnderlineIcon,
  Volume2,
  VolumeX,
  Play,
  Square,
  Headphones
} from 'lucide-react';
import { findBilingualCounterpart, cleanTerm } from '../utils/bilingualMatcher';

interface TextbookReaderProps {
  section: ChapterSection;
  onAddCustomWord: (wordData: { word: string; meaning: string; contextSentence?: string; sourceSectionTitle?: string; sourcePage?: number }) => void;
  customWords: CustomWord[];
  highlights?: TextHighlight[];
  onSaveHighlight?: (highlight: TextHighlight | TextHighlight[]) => void;
  onDeleteHighlight?: (id: string | string[]) => void;
  onClearSectionHighlights?: (sectionId: string) => void;
}

export const TextbookReader: React.FC<TextbookReaderProps> = ({ 
  section,
  onAddCustomWord,
  customWords,
  highlights = [],
  onSaveHighlight,
  onDeleteHighlight,
  onClearSectionHighlights
}) => {
  // Main view mode: 'text' (default) | 'visual' (page gallery) | 'split' (side-by-side text & scan)
  const [viewLayout, setViewLayout] = useState<'text' | 'visual' | 'split'>('text');
  const [langMode, setLangMode] = useState<'ko' | 'en' | 'side-by-side'>('ko');
  
  // Toggle for the primary textbook reader (Default: true / open as requested)
  const [isTextbookExpanded, setIsTextbookExpanded] = useState<boolean>(true);
  
  // Selected text for custom vocabulary & highlighting
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [modalWord, setModalWord] = useState<string>('');
  const [modalMeaning, setModalMeaning] = useState<string>('');
  const [modalContext, setModalContext] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active highlight popover (when clicking an existing highlight)
  const [activeHighlightPopover, setActiveHighlightPopover] = useState<{
    highlight: TextHighlight;
    x: number;
    y: number;
  } | null>(null);

  // Modal to review all highlights in this section
  const [isHighlightListOpen, setIsHighlightListOpen] = useState<boolean>(false);

  // Lightbox modal state for high-res textbook page viewing
  const [lightboxImage, setLightboxImage] = useState<PageImageInfo | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageImages = getPageImagesForSection(section.pages);
  const safePageIndex = Math.min(activePageIndex, Math.max(0, pageImages.length - 1));
  const activeImage = pageImages[safePageIndex] || pageImages[0];

  // Highlights filtered for current section
  const sectionHighlights = useMemo(() => {
    return highlights.filter(h => h.sectionId === section.id);
  }, [highlights, section.id]);

  // TTS (Text-to-Speech) state for reading English textbook aloud
  const [ttsState, setTtsState] = useState<{
    isPlaying: boolean;
    isPaused: boolean;
    currentParagraphIndex: number | null;
    speed: number;
  }>({
    isPlaying: false,
    isPaused: false,
    currentParagraphIndex: null,
    speed: 1.0,
  });

  const ttsSequenceRef = useRef<{ cancelRequested: boolean }>({ cancelRequested: false });

  const stopTTS = () => {
    ttsSequenceRef.current.cancelRequested = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setTtsState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentParagraphIndex: null,
    }));
  };

  const getBestEnglishVoice = (): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen')));
    if (naturalVoice) return naturalVoice;
    return voices.find(v => v.lang.startsWith('en')) || null;
  };

  const speakSingleParagraph = (text: string, index: number, onComplete?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setToastMessage('이 브라우저는 음성 읽기(TTS)를 지원하지 않습니다.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text: strip brackets, asterisks
    const cleanText = text.replace(/\[\d+\]/g, '').replace(/\*+/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = ttsState.speed;
    utterance.pitch = 1.0;

    const voice = getBestEnglishVoice();
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setTtsState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        currentParagraphIndex: index,
      }));
    };

    utterance.onend = () => {
      if (onComplete) {
        onComplete();
      } else {
        setTtsState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentParagraphIndex: null,
        }));
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.warn('TTS error:', e);
      }
      setTtsState(prev => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentParagraphIndex: null,
      }));
    };

    window.speechSynthesis.speak(utterance);
  };

  const playFullEnglishSection = () => {
    if (ttsState.isPlaying && !ttsState.isPaused) {
      stopTTS();
      return;
    }
    ttsSequenceRef.current.cancelRequested = false;
    const paragraphs = section.contentEn;
    if (!paragraphs || paragraphs.length === 0) return;

    const playStep = (idx: number) => {
      if (ttsSequenceRef.current.cancelRequested || idx >= paragraphs.length) {
        setTtsState(prev => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentParagraphIndex: null,
        }));
        return;
      }

      speakSingleParagraph(paragraphs[idx], idx, () => {
        setTimeout(() => {
          if (!ttsSequenceRef.current.cancelRequested) {
            playStep(idx + 1);
          }
        }, 500);
      });
    };

    playStep(0);
  };

  // Stop TTS on section changes or unmount
  React.useEffect(() => {
    stopTTS();
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [section.id]);

  // Reset active page index when section changes
  React.useEffect(() => {
    setActivePageIndex(0);
    setActiveHighlightPopover(null);
    setSelectionPos(null);
  }, [section.id]);

  // Support Left / Right arrow keys for page flipping in visual mode
  React.useEffect(() => {
    if (pageImages.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not flip if modal or input is focused
      if (isAddModalOpen || isHighlightListOpen) return;
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (e.key === 'ArrowLeft') {
        if (lightboxImage) {
          const cIdx = pageImages.findIndex(img => img.pageNumber === lightboxImage.pageNumber);
          if (cIdx > 0) {
            setLightboxImage(pageImages[cIdx - 1]);
            setActivePageIndex(cIdx - 1);
          }
        } else if (viewLayout === 'visual') {
          setActivePageIndex(prev => Math.max(0, prev - 1));
        }
      } else if (e.key === 'ArrowRight') {
        if (lightboxImage) {
          const cIdx = pageImages.findIndex(img => img.pageNumber === lightboxImage.pageNumber);
          if (cIdx >= 0 && cIdx < pageImages.length - 1) {
            setLightboxImage(pageImages[cIdx + 1]);
            setActivePageIndex(cIdx + 1);
          }
        } else if (viewLayout === 'visual') {
          setActivePageIndex(prev => Math.min(pageImages.length - 1, prev + 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewLayout, pageImages, isAddModalOpen, isHighlightListOpen, lightboxImage]);

  // Detect text selection in textbook (supports words and full sentences up to 350 chars)
  const handleSelectionCheck = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      if (!isAddModalOpen && !activeHighlightPopover) {
        setSelectionPos(null);
      }
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 0 && text.length < 350) {
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          setSelectedText(text);
          setActiveHighlightPopover(null);
          setSelectionPos({
            x: rect.left + rect.width / 2,
            y: Math.max(10, rect.top - 12)
          });
        }
      } catch {
        setSelectionPos(null);
      }
    } else {
      setSelectionPos(null);
    }
  };

  const handleMouseUp = () => {
    handleSelectionCheck();
  };

  // Document-level selection listener for mouse, touch (smartphones/tablets), and stylus
  React.useEffect(() => {
    const onDocMouseUp = () => {
      // Small timeout allows browser selection to settle
      setTimeout(handleSelectionCheck, 20);
    };

    document.addEventListener('mouseup', onDocMouseUp);
    document.addEventListener('touchend', onDocMouseUp);
    return () => {
      document.removeEventListener('mouseup', onDocMouseUp);
      document.removeEventListener('touchend', onDocMouseUp);
    };
  }, [section.id, isAddModalOpen, activeHighlightPopover]);

  // Highlighting Action Handlers
  const handleApplyHighlight = (color: HighlightColor) => {
    if (!selectedText.trim()) return;
    const cleanSelected = cleanTerm(selectedText);
    const mainId = `hl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Look for bilingual counterpart in opposite language
    const counterpart = findBilingualCounterpart(selectedText, section, customWords);
    const counterpartId = counterpart ? `hl_${Date.now() + 1}_${Math.random().toString(36).substring(2, 7)}` : undefined;

    const newHighlight: TextHighlight = {
      id: mainId,
      sectionId: section.id,
      text: cleanSelected || selectedText.trim(),
      color,
      createdAt: new Date().toISOString(),
      counterpartId: counterpartId
    };

    const toSave: TextHighlight[] = [newHighlight];

    if (counterpart && counterpart.text && counterpartId) {
      const counterpartHighlight: TextHighlight = {
        id: counterpartId,
        sectionId: section.id,
        text: counterpart.text,
        color,
        createdAt: new Date().toISOString(),
        counterpartId: mainId
      };
      toSave.push(counterpartHighlight);

      // Auto-switch to 'side-by-side' (한영 대조) mode so child immediately sees both highlights together!
      if (langMode !== 'side-by-side') {
        setLangMode('side-by-side');
      }
    }
    
    // Save atomically in a single batch
    onSaveHighlight?.(toSave);
    
    const colorLabel = 
      color === 'yellow' ? '노랑 형광펜' :
      color === 'mint' ? '민트 형광펜' :
      color === 'pink' ? '핑크 형광펜' :
      color === 'underline-red' ? '빨간색 밑줄' : '파란색 밑줄';

    if (counterpart && counterpart.text) {
      setToastMessage(`✓ 한·영 동시 표시: "${cleanSelected}" ↔ "${counterpart.text}" 에 ${colorLabel}이 함께 적용되었습니다! (한·영 대조 뷰로 나란히 확인)`);
    } else {
      setToastMessage(`✓ ${colorLabel}으로 중요 표시되었습니다!`);
    }
    setTimeout(() => setToastMessage(null), 3500);
    
    window.getSelection()?.removeAllRanges();
    setSelectionPos(null);
    setSelectedText('');
  };

  const handleUpdateHighlightColor = (highlight: TextHighlight, newColor: HighlightColor) => {
    const updated = { ...highlight, color: newColor };
    const toUpdate: TextHighlight[] = [updated];

    // If there is a linked counterpart, update its color too!
    if (highlight.counterpartId) {
      const counterpart = sectionHighlights.find(h => h.id === highlight.counterpartId);
      if (counterpart) {
        toUpdate.push({ ...counterpart, color: newColor });
      }
    } else {
      const paired = sectionHighlights.find(h => h.counterpartId === highlight.id);
      if (paired) {
        toUpdate.push({ ...paired, color: newColor });
      }
    }

    onSaveHighlight?.(toUpdate);
    setActiveHighlightPopover(null);
    setToastMessage('표시 색상이 변경되었습니다.');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleDeleteHighlightItem = (id: string) => {
    const hl = sectionHighlights.find(h => h.id === id);
    const idsToDelete: string[] = [id];

    // If there is a linked counterpart, delete it too!
    if (hl?.counterpartId) {
      idsToDelete.push(hl.counterpartId);
    } else if (hl) {
      const paired = sectionHighlights.find(h => h.counterpartId === hl.id);
      if (paired) {
        idsToDelete.push(paired.id);
      }
    }

    onDeleteHighlight?.(idsToDelete);
    setActiveHighlightPopover(null);
    setToastMessage('하이라이트가 삭제되었습니다.');
    setTimeout(() => setToastMessage(null), 2000);
  };

  const getHighlightClassName = (color: HighlightColor) => {
    switch (color) {
      case 'yellow':
        return 'bg-amber-200/90 text-amber-950 px-1 py-0.5 rounded shadow-2xs border-b border-amber-300 font-medium cursor-pointer hover:bg-amber-300 transition-colors inline';
      case 'mint':
        return 'bg-emerald-200/90 text-emerald-950 px-1 py-0.5 rounded shadow-2xs border-b border-emerald-300 font-medium cursor-pointer hover:bg-emerald-300 transition-colors inline';
      case 'pink':
        return 'bg-pink-200/90 text-pink-950 px-1 py-0.5 rounded shadow-2xs border-b border-pink-300 font-medium cursor-pointer hover:bg-pink-300 transition-colors inline';
      case 'underline-red':
        return 'underline decoration-red-500 decoration-[2.5px] underline-offset-4 font-semibold text-gray-900 bg-red-50/60 px-0.5 rounded cursor-pointer hover:bg-red-100 transition-colors inline';
      case 'underline-blue':
        return 'underline decoration-blue-600 decoration-[2.5px] underline-offset-4 font-semibold text-gray-900 bg-blue-50/60 px-0.5 rounded cursor-pointer hover:bg-blue-100 transition-colors inline';
      default:
        return 'bg-amber-200/90 text-amber-950 px-1 py-0.5 rounded cursor-pointer inline';
    }
  };

  // Helper to render paragraph with non-overlapping highlights
  const renderAnnotatedParagraph = (paragraphText: string, _lang: 'ko' | 'en', _pIndex: number) => {
    const matches: { start: number; end: number; highlight: TextHighlight }[] = [];
    
    // Sort highlights by length descending to match longer phrases first
    const relevantHighlights = [...sectionHighlights].sort((a, b) => b.text.length - a.text.length);
    const lowerPara = paragraphText.toLowerCase();

    for (const hl of relevantHighlights) {
      if (!hl.text || hl.text.length < 2) continue;
      const lowerHl = hl.text.toLowerCase();
      let searchPos = 0;
      while (searchPos < paragraphText.length) {
        // Case-insensitive match so English capitalization differences match seamlessly
        const idx = lowerPara.indexOf(lowerHl, searchPos);
        if (idx === -1) break;
        const end = idx + hl.text.length;
        
        // Prevent overlap with already registered matches
        const overlaps = matches.some(m => Math.max(m.start, idx) < Math.min(m.end, end));
        if (!overlaps) {
          matches.push({ start: idx, end, highlight: hl });
        }
        searchPos = idx + 1;
      }
    }

    if (matches.length === 0) {
      return paragraphText;
    }

    matches.sort((a, b) => a.start - b.start);

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((m, idx) => {
      if (m.start > lastIndex) {
        elements.push(paragraphText.slice(lastIndex, m.start));
      }
      
      elements.push(
        <mark
          key={`hl-${m.highlight.id}-${idx}`}
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            setActiveHighlightPopover({
              highlight: m.highlight,
              x: rect.left + rect.width / 2,
              y: Math.max(10, rect.top - 10)
            });
          }}
          title="클릭하여 색상 변경 또는 지우기"
          className={getHighlightClassName(m.highlight.color)}
        >
          {paragraphText.slice(m.start, m.end)}
        </mark>
      );

      lastIndex = m.end;
    });

    if (lastIndex < paragraphText.length) {
      elements.push(paragraphText.slice(lastIndex));
    }

    return <>{elements}</>;
  };

  const handleOpenAddModal = (wordToUse?: string) => {
    const word = wordToUse || selectedText || '';
    setModalWord(word);
    setModalMeaning('');
    
    let foundContext = '';
    const allParagraphs = [...section.contentKo, ...section.contentEn];
    if (word) {
      const matched = allParagraphs.find(p => p.includes(word));
      if (matched) {
        foundContext = matched.slice(0, 150) + (matched.length > 150 ? '...' : '');
      }
    }
    setModalContext(foundContext);
    setIsAddModalOpen(true);
    setSelectionPos(null);
  };

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalWord.trim()) return;

    onAddCustomWord({
      word: modalWord.trim(),
      meaning: modalMeaning.trim() || '교재 본문에서 추가한 용어',
      contextSentence: modalContext.trim(),
      sourceSectionTitle: section.titleKo,
      sourcePage: section.pages[0] || 429
    });

    setIsAddModalOpen(false);
    setToastMessage(`'${modalWord.trim()}' 단어가 나만의 용어 사전에 등록되었습니다!`);
    setTimeout(() => setToastMessage(null), 3000);
    
    window.getSelection()?.removeAllRanges();
    setSelectionPos(null);
  };

  const isWordAlreadySaved = (word: string) => {
    return customWords.some(w => w.word.toLowerCase() === word.toLowerCase());
  };

  const handleOpenLightbox = (img: PageImageInfo) => {
    setLightboxImage(img);
    setZoomLevel(1);
  };

  const renderTTSAudioBar = (isCompact = false) => (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50/70 to-blue-50/40 border border-blue-200/80 rounded-xl p-3 sm:p-3.5 mb-4 shadow-2xs flex flex-wrap items-center justify-between gap-2.5 transition-all">
      <div className="flex items-center space-x-2.5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white transition-all shadow-2xs shrink-0 ${
          ttsState.isPlaying ? 'bg-indigo-600 animate-pulse' : 'bg-blue-600'
        }`}>
          <Headphones className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="text-xs font-bold text-gray-900">
              영어 원문 소리내어 읽기 (Read Aloud)
            </span>
            {ttsState.isPlaying && (
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
                <Volume2 className="w-3 h-3" />
                <span>
                  {ttsState.currentParagraphIndex !== null
                    ? `${ttsState.currentParagraphIndex + 1}번째 문단 읽는 중`
                    : '재생 중'}
                </span>
              </span>
            )}
          </div>
          {!isCompact && (
            <p className="text-[11px] text-gray-500 mt-0.5">
              💡 원어민 발음으로 들으며 과학 용어 발음과 문맥을 익혀보세요. 각 문단 옆 스피커 아이콘을 누르면 개별 듣기도 가능합니다.
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
        {/* Speed selection */}
        <div className="flex items-center space-x-0.5 bg-white border border-gray-200 rounded-lg p-0.5 text-[11px] font-semibold text-gray-600 shadow-2xs">
          <span className="px-1 text-gray-400 text-[10px]">속도:</span>
          {[
            { label: '0.8x 천천히', value: 0.8 },
            { label: '1.0x 표준', value: 1.0 },
            { label: '1.2x 빠름', value: 1.2 },
          ].map((spd) => (
            <button
              key={spd.value}
              onClick={() => {
                setTtsState(prev => ({ ...prev, speed: spd.value }));
                if (ttsState.isPlaying) {
                  stopTTS();
                }
              }}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                ttsState.speed === spd.value
                  ? 'bg-blue-600 text-white font-bold'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {spd.label}
            </button>
          ))}
        </div>

        {/* Play/Stop Button */}
        {ttsState.isPlaying ? (
          <button
            onClick={stopTTS}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>읽기 중지</span>
          </button>
        ) : (
          <button
            onClick={playFullEnglishSection}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>전체 듣기</span>
          </button>
        )}
      </div>
    </div>
  );

  const renderEnglishParagraphItem = (p: string, i: number) => {
    const isCurrentlyPlaying = ttsState.currentParagraphIndex === i && ttsState.isPlaying;

    return (
      <div
        key={i}
        className={`group relative p-2.5 rounded-lg transition-all ${
          isCurrentlyPlaying
            ? 'bg-indigo-50/90 ring-2 ring-indigo-400 shadow-2xs'
            : 'hover:bg-blue-50/20'
        }`}
      >
        <div className="flex items-start justify-between gap-2.5">
          <p className="font-serif text-justify text-sm sm:text-base text-gray-800 leading-relaxed flex-1 select-text">
            {renderAnnotatedParagraph(p, 'en', i)}
          </p>
          <button
            onClick={() => {
              if (isCurrentlyPlaying) {
                stopTTS();
              } else {
                speakSingleParagraph(p, i);
              }
            }}
            className={`p-1.5 rounded-md transition-all shrink-0 cursor-pointer ${
              isCurrentlyPlaying
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 opacity-60 group-hover:opacity-100'
            }`}
            title={isCurrentlyPlaying ? '문단 읽기 중지' : '이 문단 영어 음성으로 듣기'}
          >
            {isCurrentlyPlaying ? (
              <Square className="w-3.5 h-3.5 fill-current animate-pulse" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div id="textbook-reader-container" className="my-6 space-y-4" ref={containerRef} onMouseUp={handleMouseUp}>
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs sm:text-sm flex items-center space-x-2 border border-gray-700 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Selection Tooltip (Highlighting & Dictionary) */}
      {selectionPos && selectedText && (() => {
        const counterpart = findBilingualCounterpart(selectedText, section, customWords);
        return (
          <div
            style={{
              position: 'fixed',
              left: `${selectionPos.x}px`,
              top: `${selectionPos.y}px`,
              transform: 'translate(-50%, -100%)',
              zIndex: 50
            }}
            className="animate-in fade-in zoom-in-95 duration-150 flex flex-col items-center select-none"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {counterpart && (
              <div className="mb-1.5 px-2.5 py-0.5 rounded-full bg-blue-600/95 text-white text-[11px] font-bold shadow-lg flex items-center space-x-1.5 border border-blue-400 backdrop-blur-xs">
                <span>🔄 한·영 동시 매칭:</span>
                <span className="text-yellow-300">"{counterpart.text}"</span>
                <span className="text-[10px] text-blue-200">함께 표시됨</span>
              </div>
            )}
            <div className="flex items-center bg-gray-900/95 backdrop-blur-sm text-white px-2 py-1.5 rounded-full shadow-2xl border border-gray-700 space-x-1.5">
              {/* Highlighter Color Buttons */}
              <div className="flex items-center space-x-1 pl-1 pr-1.5 border-r border-gray-700">
                <button
                  title="노랑 형광펜으로 칠하기"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleApplyHighlight('yellow');
                  }}
                  className="w-5 h-5 rounded-full bg-amber-300 hover:scale-115 transition-transform border border-amber-400 shadow-2xs cursor-pointer"
                />
                <button
                  title="민트 형광펜으로 칠하기"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleApplyHighlight('mint');
                  }}
                  className="w-5 h-5 rounded-full bg-emerald-400 hover:scale-115 transition-transform border border-emerald-500 shadow-2xs cursor-pointer"
                />
                <button
                  title="핑크 형광펜으로 칠하기"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleApplyHighlight('pink');
                  }}
                  className="w-5 h-5 rounded-full bg-pink-400 hover:scale-115 transition-transform border border-pink-500 shadow-2xs cursor-pointer"
                />
              </div>

              {/* Underline Buttons */}
              <div className="flex items-center space-x-1 pr-1.5 border-r border-gray-700">
                <button
                  title="빨간색 밑줄 긋기"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleApplyHighlight('underline-red');
                  }}
                  className="px-1.5 py-0.5 rounded text-[11px] font-bold text-red-400 hover:bg-gray-800 underline decoration-red-500 decoration-2 transition-colors cursor-pointer"
                >
                  빨강 밑줄
                </button>
                <button
                  title="파란색 밑줄 긋기"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleApplyHighlight('underline-blue');
                  }}
                  className="px-1.5 py-0.5 rounded text-[11px] font-bold text-blue-400 hover:bg-gray-800 underline decoration-blue-500 decoration-2 transition-colors cursor-pointer"
                >
                  파랑 밑줄
                </button>
              </div>

              {/* Add to Vocabulary */}
              <button
                title="나만의 단어장에 등록"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleOpenAddModal();
                }}
                className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-all cursor-pointer"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">단어장</span>
              </button>

              {/* Close */}
              <button
                title="선택 닫기"
                onMouseDown={(e) => {
                  e.preventDefault();
                  window.getSelection()?.removeAllRanges();
                  setSelectionPos(null);
                }}
                className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })()}

      {/* Active Highlight Click Popover (Change color, delete, or add to vocab) */}
      {activeHighlightPopover && (
        <div
          style={{
            position: 'fixed',
            left: `${activeHighlightPopover.x}px`,
            top: `${activeHighlightPopover.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 50
          }}
          className="animate-in fade-in zoom-in-95 duration-150 bg-white text-gray-900 p-2 rounded-xl shadow-2xl border border-gray-200 flex items-center space-x-2 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-[11px] font-bold text-gray-500 pl-1">표시 스타일:</span>
          <div className="flex items-center space-x-1">
            <button
              title="노랑 형광펜"
              onClick={() => handleUpdateHighlightColor(activeHighlightPopover.highlight, 'yellow')}
              className="w-5 h-5 rounded-full bg-amber-300 hover:scale-115 transition-transform border border-amber-400 cursor-pointer"
            />
            <button
              title="민트 형광펜"
              onClick={() => handleUpdateHighlightColor(activeHighlightPopover.highlight, 'mint')}
              className="w-5 h-5 rounded-full bg-emerald-400 hover:scale-115 transition-transform border border-emerald-500 cursor-pointer"
            />
            <button
              title="핑크 형광펜"
              onClick={() => handleUpdateHighlightColor(activeHighlightPopover.highlight, 'pink')}
              className="w-5 h-5 rounded-full bg-pink-400 hover:scale-115 transition-transform border border-pink-500 cursor-pointer"
            />
            <button
              title="빨강 밑줄"
              onClick={() => handleUpdateHighlightColor(activeHighlightPopover.highlight, 'underline-red')}
              className="px-1.5 py-0.5 text-[11px] font-bold text-red-600 underline decoration-red-500 hover:bg-red-50 rounded cursor-pointer"
            >
              U
            </button>
            <button
              title="파랑 밑줄"
              onClick={() => handleUpdateHighlightColor(activeHighlightPopover.highlight, 'underline-blue')}
              className="px-1.5 py-0.5 text-[11px] font-bold text-blue-600 underline decoration-blue-600 hover:bg-blue-50 rounded cursor-pointer"
            >
              U
            </button>
          </div>

          <div className="h-4 w-px bg-gray-200" />

          {/* Delete Highlight */}
          <button
            title="지우개 (하이라이트 삭제)"
            onClick={() => handleDeleteHighlightItem(activeHighlightPopover.highlight.id)}
            className="flex items-center space-x-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded font-semibold transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">지우기</span>
          </button>

          {/* Wordbook shortcut */}
          <button
            title="나만의 단어장에 저장"
            onClick={() => {
              handleOpenAddModal(activeHighlightPopover.highlight.text);
              setActiveHighlightPopover(null);
            }}
            className="flex items-center space-x-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded font-semibold transition-colors cursor-pointer"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span className="text-[11px]">단어장</span>
          </button>

          {/* Close */}
          <button
            onClick={() => setActiveHighlightPopover(null)}
            className="p-1 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header Card: Title + Mode Toggle Buttons */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border border-blue-200/80 rounded-xl p-4 shadow-2xs space-y-3 transition-all duration-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div 
            onClick={() => setIsTextbookExpanded(prev => !prev)}
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsTextbookExpanded(prev => !prev);
              }}
              className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white flex items-center justify-center font-bold shadow-xs shrink-0 cursor-pointer transition-all relative group/btn"
              title={isTextbookExpanded ? '교재 원문 접기' : '교재 원문 열기 (클릭 시 펼침)'}
              aria-label="교재 원문 토글"
            >
              <BookOpen className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-blue-700 border border-blue-200 flex items-center justify-center shadow-xs transition-transform duration-200 ${isTextbookExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-3 h-3" />
              </span>
            </button>
            <div>
              <h4 className="font-bold text-gray-900 text-sm flex items-center space-x-1.5 group-hover:text-blue-700 transition-colors">
                <span>교재 원문</span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  p. {section.pages.join(', ')} · 본문 완전 수록
                </span>
              </h4>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Layout Selector */}
            <div className="flex items-center space-x-1 bg-white/90 border border-gray-200/80 p-1 rounded-lg text-xs font-semibold shadow-2xs">
              <button
                onClick={() => {
                  setViewLayout('text');
                  setIsTextbookExpanded(true);
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                  viewLayout === 'text'
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="텍스트 번역 및 해설 중심 모드"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>텍스트</span>
              </button>
              <button
                onClick={() => {
                  setViewLayout('visual');
                  setIsTextbookExpanded(true);
                }}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                  viewLayout === 'visual'
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="원본 교재 고화질 사진 및 도표 중심 모드"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>교재</span>
              </button>
              <button
                onClick={() => {
                  setViewLayout('split');
                  setIsTextbookExpanded(true);
                }}
                className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                  viewLayout === 'split'
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="텍스트 번역과 원본 삽화를 나란히 배치"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>함께 보기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub toolbar: Language selector & Word add button (only in text or split mode) */}
        {isTextbookExpanded && viewLayout !== 'visual' && (
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-blue-100 text-xs animate-in fade-in duration-150">
            <div className="flex items-center space-x-2">
              {/* Language Toggle */}
              <div className="flex items-center space-x-1 border border-gray-200 rounded-md bg-gray-50 p-0.5">
                <button
                  onClick={() => setLangMode('ko')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                    langMode === 'ko' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  한글
                </button>
                <button
                  onClick={() => setLangMode('en')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                    langMode === 'en' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  영어
                </button>
                <button
                  onClick={() => setLangMode('side-by-side')}
                  className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                    langMode === 'side-by-side' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  한영
                </button>
              </div>

              <button
                onClick={() => handleOpenAddModal('')}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>단어장</span>
              </button>

              {/* Highlight list / reviewer button */}
              <button
                onClick={() => setIsHighlightListOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors cursor-pointer"
                title="본문 형광펜 표시 목록 열기"
              >
                <Highlighter className="w-3 h-3 text-amber-600" />
                <span>형광펜 ({sectionHighlights.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Primary Textbook Content Body - Collapsible (Default: Open) */}
      {isTextbookExpanded && (
        <div className="space-y-4 animate-in fade-in duration-200">

      {/* ======================================================== */}
      {/* 1. VISUAL MODE: Single-Page High-Res Viewer with Flipping */}
      {/* ======================================================== */}
      {viewLayout === 'visual' && activeImage && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Top Page Header & Quick Flipping */}
            <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="bg-blue-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow-2xs">
                  교재 p.{activeImage.pageNumber} 원본
                </span>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {safePageIndex + 1} / {pageImages.length} 페이지
                </span>
                <h4 className="font-bold text-gray-800 text-xs sm:text-sm truncate max-w-xs sm:max-w-md">
                  {activeImage.title}
                </h4>
              </div>

              <div className="flex items-center space-x-2">
                {/* Previous & Next Page buttons in header */}
                {pageImages.length > 1 && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setActivePageIndex(prev => Math.max(0, prev - 1))}
                      disabled={safePageIndex === 0}
                      className="flex items-center space-x-1 text-xs font-bold text-gray-700 bg-white border border-gray-300 px-2.5 py-1 rounded shadow-2xs hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="이전 페이지 (단축키: ←)"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>이전장</span>
                    </button>
                    <button
                      onClick={() => setActivePageIndex(prev => Math.min(pageImages.length - 1, prev + 1))}
                      disabled={safePageIndex >= pageImages.length - 1}
                      className="flex items-center space-x-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-300 px-2.5 py-1 rounded shadow-2xs hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="다음 페이지 (단축키: →)"
                    >
                      <span>다음장</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleOpenLightbox(activeImage)}
                  className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-white border border-gray-200 px-2.5 py-1 rounded shadow-2xs hover:bg-blue-50 transition-colors cursor-pointer"
                  title="초고화질 라이트박스 팝업 확대"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">크게 확대 보기</span>
                </button>
              </div>
            </div>

            {/* High-res Image Canvas with Overlay Navigation */}
            <div className="relative bg-gray-100 flex items-center justify-center p-2 sm:p-5 group">
              {/* Previous page overlay arrow button */}
              {pageImages.length > 1 && safePageIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePageIndex(prev => Math.max(0, prev - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer backdrop-blur-xs"
                  title={`이전 페이지 (p.${pageImages[safePageIndex - 1]?.pageNumber})`}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next page overlay arrow button */}
              {pageImages.length > 1 && safePageIndex < pageImages.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePageIndex(prev => Math.min(pageImages.length - 1, prev + 1));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer backdrop-blur-xs"
                  title={`다음 페이지 (p.${pageImages[safePageIndex + 1]?.pageNumber})`}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Main Image */}
              <div 
                className="cursor-zoom-in relative flex items-center justify-center"
                onClick={() => handleOpenLightbox(activeImage)}
              >
                <img
                  src={activeImage.imageSrc}
                  alt={activeImage.title}
                  className="max-h-[850px] w-auto object-contain rounded-md shadow-md group-hover:scale-[1.008] transition-transform duration-200"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                  <div className="opacity-0 group-hover:opacity-100 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-opacity shadow-lg">
                    <Eye className="w-4 h-4" />
                    <span>클릭하여 초고화질 확대 및 탐색</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key illustrations breakdown for the active page */}
            <div className="p-4 bg-blue-50/40 border-t border-gray-100 space-y-1.5">
              <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wide flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>p.{activeImage.pageNumber}의 핵심 시각 자료 & 도표 가이드</span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                {activeImage.keyIllustrations.map((ill, iIdx) => (
                  <li key={iIdx} className="flex items-start space-x-1.5 bg-white p-2 rounded border border-blue-100">
                    <span className="text-blue-500 font-bold">✔</span>
                    <span>{ill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SPLIT MODE: Side-by-side Text & Scanned Image        */}
      {/* ======================================================== */}
      {viewLayout === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Text reader (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 p-5 shadow-xs space-y-4 select-text">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="font-bold text-blue-700 text-xs uppercase">
                {langMode === 'en' ? 'English Textbook Text' : '한국어 정밀 번역 본문'}
              </span>
              <span className="text-[11px] text-gray-400">단어 드래그로 단어장에 추가</span>
            </div>

            <div className="space-y-3.5 text-sm text-gray-800 leading-relaxed max-h-[750px] overflow-y-auto pr-2">
              {langMode === 'en' && renderTTSAudioBar(true)}
              {langMode === 'en'
                ? section.contentEn.map((p, i) => renderEnglishParagraphItem(p, i))
                : section.contentKo.map((p, i) => (
                    <p key={i} className="hover:bg-blue-50/30 p-1 rounded transition-colors text-justify">
                      {renderAnnotatedParagraph(p, 'ko', i)}
                    </p>
                  ))}

              {section.sidebar && (
                <div className="mt-4 border border-amber-300 bg-amber-50/70 rounded-lg p-3.5 text-xs text-amber-900 leading-relaxed">
                  <div className="font-bold text-amber-950 mb-1">
                    ★ 교재 심화: {section.sidebar.titleKo}
                  </div>
                  {section.sidebar.contentKo.map((p, i) => (
                    <p key={i} className="mt-1">{renderAnnotatedParagraph(p, 'ko', i)}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Scanned Textbook Visual Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 p-4 shadow-xs sticky top-20">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-gray-900">교재 p.{activeImage?.pageNumber} 원본</span>
                <span className="text-[10px] text-gray-400 font-mono">({activePageIndex + 1}/{pageImages.length})</span>
              </div>
              <button
                onClick={() => activeImage && handleOpenLightbox(activeImage)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>확대 보기</span>
              </button>
            </div>

            {/* Scanned Image Preview */}
            {activeImage && (
              <div 
                className="relative bg-gray-50 border border-gray-100 rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => handleOpenLightbox(activeImage)}
              >
                <img
                  src={activeImage.imageSrc}
                  alt={activeImage.title}
                  className="w-full max-h-[560px] object-contain mx-auto group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-black/75 text-white text-xs px-3 py-1.5 rounded-full shadow-lg transition-opacity flex items-center space-x-1">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>클릭하여 전체화면</span>
                  </span>
                </div>
              </div>
            )}

            {/* Page switcher pagination */}
            {pageImages.length > 1 && (
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 text-xs">
                <button
                  onClick={() => setActivePageIndex(prev => Math.max(0, prev - 1))}
                  disabled={activePageIndex === 0}
                  className="p-1 rounded text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>이전 페이지</span>
                </button>
                <span className="font-mono text-gray-600 text-xs">
                  p.{activeImage?.pageNumber}
                </span>
                <button
                  onClick={() => setActivePageIndex(prev => Math.min(pageImages.length - 1, prev + 1))}
                  disabled={activePageIndex === pageImages.length - 1}
                  className="p-1 rounded text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1"
                >
                  <span>다음 페이지</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TEXT MODE: Text First, then Optional Textbook Scans   */}
      {/* ======================================================== */}
      {viewLayout === 'text' && (
        <div className="space-y-6">
          {/* 1. Main Text Content Box (FIRST: Study with text first) */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-7 shadow-xs">
            {langMode === 'side-by-side' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                {/* Left: Korean */}
                <div className="space-y-4 pr-0 lg:pr-4">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-700 uppercase tracking-wide border-b border-blue-100 pb-1.5">
                    <span>한국어 정밀 번역</span>
                    <span className="text-[10px] text-gray-400 font-normal">단어 드래그로 사전 추가 가능</span>
                  </div>
                  <div className="space-y-3.5 text-sm text-gray-800 leading-relaxed select-text">
                    {section.contentKo.map((p, i) => (
                      <p key={i} className="text-justify hover:bg-blue-50/20 p-1 rounded transition-colors">
                        {renderAnnotatedParagraph(p, 'ko', i)}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Right: English Original */}
                <div className="space-y-4 pt-4 lg:pt-0 pl-0 lg:pl-6 font-serif">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 pb-1.5 font-sans">
                    <span>English Original Textbook</span>
                    <span className="text-[10px] text-gray-400 font-normal">Select word to save</span>
                  </div>
                  {renderTTSAudioBar(true)}
                  <div className="space-y-3.5 text-sm text-gray-700 leading-relaxed select-text">
                    {section.contentEn.map((p, i) => renderEnglishParagraphItem(p, i))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 select-text">
                {langMode === 'en' && renderTTSAudioBar(false)}
                <div className="space-y-3.5 text-sm sm:text-base text-gray-800 leading-relaxed">
                  {langMode === 'ko'
                    ? section.contentKo.map((p, i) => (
                        <p 
                          key={i} 
                          className="p-1 rounded hover:bg-blue-50/20 transition-colors text-justify"
                        >
                          {renderAnnotatedParagraph(p, 'ko', i)}
                        </p>
                      ))
                    : section.contentEn.map((p, i) => renderEnglishParagraphItem(p, i))}
                </div>
              </div>
            )}

            {/* Sidebar Callout Box if exists in textbook */}
            {section.sidebar && (
              <div className="mt-6 border border-amber-300 bg-amber-50/70 rounded-lg p-4 sm:p-5 select-text">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200 mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="bg-amber-600 text-white font-bold text-xs px-2 py-0.5 rounded">
                      교재 심화 탐구
                    </span>
                    <h4 className="font-bold text-amber-950 text-sm sm:text-base">
                      {section.sidebar.titleKo}
                    </h4>
                  </div>
                  <span className="text-xs text-amber-800/70 italic hidden sm:inline">
                    {section.sidebar.titleEn}
                  </span>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm text-amber-900 leading-relaxed">
                  {(langMode === 'en' ? section.sidebar.contentEn : section.sidebar.contentKo).map((p, i) => (
                    <p key={i}>{renderAnnotatedParagraph(p, langMode === 'en' ? 'en' : 'ko', i)}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Handwritten Margin Notes from the scanned CamScanner PDF */}
            {section.marginNotes && section.marginNotes.length > 0 && (
              <div className="mt-6 border border-purple-200 bg-purple-50/60 rounded-lg p-4 select-text">
                <div className="flex items-center space-x-2 text-purple-900 font-bold text-xs sm:text-sm mb-2.5">
                  <StickyNote className="w-4 h-4 text-purple-600" />
                  <span>교재 여백 손글씨 필기 노트 (CamScanner Scanned Annotations)</span>
                </div>
                <div className="space-y-2">
                  {section.marginNotes.map((note, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border border-purple-100 text-xs space-y-1">
                      <div className="font-mono text-purple-800 font-medium">
                        📝 "{note.originalText}"
                      </div>
                      <div className="text-gray-700">
                        ➔ <strong>해석:</strong> {note.translation}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        위치: {note.context}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
        </div>
      )}

      {/* ======================================================== */}
      {/* Lightbox Modal: Ultra High-Res Zoomable Page Viewer      */}
      {/* ======================================================== */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-between p-2 sm:p-4 animate-in fade-in duration-200">
          {/* Top Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between text-white py-2 px-3 bg-black/50 rounded-xl mb-2">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded">
                p.{lightboxImage.pageNumber} 원본 교재
              </span>
              <span className="text-xs sm:text-sm font-semibold truncate text-gray-200">
                {lightboxImage.title}
              </span>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.2))}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="축소"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="확대"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                100%
              </button>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors ml-2 cursor-pointer"
                title="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Centered Image with Zoom & Floating Page Arrows */}
          <div className="relative flex-1 w-full max-w-5xl overflow-auto flex items-center justify-center p-2 rounded-xl bg-neutral-900/50">
            {pageImages.length > 1 && (() => {
              const currentLightboxIndex = pageImages.findIndex(img => img.pageNumber === lightboxImage.pageNumber);
              return (
                <>
                  {currentLightboxIndex > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const prevImg = pageImages[currentLightboxIndex - 1];
                        setLightboxImage(prevImg);
                        setActivePageIndex(currentLightboxIndex - 1);
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all hover:scale-110 cursor-pointer"
                      title={`이전 페이지 (p.${pageImages[currentLightboxIndex - 1].pageNumber})`}
                    >
                      <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                    </button>
                  )}
                  {currentLightboxIndex < pageImages.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const nextImg = pageImages[currentLightboxIndex + 1];
                        setLightboxImage(nextImg);
                        setActivePageIndex(currentLightboxIndex + 1);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md shadow-2xl transition-all hover:scale-110 cursor-pointer"
                      title={`다음 페이지 (p.${pageImages[currentLightboxIndex + 1].pageNumber})`}
                    >
                      <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
                    </button>
                  )}
                </>
              );
            })()}

            <img
              src={lightboxImage.imageSrc}
              alt={lightboxImage.title}
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out'
              }}
              className="max-h-[85vh] w-auto object-contain rounded-md shadow-2xl select-none"
            />
          </div>

          {/* Bottom Bar: Key illustrations */}
          <div className="w-full max-w-5xl py-2 px-4 bg-black/60 rounded-xl mt-2 text-white text-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-amber-400 font-bold">💡 삽화 설명:</span>
              <span className="text-gray-300">
                {lightboxImage.keyIllustrations.join(' · ')}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">
              ESC 키 또는 우측 상단 닫기로 복귀
            </span>
          </div>
        </div>
      )}

      {/* Add Custom Word Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-blue-50/50">
              <div className="flex items-center space-x-2 text-blue-700">
                <BookmarkPlus className="w-4 h-4" />
                <h4 className="font-bold text-sm text-gray-900">나만의 용어 사전에 단어 추가</h4>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveWord} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  선택한 단어 / 용어
                </label>
                <input
                  type="text"
                  required
                  value={modalWord}
                  onChange={(e) => setModalWord(e.target.value)}
                  placeholder="예: troposphere, 기온 감률, cyanobacteria"
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                />
                {modalWord && isWordAlreadySaved(modalWord) && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    ⚠️ 이미 나만의 사전에 등록되어 있는 단어입니다.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  단어의 뜻 및 나의 메모
                </label>
                <textarea
                  rows={2}
                  required
                  value={modalMeaning}
                  onChange={(e) => setModalMeaning(e.target.value)}
                  placeholder="단어의 의미나 암기 팁을 적어보세요..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  교재 내 인용 문맥 (선택 사항)
                </label>
                <textarea
                  rows={2}
                  value={modalContext}
                  onChange={(e) => setModalContext(e.target.value)}
                  placeholder="단어가 쓰인 문장이나 문맥..."
                  className="w-full px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-600 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
                <span>출처: {section.titleKo} (p.{section.pages[0]})</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-md font-medium"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-xs transition-colors"
                  >
                    사전에 저장
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Highlighted Quotes Review Modal */}
      {isHighlightListOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-gray-200 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Highlighter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center space-x-2">
                    <span>형광펜 & 밑줄 표시 모아보기</span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      {sectionHighlights.length}개
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {section.titleEn} ({section.titleKo})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHighlightListOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
              {sectionHighlights.length === 0 ? (
                <div className="text-center py-10 px-4 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                    <Highlighter className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-800">
                      아직 표시된 형광펜이나 밑줄이 없습니다.
                    </p>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                      본문에서 중요한 단어나 문장을 마우스나 손가락으로 드래그하면 노랑·민트·핑크 형광펜 또는 빨강·파랑 밑줄을 그을 수 있습니다.
                    </p>
                  </div>
                </div>
              ) : (
                sectionHighlights.map((hl: TextHighlight) => {
                  const colorBadge = 
                    hl.color === 'yellow' ? { name: '노랑 형광펜', bg: 'bg-amber-100 text-amber-900 border-amber-300' } :
                    hl.color === 'mint' ? { name: '민트 형광펜', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' } :
                    hl.color === 'pink' ? { name: '핑크 형광펜', bg: 'bg-pink-100 text-pink-900 border-pink-300' } :
                    hl.color === 'underline-red' ? { name: '빨간 밑줄', bg: 'bg-red-50 text-red-700 border-red-200' } :
                    { name: '파란 밑줄', bg: 'bg-blue-50 text-blue-700 border-blue-200' };

                  return (
                    <div
                      key={hl.id}
                      className="p-3 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-gray-50 transition-colors space-y-2 group"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`px-2 py-0.5 rounded-full border font-bold ${colorBadge.bg}`}>
                          {colorBadge.name}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => {
                              handleOpenAddModal(hl.text);
                              setIsHighlightListOpen(false);
                            }}
                            className="px-2 py-0.5 text-xs text-blue-600 hover:bg-blue-50 rounded font-semibold flex items-center space-x-1 cursor-pointer"
                            title="단어장에 추가"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            <span>단어장</span>
                          </button>
                          <button
                            onClick={() => handleDeleteHighlightItem(hl.id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium bg-white p-2.5 rounded-lg border border-gray-100">
                        "{hl.text}"
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              {sectionHighlights.length > 0 && onClearSectionHighlights ? (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('이 단원의 모든 형광펜 및 밑줄 표시를 삭제하시겠습니까?')) {
                      onClearSectionHighlights(section.id);
                      setIsHighlightListOpen(false);
                      setToastMessage('이 단원의 모든 하이라이트가 초기화되었습니다.');
                      setTimeout(() => setToastMessage(null), 2500);
                    }
                  }}
                  className="text-red-600 hover:text-red-700 font-medium hover:underline cursor-pointer"
                >
                  이 구역 전체 지우기
                </button>
              ) : (
                <span className="text-[11px] text-gray-400">구글 드라이브와 자동 동기화됩니다.</span>
              )}

              <button
                type="button"
                onClick={() => setIsHighlightListOpen(false)}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
