const Notification = require('../models/Notification');

// @desc    Get notifications for current user
// @route   GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    const query = { user: req.user._id };
    if (unread === 'true') query.read = false;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Notification.countDocuments(query);
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      notifications,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({ user: req.user._id, read: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper: Create a notification and emit via socket
const createNotification = async (io, userId, data) => {
  try {
    const notification = await Notification.create({
      user: userId,
      ...data,
    });

    // Emit real-time notification if io is available
    if (io) {
      io.to(`user_${userId}`).emit('newNotification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead, createNotification };
