const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide client name'],
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Please provide phone number'],
        trim: true
    },
    age: {
        type: Number,
        min: 10,
        max: 100
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Other'
    },
    // Fitness Information
    goals: {
        type: [String],
        enum: ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Fitness', 'Athletic Performance'],
        default: ['General Fitness']
    },
    fitnessLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
        index: true
    },
    height: {
        type: Number, // in cm
        min: 100,
        max: 250
    },
    weight: {
        type: Number, // in kg
        min: 30,
        max: 300
    },
    // Tracking Information
    joiningDate: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active',
        index: true
    },
    // Activity Metrics (for algorithm calculations)
    workoutsCompleted: {
        type: Number,
        default: 0
    },
    notesCount: {
        type: Number,
        default: 0
    },
    paymentScore: {
        type: Number,
        default: 100, // 100 = all payments on time
        min: 0,
        max: 100
    },
    // Assigned Trainer
    assignedTrainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Profile Image
    profileImage: {
        type: String,
        default: ''
    },
    // Additional Notes
    medicalConditions: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual: Days since joining
clientSchema.virtual('daysSinceJoining').get(function () {
    const diff = Date.now() - this.joiningDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Virtual: Days inactive
clientSchema.virtual('daysInactive').get(function () {
    const diff = Date.now() - this.lastActivity.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
});

// Virtual: BMI Calculation
clientSchema.virtual('bmi').get(function () {
    if (this.height && this.weight) {
        const heightInMeters = this.height / 100;
        return (this.weight / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
});

// Method: Calculate Activity Score (Weighted Algorithm)
clientSchema.methods.calculateActivityScore = function () {
    const weights = {
        lastActivity: 0.35,      // Recent activity is most important
        workoutsCompleted: 0.30, // Workout completion
        paymentScore: 0.25,      // Payment reliability
        notesCount: 0.10         // Engagement through notes
    };

    // Last Activity Score (0-100): Higher score for more recent activity
    const daysInactive = this.daysInactive;
    const activityScore = Math.max(0, 100 - (daysInactive * 5)); // -5 points per day inactive

    // Workouts Score (0-100): Based on workouts this month
    const workoutScore = Math.min(100, this.workoutsCompleted * 5); // 5 points per workout

    // Payment Score (already 0-100)
    const paymentScoreValue = this.paymentScore;

    // Notes Score (0-100): Engagement indicator
    const notesScore = Math.min(100, this.notesCount * 10); // 10 points per note

    // Calculate weighted total
    const totalScore =
        (activityScore * weights.lastActivity) +
        (workoutScore * weights.workoutsCompleted) +
        (paymentScoreValue * weights.paymentScore) +
        (notesScore * weights.notesCount);

    return Math.round(totalScore);
};

// Method: Check if client is inactive (7+ days)
clientSchema.methods.isInactive = function () {
    return this.daysInactive >= 7;
};

// Method: Update last activity
clientSchema.methods.updateActivity = async function () {
    this.lastActivity = Date.now();
    await this.save();
};

// Index for search performance
clientSchema.index({ name: 'text', email: 'text' });

// Index for analytics queries
clientSchema.index({ status: 1, fitnessLevel: 1, joiningDate: -1 });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
