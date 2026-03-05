const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide workout title'],
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: [true, 'Please provide workout description'],
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: [true, 'Please specify difficulty level'],
        index: true
    },
    duration: {
        type: Number, // in minutes
        required: [true, 'Please specify duration'],
        min: 5,
        max: 300
    },
    category: {
        type: String,
        enum: ['Cardio', 'Strength', 'Flexibility', 'HIIT', 'Yoga', 'CrossFit', 'Sports'],
        required: [true, 'Please specify category'],
        index: true
    },
    targetMuscles: {
        type: [String],
        enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body', 'Cardio'],
        default: ['Full Body']
    },
    exercises: [{
        name: {
            type: String,
            required: true
        },
        sets: {
            type: Number,
            min: 1,
            max: 10
        },
        reps: {
            type: String, // Can be "12-15" or "30 seconds"
            required: true
        },
        restTime: {
            type: Number, // in seconds
            default: 60
        },
        notes: {
            type: String,
            default: ''
        }
    }],
    // Tracking Metrics
    popularity: {
        type: Number,
        default: 0, // Number of times assigned/completed
        min: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    // Creator
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Status
    isActive: {
        type: Boolean,
        default: true
    },
    // Tags for better search
    tags: [{
        type: String,
        trim: true
    }],
    // Image/Video URL
    imageUrl: {
        type: String,
        default: ''
    },
    videoUrl: {
        type: String,
        default: ''
    },
    // Equipment needed
    equipment: [{
        type: String,
        enum: ['Dumbbells', 'Barbell', 'Kettlebell', 'Resistance Bands', 'Pull-up Bar',
            'Bench', 'Mat', 'None', 'Treadmill', 'Bike', 'Rower']
    }],
    // Calories burned estimate (per session)
    caloriesBurned: {
        type: Number,
        min: 0,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual: Average Rating
workoutSchema.virtual('averageRating').get(function () {
    if (this.totalRatings === 0) return 0;
    return (this.rating / this.totalRatings).toFixed(1);
});

// Virtual: Total Exercises
workoutSchema.virtual('totalExercises').get(function () {
    return this.exercises.length;
});

// Virtual: Popularity Score (for recommendations)
workoutSchema.virtual('popularityScore').get(function () {
    // Weighted score: popularity + rating
    const popScore = Math.min(this.popularity / 10, 50); // Max 50 points from popularity
    const ratingScore = parseFloat(this.averageRating) * 10; // Max 50 points from rating
    return Math.round(popScore + ratingScore);
});

// Method: Increment popularity when workout is assigned/completed
workoutSchema.methods.incrementPopularity = async function () {
    this.popularity += 1;
    await this.save();
};

// Method: Add rating
workoutSchema.methods.addRating = async function (ratingValue) {
    if (ratingValue < 1 || ratingValue > 5) {
        throw new Error('Rating must be between 1 and 5');
    }
    this.rating += ratingValue;
    this.totalRatings += 1;
    await this.save();
};

// Method: Check if suitable for fitness level
workoutSchema.methods.isSuitableFor = function (fitnessLevel) {
    const levels = ['Beginner', 'Intermediate', 'Advanced'];
    const workoutLevelIndex = levels.indexOf(this.difficulty);
    const clientLevelIndex = levels.indexOf(fitnessLevel);

    // Allow same level or one level below
    return clientLevelIndex >= workoutLevelIndex - 1;
};

// Text index for search
workoutSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Compound index for filtering
workoutSchema.index({ category: 1, difficulty: 1, isActive: 1 });

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
