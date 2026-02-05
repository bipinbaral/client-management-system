const rateLimit = require('express-rate-limit');

/**
 * Rate Limiting Middleware using Token Bucket Algorithm
 * Prevents API abuse and brute-force attacks
 */

// General API rate limiter - 100 requests per 15 minutes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Max 100 requests per window
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Store rate limit data in memory (use Redis for production)
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many requests. Please slow down and try again later.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

// Strict rate limiter for authentication endpoints - 5 requests per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Strict limit to prevent brute force
    skipSuccessfulRequests: false, // Count all requests
    message: {
        success: false,
        message: 'Too many login attempts, please try again after 15 minutes.',
        retryAfter: '15 minutes'
    },
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many authentication attempts. Account temporarily locked for security.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

// Moderate limiter for search endpoints - 50 requests per 15 minutes
const searchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: 'Too many search requests, please try again later.',
        retryAfter: '15 minutes'
    },
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Search rate limit exceeded. Please wait before searching again.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

// Create/Update operation limiter - 30 requests per 15 minutes
const createUpdateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: {
        success: false,
        message: 'Too many create/update operations, please try again later.',
        retryAfter: '15 minutes'
    }
});

// Export data limiter - very strict, 3 requests per hour
const exportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: {
        success: false,
        message: 'Export limit reached. Please wait 1 hour before exporting again.',
        retryAfter: '1 hour'
    },
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Export quota exceeded. You can export data 3 times per hour.',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

module.exports = {
    generalLimiter,
    authLimiter,
    searchLimiter,
    createUpdateLimiter,
    exportLimiter
};
