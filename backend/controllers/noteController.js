const Note = require('../models/Note');
const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');

/**
 * @desc    Get all notes with filters
 * @route   GET /api/notes
 * @access  Private
 */
exports.getNotes = async (req, res) => {
    try {
        const { clientId, priority, category, tags, page, limit } = req.query;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 20;
        const skip = (pageNum - 1) * limitNum;

        // Build query
        let queryObj = {};
        if (clientId) queryObj.client = clientId;
        if (priority) queryObj.priority = priority;
        if (category) queryObj.category = category;
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            queryObj.tags = { $in: tagArray };
        }

        const notes = await Note.find(queryObj)
            .populate('client', 'name email')
            .populate('createdBy', 'name email')
            .sort({ isPinned: -1, createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Note.countDocuments(queryObj);

        res.status(200).json({
            success: true,
            count: notes.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: notes
        });
    } catch (error) {
        console.error('Get notes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notes',
            error: error.message
        });
    }
};

/**
 * @desc    Get single note
 * @route   GET /api/notes/:id
 * @access  Private
 */
exports.getNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id)
            .populate('client', 'name email phone')
            .populate('createdBy', 'name email');

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        console.error('Get note error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching note',
            error: error.message
        });
    }
};

/**
 * @desc    Create new note
 * @route   POST /api/notes
 * @access  Private
 */
exports.createNote = async (req, res) => {
    try {
        const note = await Note.create({
            ...req.body,
            createdBy: req.user._id
        });

        // Update client notes count
        const client = await Client.findById(note.client);
        if (client) {
            client.notesCount += 1;
            await client.save();
        }

        await ActivityLog.log({
            action: 'CREATE_NOTE',
            description: `Created note: ${note.title}`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'INFO',
            entityType: 'Note',
            entityId: note._id
        });

        const populatedNote = await Note.findById(note._id)
            .populate('client', 'name email')
            .populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            data: populatedNote
        });
    } catch (error) {
        console.error('Create note error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating note',
            error: error.message
        });
    }
};

/**
 * @desc    Update note
 * @route   PUT /api/notes/:id
 * @access  Private
 */
exports.updateNote = async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        note = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('client', 'name email').populate('createdBy', 'name email');

        await ActivityLog.log({
            action: 'UPDATE_NOTE',
            description: `Updated note: ${note.title}`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'INFO',
            entityType: 'Note',
            entityId: note._id
        });

        res.status(200).json({
            success: true,
            message: 'Note updated successfully',
            data: note
        });
    } catch (error) {
        console.error('Update note error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating note',
            error: error.message
        });
    }
};

/**
 * @desc    Delete note
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        // Update client notes count
        const client = await Client.findById(note.client);
        if (client && client.notesCount > 0) {
            client.notesCount -= 1;
            await client.save();
        }

        await note.deleteOne();

        await ActivityLog.log({
            action: 'DELETE_NOTE',
            description: `Deleted note: ${note.title}`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'WARNING',
            entityType: 'Note',
            entityId: note._id
        });

        res.status(200).json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        console.error('Delete note error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting note',
            error: error.message
        });
    }
};

/**
 * @desc    Get all unique tags
 * @route   GET /api/notes/tags
 * @access  Private
 */
exports.getAllTags = async (req, res) => {
    try {
        const tags = await Note.getAllTags();

        res.status(200).json({
            success: true,
            count: tags.length,
            data: tags
        });
    } catch (error) {
        console.error('Get tags error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tags',
            error: error.message
        });
    }
};

/**
 * @desc    Mark note as completed
 * @route   PATCH /api/notes/:id/complete
 * @access  Private
 */
exports.markCompleted = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        await note.markCompleted();

        res.status(200).json({
            success: true,
            message: 'Note marked as completed',
            data: note
        });
    } catch (error) {
        console.error('Mark completed error:', error);
        res.status(500).json({
            success: false,
            message: 'Error marking note as completed',
            error: error.message
        });
    }
};
