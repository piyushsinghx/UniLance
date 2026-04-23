const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['new_order', 'order_update', 'order_delivered', 'order_completed', 'new_message', 'new_review', 'payment', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    data: {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
      gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      link: String,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient queries
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
