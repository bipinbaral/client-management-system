const express = require('express');
const router = express.Router();
const {
    getPayments,
    getPayment,
    createPayment,
    updatePayment,
    getOverduePayments,
    getPaymentsDueSoon,
    getPaymentAnalytics
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { validatePayment, validateId } = require('../middleware/validator');
const { createUpdateLimiter } = require('../middleware/rateLimiter');

// All routes are protected
router.use(protect);

// GET /api/payments - Get all payments (with filters)
// POST /api/payments - Create new payment
router.route('/')
    .get(getPayments)
    .post(createUpdateLimiter, validatePayment, createPayment);

// Special routes (before /:id)
router.get('/overdue', getOverduePayments);
router.get('/due-soon', getPaymentsDueSoon);
router.get('/analytics', getPaymentAnalytics);

// GET /api/payments/:id - Get single payment
// PUT /api/payments/:id - Update payment
router.route('/:id')
    .get(validateId, getPayment)
    .put(createUpdateLimiter, validateId, validatePayment, updatePayment);

module.exports = router;
