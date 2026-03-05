const Client = require('../models/Client');
const Payment = require('../models/Payment');
const Workout = require('../models/Workout');
const Note = require('../models/Note');
const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');
const { analyzeClientActivity, analyzeRevenueTrend } = require('../utils/algorithms/analytics');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/analytics/dashboard
 * @access  Private
 */
exports.getDashboardStats = async (req, res) => {
    console.log('--- GET DASHBOARD STATS CALLED ---');
    try {
        // Total system users
        const totalUsers = await User.countDocuments();
        const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        // Total clients
        const totalClients = await Client.countDocuments();
        const activeClients = await Client.countDocuments({ status: 'Active' });
        const inactiveClients = await Client.countDocuments({ status: 'Inactive' });

        // Client growth (last 30 days vs previous 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

        const recentClients = await Client.countDocuments({
            joiningDate: { $gte: thirtyDaysAgo }
        });
        const previousClients = await Client.countDocuments({
            joiningDate: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }
        });

        const clientGrowthRate = previousClients > 0
            ? Math.round(((recentClients - previousClients) / previousClients) * 100)
            : 100;

        // Revenue statistics
        const paidPayments = await Payment.find({ status: 'Paid' });
        const totalRevenue = paidPayments.reduce((sum, p) => sum + p.finalAmount, 0);

        const recentRevenue = paidPayments
            .filter(p => p.paidDate >= thirtyDaysAgo)
            .reduce((sum, p) => sum + p.finalAmount, 0);

        const previousRevenue = paidPayments
            .filter(p => p.paidDate >= sixtyDaysAgo && p.paidDate < thirtyDaysAgo)
            .reduce((sum, p) => sum + p.finalAmount, 0);

        const revenueGrowthRate = previousRevenue > 0
            ? Math.round(((recentRevenue - previousRevenue) / previousRevenue) * 100)
            : 100;

        // Overdue payments
        const overduePayments = await Payment.countDocuments({ status: 'Overdue' });
        const pendingPayments = await Payment.countDocuments({ status: 'Pending' });

        // Total workouts
        const totalWorkouts = await Workout.countDocuments();

        // Recent activity from logs
        const recentActivity = await ActivityLog.getRecent(15);

        // Log activity
        await ActivityLog.log({
            action: 'OTHER',
            description: 'Viewed admin dashboard statistics',
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'INFO'
        });

        res.status(200).json({
            success: true,
            data: {
                clients: {
                    total: totalUsers, // Using system-wide count as "Total Users"
                    clientCount: totalClients,
                    freelancerCount: totalFreelancers,
                    adminCount: totalAdmins,
                    active: activeClients,
                    inactive: inactiveClients,
                    newThisMonth: recentClients,
                    growthRate: clientGrowthRate
                },
                workouts: {
                    total: totalWorkouts,
                    growthRate: 5 // Placeholder for now
                },
                revenue: {
                    total: Math.round(totalRevenue * 100) / 100,
                    thisMonth: Math.round(recentRevenue * 100) / 100,
                    growthRate: revenueGrowthRate
                },
                payments: {
                    overdue: overduePayments,
                    pending: pendingPayments
                },
                recentActivity
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};

/**
 * @desc    Get client activity distribution (using activity scoring algorithm)
 * @route   GET /api/analytics/clients/activity
 * @access  Private
 */
exports.getClientActivityDistribution = async (req, res) => {
    try {
        const clients = await Client.find({ status: 'Active' });

        // Use analytics algorithm to analyze activity distribution
        const analysis = analyzeClientActivity(clients);

        res.status(200).json({
            success: true,
            data: analysis
        });
    } catch (error) {
        console.error('Get client activity distribution error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing client activity',
            error: error.message
        });
    }
};

/**
 * @desc    Get revenue trends with forecasting
 * @route   GET /api/analytics/revenue/trends
 * @access  Private
 */
exports.getRevenueTrends = async (req, res) => {
    try {
        const { days } = req.query;
        const daysBack = parseInt(days, 10) || 90;

        const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

        const payments = await Payment.find({
            status: 'Paid',
            paidDate: { $gte: startDate }
        }).sort({ paidDate: 1 });

        // Use analytics algorithm for trend analysis
        const trendAnalysis = analyzeRevenueTrend(payments, 7);

        res.status(200).json({
            success: true,
            data: trendAnalysis
        });
    } catch (error) {
        console.error('Get revenue trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing revenue trends',
            error: error.message
        });
    }
};

/**
 * @desc    Get workout statistics
 * @route   GET /api/analytics/workouts
 * @access  Private
 */
exports.getWorkoutStats = async (req, res) => {
    try {
        const totalWorkouts = await Workout.countDocuments({ isActive: true });

        // Distribution by difficulty
        const byDifficulty = await Workout.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$difficulty', count: { $sum: 1 } } }
        ]);

        // Distribution by category
        const byCategory = await Workout.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Top rated workouts
        const topRated = await Workout.find({ isActive: true })
            .sort({ rating: -1, totalRatings: -1 })
            .limit(10)
            .select('title difficulty category rating totalRatings');

        // Most popular workouts
        const mostPopular = await Workout.find({ isActive: true })
            .sort({ popularity: -1 })
            .limit(10)
            .select('title difficulty category popularity');

        res.status(200).json({
            success: true,
            data: {
                total: totalWorkouts,
                byDifficulty,
                byCategory,
                topRated: topRated.map(w => ({
                    ...w.toObject(),
                    averageRating: w.averageRating
                })),
                mostPopular
            }
        });
    } catch (error) {
        console.error('Get workout stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching workout statistics',
            error: error.message
        });
    }
};

/**
 * @desc    Get activity logs with filters
 * @route   GET /api/analytics/logs
 * @access  Private
 */
exports.getActivityLogs = async (req, res) => {
    try {
        const { action, level, startDate, endDate, limit } = req.query;

        const filters = {};
        if (action) filters.action = action;
        if (level) filters.level = level;
        if (startDate || endDate) {
            filters.createdAt = {};
            if (startDate) filters.createdAt.$gte = new Date(startDate);
            if (endDate) filters.createdAt.$lte = new Date(endDate);
        }

        const limitNum = parseInt(limit, 10) || 50;

        const logs = await ActivityLog.getRecent(limitNum, filters);

        res.status(200).json({
            success: true,
            count: logs.length,
            data: logs
        });
    } catch (error) {
        console.error('Get activity logs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching activity logs',
            error: error.message
        });
    }
};

/**
 * @desc    Get system statistics (log analysis)
 * @route   GET /api/analytics/system
 * @access  Private
 */
exports.getSystemStats = async (req, res) => {
    try {
        const { days } = req.query;
        const daysBack = parseInt(days, 10) || 7;

        const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
        const endDate = new Date();

        const statistics = await ActivityLog.getStatistics(startDate, endDate);

        const errorLogs = await ActivityLog.getErrors(100);

        res.status(200).json({
            success: true,
            data: {
                period: {
                    start: startDate.toISOString().split('T')[0],
                    end: endDate.toISOString().split('T')[0],
                    days: daysBack
                },
                statistics,
                recentErrors: errorLogs.slice(0, 10)
            }
        });
    } catch (error) {
        console.error('Get system stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching system statistics',
            error: error.message
        });
    }
};
