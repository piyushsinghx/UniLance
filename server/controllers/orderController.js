const Order = require('../models/Order');
const Gig = require('../models/Gig');

// @desc    Create an order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { gigId, tier, requirements } = req.body;
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    const price = gig.pricing[tier]?.price || gig.pricing.basic.price;
    const deliveryDays = gig.pricing[tier]?.deliveryDays || 7;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    const order = await Order.create({
      buyer: req.user._id,
      seller: gig.seller,
      gig: gigId,
      tier: tier || 'basic',
      price,
      deliveryDate,
      requirements: requirements || '',
    });

    // Increment order count on gig
    await Gig.findByIdAndUpdate(gigId, { $inc: { orderCount: 1 } });

    const populated = await Order.findById(order._id)
      .populate('gig', 'title images')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    const { status, role } = req.query;
    const query = {};

    if (role === 'seller') {
      query.seller = req.user._id;
    } else {
      query.buyer = req.user._id;
    }

    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('gig', 'title images pricing')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only buyer or seller of this order can update
    const isBuyer = order.buyer.toString() === req.user._id.toString();
    const isSeller = order.seller.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    const populated = await Order.findById(order._id)
      .populate('gig', 'title images')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
