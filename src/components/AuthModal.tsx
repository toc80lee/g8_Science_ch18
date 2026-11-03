import React, { useState } from 'react';
import { 
  UserPlus, 
  LogIn, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap, 
  UserCheck, 
  ShieldCheck,
  Lock,
  Mail,
  User as UserIcon,
  BookOpen
} from 'lucide-react';
import { signUpMember, signInMember, quickStudentSignUp, MemberSessionData } from '../services/firebaseAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (session: MemberSessionData) => void;
  initialTab?: 'signup' | 'signin' | 'quick';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialTab = 'signup'
}) => {
  const [activeTab, setActiveTab] = useState<'signup' | 'signin' | 'quick'>(initialTab);

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'parent' | 'teacher'>('student');
  const [schoolGrade, setSchoolGrade] = useState('중학교 2학년');

  // Quick student name
  const [quickName, setQuickName] = useState('Josh');

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!displayName.trim()) {
        throw new Error('이름 또는 닉네임을 입력해주세요.');
      }
      if (!email.trim() || !email.includes('@')) {
        throw new Error('유효한 이메일 주소를 입력해주세요.');
      }
      if (password.length < 6) {
        throw new Error('비밀번호는 최소 6자 이상이어야 합니다.');
      }

      const session = await signUpMember({
        email: email.trim(),
        password,
        displayName: displayName.trim(),
        role,
        schoolGrade
      });

      onAuthSuccess(session);
      onClose();
    } catch (err: any) {
      console.error('Sign up error:', err);
      setErrorMessage(err.message || '회원가입 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (!email.trim()) {
        throw new Error('이메일을 입력해주세요.');
      }
      if (!password) {
        throw new Error('비밀번호를 입력해주세요.');
      }

      const session = await signInMember({
        email: email.trim(),
        password
      });

      onAuthSuccess(session);
      onClose();
    } catch (err: any) {
      console.error('Sign in error:', err);
      setErrorMessage(err.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const nameToUse = quickName.trim() || '학생';
      const session = await quickStudentSignUp(nameToUse, schoolGrade);
      onAuthSuccess(session);
      onClose();
    } catch (err: any) {
      console.error('Quick student register error:', err);
      setErrorMessage(err.message || '등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">에브리스터디 회원 계정</h3>
                <p className="text-xs text-blue-100">Firebase 클라우드 실시간 학습 이력 관리</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex mt-4 bg-black/20 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              회원가입
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'signin'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              로그인
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('quick'); setErrorMessage(null); }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'quick'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              간편 학생 등록
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: 회원가입 (Sign Up) */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  이름 / 학생 닉네임 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="예: Josh, 홍길동"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  이메일 주소 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.kr"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  비밀번호 (6자 이상) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">역할</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden bg-white"
                  >
                    <option value="student">학생</option>
                    <option value="parent">학부모</option>
                    <option value="teacher">선생님 / 멘토</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">학년/구분</label>
                  <input
                    type="text"
                    value={schoolGrade}
                    onChange={(e) => setSchoolGrade(e.target.value)}
                    placeholder="중학교 2학년"
                    className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>회원가입 완료하고 학습 시작</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: 로그인 (Sign In) */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  이메일 주소 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@school.kr"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  비밀번호 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>로그인하여 내 학습 이력 불러오기</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: 간편 학생 등록 (Quick 1-Click) */}
          {activeTab === 'quick' && (
            <form onSubmit={handleQuickRegister} className="space-y-4">
              <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 leading-relaxed">
                <span className="font-bold flex items-center gap-1.5 mb-1 text-purple-800">
                  <Sparkles className="w-3.5 h-3.5" /> 비밀번호 없이 1초만에 바로 학습 시작!
                </span>
                복잡한 회원가입 없이 학생 이름만 등록하면 전용 계정이 생성되어 Firebase 클라우드에 진도와 학습 정리가 즉시 저장됩니다.
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  학생 이름 / 닉네임 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    placeholder="예: Josh, 민준"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">학년</label>
                <input
                  type="text"
                  value={schoolGrade}
                  onChange={(e) => setSchoolGrade(e.target.value)}
                  placeholder="중학교 2학년"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    <span>{quickName || '학생'} 전용 계정으로 바로 시작</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Benefits info footer */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center space-x-2 text-[11px] text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>회원 학습 진도, 나만의 단어장, 퀴즈 오답, 학습 정리가 Firebase에 안전하게 보관됩니다.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
