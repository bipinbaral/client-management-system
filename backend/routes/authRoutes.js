const express = require('express');
const router = express.Router();
const { login, register, getMe, getUsers } = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateLogin, validateRegister } = require('../middleware/validator');
const { protect, admin } = require('../middleware/authMiddleware');

// POST /api/auth/login - Login user (with strict rate limiting)
router.post('/login', authLimiter, validateLogin, login);

// POST /api/auth/register - Register new user
router.post('/register', authLimiter, validateRegister, register);

// GET /api/auth/me - Get current user profile
router.get('/me', protect, getMe);

// GET /api/auth/users - Get all users (Admin only)
router.get('/users', protect, admin, getUsers);

module.exports = router;
