const ServiceOrder = require('../models/ServiceOrder');
const Service = require('../models/Service');
const ActivityLog = require('../models/ActivityLog');

/**
 * @desc    Create a new service order (client books a service)
 * @route   POST /api/service-orders
 * @access  Private (client)
 */
exports.createOrder = async (req, res) => {
  try {
    const { serviceId, notes } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: 'serviceId is required',
      });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or inactive',
      });
    }

    if (!service.owner) {
      return res.status(400).json({
        success: false,
        message: 'Service owner not found',
      });
    }

    const order = await ServiceOrder.create({
      service: service._id,
      client: req.user._id,
      freelancer: service.owner,
      price: service.price,
      notes: notes || '',
    });

    await ActivityLog.log({
      action: 'CREATE_SERVICE_ORDER',
      description: `Booked service: ${service.title}`,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      level: 'SUCCESS',
      entityType: 'ServiceOrder',
      entityId: order._id,
    });

    res.status(201).json({
      success: true,
      message: 'Service booked successfully',
      data: order,
    });
  } catch (error) {
    console.error('Create service order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating service order',
      error: error.message,
    });
  }
};

/**
 * @desc    Get service orders for logged-in client
 * @route   GET /api/service-orders/client
 * @access  Private (client)
 */
exports.getClientOrders = async (req, res) => {
  try {
    const orders = await ServiceOrder.find({ client: req.user._id })
      .populate('service', 'title category price')
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get client service orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service orders',
      error: error.message,
    });
  }
};

/**
 * @desc    Get service orders for logged-in freelancer
 * @route   GET /api/service-orders/freelancer
 * @access  Private (freelancer)
 */
exports.getFreelancerOrders = async (req, res) => {
  try {
    const orders = await ServiceOrder.find({ freelancer: req.user._id })
      .populate('service', 'title category price')
      .populate('client', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Get freelancer service orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service orders',
      error: error.message,
    });
  }
};

/**
 * @desc    Update order status (freelancer accepts / completes)
 * @route   PATCH /api/service-orders/:id/status
 * @access  Private (freelancer)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'completed', 'cancelled', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const order = await ServiceOrder.findById(req.params.id).populate('service', 'title');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order',
      });
    }

    order.status = status;
    await order.save();

    await ActivityLog.log({
      action: 'UPDATE_SERVICE_ORDER',
      description: `Order ${status} for service: ${order.service?.title || order.service}`,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      level: 'INFO',
      entityType: 'ServiceOrder',
      entityId: order._id,
    });

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    console.error('Update service order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message,
    });
  }
};

/**
 * @desc    Get earnings summary for logged-in freelancer from service orders
 * @route   GET /api/service-orders/earnings
 * @access  Private (freelancer)
 */
exports.getEarningsSummary = async (req, res) => {
  try {
    const orders = await ServiceOrder.find({ freelancer: req.user._id });

    const totalRevenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + (o.price || 0), 0);

    const pendingAmount = orders
      .filter((o) => o.status === 'pending' || o.status === 'accepted')
      .reduce((sum, o) => sum + (o.price || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        pendingAmount,
      },
    });
  } catch (error) {
    console.error('Get service earnings summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching earnings',
      error: error.message,
    });
  }
};

