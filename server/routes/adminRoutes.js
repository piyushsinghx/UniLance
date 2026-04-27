const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getAdminStats,
  getAllUsers,
  getAllOrders,
  getAllGigs,
  deleteUser,
  deleteGig,
  getRecentActivity,
} = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);
router.get('/gigs', getAllGigs);
router.get('/activity', getRecentActivity);
router.delete('/users/:id', deleteUser);
router.delete('/gigs/:id', deleteGig);

module.exports = router;
