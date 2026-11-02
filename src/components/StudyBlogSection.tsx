import React, { useState, useEffect, useRef } from 'react';
import { ChapterSection, BlogPost } from '../types';
import { 
  getBlogPostsForSection, 
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
  X, 
  RotateCcw
} from 'lucide-react';

interface StudyBlogSectionProps {
  section: ChapterSection;
  embedded?: boolean;
}

export const StudyBlogSection: React.FC<StudyBlogSectionProps> = ({
  section,
  embedded = false,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Editor form state: completely clean blank slate
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('학생');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageCaption, setImageCaption] = useState<string>('');
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'textbook' | 'url'>('upload');

  // Status message for save confirmation
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Per-post comment input states
  const [commentInputs, setCommentInputs] = useState<Record<string, { author: string; content: string }>>({});

  // File input ref for image upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Draft storage key
  const draftKey = `ch18_blog_draft_${section.id}`;

  // Load posts for current section
  useEffect(() => {
    const list = getBlogPostsForSection(section);
    setPosts(list);

    // If there is an unsaved draft for this section and we are not editing, load it
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
  }, [section.id]);

  // Auto-save draft as student types (prevents accidental loss)
  useEffect(() => {
    if (editingPostId) return; // don't overwrite draft when editing existing post
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
      // ignore storage quota error
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
  };

  // Open editor to edit an existing post
  const handleStartEdit = (post: BlogPost) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setAuthorName(post.authorName || '학생');
    setContent(post.content);
    setImageUrl(post.imageUrl || '');
    setImageCaption(post.imageCaption || '');
    setShowImageOptions(!!post.imageUrl);
    setIsEditorVisible(true);
    setErrorMessage(null);

    // Scroll to editor smoothly
    window.scrollTo({ top: 350, behavior: 'smooth' });
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

  // Save Post (Robust: automatically sets fallback title if left blank)
  const handleSavePost = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setErrorMessage('내용을 입력해 주세요.');
      return;
    }

    // Default title if empty
    const finalTitle = title.trim() || `${section.titleKo} 학습 정리`;
    const finalAuthor = authorName.trim() || '학생';

    try {
      if (editingPostId) {
        const updated = updateBlogPost(section.id, editingPostId, {
          title: finalTitle,
          authorName: finalAuthor,
          content: trimmedContent,
          imageUrl: imageUrl.trim() || undefined,
          imageCaption: imageCaption.trim() || undefined,
        });
        setPosts(updated);
        setSaveFeedback('수정 내용이 저장되었습니다!');
      } else {
        createBlogPost(section, {
          sectionId: section.id,
          sectionTitleKo: section.titleKo,
          sectionTitleEn: section.titleEn,
          title: finalTitle,
          authorName: finalAuthor,
          content: trimmedContent,
          tags: [`#${section.titleKo.replace(/\s+/g, '')}`],
          understandingLevel: 'great',
          imageUrl: imageUrl.trim() || undefined,
          imageCaption: imageCaption.trim() || undefined,
        });
        const reloaded = getBlogPostsForSection(section);
        setPosts(reloaded);
        setSaveFeedback('학습 정리가 안전하게 저장되었습니다!');
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

      // Auto-clear feedback after 4 seconds
      setTimeout(() => {
        setSaveFeedback(null);
      }, 4000);
    } catch (err) {
      console.error('Save error:', err);
      setErrorMessage('저장 중 문제가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  // Delete post
  const handleDeletePost = (postId: string) => {
    if (window.confirm('이 학습 정리를 삭제하시겠습니까?')) {
      const updated = deleteBlogPost(section.id, postId);
      setPosts(updated);
      if (editingPostId === postId) {
        handleStartNewPost();
      }
    }
  };

  // Like post
  const handleLikePost = (postId: string) => {
    toggleLikeBlogPost(section.id, postId);
    setPosts(getBlogPostsForSection(section));
  };

  // Simplified comment handling
  const handleCommentChange = (postId: string, field: 'author' | 'content', value: string) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: {
        author: prev[postId]?.author ?? '부모님',
        content: prev[postId]?.content ?? '',
        [field]: value,
      },
    }));
  };

  const handleAddComment = (postId: string) => {
    const currentInput = commentInputs[postId];
    const cContent = currentInput?.content?.trim();
    if (!cContent) return;

    const cAuthor = currentInput?.author?.trim() || '부모님';

    addBlogComment(section.id, postId, {
      postId,
      authorRole: 'parent',
      authorName: cAuthor,
      content: cContent,
    });

    // Reset input
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: { author: cAuthor, content: '' },
    }));

    // Refresh post list
    setPosts(getBlogPostsForSection(section));
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    deleteBlogComment(section.id, postId, commentId);
    setPosts(getBlogPostsForSection(section));
  };

  return (
    <div className={`space-y-6 ${embedded ? '' : 'p-4 sm:p-6 max-w-4xl mx-auto'}`}>
      {/* Save Success Alert Notification */}
      {saveFeedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveFeedback(null)}
            className="text-emerald-600 hover:text-emerald-900 text-xs font-bold p-1"
          >
            닫기
          </button>
        </div>
      )}

      {/* Editor Card: Clean, simple, blank canvas for the student */}
      {isEditorVisible && (
        <div className="bg-white border border-purple-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                {editingPostId ? '학습 정리 수정하기' : '나의 학습 정리'}
              </h3>
            </div>
            {editingPostId && (
              <button
                type="button"
                onClick={handleStartNewPost}
                className="text-xs text-gray-500 hover:text-gray-800 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>새 글 쓰기로 전환</span>
              </button>
            )}
          </div>

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
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                        className={`px-2 py-0.5 rounded font-medium ${
                          imageTab === 'upload' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        내 기기 사진
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab('textbook')}
                        className={`px-2 py-0.5 rounded font-medium ${
                          imageTab === 'textbook' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        교재 삽화 선택
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab('url')}
                        className={`px-2 py-0.5 rounded font-medium ${
                          imageTab === 'url' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        URL 입력
                      </button>
                    </div>
                  </div>

                  {/* Upload from file */}
                  {imageTab === 'upload' && (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 border border-dashed border-gray-300 rounded bg-white hover:bg-purple-50 text-purple-700 font-medium flex items-center justify-center space-x-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>사진 파일 선택하기</span>
                      </button>
                    </div>
                  )}

                  {/* Textbook image selection */}
                  {imageTab === 'textbook' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {section.pages?.map((p) => {
                        const imgInfo = textbookPageImages[p];
                        if (!imgInfo) return null;
                        const isSelected = imageUrl === imgInfo.imageSrc;
                        return (
                          <div
                            key={p}
                            onClick={() => {
                              setImageUrl(imgInfo.imageSrc);
                              setImageCaption(`교재 ${p}쪽 삽화`);
                            }}
                            className={`border rounded overflow-hidden cursor-pointer p-1 text-center bg-white ${
                              isSelected ? 'border-purple-600 ring-1 ring-purple-500' : 'border-gray-200'
                            }`}
                          >
                            <img src={imgInfo.imageSrc} alt="" className="w-full h-14 object-cover rounded" />
                            <span className="text-[10px] text-gray-600 block mt-0.5 truncate">{p}쪽 {imgInfo.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* URL */}
                  {imageTab === 'url' && (
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="이미지 주소 (https://...)"
                      className="w-full px-2.5 py-1.5 border border-gray-300 rounded bg-white"
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
                        className="text-red-500 hover:text-red-700 p-1"
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
                작성 중인 내용은 자동 임시 보관됩니다.
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
                    className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-800"
                  >
                    지우기
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingPostId ? '수정 완료' : '저장하기'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Saved Posts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-bold text-gray-700">
            기록된 학습 정리 ({posts.length}개)
          </h4>
          {!isEditorVisible && (
            <button
              type="button"
              onClick={handleStartNewPost}
              className="text-xs text-purple-700 hover:text-purple-900 font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 글 작성</span>
            </button>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-400 bg-gray-50/70 border border-gray-200/80 rounded-xl">
            아직 저장된 학습 정리가 없습니다. 위의 입력창에 오늘 배운 내용을 작성하고 [저장하기]를 눌러보세요.
          </div>
        ) : (
          posts.map((post) => {
            const commentState = commentInputs[post.id] || { author: '부모님', content: '' };

            return (
              <article
                key={post.id}
                className="bg-white border border-gray-200 rounded-xl shadow-2xs overflow-hidden"
              >
                {/* Post Header */}
                <div className="p-4 sm:p-5 border-b border-gray-100 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900">
                      {post.title}
                    </h3>
                    <div className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                      <span className="font-semibold text-gray-700">{post.authorName}</span>
                      <span>•</span>
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

                  {/* Edit / Delete actions */}
                  <div className="flex items-center space-x-1 text-gray-400">
                    <button
                      onClick={() => handleStartEdit(post)}
                      className="p-1 hover:text-purple-600 rounded"
                      title="수정"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="p-1 hover:text-red-600 rounded"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                    <Heart className={`w-3.5 h-3.5 ${(post.likes || 0) > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
                    <span>좋아요 {post.likes || 0}</span>
                  </button>

                  <span className="flex items-center space-x-1 text-gray-500">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>댓글 {post.comments?.length || 0}</span>
                  </span>
                </div>

                {/* Simplified Comments Section */}
                <div className="p-4 sm:p-5 bg-gray-50/30 border-t border-gray-100 space-y-3">
                  {/* Comments list */}
                  {post.comments && post.comments.length > 0 ? (
                    <div className="space-y-2">
                      {post.comments.map((cmt) => (
                        <div
                          key={cmt.id}
                          className="bg-white p-2.5 sm:p-3 rounded-lg border border-gray-200 flex items-start justify-between gap-2 text-xs"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-bold text-gray-900">{cmt.authorName}</span>
                              <span className="text-[11px] text-gray-400">
                                {new Date(cmt.createdAt).toLocaleTimeString('ko-KR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-normal">{cmt.content}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(post.id, cmt.id)}
                            className="text-gray-300 hover:text-red-500 p-0.5"
                            title="댓글 삭제"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {/* Simple Comment Input (author + text + button) */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentState.author}
                      onChange={(e) => handleCommentChange(post.id, 'author', e.target.value)}
                      placeholder="작성자 (예: 엄마)"
                      className="w-full sm:w-28 px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    />
                    <input
                      type="text"
                      value={commentState.content}
                      onChange={(e) => handleCommentChange(post.id, 'content', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddComment(post.id);
                        }
                      }}
                      placeholder="응원 댓글을 남겨주세요..."
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded-lg bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(post.id)}
                      className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0 flex items-center justify-center space-x-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>등록</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
