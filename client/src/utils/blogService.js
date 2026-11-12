import api from './api';
import { MOCK_BLOGS } from './mockBlogs';
import { CATEGORIES } from './constants';

/**
 * Normalizes article data between database schema and mock structure
 */
export const normalizePost = (post) => {
  if (!post) return null;
  return {
    id: post._id || post.id,
    _id: post._id || post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage,
    category: post.category?.name || post.category || 'General',
    categorySlug: post.category?.slug || post.categorySlug || 'general',
    author: {
      name: post.author?.name || 'FlyerTech Editorial',
      role: post.author?.role || 'Staff Writer',
      avatar: post.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: post.author?.bio || '',
      socialLinks: post.author?.socialLinks || {},
    },
    tags: Array.isArray(post.tags)
      ? post.tags.map((t) => (typeof t === 'object' ? t.name : t))
      : [],
    status: post.status || 'published',
    publishedAt: post.publishedAt || post.createdAt || new Date().toISOString(),
    readTime: post.readTime || '5 min read',
    views: post.views || 0,
    isFeatured: Boolean(post.isFeatured),
    isTrending: Boolean(post.isTrending),
    seo: post.seo || {},
  };
};

/**
 * Fetch published articles with search, category, sort, and pagination
 */
export const fetchArticles = async ({
  category = 'all',
  search = '',
  sort = 'latest',
  page = 1,
  limit = 9,
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const response = await api.get(`/posts?${params.toString()}`);
    if (response.data?.success && response.data?.data) {
      return {
        articles: response.data.data.map(normalizePost),
        total: response.data.total || response.data.count,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
        source: 'api',
      };
    }
  } catch (error) {
    console.warn('[BlogService] API offline or error. Falling back to local store:', error.message);
  }

  // Graceful local fallback
  let filtered = [...MOCK_BLOGS];

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.categorySlug === category);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (sort === 'popular') {
    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    filtered.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit).map(normalizePost);

  return {
    articles: paginated,
    total,
    totalPages,
    currentPage: page,
    source: 'local-fallback',
  };
};

/**
 * Fetch a single article by slug
 */
export const fetchArticleBySlug = async (slug) => {
  try {
    const response = await api.get(`/posts/${slug}`);
    if (response.data?.success && response.data?.data) {
      return {
        article: normalizePost(response.data.data),
        relatedPosts: (response.data.relatedPosts || []).map(normalizePost),
        prevPost: response.data.prevPost || null,
        nextPost: response.data.nextPost || null,
        source: 'api',
      };
    }
  } catch (error) {
    console.warn(`[BlogService] API fetch for slug "${slug}" failed. Falling back to local store:`, error.message);
  }

  // Graceful local fallback
  const postIndex = MOCK_BLOGS.findIndex((p) => p.slug === slug);
  if (postIndex === -1) return null;

  const post = normalizePost(MOCK_BLOGS[postIndex]);
  const prevPost = postIndex > 0 ? { title: MOCK_BLOGS[postIndex - 1].title, slug: MOCK_BLOGS[postIndex - 1].slug } : null;
  const nextPost = postIndex < MOCK_BLOGS.length - 1 ? { title: MOCK_BLOGS[postIndex + 1].title, slug: MOCK_BLOGS[postIndex + 1].slug } : null;

  const relatedPosts = MOCK_BLOGS
    .filter((p) => p.id !== post.id && (p.categorySlug === post.categorySlug || p.isTrending))
    .slice(0, 3)
    .map(normalizePost);

  return {
    article: post,
    relatedPosts,
    prevPost,
    nextPost,
    source: 'local-fallback',
  };
};

/**
 * Fetch all categories with live post counts
 */
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
  } catch (error) {
    console.warn('[BlogService] Failed to load categories from API, using defaults:', error.message);
  }
  return CATEGORIES;
};

/**
 * Admin: Fetch all posts across draft, published, and scheduled
 */
export const fetchAdminPosts = async ({ status = 'all', category = 'all', search = '', page = 1, limit = 20 } = {}) => {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.append('status', status);
  if (category && category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  params.append('page', page);
  params.append('limit', limit);

  const response = await api.get(`/posts/admin/all?${params.toString()}`);
  return response.data;
};

/**
 * Admin: Create post
 */
export const createPost = async (postData) => {
  const response = await api.post('/posts', postData);
  return response.data;
};

/**
 * Admin: Update post
 */
export const updatePost = async (id, postData) => {
  const response = await api.put(`/posts/${id}`, postData);
  return response.data;
};

/**
 * Admin: Delete post
 */
export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

/**
 * Admin: Upload image
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
