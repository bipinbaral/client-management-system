const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: [true, 'Please provide client reference'],
        index: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide payment amount'],
        min: 0
    },
    currency: {
        type: String,
        default: 'NPR',
        enum: ['NPR', 'USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD']
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Other'],
        default: 'Cash'
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Overdue', 'Cancelled', 'Refunded'],
        default: 'Pending',
        index: true
    },
    transactionId: {
        type: String,
        trim: true,
        default: ''
    },
    // Subscription Information
    subscriptionType: {
        type: String,
        enum: ['Monthly', 'Quarterly', '6-Month', 'Yearly', 'One-time'],
        default: 'Monthly'
    },
    subscriptionPeriod: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        }
    },
    // Date Information
    dueDate: {
        type: Date,
        required: [true, 'Please provide due date'],
        index: true
    },
    paidDate: {
        type: Date
    },
    // Notes
    notes: {
        type: String,
        default: ''
    },
    // Invoice details
    invoiceNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    // Processed by
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Discount applied
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100 // percentage
    },
    discountAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    // Final amount after discount
    finalAmount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual: Days overdue
paymentSchema.virtual('daysOverdue').get(function () {
    if (this.status === 'Paid' || this.status === 'Cancelled') return 0;

    const now = new Date();
    if (now > this.dueDate) {
        const diff = now.getTime() - this.dueDate.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
});

// Virtual: Days until due
paymentSchema.virtual('daysUntilDue').get(function () {
    if (this.status === 'Paid' || this.status === 'Cancelled') return null;

    const now = new Date();
    if (this.dueDate > now) {
        const diff = this.dueDate.getTime() - now.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    return 0;
});

// Virtual: Priority for notifications (0 = highest)
paymentSchema.virtual('priority').get(function () {
    const daysOverdue = this.daysOverdue;
    const daysUntilDue = this.daysUntilDue;

    if (daysOverdue > 0) return 0; // Highest priority - overdue
    if (daysUntilDue !== null && daysUntilDue <= 3) return 1; // Due soon
    return 2; // Normal priority
});

// Virtual: Is Overdue
paymentSchema.virtual('isOverdue').get(function () {
    return this.status !== 'Paid' && this.status !== 'Cancelled' && new Date() > this.dueDate;
});

// Pre-save hook: Auto-update status to Overdue
paymentSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'Paid' && !this.paidDate) {
        this.paidDate = new Date();
    }

    // Auto-mark as overdue
    if (this.status === 'Pending' && this.dueDate && new Date() > this.dueDate) {
        this.status = 'Overdue';
    }

    // Calculate final amount with discount
    if (this.isModified('amount') || this.isModified('discount')) {
        this.discountAmount = (this.amount * this.discount) / 100;
        this.finalAmount = this.amount - this.discountAmount;
    }

    next();
});

// Method: Mark as paid
paymentSchema.methods.markAsPaid = async function (transactionId = '') {
    this.status = 'Paid';
    this.paidDate = new Date();
    if (transactionId) this.transactionId = transactionId;
    await this.save();
};

// Method: Generate invoice number
paymentSchema.methods.generateInvoiceNumber = function () {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
};

// Static: Get overdue payments (Priority Queue algorithm)
paymentSchema.statics.getOverduePayments = async function () {
    const payments = await this.find({
        status: { $in: ['Pending', 'Overdue'] },
        dueDate: { $lt: new Date() }
    })
        .populate('client', 'name email phone')
        .sort({ dueDate: 1 }); // Oldest first

    // Sort by priority (overdue days descending)
    return payments.sort((a, b) => b.daysOverdue - a.daysOverdue);
};

// Static: Get payments due soon (within N days)
paymentSchema.statics.getPaymentsDueSoon = async function (days = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return await this.find({
        status: 'Pending',
        dueDate: { $gte: new Date(), $lte: futureDate }
    })
        .populate('client', 'name email phone')
        .sort({ dueDate: 1 });
};

// Static: Revenue analytics
paymentSchema.statics.getRevenueAnalytics = async function (startDate, endDate) {
    const analytics = await this.aggregate([
        {
            $match: {
                status: 'Paid',
                paidDate: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$finalAmount' },
                totalPayments: { $sum: 1 },
                averagePayment: { $avg: '$finalAmount' },
                totalDiscount: { $sum: '$discountAmount' }
            }
        }
    ]);

    return analytics.length > 0 ? analytics[0] : {
        totalRevenue: 0,
        totalPayments: 0,
        averagePayment: 0,
        totalDiscount: 0
    };
};

// Indexes
paymentSchema.index({ client: 1, status: 1, dueDate: -1 });
paymentSchema.index({ status: 1, dueDate: 1 });
paymentSchema.index({ paidDate: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
