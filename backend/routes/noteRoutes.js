const express = require('express');
const router = express.Router();
const {
    getNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote,
    getAllTags,
    markCompleted
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { validateNote, validateId } = require('../middleware/validator');
const { createUpdateLimiter } = require('../middleware/rateLimiter');

// All routes are protected
router.use(protect);

// GET /api/notes - Get all notes (with filters)
// POST /api/notes - Create new note
router.route('/')
    .get(getNotes)
    .post(createUpdateLimiter, validateNote, createNote);

// GET /api/notes/tags - Get all unique tags
router.get('/tags', getAllTags);

// GET /api/notes/:id - Get single note
// PUT /api/notes/:id - Update note
// DELETE /api/notes/:id - Delete note
router.route('/:id')
    .get(validateId, getNote)
    .put(createUpdateLimiter, validateId, validateNote, updateNote)
    .delete(validateId, deleteNote);

// PATCH /api/notes/:id/complete - Mark note as completed
router.patch('/:id/complete', validateId, markCompleted);

module.exports = router;
