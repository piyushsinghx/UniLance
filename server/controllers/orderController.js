const Order = require('../models/Order');
const Gig = require('../models/Gig');
const { createNotification } = require('./notificationController');

const populateOrderById = (id) =>
  Order.findById(id)
    .populate('gig', 'title images pricing category')
    .populate('buyer', 'name avatar email')
    .populate('seller', 'name avatar email');

const emitOrderUpdate = (req, order) => {
  const io = req.app.get('io');
  if (!io) {
    return;
  }

  io.to(`user_${order.buyer._id || order.buyer}`).emit('orderStatusUpdate', order);
  io.to(`user_${order.seller._id || order.seller}`).emit('orderStatusUpdate', order);
};

// @desc    Create an order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { gigId, tier, requirements } = req.body;
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot order your own gig' });
    }

    const selectedTier = gig.pricing[tier] ? tier : 'basic';
    const price = gig.pricing[selectedTier]?.price || gig.pricing.basic.price;
    const deliveryDays = gig.pricing[selectedTier]?.deliveryDays || 7;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);

    const order = await Order.create({
      buyer: req.user._id,
      seller: gig.seller,
      gig: gigId,
      tier: selectedTier,
      price,
      deliveryDate,
      requirements: requirements || '',
    });

    const populated = await populateOrderById(order._id);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    const { status, role, limit } = req.query;
    const query = {};

    if (role === 'seller') {
      query.seller = req.user._id;
    } else {
      query.buyer = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    let ordersQuery = Order.find(query)
      .populate('gig', 'title images pricing')
      .populate('buyer', 'name avatar')
      .populate('seller', 'name avatar')
      .sort({ createdAt: -1 });

    if (limit) {
      ordersQuery = ordersQuery.limit(Number(limit));
    }

    const orders = await ordersQuery;
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await populateOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isSeller = order.seller._id.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await populateOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isBuyer = order.buyer._id.toString() === req.user._id.toString();
    const isSeller = order.seller._id.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status !== 'cancelled') {
      return res.status(400).json({ message: 'Only cancellation is allowed on this endpoint' });
    }

    if (!['pending', 'active'].includes(order.status)) {
      return res.status(400).json({ message: 'This order can no longer be cancelled' });
    }

    order.status = 'cancelled';
    await order.save();

    const notifyUserId = isBuyer ? order.seller._id : order.buyer._id;
    const io = req.app.get('io');
    await createNotification(io, notifyUserId, {
      type: 'order_update',
      title: 'Order Cancelled',
      message: `The order for "${order.gig.title}" was cancelled.`,
      data: { orderId: order._id },
    });

    emitOrderUpdate(req, order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seller delivers order
// @route   PUT /api/orders/:id/deliver
const deliverOrder = async (req, res) => {
  try {
    const deliveryFiles = req.body.deliveryFiles || req.body.files || [];
    const deliveryMessage = req.body.deliveryMessage || req.body.message || '';
    const order = await populateOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the seller can deliver this order' });
    }

    if (!['active', 'revision'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be delivered in its current state' });
    }

    order.status = 'delivered';
    order.deliveryFiles = deliveryFiles;
    order.deliveryMessage = deliveryMessage;
    order.deliveredAt = new Date();

    const lastRevision = order.revisionRequests[order.revisionRequests.length - 1];
    if (lastRevision && !lastRevision.resolvedAt) {
      lastRevision.resolvedAt = new Date();
    }

    await order.save();

    const io = req.app.get('io');
    await createNotification(io, order.buyer._id, {
      type: 'order_delivered',
      title: 'Order Delivered',
      message: `${order.seller.name} delivered your order for "${order.gig.title}".`,
      data: { orderId: order._id },
    });

    emitOrderUpdate(req, order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Buyer requests revision
// @route   PUT /api/orders/:id/revision
const requestRevision = async (req, res) => {
  try {
    const message = req.body.message?.trim();
    const order = await populateOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.buyer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the buyer can request a revision' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Revisions can only be requested after delivery' });
    }

    order.status = 'revision';
    order.revisionRequests.push({
      message: message || 'Please revise the delivery.',
      requestedAt: new Date(),
    });
    await order.save();

    const io = req.app.get('io');
    await createNotification(io, order.seller._id, {
      type: 'order_update',
      title: 'Revision Requested',
      message: `${order.buyer.name} requested a revision for "${order.gig.title}".`,
      data: { orderId: order._id },
    });

    emitOrderUpdate(req, order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Buyer accepts delivery
// @route   PUT /api/orders/:id/accept
const acceptDelivery = async (req, res) => {
  try {
    const order = await populateOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.buyer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the buyer can accept delivery' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Only delivered orders can be completed' });
    }

    order.status = 'completed';
    order.completedAt = new Date();
    await order.save();

    const io = req.app.get('io');
    await createNotification(io, order.seller._id, {
      type: 'order_completed',
      title: 'Order Completed',
      message: `${order.buyer.name} accepted the delivery for "${order.gig.title}" - INR ${order.price} earned.`,
      data: { orderId: order._id },
    });

    emitOrderUpdate(req, order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deliverOrder,
  requestRevision,
  acceptDelivery,
};
