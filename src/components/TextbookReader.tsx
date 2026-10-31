import React, { useState, useEffect, useRef } from 'react';
import { ChapterSection, CustomWord } from '../types';
import { 
  BookOpen, 
  Languages, 
  BookmarkPlus, 
  Check, 
  Plus, 
  StickyNote, 
  Sparkles,
  X,
  FileText
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
  const [langMode, setLangMode] = useState<'ko' | 'en' | 'side-by-side'>('ko');
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionPos, setSelectionPos] = useState<{ x: number; y: number } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [modalWord, setModalWord] = useState<string>('');
  const [modalMeaning, setModalMeaning] = useState<string>('');
  const [modalContext, setModalContext] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Detect text selection in textbook
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      // Don't close if modal is open
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
    
    // Find context sentence from textbook text if possible
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
    
    // Clear selection
    window.getSelection()?.removeAllRanges();
    setSelectionPos(null);
  };

  const isWordAlreadySaved = (word: string) => {
    return customWords.some(w => w.word.toLowerCase() === word.toLowerCase());
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

      {/* Textbook Section Header matching high-grade layout */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center space-x-1.5">
              <span>교재 원문 완전 수록</span>
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                Earth's Atmosphere p. {section.pages.join(', ')}
              </span>
            </h3>
            <p className="text-[11px] text-gray-500">
              💡 본문 글자를 마우스로 드래그하면 즉시 '나만의 용어 사전'에 등록할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Controls: Language toggle & Quick Add Word button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenAddModal('')}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>단어 직접 등록</span>
          </button>

          <div className="flex items-center space-x-1 border border-gray-300 rounded-md bg-gray-50 p-0.5 text-xs">
            <button
              onClick={() => setLangMode('ko')}
              className={`px-2.5 py-1 rounded transition-colors ${
                langMode === 'ko' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              한글 번역
            </button>
            <button
              onClick={() => setLangMode('en')}
              className={`px-2.5 py-1 rounded transition-colors ${
                langMode === 'en' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              영어 원문
            </button>
            <button
              onClick={() => setLangMode('side-by-side')}
              className={`px-2.5 py-1 rounded transition-colors ${
                langMode === 'side-by-side' ? 'bg-white text-blue-600 font-bold shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              한·영 대조
            </button>
          </div>
        </div>
      </div>

      {/* Main Text Content Box */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 sm:p-7 shadow-xs">
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
