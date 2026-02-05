const express = require('express');
const router = express.Router();
const {
    getClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
    getInactiveClients,
    getRecommendations,
    getSimilarClients
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');
const { validateClient, validateId } = require('../middleware/validator');
const { searchLimiter, createUpdateLimiter } = require('../middleware/rateLimiter');

// All routes are protected
router.use(protect);

// GET /api/clients - Get all clients (with search/filter)
// GET /api/clients/inactive - Get inactive clients
router.route('/')
    .get(searchLimiter, getClients)
    .post(createUpdateLimiter, validateClient, createClient);

// Special routes (must be before /:id routes)
router.get('/inactive', getInactiveClients);

// GET /api/clients/:id - Get single client
// PUT /api/clients/:id - Update client
// DELETE /api/clients/:id - Delete client
router.route('/:id')
    .get(validateId, getClient)
    .put(createUpdateLimiter, validateId, validateClient, updateClient)
    .delete(validateId, deleteClient);

// GET /api/clients/:id/recommendations - Get workout recommendations for client
router.get('/:id/recommendations', validateId, getRecommendations);

// GET /api/clients/:id/similar - Find similar clients
router.get('/:id/similar', validateId, getSimilarClients);

module.exports = router;
