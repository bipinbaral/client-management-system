const Workout = require('../models/Workout');
const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');
const { searchWorkouts } = require('../utils/algorithms/fuzzySearch');
const { recommendWorkoutsContentBased } = require('../utils/algorithms/recommendation');

/**
 * @desc    Get all workouts with filters and search
 * @route   GET /api/workouts
 * @access  Private
 */
exports.getWorkouts = async (req, res) => {
    try {
        const { query, difficulty, category, sortBy, page, limit } = req.query;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 20;
        const skip = (pageNum - 1) * limitNum;

        // Build query
        let queryObj = { isActive: true };
        if (difficulty) queryObj.difficulty = difficulty;
        if (category) queryObj.category = category;

        // Get workouts
        let workouts = await Workout.find(queryObj).populate('createdBy', 'name email');

        // Apply fuzzy search if query exists
        if (query) {
            workouts = searchWorkouts(workouts, query);
        }

        // Sorting
        const sortField = sortBy || 'createdAt';
        workouts.sort((a, b) => {
            if (sortField === 'popularity') return (b.popularity || 0) - (a.popularity || 0);
            if (sortField === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
            return new Date(b[sortField]) - new Date(a[sortField]);
        });

        const totalWorkouts = workouts.length;
        const paginatedWorkouts = workouts.slice(skip, skip + limitNum);

        res.status(200).json({
            success: true,
            count: paginatedWorkouts.length,
            total: totalWorkouts,
            page: pageNum,
            pages: Math.ceil(totalWorkouts / limitNum),
            data: paginatedWorkouts
        });
    } catch (error) {
        console.error('Get workouts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching workouts',
            error: error.message
        });
    }
};

/**
 * @desc    Get single workout
 * @route   GET /api/workouts/:id
 * @access  Private
 */
exports.getWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id).populate('createdBy', 'name email');

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }

        res.status(200).json({
            success: true,
            data: workout
        });
    } catch (error) {
        console.error('Get workout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching workout',
            error: error.message
        });
    }
};

/**
 * @desc    Create new workout
 * @route   POST /api/workouts
 * @access  Private
 */
exports.createWorkout = async (req, res) => {
    try {
        const workout = await Workout.create({
            ...req.body,
            createdBy: req.user._id
        });

        await ActivityLog.log({
            action: 'CREATE_WORKOUT',
            description: `Created new workout: ${workout.title}`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'SUCCESS',
            entityType: 'Workout',
            entityId: workout._id
        });

        res.status(201).json({
            success: true,
            message: 'Workout created successfully',
            data: workout
        });
    } catch (error) {
        console.error('Create workout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating workout',
            error: error.message
        });
    }
};

/**
 * @desc    Update workout
 * @route   PUT /api/workouts/:id
 * @access  Private
 */
exports.updateWorkout = async (req, res) => {
    try {
        let workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }

        workout = await Workout.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        await ActivityLog.log({
            action: 'UPDATE_WORKOUT',
            description: `Updated workout: ${workout.title}`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'INFO',
            entityType: 'Workout',
            entityId: workout._id
        });

        res.status(200).json({
            success: true,
            message: 'Workout updated successfully',
            data: workout
        });
    } catch (error) {
        console.error('Update workout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating workout',
            error: error.message
        });
    }
};

/**
 * @desc    Delete workout
 * @route   DELETE /api/workouts/:id
 * @access  Private
 */
exports.deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }

        // Soft delete
        workout.isActive = false;
        await workout.save();

        await ActivityLog.log({
            action: 'DELETE_WORKOUT',
            description: `Deleted workout: ${workout.title}`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'WARNING',
            entityType: 'Workout',
            entityId: workout._id
        });

        res.status(200).json({
            success: true,
            message: 'Workout deleted successfully',
            data: workout
        });
    } catch (error) {
        console.error('Delete workout error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting workout',
            error: error.message
        });
    }
};

/**
 * @desc    Get recommended workouts for a client
 * @route   GET /api/workouts/recommend/:clientId
 * @access  Private
 */
exports.recommendForClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.clientId);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        const allWorkouts = await Workout.find({ isActive: true });

        // Use content-based filtering algorithm
        const recommendations = recommendWorkoutsContentBased(client, allWorkouts, 10);

        res.status(200).json({
            success: true,
            count: recommendations.length,
            data: recommendations,
            clientInfo: {
                name: client.name,
                fitnessLevel: client.fitnessLevel,
                goals: client.goals
            }
        });
    } catch (error) {
        console.error('Recommend workouts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating recommendations',
            error: error.message
        });
    }
};

/**
 * @desc    Rate a workout
 * @route   POST /api/workouts/:id/rate
 * @access  Private
 */
exports.rateWorkout = async (req, res) => {
    try {
        const { rating } = req.body;
        const workout = await Workout.findById(req.params.id);

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found'
            });
        }

        await workout.addRating(rating);

        res.status(200).json({
            success: true,
            message: 'Rating added successfully',
            data: {
                averageRating: workout.averageRating,
                totalRatings: workout.totalRatings
            }
        });
    } catch (error) {
        console.error('Rate workout error:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
