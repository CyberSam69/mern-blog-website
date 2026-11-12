const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostBySlug,
  getAllPostsAdmin,
  getPostByIdAdmin,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');

// Admin protected routes (MUST be declared before parameterized /:slug route)
router.get('/admin/all', protect, authorize('admin'), getAllPostsAdmin);
router.get('/admin/post/:id', protect, authorize('admin'), getPostByIdAdmin);
router.post('/', protect, authorize('admin'), createPost);
router.put('/:id', protect, authorize('admin'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

// Public routes
router.get('/', getPosts);
router.get('/slug/:slug', getPostBySlug);
router.get('/:slug', getPostBySlug);

module.exports = router;

