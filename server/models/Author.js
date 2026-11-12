const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an author name'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      default: 'Technical Contributor',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      maxlength: [600, 'Bio cannot exceed 600 characters'],
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    socialLinks: {
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Author', authorSchema);

