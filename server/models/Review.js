const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      maxlength: 500,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews
reviewSchema.index({ user: 1, gig: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
