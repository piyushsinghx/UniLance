const express = require('express');
const { getGigs, getGigById, createGig, updateGig, deleteGig, getGigsBySeller, getFeaturedGigs } = require('../controllers/gigController');
const { protect, sellerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getGigs);
router.get('/featured', getFeaturedGigs);
router.get('/seller/:sellerId', getGigsBySeller);
router.get('/:id', getGigById);
router.post('/', protect, sellerOnly, createGig);
router.put('/:id', protect, sellerOnly, updateGig);
router.delete('/:id', protect, sellerOnly, deleteGig);

module.exports = router;
