const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide service title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide service description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide service category'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide base price'],
      min: [0, 'Price must be a positive number'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Simple rating meta so hiring side can show social proof later
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ title: 'text', description: 'text', category: 'text' });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;

