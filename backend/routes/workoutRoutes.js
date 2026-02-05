const express = require('express');
const router = express.Router();
const {
    getWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    recommendForClient,
    rateWorkout
} = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');
const { validateWorkout, validateId } = require('../middleware/validator');
const { searchLimiter, createUpdateLimiter } = require('../middleware/rateLimiter');

// All routes are protected
router.use(protect);

// GET /api/workouts - Get all workouts (with search/filter)
// POST /api/workouts - Create new workout
router.route('/')
    .get(searchLimiter, getWorkouts)
    .post(createUpdateLimiter, validateWorkout, createWorkout);

// GET /api/workouts/recommend/:clientId - Recommend workouts for client
router.get('/recommend/:clientId', validateId, recommendForClient);

// GET /api/workouts/:id - Get single workout
// PUT /api/workouts/:id - Update workout
// DELETE /api/workouts/:id - Delete workout
router.route('/:id')
    .get(validateId, getWorkout)
    .put(createUpdateLimiter, validateId, validateWorkout, updateWorkout)
    .delete(validateId, deleteWorkout);

// POST /api/workouts/:id/rate - Rate a workout
router.post('/:id/rate', validateId, rateWorkout);

module.exports = router;
