const ProjectRequest = require('../models/ProjectRequest');
const ActivityLog = require('../models/ActivityLog');

/**
 * @desc    Create a new project request (client -> freelancer)
 * @route   POST /api/requests
 * @access  Private (client)
 */
exports.createRequest = async (req, res) => {
  try {
    const { title, description, budget, deadline, freelancerId } = req.body;

    if (!title || !description || budget === undefined || !freelancerId) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, budget and freelancerId are required',
      });
    }

    const request = await ProjectRequest.create({
      title,
      description,
      budget,
      deadline,
      client: req.user._id,
      freelancer: freelancerId,
    });

    await ActivityLog.log({
      action: 'CREATE_PROJECT_REQUEST',
      description: `Created project request: ${request.title}`,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      level: 'SUCCESS',
      entityType: 'ProjectRequest',
      entityId: request._id,
    });

    res.status(201).json({
      success: true,
      message: 'Project request created successfully',
      data: request,
    });
  } catch (error) {
    console.error('Create project request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating project request',
      error: error.message,
    });
  }
};

/**
 * @desc    Get project requests created by logged-in client
 * @route   GET /api/requests/client
 * @access  Private (client)
 */
exports.getClientRequests = async (req, res) => {
  try {
    const requests = await ProjectRequest.find({ client: req.user._id })
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Get client project requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project requests',
      error: error.message,
    });
  }
};

/**
 * @desc    Get project requests assigned to logged-in freelancer
 * @route   GET /api/requests/freelancer
 * @access  Private (freelancer)
 */
exports.getFreelancerRequests = async (req, res) => {
  try {
    const requests = await ProjectRequest.find({ freelancer: req.user._id })
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error('Get freelancer project requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project requests',
      error: error.message,
    });
  }
};

/**
 * @desc    Update a project request (status or details)
 * @route   PUT /api/requests/:id
 * @access  Private (client or freelancer)
 */
exports.updateRequest = async (req, res) => {
  try {
    const request = await ProjectRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Project request not found',
      });
    }

    const isClient = request.client.toString() === req.user._id.toString();
    const isFreelancer = request.freelancer.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project request',
      });
    }

    const allowedFieldsForClient = ['title', 'description', 'budget', 'deadline', 'status'];
    const allowedFieldsForFreelancer = ['status'];

    const fieldsToUpdate = isClient ? allowedFieldsForClient : allowedFieldsForFreelancer;

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        request[field] = req.body[field];
      }
    });

    await request.save();

    await ActivityLog.log({
      action: 'UPDATE_PROJECT_REQUEST',
      description: `Updated project request: ${request.title}`,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      level: 'INFO',
      entityType: 'ProjectRequest',
      entityId: request._id,
    });

    res.status(200).json({
      success: true,
      message: 'Project request updated successfully',
      data: request,
    });
  } catch (error) {
    console.error('Update project request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating project request',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a project request (client only)
 * @route   DELETE /api/requests/:id
 * @access  Private (client)
 */
exports.deleteRequest = async (req, res) => {
  try {
    const request = await ProjectRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Project request not found',
      });
    }

    if (request.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the client who created this request can delete it',
      });
    }

    await request.deleteOne();

    await ActivityLog.log({
      action: 'DELETE_PROJECT_REQUEST',
      description: `Deleted project request: ${request.title}`,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      level: 'WARNING',
      entityType: 'ProjectRequest',
      entityId: request._id,
    });

    res.status(200).json({
      success: true,
      message: 'Project request deleted successfully',
    });
  } catch (error) {
    console.error('Delete project request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project request',
      error: error.message,
    });
  }
};

