import React, { useState } from 'react';
import { KeyTerm, CustomWord } from '../types';
import { 
  Search, 
  BookOpen, 
  Bookmark, 
  Check, 
  Trash2, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  GraduationCap,
  ArrowLeft,
  X,
  BookMarked
} from 'lucide-react';

interface GlossaryPageViewProps {
  keyTerms: KeyTerm[];
  customWords: CustomWord[];
  activeTab: 'key-terms' | 'custom-words' | 'flashcards';
  onChangeTab: (tab: 'key-terms' | 'custom-words' | 'flashcards') => void;
  onToggleCustomMemorized: (id: string) => void;
  onDeleteCustomWord: (id: string) => void;
  onAddCustomWord: (wordData: { word: string; meaning: string; contextSentence?: string }) => void;
  onBackToStudy: () => void;
}

export const GlossaryPageView: React.FC<GlossaryPageViewProps> = ({
  keyTerms,
  customWords,
  activeTab,
  onChangeTab,
  onToggleCustomMemorized,
  onDeleteCustomWord,
  onAddCustomWord,
  onBackToStudy
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [keyTermMemorized, setKeyTermMemorized] = useState<Record<string, boolean>>({});

  // Direct custom word add state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newContext, setNewContext] = useState('');

  // Flashcard mode state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleKeyTermMemorized = (term: string) => {
    setKeyTermMemorized(prev => ({ ...prev, [term]: !prev[term] }));
  };

  const handleAddNewWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;

    onAddCustomWord({
      word: newWord.trim(),
      meaning: newMeaning.trim() || '사용자 등록 단어',
      contextSentence: newContext.trim()
    });

    setNewWord('');
    setNewMeaning('');
    setNewContext('');
    setShowAddForm(false);
  };

  // Filter lists
  const filteredKeyTerms = keyTerms.filter(
    (k) =>
      k.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.termEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.definitionKo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomWords = customWords.filter(
    (w) =>
      w.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.contextSentence && w.contextSentence.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Combine items for Flashcards
  const flashcardList = [
    ...keyTerms.map(k => ({
      id: k.term,
      word: `${k.term} (${k.termEn})`,
      definition: k.definitionKo,
      sub: k.definitionEn,
      source: `교재 p.${k.page}`,
      isDone: keyTermMemorized[k.term] || false,
      toggle: () => toggleKeyTermMemorized(k.term)
    })),
    ...customWords.map(c => ({
      id: c.id,
      word: c.word,
      definition: c.meaning,
      sub: c.contextSentence || '',
      source: c.sourceSectionTitle || '나만의 단어',
      isDone: c.isMemorized,
      toggle: () => onToggleCustomMemorized(c.id)
    }))
  ];

  const currentFlashcard = flashcardList[flashcardIndex] || flashcardList[0];
  const customMemorizedCount = customWords.filter(w => w.isMemorized).length;
  const keyTermsMemorizedCount = Object.values(keyTermMemorized).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb banner */}
      <div className="bg-blue-50/70 border border-blue-100 rounded px-4 py-2.5 text-xs text-blue-700 font-medium flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookMarked className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold">참고 자료</span>
          <span className="text-blue-300">·</span>
          <span>
            {activeTab === 'key-terms' && '21개 핵심 과학 용어 사전'}
            {activeTab === 'custom-words' && '나만의 용어 사전'}
            {activeTab === 'flashcards' && '플래시카드 암기 훈련'}
          </span>
        </div>
        <button
          onClick={onBackToStudy}
          className="text-xs text-blue-600 font-bold hover:underline flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>교재 본문으로 돌아가기</span>
        </button>
      </div>

      {/* Main Page Title Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                대기과학 용어 사전 & 스마트 암기 센터
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                교재 450쪽 공식 21개 필수 용어와 교재 본문에서 내가 직접 스크랩한 단어들을 화면에서 바로 학습합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={onBackToStudy}
          className="flex items-center space-x-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs sm:text-sm rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>학습 본문 보기</span>
        </button>
      </div>

      {/* In-page Tab Menu Navigation */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50/70 px-4 sm:px-6 pt-3 space-x-3 text-xs sm:text-sm overflow-x-auto">
          <button
            onClick={() => onChangeTab('key-terms')}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'key-terms'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>21개 핵심 용어 사전</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[11px] font-bold">
              {keyTermsMemorizedCount}/{keyTerms.length}
            </span>
          </button>

          <button
            onClick={() => onChangeTab('custom-words')}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'custom-words'
                ? 'border-amber-600 text-amber-700 bg-white rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>나만의 용어 사전</span>
            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[11px] font-bold">
              {customWords.length}개 등록
            </span>
          </button>

          <button
            onClick={() => {
              onChangeTab('flashcards');
              setIsFlipped(false);
            }}
            className={`pb-3 px-3 font-bold border-b-2 transition-all flex items-center space-x-2 shrink-0 ${
              activeTab === 'flashcards'
                ? 'border-purple-600 text-purple-700 bg-white rounded-t-lg'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <span>플래시카드 암기 훈련</span>
          </button>
        </div>

        {/* Tab 1: 21 Key Terms Glossary View */}
        {activeTab === 'key-terms' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Search & Statistics */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="21개 핵심 용어 검색 (한글명, 영문명, 뜻)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded font-semibold">
                  전체 21개 용어
                </span>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded font-semibold">
                  암기 완료: {keyTermsMemorizedCount}개
                </span>
              </div>
            </div>

            {/* List of 21 Key Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredKeyTerms.map((item) => {
                const isDone = keyTermMemorized[item.term];
                return (
                  <div
                    key={item.term}
                    className={`p-4 rounded-xl border transition-all ${
                      isDone
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-gray-200 bg-white hover:border-blue-200 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                            {item.term}
                          </h3>
                          <span className="text-xs text-blue-600 font-serif italic font-medium">
                            {item.termEn}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">
                          교재 p.{item.page}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleKeyTermMemorized(item.term)}
                        className={`shrink-0 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors flex items-center space-x-1 ${
                          isDone
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>{isDone ? '암기완료' : '암기하기'}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-800 mt-2 leading-relaxed">
                      {item.definitionKo}
                    </p>
                    <p className="text-xs text-gray-500 mt-1.5 font-serif italic border-t border-gray-100 pt-1.5">
                      "{item.definitionEn}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: My Custom Vocabulary View */}
        {activeTab === 'custom-words' && (
          <div className="p-4 sm:p-6 space-y-4">
            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="내가 등록한 단어 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-600">
                  암기: <strong className="text-emerald-700">{customMemorizedCount}</strong> / {customWords.length}개
                </span>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 단어 직접 등록</span>
                </button>
              </div>
            </div>

            {/* Direct Add Form Box */}
            {showAddForm && (
              <form onSubmit={handleAddNewWord} className="p-4 sm:p-5 bg-amber-50/70 border border-amber-300 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center space-x-1.5">
                    <Bookmark className="w-4 h-4 text-amber-600" />
                    <span>나만의 단어장에 새 단어 추가</span>
                  </span>
                  <button type="button" onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="단어 / 용어 (예: cyanobacteria, 기온 감률)"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    className="px-3.5 py-2 text-xs sm:text-sm bg-white border border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 font-medium"
                  />
                  <input
                    type="text"
                    required
                    placeholder="뜻 / 의미 (예: 광합성으로 산소를 만든 원시 남세균)"
                    value={newMeaning}
                    onChange={(e) => setNewMeaning(e.target.value)}
                    className="px-3.5 py-2 text-xs sm:text-sm bg-white border border-amber-300 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                </div>
                <input
                  type="text"
                  placeholder="예문 또는 메모 (선택사항)"
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-amber-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
                <div className="flex justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-amber-100 rounded-md"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-md shadow-2xs"
                  >
                    사전에 저장
                  </button>
                </div>
              </form>
            )}

            {/* Custom Words List */}
            {filteredCustomWords.length === 0 ? (
              <div className="text-center py-16 px-4 bg-gray-50/50 rounded-xl border border-dashed border-gray-300 space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-800 text-base">
                  등록된 나만의 단어가 없습니다
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                  교재 본문에서 글자를 마우스로 드래그(선택)하면 나타나는
                  <span className="font-bold text-blue-600"> [나만의 사전에 추가]</span> 버튼을 누르거나,
                  상단의 <strong>[새 단어 직접 등록]</strong>을 눌러 나만의 단어장을 완성해 보세요!
                </p>
                <div className="pt-2">
                  <button
                    onClick={onBackToStudy}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center space-x-1"
                  >
                    <BookOpen className="w-3.5 h-3.5 mr-1" />
                    <span>교재 본문으로 단어 찾으러 가기</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCustomWords.map((word) => (
                  <div
                    key={word.id}
                    className={`p-4 rounded-xl border transition-all ${
                      word.isMemorized
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-gray-200 bg-white hover:border-amber-200 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900 text-sm sm:text-base">
                            {word.word}
                          </span>
                          {word.sourceSectionTitle && (
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-medium">
                              출처: {word.sourceSectionTitle} (p.{word.sourcePage})
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-800 mt-1.5 font-medium leading-relaxed">
                          {word.meaning}
                        </p>
                        {word.contextSentence && (
                          <p className="text-xs text-gray-500 mt-1.5 italic border-l-2 border-amber-300 pl-2.5 bg-amber-50/30 py-0.5 rounded-r">
                            "{word.contextSentence}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 shrink-0 pt-0.5">
                        <button
                          onClick={() => onToggleCustomMemorized(word.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center space-x-1 ${
                            word.isMemorized
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{word.isMemorized ? '암기완료' : '암기하기'}</span>
                        </button>
                        <button
                          onClick={() => onDeleteCustomWord(word.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Flashcard Memorization Mode */}
        {activeTab === 'flashcards' && (
          <div className="p-6 sm:p-10 flex flex-col justify-between items-center text-center min-h-[420px]">
            <div className="w-full flex items-center justify-between text-xs text-gray-500 mb-6 max-w-xl">
              <span>카드 {flashcardIndex + 1} / {flashcardList.length}</span>
              <span className="font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded">
                💡 카드를 클릭하면 뜻이 뒤집힙니다
              </span>
            </div>

            {/* Flashcard Box */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-xl min-h-[260px] bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-8 sm:p-10 flex flex-col justify-center items-center cursor-pointer shadow-md hover:shadow-lg transition-all"
            >
              {!isFlipped ? (
                <div className="space-y-3">
                  <span className="text-xs text-blue-600 font-semibold tracking-wide uppercase bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {currentFlashcard.source}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                    {currentFlashcard.word}
                  </h3>
                  <p className="text-xs text-gray-400 mt-4">클릭하여 정답 및 뜻 확인 👆</p>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  <span className="text-xs text-emerald-700 font-bold bg-emerald-100 px-3 py-0.5 rounded-full">
                    정답 해설 & 뜻
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                    {currentFlashcard.definition}
                  </p>
                  {currentFlashcard.sub && (
                    <p className="text-xs text-gray-500 italic max-w-md mx-auto pt-2">
                      "{currentFlashcard.sub}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="w-full max-w-xl mt-8 flex items-center justify-between">
              <button
                onClick={() => {
                  setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : flashcardList.length - 1));
                  setIsFlipped(false);
                }}
                className="flex items-center space-x-1 px-4 py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>이전 카드</span>
              </button>

              <button
                onClick={currentFlashcard.toggle}
                className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center space-x-1.5 shadow-2xs ${
                  currentFlashcard.isDone
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-emerald-100'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{currentFlashcard.isDone ? '암기 완료됨' : '암기 완료 체크'}</span>
              </button>

              <button
                onClick={() => {
                  setFlashcardIndex((prev) => (prev < flashcardList.length - 1 ? prev + 1 : 0));
                  setIsFlipped(false);
                }}
                className="flex items-center space-x-1 px-4 py-2 text-xs sm:text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                <span>다음 카드</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
