const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getClientActivityDistribution,
    getRevenueTrends,
    getWorkoutStats,
    getActivityLogs,
    getSystemStats
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// GET /api/analytics/dashboard - Dashboard statistics
router.get('/dashboard', getDashboardStats);

// GET /api/analytics/clients/activity - Client activity distribution
router.get('/clients/activity', getClientActivityDistribution);

// GET /api/analytics/revenue/trends - Revenue trends with forecasting
router.get('/revenue/trends', getRevenueTrends);

// GET /api/analytics/workouts - Workout statistics
router.get('/workouts', getWorkoutStats);

// GET /api/analytics/logs - Activity logs
router.get('/logs', getActivityLogs);

// GET /api/analytics/system - System statistics
router.get('/system', getSystemStats);

module.exports = router;
