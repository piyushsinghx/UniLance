const express = require('express');
const { getDashboardStats, getEarningsData, getGigPerformance } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, getDashboardStats);
router.get('/earnings', protect, getEarningsData);
router.get('/gig-performance', protect, getGigPerformance);

module.exports = router;
