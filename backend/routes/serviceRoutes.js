const express = require('express');
const router = express.Router();
const {
  getPublicServices,
  getMyServices,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize, optionalAuth } = require('../middleware/authMiddleware');
const { generalLimiter, createUpdateLimiter } = require('../middleware/rateLimiter');

// Public listing for hiring side (optional auth)
router.get('/', generalLimiter, optionalAuth, getPublicServices);

// All routes below this line require authenticated freelancer
router.use(protect, authorize('freelancer'));

// GET /api/services/mine - services of logged-in freelancer
router.get('/mine', getMyServices);

// POST /api/services - create new service
router.post('/', createUpdateLimiter, createService);

// PUT /api/services/:id - update service
// DELETE /api/services/:id - delete service
router
  .route('/:id')
  .put(createUpdateLimiter, updateService)
  .delete(deleteService);

module.exports = router;

