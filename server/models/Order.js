const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gig',
      required: true,
    },
    tier: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      default: 'basic',
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'delivered', 'revision', 'completed', 'cancelled'],
      default: 'pending',
    },
    deliveryDate: {
      type: Date,
    },
    requirements: {
      type: String,
      default: '',
    },
    // Delivery
    deliveryFiles: {
      type: [String],
      default: [],
    },
    deliveryMessage: {
      type: String,
      default: '',
    },
    deliveredAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    // Revision requests
    revisionRequests: [
      {
        message: { type: String, required: true },
        requestedAt: { type: Date, default: Date.now },
        resolvedAt: { type: Date },
      },
    ],
    // Payment (Razorpay)
    razorpayOrderId: {
      type: String,
      default: '',
    },
    razorpayPaymentId: {
      type: String,
      default: '',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
