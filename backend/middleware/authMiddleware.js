const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

/**
 * Protect routes - Verify JWT token
 */
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized - User not found'
                });
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error.message);

            // Log failed authentication attempt
            await ActivityLog.log({
                action: 'LOGIN',
                description: 'Failed authentication attempt',
                level: 'WARNING',
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'],
                errorDetails: {
                    message: error.message
                }
            });

            return res.status(401).json({
                success: false,
                message: 'Not authorized - Invalid or expired token'
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: 'Not authorized - No token provided'
        });
    }
};

/**
 * Role-based access control
 * @param  {...String} roles - Allowed roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized - Please login first'
            });
        }

        if (!roles.includes(req.user.role || 'user')) {
            return res.status(403).json({
                success: false,
                message: `Not authorized - ${req.user.role || 'User'} role cannot access this resource`
            });
        }

        next();
    };
};

/**
 * Optional auth - Sets user if token exists, doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            // Token invalid, but we continue anyway
            req.user = null;
        }
    }

    next();
};

/**
 * Admin only middleware
 */
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Not authorized - Admin access only'
        });
    }
};

module.exports = { protect, authorize, optionalAuth, admin };
