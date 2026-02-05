const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: [true, 'Please provide action type'],
        enum: [
            'LOGIN',
            'LOGOUT',
            'CREATE_CLIENT',
            'UPDATE_CLIENT',
            'DELETE_CLIENT',
            'CREATE_WORKOUT',
            'UPDATE_WORKOUT',
            'DELETE_WORKOUT',
            'CREATE_PAYMENT',
            'UPDATE_PAYMENT',
            'CREATE_NOTE',
            'UPDATE_NOTE',
            'DELETE_NOTE',
            'ASSIGN_WORKOUT',
            'COMPLETE_WORKOUT',
            'PASSWORD_CHANGE',
            'PROFILE_UPDATE',
            'EXPORT_DATA',
            'OTHER'
        ],
        index: true
    },
    description: {
        type: String,
        required: [true, 'Please provide description'],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    userName: {
        type: String,
        trim: true
    },
    userEmail: {
        type: String,
        trim: true
    },
    ipAddress: {
        type: String,
        trim: true
    },
    userAgent: {
        type: String,
        trim: true
    },
    level: {
        type: String,
        enum: ['INFO', 'WARNING', 'ERROR', 'SUCCESS'],
        default: 'INFO',
        index: true
    },
    // Related entity information
    entityType: {
        type: String,
        enum: ['Client', 'Workout', 'Payment', 'Note', 'User', 'System'],
        index: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId
    },
    // Additional metadata (flexible)
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    // Error details (if level is ERROR)
    errorDetails: {
        message: String,
        stack: String,
        code: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual: Time ago
activityLogSchema.virtual('timeAgo').get(function () {
    const seconds = Math.floor((Date.now() - this.createdAt.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };

    for (const [name, count] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / count);
        if (interval >= 1) {
            return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
        }
    }

    return 'Just now';
});

// Static: Create log entry easily
activityLogSchema.statics.log = async function (data) {
    try {
        const log = new this(data);
        await log.save();
        return log;
    } catch (error) {
        console.error('Error creating activity log:', error.message);
        return null;
    }
};

// Static: Get recent activities
activityLogSchema.statics.getRecent = async function (limit = 50, filters = {}) {
    return await this.find(filters)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit);
};

// Static: Get activities by date range
activityLogSchema.statics.getByDateRange = async function (startDate, endDate) {
    return await this.find({
        createdAt: { $gte: startDate, $lte: endDate }
    })
        .populate('user', 'name email')
        .sort({ createdAt: -1 });
};

// Static: Get error logs
activityLogSchema.statics.getErrors = async function (limit = 100) {
    return await this.find({ level: 'ERROR' })
        .sort({ createdAt: -1 })
        .limit(limit);
};

// Static: Activity statistics
activityLogSchema.statics.getStatistics = async function (startDate, endDate) {
    const stats = await this.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$action',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    const levelStats = await this.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: '$level',
                count: { $sum: 1 }
            }
        }
    ]);

    return {
        actionStats: stats,
        levelStats: levelStats
    };
};

// Indexes for performance
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, level: 1, createdAt: -1 });

// TTL Index: Auto-delete logs older than 90 days
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
