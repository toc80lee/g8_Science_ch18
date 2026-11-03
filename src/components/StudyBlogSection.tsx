import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { ChapterSection, BlogPost, BlogComment } from '../types';
import { 
  fetchBlogPostsForSection,
  subscribeToSectionBlogPosts, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  addBlogComment, 
  deleteBlogComment,
  toggleLikeBlogPost
} from '../services/studyBlogService';
import { textbookPageImages } from '../data/textbookPageImages';
import { 
  Plus, 
  Image as ImageIcon, 
  Upload, 
  Heart, 
  MessageSquare, 
  Send, 
  Trash2, 
  Edit3, 
  Check, 
  RotateCcw,
  LogIn,
  UserCheck,
  Globe2,
  Clock,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface StudyBlogSectionProps {
  section: ChapterSection;
  embedded?: boolean;
  user?: { uid: string; displayName?: string | null; email?: string | null; photoURL?: string | null } | null;
  onOpenAuthModal?: () => void;
}

export const StudyBlogSection: React.FC<StudyBlogSectionProps> = ({
  section,
  embedded = false,
  user = null,
  onOpenAuthModal
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Editor form state: completely clean blank slate
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageCaption, setImageCaption] = useState<string>('');
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'textbook' | 'url'>('upload');

  // Status message for save confirmation & errors
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [justSavedPostId, setJustSavedPostId] = useState<string | null>(null);

  // Per-post comment input states
  const [commentInputs, setCommentInputs] = useState<Record<string, { content: string; isSubmitting?: boolean }>>({});

  // File input ref for image upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Draft storage key
  const draftKey = `ch18_blog_draft_${section.id}`;

  // Automatically sync authorName with signed-in Google user if available
  useEffect(() => {
    if (user && !authorName) {
      setAuthorName(user.displayName || user.email?.split('@')[0] || '학생');
    } else if (!authorName) {
      setAuthorName('학생');
    }
  }, [user]);

  // Load and listen for real-time posts from Firebase Firestore
  useEffect(() => {
    setIsLoading(true);

    // Initial fetch from Firestore
    fetchBlogPostsForSection(section.id)
      .then((loadedPosts) => {
        setPosts(loadedPosts);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load posts:', err);
        setIsLoading(false);
      });

    // Realtime subscription so any new posts by anyone appear immediately
    const unsubscribe = subscribeToSectionBlogPosts(section.id, (realtimePosts) => {
      setPosts(realtimePosts);
      setIsLoading(false);
    });

    // Load saved draft if any
    try {
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        if (draft.title || draft.content) {
          setTitle(draft.title || '');
          setContent(draft.content || '');
          if (draft.authorName) setAuthorName(draft.authorName);
          if (draft.imageUrl) setImageUrl(draft.imageUrl);
          if (draft.imageCaption) setImageCaption(draft.imageCaption);
        }
      }
    } catch {
      // ignore draft parse error
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [section.id]);

  // Auto-save draft as student types (prevents accidental loss)
  useEffect(() => {
    if (editingPostId) return;
    if (!title && !content && !imageUrl) {
      localStorage.removeItem(draftKey);
      return;
    }
    try {
      localStorage.setItem(
        draftKey,
        JSON.stringify({ title, content, authorName, imageUrl, imageCaption })
      );
    } catch {
      // ignore
    }
  }, [title, content, authorName, imageUrl, imageCaption, editingPostId, draftKey]);

  // Open clean blank editor for a new post
  const handleStartNewPost = () => {
    setEditingPostId(null);
    setTitle('');
    setContent('');
    setImageUrl('');
    setImageCaption('');
    setShowImageOptions(false);
    setIsEditorVisible(true);
    setErrorMessage(null);
    setTimeout(() => {
      const editorEl = document.getElementById('study-blog-editor-card');
      if (editorEl) {
        editorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Open editor to edit an existing post
  const handleStartEdit = (post: BlogPost) => {
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    if (post.authorId && post.authorId !== user.uid) {
      alert('본인이 작성한 학습 정리만 수정할 수 있습니다.');
      return;
    }

    setEditingPostId(post.id);
    setTitle(post.title);
    setAuthorName(post.authorName || user.displayName || '학생');
    setContent(post.content);
    setImageUrl(post.imageUrl || '');
    setImageCaption(post.imageCaption || '');
    setShowImageOptions(!!post.imageUrl);
    setIsEditorVisible(true);
    setErrorMessage(null);

    // Scroll to editor smoothly
    setTimeout(() => {
      const editorEl = document.getElementById('study-blog-editor-card');
      if (editorEl) {
        editorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageUrl(result);
      if (!imageCaption) {
        setImageCaption(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Post to Firebase or Local Storage under user profile
  const handleSavePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setErrorMessage('내용을 입력해 주세요.');
      return;
    }

    const finalTitle = title.trim() || `${section.titleKo} 학습 정리`;
    const finalAuthor = authorName.trim() || user?.displayName || user?.email?.split('@')[0] || '학생';
    const effectiveAuthorId = user?.uid || 'student-local-' + Date.now();

    setIsSaving(true);

    try {
      if (editingPostId) {
        const updatedList = await updateBlogPost(
          section.id,
          editingPostId,
          {
            title: finalTitle,
            authorName: finalAuthor,
            content: trimmedContent,
            imageUrl: imageUrl.trim() || undefined,
            imageCaption: imageCaption.trim() || undefined,
          },
          user
        );
        setPosts(updatedList);
        setJustSavedPostId(editingPostId);
        setSaveFeedback('수정된 학습 정리가 안전하게 저장되었습니다!');
      } else {
        const created = await createBlogPost(
          section,
          {
            sectionId: section.id,
            sectionTitleKo: section.titleKo,
            sectionTitleEn: section.titleEn,
            title: finalTitle,
            authorId: effectiveAuthorId,
            authorName: finalAuthor,
            authorEmail: user?.email || '',
            authorPhotoUrl: user?.photoURL || '',
            content: trimmedContent,
            imageUrl: imageUrl.trim() || undefined,
            imageCaption: imageCaption.trim() || undefined,
          },
          user
        );

        setPosts((prev) => [created, ...prev.filter((p) => p.id !== created.id)]);
        setJustSavedPostId(created.id);
        if (user) {
          setSaveFeedback(`학습 정리가 Firebase에 성공적으로 저장 및 공유되었습니다! (작성자: ${finalAuthor})`);
        } else {
          setSaveFeedback(`학습 정리가 기기에 안전하게 저장되었습니다! (작성자: ${finalAuthor})`);
        }
      }

      // Clear draft on successful save
      localStorage.removeItem(draftKey);

      // Reset form to clean state
      setEditingPostId(null);
      setTitle('');
      setContent('');
      setImageUrl('');
      setImageCaption('');
      setShowImageOptions(false);

      // Smooth scroll to the recorded post so the user can see it immediately
      setTimeout(() => {
        const postElement = document.getElementById('saved-posts-section');
        if (postElement) {
          postElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);

      // Auto-clear feedback after 6 seconds
      setTimeout(() => {
        setSaveFeedback(null);
      }, 6000);
    } catch (err: any) {
      console.error('Save error:', err);
      setErrorMessage(`Firebase 저장 실패: ${err?.message || '잠시 후 다시 시도해 주세요.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete post (only author)
  const handleDeletePost = async (post: BlogPost) => {
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    if (post.authorId && post.authorId !== user.uid) {
      alert('본인이 작성한 학습 정리만 삭제할 수 있습니다.');
      return;
    }

    if (window.confirm('이 학습 정리를 Firebase에서 완전히 삭제하시겠습니까?')) {
      try {
        const updated = await deleteBlogPost(section.id, post.id, user);
        setPosts(updated);
        if (editingPostId === post.id) {
          handleStartNewPost();
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('삭제 중 문제가 발생했습니다.');
      }
    }
  };

  // Like post
  const handleLikePost = async (postId: string) => {
    const newLikes = await toggleLikeBlogPost(section.id, postId);
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: newLikes } : p))
    );
  };

  // Comment input change
  const handleCommentContentChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: {
        content: value,
        isSubmitting: prev[postId]?.isSubmitting ?? false,
      },
    }));
  };

  // Add Comment strictly using signed-in member account
  const handleAddComment = async (postId: string) => {
    if (!user) {
      if (onOpenAuthModal) {
        onOpenAuthModal();
      } else {
        alert('댓글을 작성하려면 먼저 회원 로그인을 해 주세요.');
      }
      return;
    }

    const currentInput = commentInputs[postId];
    const cContent = currentInput?.content?.trim();
    if (!cContent) return;

    setCommentInputs((prev) => ({
      ...prev,
      [postId]: { content: cContent, isSubmitting: true },
    }));

    try {
      const newComment = await addBlogComment(
        section.id,
        postId,
        cContent,
        'parent',
        user
      );

      // Update posts state with new comment immediately
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              comments: [...(p.comments || []), newComment],
            };
          }
          return p;
        })
      );

      // Reset input
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: { content: '', isSubmitting: false },
      }));
    } catch (err: any) {
      console.error('Comment error:', err);
      alert(`댓글 저장 실패: ${err?.message || '잠시 후 다시 시도해 주세요.'}`);
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: { content: cContent, isSubmitting: false },
      }));
    }
  };

  // Delete Comment (only author)
  const handleDeleteComment = async (postId: string, comment: BlogComment) => {
    if (!user) {
      if (onOpenAuthModal) onOpenAuthModal();
      return;
    }
    if (comment.authorId !== user.uid) {
      alert('본인이 작성한 댓글만 삭제할 수 있습니다.');
      return;
    }

    if (window.confirm('이 댓글을 삭제하시겠습니까?')) {
      await deleteBlogComment(section.id, postId, comment.id, user);
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              comments: (p.comments || []).filter((c) => c.id !== comment.id),
            };
          }
          return p;
        })
      );
    }
  };

  return (
    <div className={`space-y-6 ${embedded ? '' : 'p-4 sm:p-6 max-w-4xl mx-auto'}`}>
      {/* Firebase Sync & Google Login Status Header */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white border border-purple-200/90 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Globe2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                공유 학습 정리 (Firebase 클라우드 연동)
              </h4>
              <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                전체 공개
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">
              작성한 학습 정리는 본인 외에 다른 친구와 부모님도 함께 열람할 수 있습니다.
            </p>
          </div>
        </div>

        {/* User Status Badge or Login Action */}
        <div className="flex items-center space-x-2 self-end sm:self-center">
          {user ? (
            <div className="flex items-center space-x-2 bg-white px-2.5 py-1.5 rounded-lg border border-purple-200 text-xs">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full" />
              ) : (
                <UserCheck className="w-4 h-4 text-emerald-600" />
              )}
              <div className="text-left">
                <span className="font-semibold text-gray-800 block leading-tight">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-gray-400 font-mono block">
                  {user.email || '회원 계정 연결됨'}
                </span>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-purple-300 text-purple-700 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-purple-600" />
              <span>회원 로그인</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Success Alert Notification */}
      {saveFeedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center space-x-2.5 text-xs sm:text-sm font-semibold">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveFeedback(null)}
            className="text-emerald-700 hover:text-emerald-950 text-xs font-bold p-1 cursor-pointer"
          >
            닫기
          </button>
        </div>
      )}

      {/* Editor Card: Clean, simple, blank canvas */}
      {isEditorVisible && (
        <div className="bg-white border border-purple-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                {editingPostId ? '학습 정리 수정하기' : '나의 학습 정리 작성'}
              </h3>
            </div>
            {editingPostId && (
              <button
                type="button"
                onClick={handleStartNewPost}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>새 글 쓰기로 전환</span>
              </button>
            )}
          </div>

          {!user && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start justify-between gap-3">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">회원 로그인이 필요합니다.</span>
                  <p className="text-amber-700 mt-0.5">
                    학습 정리를 내 계정 ID로 Firebase에 저장하고 다른 사람들과 공유하려면 회원가입 및 로그인이 필요합니다.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs shrink-0 cursor-pointer"
              >
                로그인하기
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSavePost} className="space-y-3.5">
            {/* Title & Author row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`제목 (예: ${section.titleKo} 핵심 정리)`}
                  className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-medium"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="작성자 (학생 이름)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50"
                />
              </div>
            </div>

            {/* Content Blank Canvas */}
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="오늘 공부한 내용이나 나의 생각, 알게 된 점을 자유롭게 적어보세요..."
                className="w-full px-3.5 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 leading-relaxed font-sans resize-y"
              />
            </div>

            {/* Optional Image Upload Strip */}
            <div>
              {!showImageOptions && !imageUrl ? (
                <button
                  type="button"
                  onClick={() => setShowImageOptions(true)}
                  className="text-xs text-purple-700 hover:text-purple-900 inline-flex items-center space-x-1 py-1 font-medium cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>+ 사진이나 도표 첨부하기 (선택)</span>
                </button>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">이미지 첨부</span>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={() => setImageTab('upload')}
                        className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                          imageTab === 'upload' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        내 기기 사진
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab('textbook')}
                        className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                          imageTab === 'textbook' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        교과서 삽화
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab('url')}
                        className={`px-2 py-0.5 rounded font-medium cursor-pointer ${
                          imageTab === 'url' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        웹 링크 URL
                      </button>
                    </div>
                  </div>

                  {/* Upload from file */}
                  {imageTab === 'upload' && (
                    <div className="space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-purple-400 rounded-lg text-center text-gray-600 hover:text-purple-700 flex items-center justify-center space-x-2 bg-white cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>컴퓨터나 스마트폰 사진 선택하기</span>
                      </button>
                    </div>
                  )}

                  {/* Textbook illustrations */}
                  {imageTab === 'textbook' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 bg-white border rounded">
                      {Object.values(textbookPageImages).map((img) => (
                        <div
                          key={img.pageNumber}
                          onClick={() => {
                            setImageUrl(img.imageSrc);
                            setImageCaption(img.title);
                          }}
                          className={`p-1.5 border rounded cursor-pointer transition-all ${
                            imageUrl === img.imageSrc ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-300' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img src={img.imageSrc} alt="" className="w-full h-16 object-cover rounded" />
                          <p className="text-[10px] text-gray-600 truncate mt-1">{img.title}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* URL */}
                  {imageTab === 'url' && (
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="이미지 주소 (https://...)"
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white text-xs"
                    />
                  )}

                  {/* Image preview & delete */}
                  {imageUrl && (
                    <div className="flex items-center space-x-2 bg-white p-2 border rounded">
                      <img src={imageUrl} alt="" className="w-12 h-12 object-cover rounded" />
                      <input
                        type="text"
                        value={imageCaption}
                        onChange={(e) => setImageCaption(e.target.value)}
                        placeholder="이미지 설명 (선택)"
                        className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          setImageCaption('');
                        }}
                        className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        title="이미지 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-gray-400">
                {user ? `Google 계정 ID(${user.uid.slice(0, 6)}...)로 Firebase에 저장됩니다.` : '로그인 후 안전하게 클라우드에 저장할 수 있습니다.'}
              </span>
              <div className="flex items-center space-x-2">
                {(title || content || imageUrl) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('입력한 내용을 모두 비우시겠습니까?')) {
                        handleStartNewPost();
                        localStorage.removeItem(draftKey);
                      }
                    }}
                    className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    지우기
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? '저장 중...' : editingPostId ? '수정 완료' : '저장하기'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Saved Posts Section - Fully visible and clearly structured */}
      <div id="saved-posts-section" className="space-y-4 pt-2">
        <div className="flex items-center justify-between pb-1 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <h4 className="text-sm sm:text-base font-bold text-gray-800">
              기록된 학습 정리 ({posts.length}개)
            </h4>
            <span className="text-xs text-gray-500">
              • 다른 친구들과 함께 보는 공유 공간
            </span>
          </div>

          {!isEditorVisible && (
            <button
              type="button"
              onClick={handleStartNewPost}
              className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 글 작성</span>
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="p-8 text-center bg-white border border-gray-200 rounded-xl space-y-2">
            <div className="inline-block w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500">Firebase에서 학습 정리를 불러오는 중입니다...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-500 bg-gray-50/80 border border-gray-200 rounded-xl space-y-2">
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto" />
            <p className="font-semibold text-gray-700">아직 저장된 학습 정리가 없습니다.</p>
            <p className="text-gray-400">
              위의 입력창에 오늘 배운 내용이나 생각을 작성하고 [저장하기]를 누르면 여기에 기록되어 모두 함께 볼 수 있습니다.
            </p>
          </div>
        ) : (
          posts.map((post) => {
            const isAuthor = !!(user && post.authorId && user.uid === post.authorId);
            const isJustSaved = post.id === justSavedPostId;
            const commentInput = commentInputs[post.id] || { content: '' };

            return (
              <article
                key={post.id}
                id={`summary-${post.id}`}
                className={`bg-white border rounded-xl shadow-xs overflow-hidden transition-all duration-300 ${
                  isJustSaved
                    ? 'border-purple-500 ring-2 ring-purple-300/80'
                    : 'border-gray-200 hover:border-purple-200'
                }`}
              >
                {/* Post Header */}
                <div className="p-4 sm:p-5 border-b border-gray-100 flex items-start justify-between gap-3 bg-gradient-to-r from-purple-50/20 to-white">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 break-words">
                        {post.title}
                      </h3>
                      {isJustSaved && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full animate-pulse">
                          방금 저장됨
                        </span>
                      )}
                      {isAuthor && (
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                          내 글
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-gray-500 flex flex-wrap items-center gap-2">
                      {/* Author badge */}
                      <div className="flex items-center space-x-1.5">
                        {post.authorPhotoUrl ? (
                          <img
                            src={post.authorPhotoUrl}
                            alt=""
                            className="w-4 h-4 rounded-full"
                          />
                        ) : (
                          <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[9px] flex items-center justify-center font-bold">
                            {post.authorName.charAt(0)}
                          </span>
                        )}
                        <span className="font-semibold text-gray-800">{post.authorName}</span>
                      </div>

                      {post.authorEmail && (
                        <span className="text-[11px] text-gray-400 font-mono">
                          ({post.authorEmail})
                        </span>
                      )}

                      <span>•</span>

                      <div className="flex items-center space-x-1 text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Edit / Delete actions: only visible to author */}
                  {isAuthor && (
                    <div className="flex items-center space-x-1 text-gray-400 shrink-0">
                      <button
                        onClick={() => handleStartEdit(post)}
                        className="p-1.5 hover:text-purple-600 hover:bg-purple-50 rounded cursor-pointer"
                        title="수정"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post)}
                        className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Post Body */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-normal">
                    {post.content}
                  </div>

                  {post.imageUrl && (
                    <div className="pt-2">
                      <img
                        src={post.imageUrl}
                        alt={post.imageCaption || '첨부 사진'}
                        className="max-h-80 object-contain rounded-lg border border-gray-200 bg-gray-50"
                      />
                      {post.imageCaption && (
                        <p className="text-xs text-gray-500 mt-1">{post.imageCaption}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Like Count & Simple Bar */}
                <div className="px-4 sm:px-5 py-2.5 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center space-x-1 hover:text-pink-600 font-semibold cursor-pointer"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        (post.likes || 0) > 0 ? 'fill-pink-500 text-pink-500' : ''
                      }`}
                    />
                    <span>좋아요 {post.likes || 0}</span>
                  </button>

                  <span className="flex items-center space-x-1 text-gray-500">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>댓글 {post.comments?.length || 0}개</span>
                  </span>
                </div>

                {/* Comments Section: Google Auth strictly required to comment */}
                <div className="p-4 sm:p-5 bg-gray-50/40 border-t border-gray-100 space-y-3">
                  {/* Comments list */}
                  {post.comments && post.comments.length > 0 ? (
                    <div className="space-y-2">
                      {post.comments.map((cmt) => {
                        const isCommentAuthor = !!(user && cmt.authorId === user.uid);

                        return (
                          <div
                            key={cmt.id}
                            className="bg-white p-2.5 sm:p-3 rounded-lg border border-gray-200 flex items-start justify-between gap-2 text-xs shadow-2xs"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {cmt.authorPhotoUrl ? (
                                  <img
                                    src={cmt.authorPhotoUrl}
                                    alt=""
                                    className="w-4 h-4 rounded-full"
                                  />
                                ) : (
                                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] flex items-center justify-center font-bold">
                                    {cmt.authorName.charAt(0)}
                                  </span>
                                )}
                                <span className="font-bold text-gray-900">
                                  {cmt.authorName}
                                </span>
                                {cmt.authorEmail && (
                                  <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                                    ({cmt.authorEmail})
                                  </span>
                                )}
                                <span className="text-[11px] text-gray-400">
                                  {new Date(cmt.createdAt).toLocaleTimeString('ko-KR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-gray-700 leading-normal pl-5">
                                {cmt.content}
                              </p>
                            </div>

                            {isCommentAuthor && (
                              <button
                                type="button"
                                onClick={() => handleDeleteComment(post.id, cmt)}
                                className="text-gray-300 hover:text-red-500 p-0.5 cursor-pointer"
                                title="댓글 삭제"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : null}

                  {/* Comment Input or Google Login Prompt */}
                  {user ? (
                    <div className="pt-1 space-y-1.5">
                      <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                        <span className="font-semibold text-gray-700">
                          {user.displayName || user.email?.split('@')[0]}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono">
                          계정으로 댓글 작성
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={commentInput.content}
                          onChange={(e) =>
                            handleCommentContentChange(post.id, e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                          placeholder="응원 댓글이나 생각을 남겨주세요..."
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          disabled={commentInput.isSubmitting}
                          className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center justify-center space-x-1 shadow-2xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>{commentInput.isSubmitting ? '등록 중' : '등록'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100/70 border border-gray-200 rounded-lg p-2.5 flex items-center justify-between text-xs">
                      <span className="text-gray-600">
                        댓글은 회원으로 로그인한 사람만 작성할 수 있습니다.
                      </span>
                      <button
                        type="button"
                        onClick={onOpenAuthModal}
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded text-xs shrink-0 cursor-pointer flex items-center space-x-1"
                      >
                        <LogIn className="w-3 h-3" />
                        <span>로그인 후 댓글 작성</span>
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
