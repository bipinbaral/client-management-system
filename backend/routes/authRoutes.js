const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateLogin, validateRegister } = require('../middleware/validator');

// POST /api/auth/login - Login user (with strict rate limiting)
router.post('/login', authLimiter, validateLogin, login);

// POST /api/auth/register - Register new user
router.post('/register', authLimiter, validateRegister, register);

module.exports = router;
