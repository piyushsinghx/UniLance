const express = require('express');
const { createOrder, getOrders, getOrderById, updateOrderStatus, deliverOrder, requestRevision, acceptDelivery } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);
router.put('/:id/deliver', protect, deliverOrder);
router.put('/:id/revision', protect, requestRevision);
router.put('/:id/accept', protect, acceptDelivery);

module.exports = router;
