const mongoose = require('mongoose');

const CreditTransactionSchema = new mongoose.Schema({

    // identity
    phoneNumber: { type: Number, required: true, index: true },
    BuisnessCode: { type: String, required: true, index: true },
    OrganisationCode: { type: String, required: true, index: true },

    // credit details
    creditAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },

    // timing
    creditIssuedDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    paymentDate: { type: Date },

    // payment behaviour
    paymentStatus: {
        type: String,
        enum: ['UNPAID', 'PARTIAL', 'PAID'],
        default: 'UNPAID'
    },

    paymentCount: { type: Number, default: 0 }, // installments count

    // derived behaviour features (VERY IMPORTANT FOR ML)
    daysToFirstPayment: { type: Number, default: null },
    totalDaysToRepay: { type: Number, default: null },
    delayDays: { type: Number, default: 0 },

    wasLate: { type: Boolean, default: false },
    wasDefault: { type: Boolean, default: false }, // label for ML

    // context features (hidden gold for ML)
    issuedDayOfWeek: { type: Number },  // 0–6
    issuedMonth: { type: Number },      // 1–12
    festivalPeriod: { type: Boolean, default: false },
    salaryWeek: { type: Boolean, default: false },

    // tracking
    lastPaymentUpdate: { type: Date },
    createdAt: { type: Date, default: Date.now, index: true }

});

module.exports = mongoose.model('CreditTransaction', CreditTransactionSchema);
