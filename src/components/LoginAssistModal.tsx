import React, { useState } from 'react';
import { AuthErrorInfo } from '../services/firebaseAuth';

interface LoginAssistModalProps {
  isOpen: boolean;
  errorInfo: AuthErrorInfo | null;
  onClose: () => void;
  onRetry: () => void;
  onStartGuestMode: () => void;
}

export const LoginAssistModal: React.FC<LoginAssistModalProps> = ({
  isOpen,
  errorInfo,
  onClose,
  onRetry,
  onStartGuestMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen || !errorInfo) return null;

  const currentDomain = errorInfo.domain || (typeof window !== 'undefined' ? window.location.hostname : 'g8-science-ch18.vercel.app');
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://g8-science-ch18.vercel.app';
  const gcpCredentialsUrl = 'https://console.cloud.google.com/apis/credentials?project=primeval-falcon-387715';
  const firebaseProjectUrl = 'https://console.firebase.google.com/project/primeval-falcon-387715/authentication/settings';

  const envVariablesText = `VITE_FIREBASE_API_KEY=AIzaSyBzKFCQGh10ccRCQxzVbKFDXvF5K4AaBG0
VITE_FIREBASE_PROJECT_ID=primeval-falcon-387715
VITE_FIREBASE_APP_ID=1:195664391315:web:d447e682d849a305387166
VITE_FIREBASE_AUTH_DOMAIN=primeval-falcon-387715.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=primeval-falcon-387715.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=195664391315
VITE_FIREBASE_OAUTH_CLIENT_ID=195664391315-ig2adgql9hc3bsdvcbqqlqk6ai5eps9t.apps.googleusercontent.com
VITE_FIREBASE_DATABASE_ID=ai-studio-g8sciencechapter-670523c3-e3cf-499c-895a-27f17c6c4608`;

  const handleCopyDomain = (textToCopy: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyEnv = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(envVariablesText);
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 transition-all transform scale-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 px-6 py-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-xl shadow-inner">
              {errorInfo.isApiKeyInvalid ? '🔑' : errorInfo.isUnauthorizedDomain ? '🌐' : '🔐'}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">
                {errorInfo.friendlyTitle}
              </h3>
              <p className="text-xs text-blue-100 mt-0.5">
                {errorInfo.isApiKeyInvalid 
                  ? 'GCP API 키 웹사이트 허용 설정 안내' 
                  : errorInfo.isUnauthorizedDomain 
                    ? '도메인 승인 설정 안내' 
                    : '로그인 안내'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors text-xl leading-none"
            title="닫기"
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Main Description */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 leading-relaxed">
            <p className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1">
              <span>⚠️</span>
              {errorInfo.friendlyTitle}
            </p>
            <p className="text-amber-800 text-xs sm:text-sm">
              {errorInfo.friendlyDescription}
            </p>
          </div>

          {/* API Key Restriction (HTTP Referrer blocked) */}
          {errorInfo.isApiKeyInvalid && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  허용 목록에 추가해야 할 배포 주소
                </span>
                <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs text-slate-800">
                  <span className="truncate select-all font-bold text-blue-600">{currentOrigin}/*</span>
                  <button
                    onClick={() => handleCopyDomain(`${currentOrigin}/*`)}
                    className="shrink-0 px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    {copied ? '✓ 복사됨!' : '주소 복사'}
                  </button>
                </div>
              </div>

              {/* Step-by-Step Guide for GCP */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-xs sm:text-sm text-indigo-950 space-y-2.5">
                <h4 className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <span>🛠️</span>
                  Google Cloud Console 해결 방법 (1분 소요):
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-indigo-900 leading-relaxed pl-1">
                  <li>
                    아래 링크를 눌러 <strong>Google Cloud 콘솔(사용자 인증 정보)</strong>로 이동합니다.
                  </li>
                  <li>
                    <strong>API 키</strong> 목록에서 <code>primeval-falcon-387715</code>에 생성된 Web API 키를 클릭합니다.
                  </li>
                  <li>
                    <strong>[애플리케이션 제한사항]</strong>에서:
                    <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-700">
                      <li>가장 편리한 방법: <strong>'없음'</strong>으로 설정 (Firebase 보안 규칙으로 보호되므로 안전)</li>
                      <li>또는 <strong>'웹사이트'</strong> 선택 후 웹사이트 제한사항에 <code className="bg-white px-1 py-0.5 rounded border border-indigo-200 text-indigo-900">{currentOrigin}/*</code> 및 <code className="bg-white px-1 py-0.5 rounded border border-indigo-200 text-indigo-900">http://localhost:*</code> 추가</li>
                    </ul>
                  </li>
                  <li>
                    하단 <strong>[저장]</strong>을 누르면 약 1분 후 정상적으로 구글 로그인이 작동합니다.
                  </li>
                </ol>

                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={gcpCredentialsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                  >
                    <span>GCP 사용자 인증 정보 바로가기</span>
                    <span>↗</span>
                  </a>
                  <button
                    onClick={handleCopyEnv}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-800 rounded-lg text-xs font-semibold hover:bg-indigo-50 transition-colors"
                  >
                    <span>{copiedEnv ? '✓ 환경변수 복사됨!' : 'Vercel 환경변수 전체 복사'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* If Unauthorized Domain (like Vercel domain) */}
          {errorInfo.isUnauthorizedDomain && (
            <div className="space-y-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  현재 웹사이트 도메인 (승인 필요)
                </span>
                <div className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-slate-300 font-mono text-sm text-slate-800">
                  <span className="truncate select-all font-bold text-blue-600">{currentDomain}</span>
                  <button
                    onClick={() => handleCopyDomain(currentDomain)}
                    className="shrink-0 px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    {copied ? '✓ 복사됨!' : '도메인 복사'}
                  </button>
                </div>
              </div>

              {/* Step-by-Step Guide */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-xs sm:text-sm text-indigo-950 space-y-2">
                <h4 className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <span>🛠️</span>
                  Firebase Console 승인 도메인 등록 방법 (1분 소요):
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-indigo-800 leading-relaxed pl-1">
                  <li>
                    <strong className="text-indigo-950">Firebase Console</strong>에 접속합니다.
                  </li>
                  <li>
                    좌측 메뉴의 <strong>Authentication (인증)</strong> → 상단 <strong>Settings (설정)</strong> 탭을 클릭합니다.
                  </li>
                  <li>
                    <strong>Authorized domains (승인된 도메인)</strong> 목록에서 <strong>[Add domain (도메인 추가)]</strong> 버튼을 클릭합니다.
                  </li>
                  <li>
                    위에서 복사한 <code className="bg-white px-1.5 py-0.5 rounded text-indigo-900 font-mono border border-indigo-200">{currentDomain}</code>을 입력하고 저장합니다.
                  </li>
                </ol>

                <div className="pt-2">
                  <a
                    href={firebaseProjectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    <span>Firebase Console 설정 페이지 바로가기</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Quick Alternative: Guest Mode */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-emerald-800 flex items-center justify-center sm:justify-start gap-1">
                <span>🌱</span> 로그인 없이 바로 학습하기 (게스트 모드)
              </span>
              <p className="text-xs text-emerald-700 leading-normal">
                구글 로그인 설정 전에도 단어장, 형광펜, 퀴즈 오답 노트 등 모든 학습 기록이 이 브라우저에 안전하게 보관됩니다.
              </p>
            </div>
            <button
              onClick={() => {
                onStartGuestMode();
                onClose();
              }}
              className="shrink-0 w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              게스트로 바로 시작 →
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            닫기
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onRetry();
              }}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              다시 시도
            </button>
            <button
              onClick={() => {
                onStartGuestMode();
                onClose();
              }}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              게스트 모드로 진행
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
