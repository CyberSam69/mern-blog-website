const Author = require('../models/Author');
const Post = require('../models/Post');

// @desc    Get all authors
// @route   GET /api/authors
// @access  Public
exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: authors.length, data: authors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single author
// @route   GET /api/authors/:id
// @access  Public
exports.getAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }
    res.status(200).json({ success: true, data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create author
// @route   POST /api/authors
// @access  Private (Admin)
exports.createAuthor = async (req, res) => {
  try {
    const { name, email, role, bio, avatar, socialLinks } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Author name is required' });
    }
    const author = await Author.create({
      name,
      email,
      role: role || 'Technical Contributor',
      bio: bio || '',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      socialLinks: socialLinks || {},
    });
    res.status(201).json({ success: true, data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update author
// @route   PUT /api/authors/:id
// @access  Private (Admin)
exports.updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }
    res.status(200).json({ success: true, data: author });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete author
// @route   DELETE /api/authors/:id
// @access  Private (Admin)
exports.deleteAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }

    const postsCount = await Post.countDocuments({ author: req.params.id });
    if (postsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete author: ${postsCount} articles are authored by this person. Reassign them first.`,
      });
    }

    await author.deleteOne();
    res.status(200).json({ success: true, message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

