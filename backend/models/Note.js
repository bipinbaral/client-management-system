const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide note title'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Please provide note content'],
        trim: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Please provide client reference'],
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide creator reference']
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium',
        index: true
    },
    category: {
        type: String,
        enum: ['General', 'Progress', 'Medical', 'Diet', 'Workout', 'Payment', 'Other'],
        default: 'General'
    },
    isImportant: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    // Attachment support (future)
    attachments: [{
        fileName: String,
        fileUrl: String,
        fileType: String,
        fileSize: Number
    }],
    // For follow-up reminders
    reminderDate: {
        type: Date
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedDate: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual: Days since created
noteSchema.virtual('daysSinceCreated').get(function () {
    const diff = Date.now() - this.createdAt.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Virtual: Has reminder
noteSchema.virtual('hasReminder').get(function () {
    return this.reminderDate && this.reminderDate > new Date();
});

// Method: Mark as completed
noteSchema.methods.markCompleted = async function () {
    this.isCompleted = true;
    this.completedDate = new Date();
    await this.save();
};

// Method: Add tag
noteSchema.methods.addTag = async function (tag) {
    if (!this.tags.includes(tag.toLowerCase())) {
        this.tags.push(tag.toLowerCase());
        await this.save();
    }
};

// Static: Get all unique tags
noteSchema.statics.getAllTags = async function () {
    const tags = await this.distinct('tags');
    return tags.sort();
};

// Static: Get notes by priority
noteSchema.statics.getByPriority = async function (priority) {
    return await this.find({ priority })
        .populate('client', 'name email')
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 });
};

// Indexes
noteSchema.index({ client: 1, createdAt: -1 });
noteSchema.index({ tags: 1 });
noteSchema.index({ priority: 1, isPinned: -1 });
noteSchema.index({ title: 'text', content: 'text' });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
