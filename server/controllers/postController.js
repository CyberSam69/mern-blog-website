const Post = require('../models/Post');
const Category = require('../models/Category');
const Author = require('../models/Author');
const Tag = require('../models/Tag');
const slugify = require('slugify');

// Utility: calculate estimated reading time from word count
const calculateReadingTime = (content) => {
  if (!content) return '1 min read';
  const cleanText = content.replace(/<[^>]*>/g, '');
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 200));
  return `${minutes} min read`;
};

// @desc    Get published articles (with search, category filter, tag, sorting, pagination)
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const { category, search, tag, sort = 'latest', page = 1, limit = 9 } = req.query;

    const now = new Date();
    // Only fetch published posts or scheduled posts whose scheduled date has arrived
    const query = {
      $or: [
        { status: 'published' },
        { status: 'scheduled', scheduledFor: { $lte: now } },
      ],
    };

    // Filter by category slug
    if (category && category !== 'all') {
      const catDoc = await Category.findOne({ slug: category });
      if (catDoc) {
        query.category = catDoc._id;
      } else {
        return res.status(200).json({
          success: true,
          count: 0,
          total: 0,
          totalPages: 0,
          currentPage: Number(page),
          data: [],
        });
      }
    }

    // Filter by tag slug
    if (tag) {
      const tagDoc = await Tag.findOne({ slug: tag });
      if (tagDoc) {
        query.tags = tagDoc._id;
      }
    }

    // Keyword search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOptions = { publishedAt: -1 };
    if (sort === 'popular') {
      sortOptions = { views: -1, publishedAt: -1 };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name role avatar')
      .populate('tags', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single published post by slug
// @route   GET /api/posts/:slug
// @access  Public
exports.getPostBySlug = async (req, res) => {
  try {
    const now = new Date();
    const post = await Post.findOne({
      slug: req.params.slug,
      $or: [
        { status: 'published' },
        { status: 'scheduled', scheduledFor: { $lte: now } },
      ],
    })
      .populate('category', 'name slug description')
      .populate('author', 'name role bio avatar socialLinks')
      .populate('tags', 'name slug');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Increment view counter
    post.views = (post.views || 0) + 1;
    await post.save();

    // Fetch related articles from the same category
    const relatedPosts = await Post.find({
      category: post.category._id,
      _id: { $ne: post._id },
      $or: [
        { status: 'published' },
        { status: 'scheduled', scheduledFor: { $lte: now } },
      ],
    })
      .populate('category', 'name slug')
      .populate('author', 'name role avatar')
      .limit(3);

    // Fetch previous and next articles
    const prevPost = await Post.findOne({
      $or: [
        { status: 'published' },
        { status: 'scheduled', scheduledFor: { $lte: now } },
      ],
      publishedAt: { $lt: post.publishedAt || now },
    })
      .select('title slug')
      .sort({ publishedAt: -1 });

    const nextPost = await Post.findOne({
      $or: [
        { status: 'published' },
        { status: 'scheduled', scheduledFor: { $lte: now } },
      ],
      publishedAt: { $gt: post.publishedAt || now },
    })
      .select('title slug')
      .sort({ publishedAt: 1 });

    res.status(200).json({
      success: true,
      data: post,
      relatedPosts,
      prevPost,
      nextPost,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all posts for Admin Panel (all statuses)
// @route   GET /api/posts/admin/all
// @access  Private (Admin)
exports.getAllPostsAdmin = async (req, res) => {
  try {
    const { status, category, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('category', 'name slug')
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Summary counts for Admin Dashboard
    const totalPublished = await Post.countDocuments({ status: 'published' });
    const totalDrafts = await Post.countDocuments({ status: 'draft' });
    const totalScheduled = await Post.countDocuments({ status: 'scheduled' });

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      stats: {
        total,
        published: totalPublished,
        drafts: totalDrafts,
        scheduled: totalScheduled,
      },
      data: posts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single post by ID (for admin editing)
// @route   GET /api/posts/admin/:id
// @access  Private (Admin)
exports.getPostByIdAdmin = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('category')
      .populate('author')
      .populate('tags');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create article
// @route   POST /api/posts
// @access  Private (Admin)
exports.createPost = async (req, res) => {
  try {
    const {
      title,
      slug: customSlug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      author,
      status = 'draft',
      scheduledFor,
      isFeatured = false,
      isTrending = false,
      seo,
    } = req.body;

    if (!title || !excerpt || !content || !category || !author) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, excerpt, content, category, and author',
      });
    }

    // Generate or clean slug
    let slug = customSlug
      ? slugify(customSlug, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });

    // Handle duplicate slugs by appending unique suffix
    const existing = await Post.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const readTime = calculateReadingTime(content);
    const publishedAt = status === 'published' ? new Date() : undefined;

    const post = await Post.create({
      title,
      slug,
      excerpt,
      content,
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80',
      category,
      tags: tags || [],
      author,
      status,
      scheduledFor: status === 'scheduled' ? scheduledFor : undefined,
      publishedAt,
      readTime,
      isFeatured,
      isTrending,
      seo: seo || {
        metaTitle: title,
        metaDescription: excerpt,
        keywords: [],
      },
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update article
// @route   PUT /api/posts/:id
// @access  Private (Admin)
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const updates = { ...req.body };

    // If title or custom slug is modified, regenerate slug
    if (updates.slug) {
      updates.slug = slugify(updates.slug, { lower: true, strict: true });
    } else if (updates.title && updates.title !== post.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    // Recalculate reading time if content changed
    if (updates.content) {
      updates.readTime = calculateReadingTime(updates.content);
    }

    // Handle status transitions
    if (updates.status === 'published' && post.status !== 'published' && !post.publishedAt) {
      updates.publishedAt = new Date();
    }

    post = await Post.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('category', 'name slug')
      .populate('author', 'name avatar')
      .populate('tags', 'name slug');

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete article
// @route   DELETE /api/posts/:id
// @access  Private (Admin)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

