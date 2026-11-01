import React, { useState, useEffect, useRef } from 'react';
import { ChapterSection, VoiceJournalEntry, JournalFeedback } from '../types';
import { 
  analyzeVoiceJournalWithAI, 
  blobToDataUrl, 
  getJournalForSection, 
  saveVoiceJournal, 
  deleteVoiceJournal 
} from '../services/voiceJournalService';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ChevronDown, 
  ArrowRight, 
  Award, 
  Trash2, 
  Edit3, 
  Check, 
  Volume2, 
  Flame, 
  Lightbulb, 
  HelpCircle,
  Clock
} from 'lucide-react';

interface SelfLearningVoiceJournalProps {
  section: ChapterSection;
  onGoToQuiz?: () => void;
  onGoToMedia?: () => void;
  embedded?: boolean;
}

export const SelfLearningVoiceJournal: React.FC<SelfLearningVoiceJournalProps> = ({
  section,
  onGoToQuiz,
  onGoToMedia,
  embedded = false
}) => {
  // Collapsible state (matching TextbookReader)
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Recording states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [transcript, setTranscript] = useState<string>('');
  const [interimText, setInterimText] = useState<string>('');
  const [isEditingTranscript, setIsEditingTranscript] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<JournalFeedback | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Existing saved journal for this section
  const [savedJournal, setSavedJournal] = useState<VoiceJournalEntry | null>(null);

  // Refs for audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Load saved journal when section changes
  useEffect(() => {
    const existing = getJournalForSection(section.id);
    if (existing) {
      setSavedJournal(existing);
      setTranscript(existing.transcript);
      setFeedback(existing.feedback);
      setAudioUrl(existing.audioDataUrl || null);
    } else {
      setSavedJournal(null);
      setTranscript('');
      setInterimText('');
      setFeedback(null);
      setAudioUrl(null);
    }
    // Reset recording timer
    setRecordSeconds(0);
    setIsRecording(false);
  }, [section.id]);

  // Handle timer during recording
  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRecording]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Start voice recording and live speech-to-text
  const handleStartRecording = async () => {
    try {
      // 1. Get microphone audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const localAudioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(localAudioUrl);

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      setInterimText('');

      // 2. Start Web Speech Recognition if available
      const SpeechRecognition = 
        (window as any).SpeechRecognition || 
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'ko-KR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let currentFinal = '';
          let currentInterim = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptText = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              currentFinal += transcriptText + ' ';
            } else {
              currentInterim += transcriptText;
            }
          }

          if (currentFinal) {
            setTranscript((prev) => (prev ? prev + ' ' : '') + currentFinal.trim());
          }
          setInterimText(currentInterim);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition warning:', event.error);
        };

        recognition.start();
      } else {
        showToast('브라우저 실시간 음성인식이 제한되어 오디오만 녹음됩니다. 텍스트로도 직접 입력할 수 있습니다.');
      }
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      showToast('마이크 접근 권한이 필요합니다. 브라우저 설정에서 마이크를 허용해 주세요.');
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setInterimText('');
    showToast('녹음이 완료되었습니다. 내용을 확인하고 분석을 시작해보세요!');
  };

  // Trigger AI / Curriculum evaluation
  const handleAnalyzeJournal = async () => {
    const textToAnalyze = transcript.trim();
    if (!textToAnalyze || textToAnalyze.length < 5) {
      showToast('분석할 내용이 너무 짧습니다. 배운 내용을 한두 문장 이상으로 말하거나 적어주세요.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeVoiceJournalWithAI(textToAnalyze, section);
      setFeedback(result);

      // Save journal entry
      let audioBase64: string | undefined = undefined;
      if (audioChunksRef.current.length > 0) {
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioBase64 = await blobToDataUrl(audioBlob);
        } catch (e) {
          console.warn('Audio data URL conversion error:', e);
        }
      } else if (savedJournal?.audioDataUrl) {
        audioBase64 = savedJournal.audioDataUrl;
      }

      const newEntry: VoiceJournalEntry = {
        id: 'vj-' + Date.now(),
        sectionId: section.id,
        sectionTitleKo: section.titleKo,
        sectionTitleEn: section.titleEn,
        recordedAt: Date.now(),
        durationSeconds: recordSeconds || savedJournal?.durationSeconds || 30,
        transcript: textToAnalyze,
        audioDataUrl: audioBase64,
        feedback: result
      };

      saveVoiceJournal(newEntry);
      setSavedJournal(newEntry);
      showToast('✓ AI 학습 분석 완료! 오늘의 학습 기록이 저장되었습니다.');
    } catch (err) {
      console.error('Journal analysis failure:', err);
      showToast('분석 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle re-recording reset
  const handleReset = () => {
    if (window.confirm('기존 녹음과 분석 결과를 초기화하고 새로 녹음하시겠습니까?')) {
      deleteVoiceJournal(section.id);
      setSavedJournal(null);
      setTranscript('');
      setInterimText('');
      setFeedback(null);
      setAudioUrl(null);
      setRecordSeconds(0);
      showToast('초기화되었습니다. 새로운 녹음을 시작할 수 있습니다.');
    }
  };

  // Audio Playback
  const togglePlayAudio = () => {
    if (!audioPlayerRef.current || !audioUrl) return;

    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(err => {
        console.warn('Audio play failed:', err);
        setIsPlayingAudio(false);
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Sample prompt chips for kids to start easily
  const promptSuggestions = [
    `"이 섹션에서 ${section.titleKo.split(' ')[0] || '대기'}에 대해 배웠어요."`,
    section.objectives[0] ? `"${section.objectives[0].slice(0, 30)}..."` : `"교재에서 가장 신기했던 점은..."`,
    `"핵심 개념과 원리를 설명해볼게요."`
  ];

  return (
    <div className={embedded ? "space-y-4" : "my-5 bg-gradient-to-r from-amber-50/80 via-yellow-50/50 to-white border border-amber-300/80 rounded-xl p-4 shadow-2xs transition-all duration-200"}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs sm:text-sm flex items-center space-x-2 border border-amber-700 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Check className="w-4 h-4 text-amber-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Embedded Sub-header or Standalone Header Banner */}
      {embedded ? (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-amber-100">
          <p className="text-xs sm:text-sm text-gray-700 font-medium">
            섹션을 읽은 후 "나는 이 단원에서 이런 걸 배웠어"라고 편하게 말해보세요. 핵심 개념을 다 배웠는지 진단하고 맞춤 가이드를 제공합니다.
          </p>
          {savedJournal && (
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>평가 완료 ({savedJournal.feedback.score}점)</span>
              </span>
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-red-600 px-2.5 py-1 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition-colors flex items-center space-x-1 cursor-pointer"
                title="녹음 내용 초기화"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">다시 녹음하기</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Standalone Header Banner */
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div 
            onClick={() => setIsExpanded(prev => !prev)}
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(prev => !prev);
              }}
              className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white flex items-center justify-center font-bold shadow-xs shrink-0 cursor-pointer transition-all relative group/btn"
              title={isExpanded ? '셀프 학습 접기' : '셀프 학습 열기 (클릭 시 펼침)'}
              aria-label="셀프 학습 토글"
            >
              <Mic className={`w-5 h-5 transition-transform ${isRecording ? 'animate-bounce text-red-200' : 'group-hover/btn:scale-110'}`} />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-amber-700 border border-amber-300 flex items-center justify-center shadow-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                <ChevronDown className="w-3 h-3" />
              </span>
            </button>
            <div>
              <h4 className="font-bold text-gray-900 text-sm flex items-center space-x-1.5 group-hover:text-amber-700 transition-colors">
                <span>셀프 학습</span>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/90 border border-amber-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{savedJournal ? `평가 완료 (${savedJournal.feedback.score}점)` : '스스로 말해보기'}</span>
                </span>
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                섹션을 읽은 후 "나는 이 단원에서 이런 걸 배웠어"라고 편하게 말해보세요. 핵심 개념을 다 배웠는지 진단하고 맞춤 가이드를 제공합니다.
              </p>
            </div>
          </div>

          {savedJournal && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="text-xs text-gray-500 hover:text-red-600 px-2.5 py-1 rounded-lg border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition-colors flex items-center space-x-1 cursor-pointer"
                title="녹음 내용 초기화"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">다시 녹음하기</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content Body */}
      {(isExpanded || embedded) && (
        <div className={embedded ? "space-y-4 animate-in fade-in duration-200" : "mt-4 pt-4 border-t border-amber-200/80 space-y-4 animate-in fade-in duration-200"}>
          {/* 1. Interactive Recording Console */}
          <div className="bg-white rounded-xl border border-amber-200 p-4 shadow-2xs space-y-4">
            {/* Top Prompt Guidance for Kids */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-bold">아이를 위한 말하기 가이드:</span>
                <span className="text-amber-800">
                  교재를 보지 않고 기억나는 대로 "이 단원에서 무엇을 배웠는지, 어떤 원리가 있었는지" 소리내어 말해보세요!
                </span>
              </div>
              <div className="flex items-center space-x-1 shrink-0">
                <span className="text-[11px] text-amber-700 bg-white border border-amber-200 px-2 py-0.5 rounded font-mono">
                  권장 시간: 30초~2분
                </span>
              </div>
            </div>

            {/* Quick Starter Chips */}
            {!transcript && !isRecording && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-gray-500 block">
                  💡 어떻게 말해야 할지 막막하다면 아래 예시를 눌러보세요:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {promptSuggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => setTranscript(sug.replace(/^"|"$/g, ''))}
                      className="text-xs bg-amber-50/60 hover:bg-amber-100/80 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-md transition-colors text-left cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Microphone Recording Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-50 via-yellow-50/60 to-white p-3.5 rounded-xl border border-amber-200">
              <div className="flex items-center space-x-3">
                {isRecording ? (
                  <button
                    onClick={handleStopRecording}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer animate-pulse"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>녹음 중지 & 저장</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartRecording}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    <span>{transcript ? '다시 녹음하기' : '마이크 켜고 말하기 시작'}</span>
                  </button>
                )}

                {/* Live Timer & Wave Visualizer */}
                <div className="flex items-center space-x-2.5">
                  <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold ${
                    isRecording 
                      ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' 
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(recordSeconds)}</span>
                  </div>

                  {isRecording && (
                    <div className="flex items-center space-x-1 pl-1">
                      <span className="w-1.5 h-4 bg-red-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-6 bg-amber-500 rounded-full animate-bounce [animation-delay:0.15s]" />
                      <span className="w-1.5 h-8 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                      <span className="w-1.5 h-5 bg-red-400 rounded-full animate-bounce [animation-delay:0.45s]" />
                      <span className="text-xs font-semibold text-red-600 pl-1.5 hidden sm:inline">
                        경청하고 있어요... 편하게 말씀하세요!
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Audio Playback Controls (if recorded) */}
              {audioUrl && !isRecording && (
                <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-amber-200 shadow-2xs">
                  <audio
                    ref={audioPlayerRef}
                    src={audioUrl}
                    onEnded={() => setIsPlayingAudio(false)}
                    className="hidden"
                  />
                  <button
                    onClick={togglePlayAudio}
                    className="flex items-center space-x-1 text-xs font-bold text-amber-800 hover:text-amber-900 transition-colors cursor-pointer"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current text-amber-600" />
                        <span>일시정지</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current text-amber-600" />
                        <span>내 목소리 다시 듣기</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-gray-400 font-mono">
                    ({formatTime(recordSeconds || savedJournal?.durationSeconds || 0)})
                  </span>
                </div>
              )}
            </div>

            {/* Live Transcript / Text Review Box */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                  <span>📝</span>
                  <span>녹음된 말하기 내용 (실시간 텍스트 변환):</span>
                </span>
                <button
                  onClick={() => setIsEditingTranscript(prev => !prev)}
                  className="text-xs text-amber-700 hover:text-amber-900 font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingTranscript ? '수정 완료' : '텍스트 직접 수정/보완하기'}</span>
                </button>
              </div>

              {isEditingTranscript ? (
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="아이가 말한 내용을 직접 입력하거나 잘못 인식된 단어를 수정하세요..."
                  className="w-full h-28 p-3 text-xs sm:text-sm border border-amber-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-amber-50/20 leading-relaxed font-sans"
                />
              ) : (
                <div className="min-h-20 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-800 leading-relaxed">
                  {transcript ? (
                    <div>
                      <span>{transcript}</span>
                      {interimText && (
                        <span className="text-amber-600 italic animate-pulse"> {interimText}</span>
                      )}
                    </div>
                  ) : isRecording ? (
                    <span className="text-amber-600 font-semibold animate-pulse">
                      말씀하시는 내용이 이곳에 실시간으로 기록됩니다...
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      아직 녹음된 내용이 없습니다. 상단의 마이크 버튼을 눌러 말을 시작하거나, '텍스트 직접 수정'을 눌러 타자로 입력해보세요.
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Run Analysis Action Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <p className="text-[11px] text-gray-500">
                💡 녹음이 끝나면 아래 버튼을 눌러 교과서 필수 개념을 다 배웠는지 AI 분석을 받아보세요.
              </p>

              <button
                onClick={handleAnalyzeJournal}
                disabled={isRecording || isAnalyzing || !transcript.trim()}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-lg shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? '배운 내용 분석 중...' : '오늘 배운 내용 분석 & 피드백 받기 →'}</span>
              </button>
            </div>
          </div>

          {/* 2. Analysis Results & Learning Guide Section */}
          {feedback && (
            <div className="bg-white rounded-xl border border-amber-300 p-5 shadow-xs space-y-5 animate-in fade-in duration-300">
              {/* Score & Summary Banner */}
              <div className="bg-gradient-to-r from-amber-100/70 via-yellow-100/50 to-amber-50 border border-amber-300/80 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-amber-400 flex flex-col items-center justify-center shadow-xs shrink-0">
                    <span className="text-xs font-bold text-gray-500">성취도</span>
                    <span className="text-xl font-extrabold text-amber-700">{feedback.score}점</span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600 text-white shadow-2xs">
                        {feedback.levelLabel}
                      </span>
                      <span className="text-xs text-amber-900 font-semibold">
                        {section.titleKo}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-800 font-medium mt-1 leading-relaxed">
                      {feedback.summary}
                    </p>
                  </div>
                </div>
                <div className="shrink-0 text-center sm:text-right">
                  <span className="text-[11px] text-gray-500 block">학습 진단 결과</span>
                  <span className="text-xs font-bold text-emerald-700">
                    완벽 이해 {feedback.coveredPoints.length}개 · 보완 추천 {feedback.missingPoints.length}개
                  </span>
                </div>
              </div>

              {/* Two Column Concept Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. What was learned well */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <h5 className="text-xs sm:text-sm font-bold text-emerald-950 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>내가 완벽하게 배운 내용 (잘 이해한 점)</span>
                  </h5>
                  {feedback.coveredPoints.length > 0 ? (
                    <ul className="space-y-2 text-xs text-emerald-900">
                      {feedback.coveredPoints.map((item, idx) => (
                        <li key={idx} className="bg-white/90 p-2.5 rounded-lg border border-emerald-200 shadow-2xs space-y-0.5">
                          <span className="font-bold text-emerald-900 block">✓ {item.title}</span>
                          <span className="text-emerald-800 leading-normal block">{item.detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic p-2 bg-white/60 rounded-lg">
                      아직 단원의 핵심 용어가 충분히 감지되지 않았습니다. 교재 본문을 다시 참고해보세요.
                    </p>
                  )}
                </div>

                {/* 2. What was missed / needs review */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-3">
                  <h5 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>조금 더 보충하면 좋은 핵심 내용 (놓친 점)</span>
                  </h5>
                  {feedback.missingPoints.length > 0 ? (
                    <ul className="space-y-2 text-xs text-amber-900">
                      {feedback.missingPoints.map((item, idx) => (
                        <li key={idx} className="bg-white/90 p-2.5 rounded-lg border border-amber-200 shadow-2xs space-y-0.5">
                          <span className="font-bold text-amber-950 flex items-center justify-between">
                            <span>🔍 {item.title}</span>
                            {item.relatedPage && (
                              <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-mono">
                                p.{item.relatedPage}
                              </span>
                            )}
                          </span>
                          <span className="text-amber-800 leading-normal block">{item.detail}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="p-3 bg-white/90 rounded-lg border border-amber-200 text-xs text-amber-800 font-semibold flex items-center space-x-2">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>축하합니다! 이 단원의 모든 필수 학습 목표를 빠짐없이 이야기했습니다.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Actionable Study Guide for Kids */}
              <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border border-blue-200 rounded-xl p-4 space-y-2.5">
                <h5 className="text-xs sm:text-sm font-bold text-blue-950 flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>앞으로의 맞춤형 학습 가이드 & 실천 방법:</span>
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {feedback.studyGuide.map((guide, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-blue-100 shadow-2xs space-y-1 flex flex-col justify-between">
                      <div>
                        <span className="font-bold text-blue-900 block mb-0.5">{guide.step}</span>
                        <p className="text-gray-700 text-[11px] leading-relaxed">{guide.action}</p>
                      </div>
                      {guide.linkHint === 'quiz' && onGoToQuiz && (
                        <button
                          onClick={onGoToQuiz}
                          className="mt-2 text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <span>형성평가 풀러가기</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      {guide.linkHint === 'media' && onGoToMedia && (
                        <button
                          onClick={onGoToMedia}
                          className="mt-2 text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center space-x-1 cursor-pointer"
                        >
                          <span>추천 영상 보기</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Saved Status info */}
              <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1">
                <span>
                  최근 기록 일시: {savedJournal?.recordedAt ? new Date(savedJournal.recordedAt).toLocaleString('ko-KR') : '방금 전'}
                </span>
                <span className="text-emerald-600 font-semibold flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>내 학습 기록에 자동 저장됨</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
