import { BlogPost, BlogComment, ChapterSection } from '../types';
import { textbookPageImages } from '../data/textbookPageImages';

const STORAGE_KEY = 'ch18_study_blog_posts';

// Return empty list so student starts with a clean, blank canvas without pre-filled textbook text
export const getDefaultBlogPosts = (_section: ChapterSection): BlogPost[] => {
  return [];
};

/**
 * Load all blog posts from localStorage
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

/**
 * Load blog posts for a specific section (filters out legacy seed posts)
 */
export const getBlogPostsForSection = (section: ChapterSection): BlogPost[] => {
  const allPosts = loadAllBlogPosts();
  const list = allPosts[section.id];
  if (Array.isArray(list)) {
    // Filter out any legacy pre-seeded mock posts from previous runs
    return list.filter(p => !p.id.startsWith('seed-'));
  }
  return [];
};

/**
 * Save blog posts for a section to localStorage
 */
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
 * Add a new blog post
 */
export const createBlogPost = (
  section: ChapterSection,
  newPost: Omit<BlogPost, 'id' | 'createdAt' | 'comments' | 'likes'>
): BlogPost => {
  const posts = getBlogPostsForSection(section);
  const created: BlogPost = {
    ...newPost,
    id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: Date.now(),
    comments: [],
    likes: 0,
  };
  const updated = [created, ...posts];
  saveBlogPostsForSection(section.id, updated);
  return created;
};

/**
 * Update an existing blog post
 */
export const updateBlogPost = (
  sectionId: string,
  postId: string,
  updates: Partial<BlogPost>
) => {
  const allPosts = loadAllBlogPosts();
  const list = allPosts[sectionId] || [];
  const updated = list.map(p => (p.id === postId ? { ...p, ...updates, updatedAt: Date.now() } : p));
  saveBlogPostsForSection(sectionId, updated);
  return updated;
};

/**
 * Delete a blog post
 */
export const deleteBlogPost = (sectionId: string, postId: string) => {
  const allPosts = loadAllBlogPosts();
  const list = allPosts[sectionId] || [];
  const updated = list.filter(p => p.id !== postId);
  saveBlogPostsForSection(sectionId, updated);
  return updated;
};

/**
 * Add a comment to a blog post
 */
export const addBlogComment = (
  sectionId: string,
  postId: string,
  comment: Omit<BlogComment, 'id' | 'createdAt' | 'likes'>
): BlogComment => {
  const allPosts = loadAllBlogPosts();
  const list = allPosts[sectionId] || [];
  const newComment: BlogComment = {
    ...comment,
    id: `cmt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: Date.now(),
    likes: 0,
  };

  const updated = list.map(p => {
    if (p.id === postId) {
      return {
        ...p,
        comments: [...p.comments, newComment],
      };
    }
    return p;
  });

  saveBlogPostsForSection(sectionId, updated);
  return newComment;
};

/**
 * Like a blog post
 */
export const toggleLikeBlogPost = (sectionId: string, postId: string): number => {
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

/**
 * Delete a comment
 */
export const deleteBlogComment = (sectionId: string, postId: string, commentId: string) => {
  const allPosts = loadAllBlogPosts();
  const list = allPosts[sectionId] || [];
  const updated = list.map(p => {
    if (p.id === postId) {
      return {
        ...p,
        comments: (p.comments || []).filter(c => c.id !== commentId),
      };
    }
    return p;
  });
  saveBlogPostsForSection(sectionId, updated);
  return updated;
};
