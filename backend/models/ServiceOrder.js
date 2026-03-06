const mongoose = require('mongoose');

const serviceOrderSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
      index: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
      index: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    paymentReflected: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

serviceOrderSchema.index({ freelancer: 1, status: 1, createdAt: -1 });
serviceOrderSchema.index({ client: 1, createdAt: -1 });

const ServiceOrder = mongoose.model('ServiceOrder', serviceOrderSchema);

module.exports = ServiceOrder;

