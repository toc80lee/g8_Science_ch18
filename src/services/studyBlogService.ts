import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc,
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  orderBy
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from './firebaseFirestore';
import { BlogPost, BlogComment, ChapterSection } from '../types';

const STORAGE_KEY = 'ch18_study_blog_posts';

// Fallback empty list
export const getDefaultBlogPosts = (_section: ChapterSection): BlogPost[] => {
  return [];
};

/**
 * LocalStorage helpers for fast offline access & local caching
 */
export const loadAllBlogPosts = (): Record<string, BlogPost[]> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (e) {
    console.error('Failed to load blog posts from storage', e);
    return {};
  }
};

export const getBlogPostsForSection = (section: ChapterSection): BlogPost[] => {
  const allPosts = loadAllBlogPosts();
  const list = allPosts[section.id];
  if (Array.isArray(list)) {
    return list.filter(p => !p.id.startsWith('seed-'));
  }
  return [];
};

export const saveBlogPostsForSection = (sectionId: string, posts: BlogPost[]) => {
  if (typeof window === 'undefined') return;
  try {
    const allPosts = loadAllBlogPosts();
    allPosts[sectionId] = posts;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPosts));
  } catch (e) {
    console.error('Failed to save blog posts', e);
  }
};

/**
 * Clean sanitization for Firestore fields
 */
function cleanDocData<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result as Partial<T>;
}

/**
 * Load comments for a specific summary post from Firestore
 */
export const fetchCommentsForSummary = async (summaryId: string): Promise<BlogComment[]> => {
  try {
    const commentsRef = collection(db, 'study_summaries', summaryId, 'comments');
    const snapshot = await getDocs(commentsRef);
    const comments: BlogComment[] = [];
    snapshot.forEach((snap) => {
      const data = snap.data();
      comments.push({
        id: snap.id,
        summaryId,
        authorId: data.authorId || '',
        authorEmail: data.authorEmail || '',
        authorPhotoUrl: data.authorPhotoUrl || '',
        authorRole: data.authorRole || 'parent',
        authorName: data.authorName || '작성자',
        avatarEmoji: data.avatarEmoji || '',
        content: data.content || '',
        createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
        likes: data.likes || 0
      });
    });
    // Sort oldest first for comments thread
    return comments.sort((a, b) => a.createdAt - b.createdAt);
  } catch (err) {
    console.warn(`Failed to fetch comments for summary ${summaryId}:`, err);
    return [];
  }
};

/**
 * Fetch all study summaries for a section from Firebase Firestore
 * Loads shared summaries so everyone can view each other's summaries.
 */
export const fetchBlogPostsForSection = async (sectionId: string): Promise<BlogPost[]> => {
  try {
    const summariesRef = collection(db, 'study_summaries');
    const q = query(summariesRef, where('sectionId', '==', sectionId));
    const snapshot = await getDocs(q);

    const postPromises: Promise<BlogPost>[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const summaryId = docSnap.id;

      postPromises.push(
        (async () => {
          const comments = await fetchCommentsForSummary(summaryId);
          return {
            id: summaryId,
            sectionId: data.sectionId || sectionId,
            sectionTitleKo: data.sectionTitleKo || '',
            sectionTitleEn: data.sectionTitleEn || '',
            title: data.title || '',
            authorId: data.authorId || '',
            authorEmail: data.authorEmail || '',
            authorPhotoUrl: data.authorPhotoUrl || '',
            authorName: data.authorName || '학생',
            createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
            updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : undefined,
            content: data.content || '',
            tags: Array.isArray(data.tags) ? data.tags : [],
            understandingLevel: data.understandingLevel || 'great',
            imageUrl: data.imageUrl || undefined,
            imageCaption: data.imageCaption || undefined,
            comments,
            likes: data.likes || 0
          } as BlogPost;
        })()
      );
    });

    const firestorePosts = await Promise.all(postPromises);
    // Sort newest post first
    firestorePosts.sort((a, b) => b.createdAt - a.createdAt);

    // Merge with any local offline posts that might not be synced yet
    const localPosts = getBlogPostsForSection({ id: sectionId } as ChapterSection);
    const map = new Map<string, BlogPost>();

    for (const p of firestorePosts) {
      map.set(p.id, p);
    }
    for (const p of localPosts) {
      if (!map.has(p.id)) {
        map.set(p.id, p);
      }
    }

    const merged = Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
    saveBlogPostsForSection(sectionId, merged);
    return merged;
  } catch (err) {
    console.warn('Error fetching posts from Firestore, falling back to local cache:', err);
    return getBlogPostsForSection({ id: sectionId } as ChapterSection);
  }
};

/**
 * Real-time listener for study summaries in a section
 */
export const subscribeToSectionBlogPosts = (
  sectionId: string,
  onUpdate: (posts: BlogPost[]) => void
): (() => void) => {
  try {
    const summariesRef = collection(db, 'study_summaries');
    const q = query(summariesRef, where('sectionId', '==', sectionId));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const postPromises: Promise<BlogPost>[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const summaryId = docSnap.id;

          postPromises.push(
            (async () => {
              const comments = await fetchCommentsForSummary(summaryId);
              return {
                id: summaryId,
                sectionId: data.sectionId || sectionId,
                sectionTitleKo: data.sectionTitleKo || '',
                sectionTitleEn: data.sectionTitleEn || '',
                title: data.title || '',
                authorId: data.authorId || '',
                authorEmail: data.authorEmail || '',
                authorPhotoUrl: data.authorPhotoUrl || '',
                authorName: data.authorName || '학생',
                createdAt: typeof data.createdAt === 'number' ? data.createdAt : Date.now(),
                updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : undefined,
                content: data.content || '',
                tags: Array.isArray(data.tags) ? data.tags : [],
                understandingLevel: data.understandingLevel || 'great',
                imageUrl: data.imageUrl || undefined,
                imageCaption: data.imageCaption || undefined,
                comments,
                likes: data.likes || 0
              } as BlogPost;
            })()
          );
        });

        const firestorePosts = await Promise.all(postPromises);
        firestorePosts.sort((a, b) => b.createdAt - a.createdAt);
        saveBlogPostsForSection(sectionId, firestorePosts);
        onUpdate(firestorePosts);
      },
      (err) => {
        console.warn('Realtime subscription error:', err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Could not set up Firestore listener:', err);
    return () => {};
  }
};

/**
 * Save / Create a new blog post in Firestore with user's Google ID
 */
export const createBlogPost = async (
  section: ChapterSection,
  newPost: Omit<BlogPost, 'id' | 'createdAt' | 'comments' | 'likes'>,
  user: User | null
): Promise<BlogPost> => {
  const generatedId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = Date.now();

  const authorId = user?.uid || newPost.authorId || 'guest';
  const authorEmail = user?.email || newPost.authorEmail || '';
  const authorPhotoUrl = user?.photoURL || newPost.authorPhotoUrl || '';
  const authorName = user?.displayName || newPost.authorName || '학생';

  const createdPost: BlogPost = {
    ...newPost,
    id: generatedId,
    sectionId: section.id,
    sectionTitleKo: section.titleKo,
    sectionTitleEn: section.titleEn,
    authorId,
    authorEmail,
    authorPhotoUrl,
    authorName,
    createdAt: now,
    comments: [],
    likes: 0
  };

  // 1. Save to Firestore if user is authenticated with Google
  if (user && user.uid) {
    try {
      const docRef = doc(db, 'study_summaries', generatedId);
      const firestorePayload = cleanDocData({
        id: generatedId,
        sectionId: section.id,
        sectionTitleKo: section.titleKo,
        sectionTitleEn: section.titleEn,
        title: createdPost.title,
        content: createdPost.content,
        authorId: user.uid,
        authorName: authorName,
        authorEmail: authorEmail,
        authorPhotoUrl: authorPhotoUrl,
        imageUrl: createdPost.imageUrl || '',
        imageCaption: createdPost.imageCaption || '',
        createdAt: now,
        likes: 0
      });
      await setDoc(docRef, firestorePayload);
    } catch (err) {
      console.error('Failed to save to Firestore directly:', err);
      throw err;
    }
  }

  // 2. Cache in localStorage
  const posts = getBlogPostsForSection(section);
  const updated = [createdPost, ...posts.filter(p => p.id !== generatedId)];
  saveBlogPostsForSection(section.id, updated);

  return createdPost;
};

/**
 * Update an existing post in Firestore
 */
export const updateBlogPost = async (
  sectionId: string,
  postId: string,
  updates: Partial<BlogPost>,
  user: User | null
): Promise<BlogPost[]> => {
  const now = Date.now();

  if (user && user.uid) {
    try {
      const docRef = doc(db, 'study_summaries', postId);
      const payload = cleanDocData({
        ...updates,
        authorId: user.uid,
        updatedAt: now
      });
      await setDoc(docRef, payload, { merge: true });
    } catch (err) {
      console.error('Failed to update post in Firestore:', err);
      throw err;
    }
  }

  const allPosts = loadAllBlogPosts();
  const list = allPosts[sectionId] || [];
  const updated = list.map(p => (p.id === postId ? { ...p, ...updates, updatedAt: now } : p));
  saveBlogPostsForSection(sectionId, updated);
  return updated;
};

/**
 * Delete a post from Firestore
 */
export const deleteBlogPost = async (
  sectionId: string,
  postId: string,
  user: User | null
): Promise<BlogPost[]> => {
  if (user && user.uid) {
    try {
      const docRef = doc(db, 'study_summaries', postId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Failed to delete post from Firestore:', err);
      throw err;
    }
  }

  const allPosts = loadAllBlogPosts();
  const list = allPosts[sectionId] || [];
  const updated = list.filter(p => p.id !== postId);
  saveBlogPostsForSection(sectionId, updated);
  return updated;
};

/**
 * Add a comment to a study summary
 * Strictly saves to Firestore under the Google-signed-in user's account
 */
export const addBlogComment = async (
  sectionId: string,
  summaryId: string,
  content: string,
  authorRole: 'parent' | 'friend' | 'teacher' | 'student',
  user: User
): Promise<BlogComment> => {
  if (!user || !user.uid) {
    throw new Error('댓글을 작성하려면 Google 계정 로그인이 필요합니다.');
  }

  const commentId = `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = Date.now();

  const newComment: BlogComment = {
    id: commentId,
    summaryId,
    authorId: user.uid,
    authorEmail: user.email || '',
    authorPhotoUrl: user.photoURL || '',
    authorName: user.displayName || '작성자',
    authorRole,
    content: content.trim(),
    createdAt: now,
    likes: 0
  };

  try {
    const commentDocRef = doc(db, 'study_summaries', summaryId, 'comments', commentId);
    const payload = cleanDocData({
      id: commentId,
      summaryId,
      sectionId,
      authorId: user.uid,
      authorEmail: user.email || '',
      authorPhotoUrl: user.photoURL || '',
      authorName: newComment.authorName,
      authorRole,
      content: newComment.content,
      createdAt: now
    });
    await setDoc(commentDocRef, payload);
  } catch (err) {
    console.error('Failed to post comment to Firestore:', err);
    throw err;
  }

  // Update local cache
  const allPosts = loadAllBlogPosts();
  const list = allPosts[sectionId] || [];
  const updated = list.map(p => {
    if (p.id === summaryId) {
      return {
        ...p,
        comments: [...(p.comments || []), newComment]
      };
    }
    return p;
  });
  saveBlogPostsForSection(sectionId, updated);

  return newComment;
};

/**
 * Delete a comment from Firestore
 */
export const deleteBlogComment = async (
  sectionId: string,
  summaryId: string,
  commentId: string,
  user: User | null
) => {
  if (user && user.uid) {
    try {
      const commentDocRef = doc(db, 'study_summaries', summaryId, 'comments', commentId);
      await deleteDoc(commentDocRef);
    } catch (err) {
      console.error('Failed to delete comment from Firestore:', err);
    }
  }

  const allPosts = loadAllBlogPosts();
  const list = allPosts[sectionId] || [];
  const updated = list.map(p => {
    if (p.id === summaryId) {
      return {
        ...p,
        comments: (p.comments || []).filter(c => c.id !== commentId)
      };
    }
    return p;
  });
  saveBlogPostsForSection(sectionId, updated);
  return updated;
};

/**
 * Like a blog post
 */
export const toggleLikeBlogPost = async (sectionId: string, postId: string): Promise<number> => {
  const allPosts = loadAllBlogPosts();
  const list = allPosts[sectionId] || [];
  let newLikes = 0;
  const updated = list.map(p => {
    if (p.id === postId) {
      newLikes = (p.likes || 0) + 1;
      return { ...p, likes: newLikes };
    }
    return p;
  });
  saveBlogPostsForSection(sectionId, updated);
  return newLikes;
};
