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

// Public routes
router.get('/', getPosts);
router.get('/slug/:slug', getPostBySlug);
router.get('/:slug', getPostBySlug);

// Admin protected routes
router.get('/admin/all', protect, authorize('admin'), getAllPostsAdmin);
router.get('/admin/post/:id', protect, authorize('admin'), getPostByIdAdmin);
router.post('/', protect, authorize('admin'), createPost);
router.put('/:id', protect, authorize('admin'), updatePost);
router.delete('/:id', protect, authorize('admin'), deletePost);

module.exports = router;

