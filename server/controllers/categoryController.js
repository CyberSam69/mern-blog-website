const Category = require('../models/Category');
const Post = require('../models/Post');
const slugify = require('slugify');

// @desc    Get all categories with post counts
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Compute live post counts
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Post.countDocuments({
          category: cat._id,
          status: 'published',
        });
        return {
          id: cat._id,
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          count,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message,
    });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A category with this name already exists' });
    }

    const category = await Category.create({ name, slug, description: description || '' });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    let updateData = { description };

    if (name) {
      updateData.name = name;
      updateData.slug = slugify(name, { lower: true, strict: true });
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Verify if any posts use this category
    const postsUsingCategory = await Post.countDocuments({ category: req.params.id });
    if (postsUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${postsUsingCategory} articles are still assigned to it. Reassign them first.`,
      });
    }

    await category.deleteOne();
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

