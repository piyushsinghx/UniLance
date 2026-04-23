const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Gig = require('../models/Gig');
const { createNotification } = require('./notificationController');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'demo_secret_key',
});

// @desc    Create Razorpay payment order
// @route   POST /api/payments/create-order
const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate('gig', 'title');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.price * 100,
      currency: 'INR',
      receipt: `order_${order._id}`,
      notes: {
        orderId: order._id.toString(),
        gigTitle: order.gig?.title || '',
      },
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_key',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'demo_secret_key')
      .update(body)
      .digest('hex');

    const order = await Order.findById(orderId)
      .populate('gig', 'title')
      .populate('buyer', 'name')
      .populate('seller', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.paymentStatus = 'paid';
    order.status = 'active';
    await order.save();

    await Gig.findByIdAndUpdate(order.gig._id, { $inc: { orderCount: 1 } });

    const io = req.app.get('io');
    await createNotification(io, order.seller._id, {
      type: 'new_order',
      title: 'New Order Received',
      message: `${order.buyer.name} placed an order for "${order.gig.title}" - INR ${order.price}.`,
      data: { orderId: order._id, gigId: order.gig._id },
    });

    await createNotification(io, order.buyer._id, {
      type: 'payment',
      title: 'Payment Successful',
      message: `Your payment of INR ${order.price} for "${order.gig.title}" was successful.`,
      data: { orderId: order._id },
    });

    if (io) {
      io.to(`user_${order.buyer._id}`).emit('orderStatusUpdate', order);
      io.to(`user_${order.seller._id}`).emit('orderStatusUpdate', order);
    }

    res.json({ success: true, message: 'Payment verified successfully', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment };
