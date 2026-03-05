const express = require('express');
const router = express.Router();
const {
  createOrder,
  getClientOrders,
  getFreelancerOrders,
  updateOrderStatus,
  getEarningsSummary,
} = require('../controllers/serviceOrderController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { createUpdateLimiter } = require('../middleware/rateLimiter');

// All routes require authentication
router.use(protect);

// Client routes
router.post('/', authorize('client'), createUpdateLimiter, createOrder);
router.get('/client', authorize('client'), getClientOrders);

// Freelancer routes
router.get('/freelancer', authorize('freelancer'), getFreelancerOrders);
router.get('/earnings', authorize('freelancer'), getEarningsSummary);
router.patch('/:id/status', authorize('freelancer'), createUpdateLimiter, updateOrderStatus);

module.exports = router;

