const express = require('express');
const { getRecommendedGigs, generateDescription, suggestPricing, trackSearch } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/recommendations', protect, getRecommendedGigs);
router.post('/generate-description', generateDescription);
router.post('/suggest-pricing', suggestPricing);
router.post('/track-search', protect, trackSearch);

module.exports = router;
