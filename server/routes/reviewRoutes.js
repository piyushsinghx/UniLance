const express = require('express');
const { createReview, getReviewsByGig } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createReview);
router.get('/gig/:gigId', getReviewsByGig);

module.exports = router;
