import React, { useState } from 'react';
import { ReviewQuestion } from '../types';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Award, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

interface QuizViewProps {
  questions: ReviewQuestion[];
  quizTitle: string;
  onNavigateToEvidence?: (page: number, keywordOrQuote?: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, quizTitle, onNavigateToEvidence }) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [checkedResults, setCheckedResults] = useState<Record<number, boolean>>({});

  const handleSelectTF = (qId: number, val: boolean, correctVal: boolean) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: val }));
    setCheckedResults((prev) => ({ ...prev, [qId]: val === correctVal }));
    setRevealedAnswers((prev) => ({ ...prev, [qId]: true }));
  };

  const handleToggleReveal = (qId: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleMarkCorrect = (qId: number, isCorrect: boolean) => {
    setCheckedResults((prev) => ({ ...prev, [qId]: isCorrect }));
    setRevealedAnswers((prev) => ({ ...prev, [qId]: true }));
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setRevealedAnswers({});
    setCheckedResults({});
  };

  const totalAnswered = Object.keys(checkedResults).length;
  const correctCount = Object.values(checkedResults).filter(Boolean).length;
  const scorePercent = totalAnswered > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Quiz Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-2xs">
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center">
            <Award className="w-5 h-5 text-blue-600 mr-2" />
            {quizTitle} (총 {questions.length}문항)
          </h3>
          <p className="text-xs text-blue-800 mt-0.5">
            교재의 공식 복습 질문을 풀고 영·한 모범 답안, 상세 해설, 그리고 교과서 본문 근거를 확인하세요.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs text-gray-500">진행도: {totalAnswered} / {questions.length}</div>
            <div className="text-sm font-bold text-blue-700">정답률: {scorePercent}% ({correctCount}개 정답)</div>
          </div>
          <button
            onClick={handleResetQuiz}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded transition-colors cursor-pointer"
            title="퀴즈 초기화"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const isRevealed = revealedAnswers[q.id];
          const isChecked = checkedResults[q.id] !== undefined;
          const isCorrect = checkedResults[q.id];

          // 1, 2, 3, 4 심플 번호 추출 (e.g., "18A-1" -> "1", "18B-3" -> "3", "4" -> "4")
          const cleanNumber = q.questionNumber.replace(/^[0-9]+[A-Za-z]+-/, '') || String(idx + 1);

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-xl border transition-all ${
                isChecked
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-2xs'
                    : 'border-rose-300 bg-rose-50/20 shadow-2xs'
                  : 'border-gray-200 bg-white hover:border-gray-300 shadow-2xs'
              }`}
            >
              {/* Question Header: Number + English First, Korean Second */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Simple 1, 2, 3, 4 Number Badge */}
                  <span className="shrink-0 w-8 h-8 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                    {cleanNumber}
                  </span>
                  
                  <div className="space-y-1.5 flex-1">
                    {/* 1. English Question First (Primary) */}
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug font-serif">
                      {q.questionEn || q.question}
                    </h4>

                    {/* 2. Korean Question Second (Translation) */}
                    <div className="flex items-start space-x-1.5 text-xs text-gray-600">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded shrink-0">
                        한글 번역
                      </span>
                      <span className="leading-relaxed">{q.question}</span>
                    </div>
                  </div>
                </div>

                {/* Page Badge */}
                <span className="text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-mono shrink-0">
                  p.{q.page}
                </span>
              </div>

              {/* Action based on question type */}
              <div className="mt-4 pl-11">
                {q.type === 'true_false' ? (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleSelectTF(q.id, true, q.correctAnswer === true)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        userAnswers[q.id] === true
                          ? q.correctAnswer === true
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      True (참)
                    </button>
                    <button
                      onClick={() => handleSelectTF(q.id, false, q.correctAnswer === false)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        userAnswers[q.id] === false
                          ? q.correctAnswer === false
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      False (거짓)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleToggleReveal(q.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center space-x-1.5 cursor-pointer transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-blue-600" />
                      <span>{isRevealed ? '답안 및 해설 닫기' : '정답 및 모범 해설 확인하기 (영·한 대조)'}</span>
                    </button>
                  </div>
                )}

                {/* Answer, Explanation, and Evidence Section */}
                {isRevealed && (
                  <div className="mt-3.5 p-4 bg-gray-50/90 rounded-xl border border-gray-200 text-xs space-y-3.5 animate-in fade-in duration-200">
                    {/* 1. Model Answer: English First, Korean Second */}
                    <div className="bg-white border border-emerald-200 rounded-lg p-3 shadow-2xs space-y-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                          Model Answer · 교재 모범 답안
                        </span>
                      </div>
                      
                      {/* English Model Answer (Primary) */}
                      <div className="text-sm font-semibold text-gray-900 font-serif leading-relaxed">
                        {q.correctAnswerEn || String(q.correctAnswer)}
                      </div>

                      {/* Korean Model Answer (Secondary) */}
                      {q.correctAnswer && (
                        <div className="text-xs text-emerald-900 leading-relaxed pt-1.5 border-t border-emerald-50 flex items-start space-x-1.5">
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200 shrink-0">
                            한글 해독
                          </span>
                          <span>{String(q.correctAnswer)}</span>
                        </div>
                      )}
                    </div>

                    {/* 2. Explanation: English First, Korean Second */}
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-2xs space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[11px]">
                          Explanation · 상세 해설
                        </span>
                      </div>

                      {/* English Explanation (Primary) */}
                      {q.explanationEn && (
                        <div className="text-xs sm:text-sm text-gray-800 leading-relaxed font-serif">
                          {q.explanationEn}
                        </div>
                      )}

                      {/* Korean Explanation (Secondary) */}
                      <div className={`text-xs text-gray-600 leading-relaxed ${q.explanationEn ? 'pt-1.5 border-t border-gray-100' : ''}`}>
                        <span className="font-semibold text-gray-700">한국어 해설: </span>
                        {q.explanation}
                      </div>
                    </div>

                    {/* 3. Textbook Evidence Quote & One-Click Navigation to Reading Passage */}
                    {(q.evidenceQuoteEn || q.evidenceQuoteKo || q.page) && (
                      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-200/90 rounded-lg p-3 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center space-x-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-bold text-blue-900 text-xs">
                              본문 속 정답 근거 · Textbook Evidence
                            </span>
                            <span className="text-[10px] text-blue-700 bg-blue-100 border border-blue-200 px-1.5 py-0.5 rounded font-mono font-bold">
                              p. {q.page}
                            </span>
                          </div>

                          {onNavigateToEvidence && (
                            <button
                              type="button"
                              onClick={() => onNavigateToEvidence(q.page, q.evidenceQuoteEn || q.evidenceQuoteKo)}
                              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-2xs flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
                              title={`교재 ${q.page}쪽 본문 위치로 바로 이동하여 전후 문맥을 확인합니다`}
                            >
                              <span>해당 본문으로 이동</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        {/* English Evidence Excerpt (Primary) */}
                        {q.evidenceQuoteEn && (
                          <div className="font-serif italic text-blue-950 text-xs sm:text-[13px] leading-relaxed bg-white/85 p-2.5 rounded border border-blue-100 shadow-2xs">
                            "{q.evidenceQuoteEn}"
                          </div>
                        )}

                        {/* Korean Evidence Excerpt (Secondary) */}
                        {q.evidenceQuoteKo && (
                          <p className="text-[11px] text-gray-600 pl-1 leading-relaxed">
                            ↳ <span className="font-medium text-gray-700">{q.evidenceQuoteKo}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Self-scoring buttons for short answer / essay */}
                    {q.type !== 'true_false' && (
                      <div className="pt-2 flex items-center space-x-2 border-t border-gray-200">
                        <span className="text-[11px] text-gray-500 font-semibold">자가 채점:</span>
                        <button
                          onClick={() => handleMarkCorrect(q.id, true)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                            isChecked && isCorrect
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-gray-200 text-gray-700 hover:bg-emerald-100'
                          }`}
                        >
                          맞음 (O)
                        </button>
                        <button
                          onClick={() => handleMarkCorrect(q.id, false)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                            isChecked && !isCorrect
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-gray-200 text-gray-700 hover:bg-rose-100'
                          }`}
                        >
                          틀림 / 복습 필요 (X)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
