const mongoose = require('mongoose');

const projectRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide project title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide project description'],
      trim: true,
    },
    budget: {
      type: Number,
      required: [true, 'Please provide estimated budget'],
      min: [0, 'Budget must be a positive number'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    deadline: {
      type: Date,
    },
    // Relations
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
  },
  {
    timestamps: true,
  }
);

projectRequestSchema.index({ title: 'text', description: 'text' });

const ProjectRequest = mongoose.model('ProjectRequest', projectRequestSchema);

module.exports = ProjectRequest;

