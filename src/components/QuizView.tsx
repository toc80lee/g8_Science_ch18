import React, { useState } from 'react';
import { ReviewQuestion } from '../types';
import { CheckCircle2, XCircle, HelpCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';

interface QuizViewProps {
  questions: ReviewQuestion[];
  quizTitle: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, quizTitle }) => {
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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base flex items-center">
            <Award className="w-5 h-5 text-blue-600 mr-2" />
            {quizTitle} (총 {questions.length}문항)
          </h3>
          <p className="text-xs text-blue-800 mt-0.5">
            교재의 공식 복습 질문을 풀고 즉각적인 해설과 교과서 페이지를 확인하세요.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs text-gray-500">진행도: {totalAnswered} / {questions.length}</div>
            <div className="text-sm font-bold text-blue-700">정답률: {scorePercent}% ({correctCount}개 정답)</div>
          </div>
          <button
            onClick={handleResetQuiz}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-white rounded transition-colors"
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

          return (
            <div
              key={q.id}
              className={`p-4 sm:p-5 rounded-lg border transition-all ${
                isChecked
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start space-x-2.5">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {q.questionNumber}
                  </span>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
                      {q.question}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 font-serif italic">
                      {q.questionEn}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-gray-400 font-mono shrink-0">
                  p.{q.page}
                </span>
              </div>

              {/* Action based on question type */}
              <div className="mt-4 pl-9">
                {q.type === 'true_false' ? (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleSelectTF(q.id, true, q.correctAnswer === true)}
                      className={`px-4 py-1.5 text-xs font-bold rounded border transition-colors ${
                        userAnswers[q.id] === true
                          ? q.correctAnswer === true
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-rose-600 text-white border-rose-600'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      True (참)
                    </button>
                    <button
                      onClick={() => handleSelectTF(q.id, false, q.correctAnswer === false)}
                      className={`px-4 py-1.5 text-xs font-bold rounded border transition-colors ${
                        userAnswers[q.id] === false
                          ? q.correctAnswer === false
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-rose-600 text-white border-rose-600'
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
                      className="text-xs text-blue-600 font-semibold hover:underline flex items-center space-x-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isRevealed ? '답안 및 해설 닫기' : '정답 및 모범 해설 확인하기'}</span>
                    </button>
                  </div>
                )}

                {/* Answer & Explanation Box */}
                {isRevealed && (
                  <div className="mt-3 p-3.5 bg-gray-50 rounded border border-gray-200 text-xs space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        교재 모범 답안
                      </span>
                      <span className="font-semibold text-gray-900">
                        {String(q.correctAnswer)}
                      </span>
                    </div>

                    <div className="text-gray-700 leading-relaxed pt-1 border-t border-gray-200">
                      <span className="font-semibold text-gray-800">해설: </span>
                      {q.explanation}
                    </div>

                    {q.type !== 'true_false' && (
                      <div className="pt-2 flex items-center space-x-2">
                        <span className="text-[11px] text-gray-500">자가 채점:</span>
                        <button
                          onClick={() => handleMarkCorrect(q.id, true)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isChecked && isCorrect
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-emerald-100'
                          }`}
                        >
                          맞음 (O)
                        </button>
                        <button
                          onClick={() => handleMarkCorrect(q.id, false)}
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isChecked && !isCorrect
                              ? 'bg-rose-600 text-white'
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
