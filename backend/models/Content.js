const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: 'Image must be a valid URL starting with http:// or https://',
      },
    },
    content: {
      type: String,
      required: [true, 'Content body is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['Draft', 'Published'],
        message: 'Status must be either Draft or Published',
      },
      default: 'Draft',
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title before saving
contentSchema.pre('save', function (next) {
  if (this.isModified('title') && this.title) {
    this.slug =
      this.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') +
      '-' +
      Date.now();
  }
  next();
});

module.exports = mongoose.model('Content', contentSchema);
