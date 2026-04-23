const Review = require('../models/Review');
const Gig = require('../models/Gig');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// @desc    Create a review
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { gigId, rating, comment } = req.body;

    // Check if already reviewed
    const existing = await Review.findOne({ user: req.user._id, gig: gigId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this gig' });
    }

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Don't allow self-review
    if (gig.seller.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: 'You cannot review your own gig' });
    }

    const review = await Review.create({
      user: req.user._id,
      gig: gigId,
      rating,
      comment,
    });

    // Update gig rating
    const reviews = await Review.find({ gig: gigId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    gig.rating = Math.round(avgRating * 10) / 10;
    gig.reviewCount = reviews.length;
    await gig.save();

    // Update seller rating
    const sellerGigs = await Gig.find({ seller: gig.seller });
    const totalReviews = sellerGigs.reduce((sum, g) => sum + g.reviewCount, 0);
    const totalRating = sellerGigs.reduce((sum, g) => sum + g.rating * g.reviewCount, 0);
    const sellerAvg = totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0;
    await User.findByIdAndUpdate(gig.seller, { rating: sellerAvg, reviewCount: totalReviews });

    // Notify seller
    const io = req.app.get('io');
    await createNotification(io, gig.seller, {
      type: 'new_review',
      title: 'New Review Received',
      message: `${req.user.name} rated your gig "${gig.title}" ${rating}⭐`,
      data: { gigId: gig._id, userId: req.user._id },
    });

    const populated = await Review.findById(review._id).populate('user', 'name avatar');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a gig
// @route   GET /api/reviews/gig/:gigId
const getReviewsByGig = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Review.countDocuments({ gig: req.params.gigId });
    const reviews = await Review.find({ gig: req.params.gigId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ reviews, page: Number(page), pages: Math.ceil(total / Number(limit)), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getReviewsByGig };
