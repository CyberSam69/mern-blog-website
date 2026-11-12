const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, authorize } = require('../middleware/auth');

// Configure disk storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `flyertech-${uniqueSuffix}${ext}`);
  },
});

// File validation: allow only image formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (jpeg, jpg, png, webp, gif, svg) are permitted'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter,
});

// @desc    Upload featured image
// @route   POST /api/upload
// @access  Private (Admin)
router.post('/', protect, authorize('admin'), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach an image file' });
    }

    const host = req.get('host');
    const protocol = req.protocol;
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

