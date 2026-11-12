const Tag = require('../models/Tag');
const slugify = require('slugify');

// @desc    Get all tags
// @route   GET /api/tags
// @access  Public
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: tags.length, data: tags });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a tag
// @route   POST /api/tags
// @access  Private (Admin)
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Tag name is required' });
    }
    const slug = slugify(name, { lower: true, strict: true });
    let tag = await Tag.findOne({ slug });
    if (tag) {
      return res.status(200).json({ success: true, data: tag });
    }
    tag = await Tag.create({ name, slug });
    res.status(201).json({ success: true, data: tag });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a tag
// @route   DELETE /api/tags/:id
// @access  Private (Admin)
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);
    if (!tag) {
      return res.status(404).json({ success: false, message: 'Tag not found' });
    }
    res.status(200).json({ success: true, message: 'Tag deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
