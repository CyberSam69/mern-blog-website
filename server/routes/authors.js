const express = require('express');
const router = express.Router();
const {
  getAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} = require('../controllers/authorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAuthors);
router.get('/:id', getAuthor);
router.post('/', protect, authorize('admin'), createAuthor);
router.put('/:id', protect, authorize('admin'), updateAuthor);
router.delete('/:id', protect, authorize('admin'), deleteAuthor);

module.exports = router;
