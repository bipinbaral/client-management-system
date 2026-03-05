const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation Middleware using express-validator
 * Validates and sanitizes request data
 */

// Helper: Check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

// Email validation regex (RFC 5322 compliant)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone validation regex - Nepal specific (10 digits, starts with 97 or 98)
const phoneRegex = /^(97|98)\d{8}$/;

/**
 * Password strength validation
 * Must be at least 8 characters with uppercase, lowercase, and number
 */
const passwordStrengthValidator = (value) => {
    if (value.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(value)) {
        throw new Error('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(value)) {
        throw new Error('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(value)) {
        throw new Error('Password must contain at least one number');
    }
    return true;
};

// Client Validation Rules
const validateClient = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(phoneRegex).withMessage('Please provide a valid Nepal phone number (10 digits starting with 97 or 98)'),

    body('age')
        .optional()
        .isInt({ min: 10, max: 100 }).withMessage('Age must be between 10 and 100'),

    body('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),

    body('fitnessLevel')
        .optional()
        .isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid fitness level'),

    body('goals')
        .optional()
        .isArray().withMessage('Goals must be an array')
        .custom((value) => {
            const validGoals = ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Fitness', 'Athletic Performance'];
            return value.every(goal => validGoals.includes(goal));
        }).withMessage('Invalid goal provided'),

    body('height')
        .optional()
        .isFloat({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),

    body('weight')
        .optional()
        .isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300 kg'),

    validate
];

// Workout Validation Rules
const validateWorkout = [
    body('title')
        .trim()
        .notEmpty().withMessage('Workout title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),

    body('difficulty')
        .notEmpty().withMessage('Difficulty level is required')
        .isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid difficulty level'),

    body('duration')
        .notEmpty().withMessage('Duration is required')
        .isInt({ min: 5, max: 300 }).withMessage('Duration must be between 5 and 300 minutes'),

    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(['Cardio', 'Strength', 'Flexibility', 'HIIT', 'Yoga', 'CrossFit', 'Sports']).withMessage('Invalid category'),

    body('exercises')
        .isArray({ min: 1 }).withMessage('At least one exercise is required'),

    body('exercises.*.name')
        .trim()
        .notEmpty().withMessage('Exercise name is required'),

    body('exercises.*.reps')
        .notEmpty().withMessage('Reps/duration is required'),

    validate
];

// Payment Validation Rules
const validatePayment = [
    body('client')
        .notEmpty().withMessage('Client ID is required')
        .isMongoId().withMessage('Invalid client ID'),

    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isFloat({ min: 0 }).withMessage('Amount must be a positive number'),

    body('paymentMethod')
        .optional()
        .isIn(['Cash', 'Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Other']).withMessage('Invalid payment method'),

    body('subscriptionType')
        .optional()
        .isIn(['Monthly', 'Quarterly', '6-Month', 'Yearly', 'One-time']).withMessage('Invalid subscription type'),

    body('dueDate')
        .notEmpty().withMessage('Due date is required')
        .isISO8601().withMessage('Invalid date format'),

    body('discount')
        .optional()
        .isFloat({ min: 0, max: 100 }).withMessage('Discount must be between 0 and 100'),

    validate
];

// Note Validation Rules
const validateNote = [
    body('title')
        .trim()
        .notEmpty().withMessage('Note title is required')
        .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),

    body('content')
        .trim()
        .notEmpty().withMessage('Note content is required')
        .isLength({ min: 5, max: 5000 }).withMessage('Content must be between 5 and 5000 characters'),

    body('client')
        .notEmpty().withMessage('Client ID is required')
        .isMongoId().withMessage('Invalid client ID'),

    body('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High', 'Urgent']).withMessage('Invalid priority level'),

    body('category')
        .optional()
        .isIn(['General', 'Progress', 'Medical', 'Diet', 'Workout', 'Payment', 'Other']).withMessage('Invalid category'),

    validate
];

// User Registration Validation
const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .custom(passwordStrengthValidator),

    validate
];

// Login Validation
const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required'),

    validate
];

// ID Parameter Validation
const validateId = [
    param('id')
        .isMongoId().withMessage('Invalid ID format'),
    validate
];

// Search Query Validation
const validateSearch = [
    query('query')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Search query must be between 1 and 100 characters'),
    validate
];

module.exports = {
    validateClient,
    validateWorkout,
    validatePayment,
    validateNote,
    validateRegister,
    validateLogin,
    validateId,
    validateSearch,
    validate
};
