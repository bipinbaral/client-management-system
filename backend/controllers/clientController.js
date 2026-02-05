const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');
const { searchClients, advancedSearch } = require('../utils/algorithms/fuzzySearch');
const { recommendWorkoutsHybrid, findSimilarClients } = require('../utils/algorithms/recommendation');
const Workout = require('../models/Workout');

/**
 * @desc    Get all clients with filters and search
 * @route   GET /api/clients
 * @access  Private
 */
exports.getClients = async (req, res) => {
    try {
        const {
            query,           // Search query
            status,          // Active/Inactive/Suspended
            fitnessLevel,    // Beginner/Intermediate/Advanced
            goals,           // Array of goals
            sortBy,          // Sort field
            sortOrder,       // asc/desc
            page,            // Page number
            limit            // Results per page
        } = req.query;

        // Pagination
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 20;
        const skip = (pageNum - 1) * limitNum;

        // Get all clients from database
        let clients = await Client.find().populate('assignedTrainer', 'name email');

        // Calculate activity scores for all clients
        clients = clients.map(client => {
            const clientObj = client.toObject();
            clientObj.activityScore = client.calculateActivityScore();
            clientObj.isInactive = client.isInactive();
            return clientObj;
        });

        // Apply search and filters
        if (query) {
            // Fuzzy search
            const filters = {};
            if (status) filters.status = status;
            if (fitnessLevel) filters.fitnessLevel = fitnessLevel;
            if (goals) filters.goals = Array.isArray(goals) ? goals : [goals];

            clients = advancedSearch(clients, query, ['name', 'email', 'phone'], filters);
        } else {
            // Apply filters without search
            if (status) clients = clients.filter(c => c.status === status);
            if (fitnessLevel) clients = clients.filter(c => c.fitnessLevel === fitnessLevel);
            if (goals) {
                const goalsArray = Array.isArray(goals) ? goals : [goals];
                clients = clients.filter(c =>
                    goalsArray.some(goal => (c.goals || []).includes(goal))
                );
            }
        }

        // Sorting
        const sortField = sortBy || 'createdAt';
        const order = sortOrder === 'asc' ? 1 : -1;

        clients.sort((a, b) => {
            if (sortField === 'activityScore') {
                return (a.activityScore - b.activityScore) * order;
            }
            if (a[sortField] < b[sortField]) return -1 * order;
            if (a[sortField] > b[sortField]) return 1 * order;
            return 0;
        });

        // Apply pagination
        const totalClients = clients.length;
        const paginatedClients = clients.slice(skip, skip + limitNum);

        // Log activity
        await ActivityLog.log({
            action: 'OTHER',
            description: `Viewed clients list (${totalClients} results)`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'INFO'
        });

        res.status(200).json({
            success: true,
            count: paginatedClients.length,
            total: totalClients,
            page: pageNum,
            pages: Math.ceil(totalClients / limitNum),
            data: paginatedClients
        });
    } catch (error) {
        console.error('Get clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching clients',
            error: error.message
        });
    }
};

/**
 * @desc    Get single client by ID
 * @route   GET /api/clients/:id
 * @access  Private
 */
exports.getClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).populate('assignedTrainer', 'name email');

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Add activity score
        const clientData = client.toObject();
        clientData.activityScore = client.calculateActivityScore();
        clientData.isInactive = client.isInactive();

        res.status(200).json({
            success: true,
            data: clientData
        });
    } catch (error) {
        console.error('Get client error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching client',
            error: error.message
        });
    }
};

/**
 * @desc    Create new client
 * @route   POST /api/clients
 * @access  Private
 */
exports.createClient = async (req, res) => {
    try {
        // Check if client with email already exists
        const existingClient = await Client.findOne({ email: req.body.email });
        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: 'Client with this email already exists'
            });
        }

        // Create client
        const client = await Client.create({
            ...req.body,
            assignedTrainer: req.user._id // Assign to logged in user
        });

        // Log activity
        await ActivityLog.log({
            action: 'CREATE_CLIENT',
            description: `Created new client: ${client.name}`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'SUCCESS',
            entityType: 'Client',
            entityId: client._id
        });

        res.status(201).json({
            success: true,
            message: 'Client created successfully',
            data: client
        });
    } catch (error) {
        console.error('Create client error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating client',
            error: error.message
        });
    }
};

/**
 * @desc    Update client
 * @route   PUT /api/clients/:id
 * @access  Private
 */
exports.updateClient = async (req, res) => {
    try {
        let client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Update client
        client = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        // Log activity
        await ActivityLog.log({
            action: 'UPDATE_CLIENT',
            description: `Updated client: ${client.name}`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'INFO',
            entityType: 'Client',
            entityId: client._id
        });

        res.status(200).json({
            success: true,
            message: 'Client updated successfully',
            data: client
        });
    } catch (error) {
        console.error('Update client error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating client',
            error: error.message
        });
    }
};

/**
 * @desc    Delete client (soft delete - mark as inactive)
 * @route   DELETE /api/clients/:id
 * @access  Private
 */
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Soft delete - mark as inactive
        client.status = 'Inactive';
        await client.save();

        // Log activity
        await ActivityLog.log({
            action: 'DELETE_CLIENT',
            description: `Deleted client: ${client.name}`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'WARNING',
            entityType: 'Client',
            entityId: client._id
        });

        res.status(200).json({
            success: true,
            message: 'Client deleted successfully (marked as inactive)',
            data: client
        });
    } catch (error) {
        console.error('Delete client error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting client',
            error: error.message
        });
    }
};

/**
 * @desc    Get inactive clients (7+ days)
 * @route   GET /api/clients/inactive
 * @access  Private
 */
exports.getInactiveClients = async (req, res) => {
    try {
        const clients = await Client.find({ status: 'Active' });

        // Filter inactive clients (algorithm: last activity > 7 days)
        const inactiveClients = clients
            .filter(client => client.isInactive())
            .map(client => ({
                ...client.toObject(),
                daysInactive: client.daysInactive,
                activityScore: client.calculateActivityScore()
            }))
            .sort((a, b) => b.daysInactive - a.daysInactive); // Most inactive first

        res.status(200).json({
            success: true,
            count: inactiveClients.length,
            data: inactiveClients
        });
    } catch (error) {
        console.error('Get inactive clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching inactive clients',
            error: error.message
        });
    }
};

/**
 * @desc    Get workout recommendations for a client
 * @route   GET /api/clients/:id/recommendations
 * @access  Private
 */
exports.getRecommendations = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Get all clients and workouts for recommendation algorithm
        const allClients = await Client.find({ status: 'Active' });
        const allWorkouts = await Workout.find({ isActive: true });

        // Use hybrid recommendation algorithm (K-NN + Content-based)
        const recommendations = await recommendWorkoutsHybrid(
            client,
            allClients,
            allWorkouts,
            10 // Limit to top 10
        );

        res.status(200).json({
            success: true,
            count: recommendations.length,
            data: recommendations,
            client: {
                name: client.name,
                fitnessLevel: client.fitnessLevel,
                goals: client.goals
            }
        });
    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating recommendations',
            error: error.message
        });
    }
};

/**
 * @desc    Find similar clients
 * @route   GET /api/clients/:id/similar
 * @access  Private
 */
exports.getSimilarClients = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        const allClients = await Client.find({ status: 'Active' }).populate('assignedTrainer', 'name');

        // Use K-NN algorithm to find similar clients
        const similarClients = findSimilarClients(client, allClients, 5);

        res.status(200).json({
            success: true,
            count: similarClients.length,
            data: similarClients.map(item => ({
                ...item.client.toObject(),
                similarityScore: item.similarityScore,
                matchPercentage: item.similarityScore
            })),
            targetClient: {
                name: client.name,
                age: client.age,
                fitnessLevel: client.fitnessLevel,
                goals: client.goals
            }
        });
    } catch (error) {
        console.error('Get similar clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Error finding similar clients',
            error: error.message
        });
    }
};
