const User = require('../models/User');
const Gig = require('../models/Gig');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Message = require('../models/Message');

// @desc    Get admin dashboard overview stats
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalGigs, totalOrders, totalReviews] = await Promise.all([
      User.countDocuments(),
      Gig.countDocuments(),
      Order.countDocuments(),
      Review.countDocuments(),
    ]);

    const completedOrders = await Order.find({ status: 'completed' });
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.price, 0);
    const activeOrders = await Order.countDocuments({ status: { $in: ['active', 'delivered', 'revision'] } });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Users by role
    const buyers = await User.countDocuments({ role: 'buyer' });
    const sellers = await User.countDocuments({ role: 'seller' });
    const admins = await User.countDocuments({ role: 'admin' });

    // New users in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Orders by status
    const ordersByStatus = {
      pending: pendingOrders,
      active: activeOrders,
      completed: completedOrders.length,
      cancelled: await Order.countDocuments({ status: 'cancelled' }),
    };

    // Gigs by category
    const gigsByCategory = await Gig.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalUsers,
      totalGigs,
      totalOrders,
      totalReviews,
      totalRevenue,
      activeOrders,
      pendingOrders,
      usersByRole: { buyers, sellers, admins },
      newUsersLast30Days: newUsers,
      ordersByStatus,
      gigsByCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('gig', 'title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all gigs (admin)
// @route   GET /api/admin/gigs
const getAllGigs = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const query = {};
    if (category) query.category = category;

    const gigs = await Gig.find(query)
      .populate('seller', 'name email university')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Gig.countDocuments(query);

    res.json({ gigs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user (admin)
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin users' });

    await User.findByIdAndDelete(req.params.id);
    // Also remove their gigs
    await Gig.deleteMany({ seller: req.params.id });

    res.json({ message: 'User and their gigs deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a gig (admin)
// @route   DELETE /api/admin/gigs/:id
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    await Gig.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gig deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent activity (admin)
// @route   GET /api/admin/activity
const getRecentActivity = async (req, res) => {
  try {
    const [recentUsers, recentOrders, recentGigs] = await Promise.all([
      User.find().select('name email role createdAt').sort({ createdAt: -1 }).limit(10),
      Order.find().populate('buyer', 'name').populate('seller', 'name').populate('gig', 'title').sort({ createdAt: -1 }).limit(10),
      Gig.find().populate('seller', 'name').select('title category createdAt pricing').sort({ createdAt: -1 }).limit(10),
    ]);

    res.json({ recentUsers, recentOrders, recentGigs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminStats, getAllUsers, getAllOrders, getAllGigs, deleteUser, deleteGig, getRecentActivity };
