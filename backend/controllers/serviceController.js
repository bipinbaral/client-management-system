const Service = require('../models/Service');
const ActivityLog = require('../models/ActivityLog');

/**
 * @desc    Public list of active services (for hiring side)
 * @route   GET /api/services
 * @access  Public (optional auth)
 */
exports.getPublicServices = async (req, res) => {
  try {
    const { category, query } = req.query;

    const filter = { isActive: true };
    if (category && category !== 'all') {
      filter.category = category;
    }

    let servicesQuery = Service.find(filter).populate('owner', 'name role');

    if (query) {
      servicesQuery = servicesQuery.find({
        $text: { $search: query },
      });
    }

    const services = await servicesQuery.sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Get public services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message,
    });
  }
};

/**
 * @desc    Get services for logged-in freelancer
 * @route   GET /api/services/mine
 * @access  Private (freelancer)
 */
exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Get my services error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your services',
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new service
 * @route   POST /api/services
 * @access  Private (freelancer)
 */
exports.createService = async (req, res) => {
  try {
    const { title, description, category, price, tags } = req.body;

    if (!title || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category and price are required',
      });
    }

    const service = await Service.create({
      title,
      description,
      category,
      price,
      tags: Array.isArray(tags) ? tags : [],
      owner: req.user._id,
    });

    await ActivityLog.log({
      action: 'CREATE_SERVICE',
      description: `Created service: ${service.title}`,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      level: 'SUCCESS',
      entityType: 'Service',
      entityId: service._id,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message,
    });
  }
};

/**
 * @desc    Update a service (only owner can update)
 * @route   PUT /api/services/:id
 * @access  Private (freelancer)
 */
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    if (service.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this service',
      });
    }

    const fieldsToUpdate = ['title', 'description', 'category', 'price', 'isActive', 'tags'];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        service[field] = req.body[field];
      }
    });

    await service.save();

    await ActivityLog.log({
      action: 'UPDATE_SERVICE',
      description: `Updated service: ${service.title}`,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      level: 'INFO',
      entityType: 'Service',
      entityId: service._id,
    });

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a service (hard delete)
 * @route   DELETE /api/services/:id
 * @access  Private (freelancer)
 */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    if (service.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this service',
      });
    }

    await service.deleteOne();

    await ActivityLog.log({
      action: 'DELETE_SERVICE',
      description: `Deleted service: ${service.title}`,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      level: 'WARNING',
      entityType: 'Service',
      entityId: service._id,
    });

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message,
    });
  }
};

