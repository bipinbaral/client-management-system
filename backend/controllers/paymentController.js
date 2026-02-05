const Payment = require('../models/Payment');
const Client = require('../models/Client');
const ActivityLog = require('../models/ActivityLog');
const { analyzeRevenueTrend } = require('../utils/algorithms/analytics');

/**
 * @desc    Get all payments with filters
 * @route   GET /api/payments
 * @access  Private
 */
exports.getPayments = async (req, res) => {
    try {
        const { status, clientId, startDate, endDate, page, limit } = req.query;

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 20;
        const skip = (pageNum - 1) * limitNum;

        // Build query
        let queryObj = {};
        if (status) queryObj.status = status;
        if (clientId) queryObj.client = clientId;
        if (startDate || endDate) {
            queryObj.dueDate = {};
            if (startDate) queryObj.dueDate.$gte = new Date(startDate);
            if (endDate) queryObj.dueDate.$lte = new Date(endDate);
        }

        const payments = await Payment.find(queryObj)
            .populate('client', 'name email phone')
            .populate('processedBy', 'name email')
            .sort({ dueDate: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Payment.countDocuments(queryObj);

        res.status(200).json({
            success: true,
            count: payments.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: payments
        });
    } catch (error) {
        console.error('Get payments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payments',
            error: error.message
        });
    }
};

/**
 * @desc    Get single payment
 * @route   GET /api/payments/:id
 * @access  Private
 */
exports.getPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('client', 'name email phone')
            .populate('processedBy', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        console.error('Get payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment',
            error: error.message
        });
    }
};

/**
 * @desc    Create new payment
 * @route   POST /api/payments
 * @access  Private
 */
exports.createPayment = async (req, res) => {
    try {
        // Generate invoice number
        const payment = new Payment({
            ...req.body,
            processedBy: req.user._id
        });

        if (!payment.invoiceNumber) {
            payment.invoiceNumber = payment.generateInvoiceNumber();
        }

        // Calculate subscription period based on type
        if (!payment.subscriptionPeriod || !payment.subscriptionPeriod.startDate) {
            const startDate = new Date();
            let endDate = new Date();

            switch (payment.subscriptionType) {
                case 'Monthly':
                    endDate.setMonth(endDate.getMonth() + 1);
                    break;
                case 'Quarterly':
                    endDate.setMonth(endDate.getMonth() + 3);
                    break;
                case '6-Month':
                    endDate.setMonth(endDate.getMonth() + 6);
                    break;
                case 'Yearly':
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    break;
                default:
                    endDate = startDate;
            }

            payment.subscriptionPeriod = { startDate, endDate };
        }

        await payment.save();

        // Update client payment score
        const client = await Client.findById(payment.client);
        if (client && payment.status === 'Paid') {
            client.paymentScore = Math.min(100, client.paymentScore + 5);
            await client.save();
        }

        await ActivityLog.log({
            action: 'CREATE_PAYMENT',
            description: `Created payment record for ${payment.finalAmount} ${payment.currency}`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'SUCCESS',
            entityType: 'Payment',
            entityId: payment._id
        });

        res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            data: payment
        });
    } catch (error) {
        console.error('Create payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating payment',
            error: error.message
        });
    }
};

/**
 * @desc    Update payment
 * @route   PUT /api/payments/:id
 * @access  Private
 */
exports.updatePayment = async (req, res) => {
    try {
        let payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        const oldStatus = payment.status;

        payment = await Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('client', 'name email');

        // Update client payment score if status changed to Paid
        if (oldStatus !== 'Paid' && payment.status === 'Paid') {
            const client = await Client.findById(payment.client._id);
            if (client) {
                client.paymentScore = Math.min(100, client.paymentScore + 5);
                await client.save();
            }
        }

        await ActivityLog.log({
            action: 'UPDATE_PAYMENT',
            description: `Updated payment (${payment.invoiceNumber})`,
            user: req.user._id,
            userName: req.user.name,
            userEmail: req.user.email,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
            level: 'INFO',
            entityType: 'Payment',
            entityId: payment._id
        });

        res.status(200).json({
            success: true,
            message: 'Payment updated successfully',
            data: payment
        });
    } catch (error) {
        console.error('Update payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating payment',
            error: error.message
        });
    }
};

/**
 * @desc    Get overdue payments (Priority Queue Algorithm)
 * @route   GET /api/payments/overdue
 * @access  Private
 */
exports.getOverduePayments = async (req, res) => {
    try {
        const overduePayments = await Payment.getOverduePayments();

        res.status(200).json({
            success: true,
            count: overduePayments.length,
            data: overduePayments
        });
    } catch (error) {
        console.error('Get overdue payments error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching overdue payments',
            error: error.message
        });
    }
};

/**
 * @desc    Get payments due soon
 * @route   GET /api/payments/due-soon
 * @access  Private
 */
exports.getPaymentsDueSoon = async (req, res) => {
    try {
        const { days } = req.query;
        const daysAhead = parseInt(days, 10) || 7;

        const paymentsDueSoon = await Payment.getPaymentsDueSoon(daysAhead);

        res.status(200).json({
            success: true,
            count: paymentsDueSoon.length,
            data: paymentsDueSoon
        });
    } catch (error) {
        console.error('Get payments due soon error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payments due soon',
            error: error.message
        });
    }
};

/**
 * @desc    Get payment analytics (Revenue trends, forecasting)
 * @route   GET /api/payments/analytics
 * @access  Private
 */
exports.getPaymentAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();

        // Get revenue analytics from Payment model
        const basicAnalytics = await Payment.getRevenueAnalytics(start, end);

        // Get all paid payments for trend analysis
        const paidPayments = await Payment.find({
            status: 'Paid',
            paidDate: { $gte: start, $lte: end }
        }).sort({ paidDate: 1 });

        // Use analytics algorithm for trend analysis
        const trendAnalysis = analyzeRevenueTrend(paidPayments, 7);

        // Get pending and overdue amounts
        const pendingPayments = await Payment.find({ status: 'Pending' });
        const overduePayments = await Payment.find({ status: 'Overdue' });

        const pendingAmount = pendingPayments.reduce((sum, p) => sum + p.finalAmount, 0);
        const overdueAmount = overduePayments.reduce((sum, p) => sum + p.finalAmount, 0);

        res.status(200).json({
            success: true,
            data: {
                ...basicAnalytics,
                ...trendAnalysis,
                pending: {
                    count: pendingPayments.length,
                    amount: pendingAmount
                },
                overdue: {
                    count: overduePayments.length,
                    amount: overdueAmount
                },
                period: {
                    start: start.toISOString().split('T')[0],
                    end: end.toISOString().split('T')[0]
                }
            }
        });
    } catch (error) {
        console.error('Get payment analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment analytics',
            error: error.message
        });
    }
};
