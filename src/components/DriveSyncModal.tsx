import React from 'react';
import { 
  CloudUpload, 
  FolderCheck, 
  AlertCircle, 
  X, 
  Check, 
  FileText, 
  Bookmark, 
  Award,
  ExternalLink,
  PenSquare
} from 'lucide-react';
import { APP_DRIVE_FOLDER_NAME } from '../services/googleDriveService';

interface DriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSync: () => void;
  isSyncing: boolean;
  userEmail: string;
  completedCount: number;
  customWordCount: number;
  quizScoreCount: number;
}

export const DriveSyncModal: React.FC<DriveSyncModalProps> = ({
  isOpen,
  onClose,
  onConfirmSync,
  isSyncing,
  userEmail,
  completedCount,
  customWordCount,
  quizScoreCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-blue-50/60">
          <div className="flex items-center space-x-2 text-blue-700">
            <CloudUpload className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-gray-900">Google Drive 동기화 확인</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSyncing}
            className="text-gray-400 hover:text-gray-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <p className="font-semibold text-gray-900 mb-1">
              다음 학습 데이터를 사용자의 개인 Google Drive에 저장(동기화)하시겠습니까?
            </p>
            <p className="text-xs text-gray-500">
              계정: <span className="font-mono font-medium text-gray-800">{userEmail}</span>
            </p>
          </div>

          {/* Sync Items Preview */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2.5 text-xs">
            <div className="font-semibold text-gray-800 flex items-center space-x-1.5 pb-2 border-b border-gray-200">
              <FolderCheck className="w-4 h-4 text-emerald-600" />
              <span>저장 위치: Google Drive &gt; <strong>{APP_DRIVE_FOLDER_NAME}</strong></span>
            </div>

            <div className="flex items-center justify-between text-gray-700">
              <span className="flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>완료한 단원 및 학습 이력</span>
              </span>
              <span className="font-bold text-blue-600">{completedCount}개 단원</span>
            </div>

            <div className="flex items-center justify-between text-gray-700">
              <span className="flex items-center space-x-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                <span>나만의 용어 사전 단어</span>
              </span>
              <span className="font-bold text-amber-700">{customWordCount}개 단어</span>
            </div>

            <div className="flex items-center justify-between text-gray-700">
              <span className="flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5 text-purple-500" />
                <span>퀴즈 및 복습 평가 점수</span>
              </span>
              <span className="font-bold text-purple-700">{quizScoreCount}개 평가</span>
            </div>

            <div className="flex items-center justify-between text-gray-700">
              <span className="flex items-center space-x-1.5">
                <PenSquare className="w-3.5 h-3.5 text-purple-600" />
                <span>학습 정리 블로그 포스트 & 댓글</span>
              </span>
              <span className="font-bold text-purple-700">포함</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-500">
            ℹ️ 이미 파일이 있는 경우 최신 학습 진도와 단어로 안전하게 갱신되며, 언제든 다른 컴퓨터에서 'Drive에서 불러오기'를 통해 복원할 수 있습니다.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-gray-200 bg-gray-50 flex items-center justify-end space-x-3 text-xs sm:text-sm">
          <button
            type="button"
            onClick={onClose}
            disabled={isSyncing}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 font-semibold rounded-lg transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirmSync}
            disabled={isSyncing}
            className="flex items-center space-x-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Drive에 저장 중...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>동기화 진행</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
