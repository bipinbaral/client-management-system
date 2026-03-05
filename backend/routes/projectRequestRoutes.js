const express = require('express');
const router = express.Router();
const {
  createRequest,
  getClientRequests,
  getFreelancerRequests,
  updateRequest,
  deleteRequest,
} = require('../controllers/projectRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { createUpdateLimiter } = require('../middleware/rateLimiter');

// All routes require authentication
router.use(protect);

// Client routes
router.post('/', authorize('client'), createUpdateLimiter, createRequest);
router.get('/client', authorize('client'), getClientRequests);

// Freelancer routes
router.get('/freelancer', authorize('freelancer'), getFreelancerRequests);

// Shared (client or freelancer) routes
router.put('/:id', createUpdateLimiter, updateRequest);
router.delete('/:id', authorize('client'), deleteRequest);

module.exports = router;

