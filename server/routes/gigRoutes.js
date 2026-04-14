const express = require('express');
const { getGigs, getGigById, createGig, updateGig, deleteGig, getGigsBySeller } = require('../controllers/gigController');
const { protect, sellerOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getGigs);
router.get('/:id', getGigById);
router.post('/', protect, sellerOnly, createGig);
router.put('/:id', protect, sellerOnly, updateGig);
router.delete('/:id', protect, sellerOnly, deleteGig);
router.get('/seller/:sellerId', getGigsBySeller);

module.exports = router;
