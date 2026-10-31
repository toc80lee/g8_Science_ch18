import React, { useState, useRef } from 'react';
import { ChapterSection, CustomWord } from '../types';
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
  ExternalLink
} from 'lucide-react';

interface TextbookReaderProps {
  section: ChapterSection;
  onAddCustomWord: (wordData: { word: string; meaning: string; contextSentence?: string; sourceSectionTitle?: string; sourcePage?: number }) => void;
  customWords: CustomWord[];
}

export const TextbookReader: React.FC<TextbookReaderProps> = ({ 
  section,
  onAddCustomWord,
  customWords
}) => {
  // Main view mode: 'text' (default) | 'visual' (page gallery) | 'split' (side-by-side text & scan)
  const [viewLayout, setViewLayout] = useState<'text' | 'visual' | 'split'>('text');
  const [langMode, setLangMode] = useState<'ko' | 'en' | 'side-by-side'>('ko');
  
  // Toggle for textbook original image verification section below text
  const [isImageSectionExpanded, setIsImageSectionExpanded] = useState<boolean>(false);
  
  // Selected text for custom vocabulary
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [modalWord, setModalWord] = useState<string>('');
  const [modalMeaning, setModalMeaning] = useState<string>('');
  const [modalContext, setModalContext] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lightbox modal state for high-res textbook page viewing
  const [lightboxImage, setLightboxImage] = useState<PageImageInfo | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageImages = getPageImagesForSection(section.pages);
  const safePageIndex = Math.min(activePageIndex, Math.max(0, pageImages.length - 1));
  const activeImage = pageImages[safePageIndex] || pageImages[0];

  // Reset active page index when section changes
  React.useEffect(() => {
    setActivePageIndex(0);
  }, [section.id]);

  // Support Left / Right arrow keys for page flipping in visual mode
  React.useEffect(() => {
    if (pageImages.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not flip if modal or input is focused
      if (isAddModalOpen) return;
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
  }, [viewLayout, pageImages, isAddModalOpen, lightboxImage]);

  // Detect text selection in textbook
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      if (!isAddModalOpen) {
        setSelectionPos(null);
      }
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 0 && text.length < 100) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(text);
      setSelectionPos({
        x: rect.left + rect.width / 2,
        y: rect.top - 8
      });
    } else {
      setSelectionPos(null);
    }
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

  return (
    <div className="my-6 space-y-4" ref={containerRef} onMouseUp={handleMouseUp}>
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs sm:text-sm flex items-center space-x-2 border border-gray-700 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Selection Tooltip Button */}
      {selectionPos && (
        <div
          style={{
            position: 'fixed',
            left: `${selectionPos.x}px`,
            top: `${selectionPos.y}px`,
            transform: 'translate(-50%, -100%)',
            zIndex: 45
          }}
          className="animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              handleOpenAddModal();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-lg border border-blue-400 transition-all hover:scale-105 cursor-pointer"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>나만의 사전에 추가</span>
          </button>
        </div>
      )}

      {/* Top Header Card: Title + Mode Toggle Buttons */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center space-x-1.5">
                <span>교재 원문 완전 수록 & 시각 자료실</span>
                <span className="text-xs text-blue-700 font-bold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                  p. {section.pages.join(', ')}
                </span>
              </h3>
              <p className="text-[11px] text-gray-500">
                💡 교재 원본 고화질 삽화, 기온 곡선 그래프, 사진 및 한·영 텍스트를 한눈에 볼 수 있습니다.
              </p>
            </div>
          </div>

          {/* View Layout Selector */}
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewLayout('text')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                viewLayout === 'text'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="텍스트 번역 및 해설 중심 모드"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>텍스트 본문</span>
            </button>
            <button
              onClick={() => setViewLayout('visual')}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                viewLayout === 'visual'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="원본 교재 고화질 사진 및 도표 중심 모드"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>교재 원본 삽화 ({pageImages.length}장)</span>
            </button>
            <button
              onClick={() => setViewLayout('split')}
              className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer ${
                viewLayout === 'split'
                  ? 'bg-white text-blue-700 shadow-2xs font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="텍스트 번역과 원본 삽화를 나란히 배치"
            >
              <Columns className="w-3.5 h-3.5 text-emerald-600" />
              <span>나란히 분할 보기</span>
            </button>
          </div>
        </div>

        {/* Sub toolbar: Language selector & Word add button (hidden in visual mode) or Visual mode page controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
          {/* Quick Page Preview Badges / Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-gray-500">
              {viewLayout === 'visual' ? '교재 페이지 선택:' : '포함 페이지:'}
            </span>
            <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
              {pageImages.map((img, idx) => (
                <button
                  key={img.pageNumber}
                  onClick={() => {
                    setActivePageIndex(idx);
                    setIsImageSectionExpanded(true);
                  }}
                  className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-colors cursor-pointer flex items-center space-x-1 ${
                    safePageIndex === idx
                      ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-2xs'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  title={`p.${img.pageNumber} ${img.title}`}
                >
                  <ImageIcon className={`w-3 h-3 ${safePageIndex === idx ? 'text-white' : 'text-blue-500'}`} />
                  <span>p.{img.pageNumber} 원본 삽화</span>
                </button>
              ))}
            </div>
          </div>

          {/* Text-mode controls: Only visible in text or split mode */}
          {viewLayout !== 'visual' ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleOpenAddModal('')}
                className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>단어 직접 등록</span>
              </button>

              {/* Language Toggle */}
              <div className="flex items-center space-x-1 border border-gray-200 rounded-md bg-gray-50 p-0.5">
                <button
                  onClick={() => setLangMode('ko')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    langMode === 'ko' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  한글 번역
                </button>
                <button
                  onClick={() => setLangMode('en')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    langMode === 'en' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  영어 원문
                </button>
                <button
                  onClick={() => setLangMode('side-by-side')}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    langMode === 'side-by-side' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  한·영 대조
                </button>
              </div>
            </div>
          ) : (
            /* Visual-mode: Page navigation header controls (Next/Prev) */
            pageImages.length > 1 && (
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-semibold text-gray-500 hidden sm:inline">
                  페이지 넘기기:
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setActivePageIndex(prev => Math.max(0, prev - 1))}
                    disabled={safePageIndex === 0}
                    className="px-2.5 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1 text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                    title="이전 페이지 (단축키: ←)"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>이전장</span>
                  </button>
                  <span className="px-2.5 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded">
                    {safePageIndex + 1} / {pageImages.length}
                  </span>
                  <button
                    onClick={() => setActivePageIndex(prev => Math.min(pageImages.length - 1, prev + 1))}
                    disabled={safePageIndex >= pageImages.length - 1}
                    className="px-2.5 py-1 rounded border border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1 text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                    title="다음 페이지 (단축키: →)"
                  >
                    <span>다음장</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>

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

            {/* Bottom Page Navigation Bar: Child-friendly large flipping buttons */}
            {pageImages.length > 1 && (
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => setActivePageIndex(prev => Math.max(0, prev - 1))}
                  disabled={safePageIndex === 0}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-blue-600" />
                  <span>
                    이전 페이지 {safePageIndex > 0 ? `(p.${pageImages[safePageIndex - 1].pageNumber})` : ''}
                  </span>
                </button>

                {/* Page indicator pills */}
                <div className="flex items-center space-x-1.5 flex-wrap">
                  {pageImages.map((p, idx) => (
                    <button
                      key={p.pageNumber}
                      onClick={() => setActivePageIndex(idx)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        safePageIndex === idx
                          ? 'bg-blue-600 text-white shadow-2xs ring-2 ring-blue-300'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-blue-50'
                      }`}
                    >
                      p.{p.pageNumber} ({idx + 1}/{pageImages.length})
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setActivePageIndex(prev => Math.min(pageImages.length - 1, prev + 1))}
                  disabled={safePageIndex >= pageImages.length - 1}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <span>
                    다음 페이지 {safePageIndex < pageImages.length - 1 ? `(p.${pageImages[safePageIndex + 1].pageNumber})` : ''}
                  </span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

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
              {(langMode === 'en' ? section.contentEn : section.contentKo).map((p, i) => (
                <p key={i} className="hover:bg-blue-50/30 p-1 rounded transition-colors text-justify">
                  {p}
                </p>
              ))}

              {section.sidebar && (
                <div className="mt-4 border border-amber-300 bg-amber-50/70 rounded-lg p-3.5 text-xs text-amber-900 leading-relaxed">
                  <div className="font-bold text-amber-950 mb-1">
                    ★ 교재 심화: {section.sidebar.titleKo}
                  </div>
                  {section.sidebar.contentKo.map((p, i) => (
                    <p key={i} className="mt-1">{p}</p>
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
                        {p}
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
                  <div className="space-y-3.5 text-sm text-gray-700 leading-relaxed select-text">
                    {section.contentEn.map((p, i) => (
                      <p key={i} className="text-justify hover:bg-blue-50/20 p-1 rounded transition-colors">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 select-text">
                <div className="space-y-3.5 text-sm sm:text-base text-gray-800 leading-relaxed">
                  {(langMode === 'ko' ? section.contentKo : section.contentEn).map((p, i) => (
                    <p 
                      key={i} 
                      className={`p-1 rounded hover:bg-blue-50/20 transition-colors ${langMode === 'en' ? 'font-serif text-justify' : 'text-justify'}`}
                    >
                      {p}
                    </p>
                  ))}
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
                    <p key={i}>{p}</p>
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

          {/* 2. 교재 원본 고화질 삽화 & 도표 확인 (SECOND: 학습 후 원본과 대조 확인용) */}
          {pageImages.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border border-blue-200/80 rounded-xl p-4 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center space-x-1.5">
                      <span>교재 원본과 내용 확인하기</span>
                      <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        p. {section.pages.join(', ')} 고화질 삽화 & 도표 ({pageImages.length}장)
                      </span>
                    </h4>
                    <p className="text-xs text-gray-500">
                      텍스트로 먼저 공부한 후, 실제 교재의 컬러 사진, 기온 감률 곡선, 여백 필기와 대조해 보세요.
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsImageSectionExpanded((prev) => !prev)}
                    className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs border border-blue-300 shadow-2xs transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <span>{isImageSectionExpanded ? '교재 삽화 접기' : '교재 원본 삽화 확인하기'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isImageSectionExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={() => setViewLayout('visual')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <span>전체화면 갤러리</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Collapsible Image Grid: Shows only when child wants to cross-verify against the textbook */}
              {isImageSectionExpanded && (
                <div className="mt-4 pt-3.5 border-t border-blue-100 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {pageImages.map((pImg) => (
                      <div
                        key={pImg.pageNumber}
                        onClick={() => handleOpenLightbox(pImg)}
                        className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-400 transition-all cursor-pointer"
                      >
                        <div className="aspect-[3/4] overflow-hidden bg-gray-50">
                          <img
                            src={pImg.imageSrc}
                            alt={pImg.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-2 bg-white border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-blue-700">p.{pImg.pageNumber}</span>
                            <span className="text-[10px] text-gray-400">클릭 확대</span>
                          </div>
                          <p className="text-[10px] text-gray-600 truncate mt-0.5">
                            {pImg.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
    </div>
  );
};
