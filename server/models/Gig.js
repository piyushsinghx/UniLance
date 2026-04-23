const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['web-development', 'design', 'writing', 'video-editing', 'mobile-development', 'data-science', 'marketing', 'other'],
    },
    images: {
      type: [String],
      default: [],
    },
    pricing: {
      basic: {
        title: { type: String, default: 'Basic' },
        description: { type: String, default: '' },
        price: { type: Number, required: true },
        deliveryDays: { type: Number, default: 7 },
        features: { type: [String], default: [] },
      },
      standard: {
        title: { type: String, default: 'Standard' },
        description: { type: String, default: '' },
        price: { type: Number, default: 0 },
        deliveryDays: { type: Number, default: 5 },
        features: { type: [String], default: [] },
      },
      premium: {
        title: { type: String, default: 'Premium' },
        description: { type: String, default: '' },
        price: { type: Number, default: 0 },
        deliveryDays: { type: Number, default: 3 },
        features: { type: [String], default: [] },
      },
    },
    tags: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Text index for search
gigSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Gig', gigSchema);
