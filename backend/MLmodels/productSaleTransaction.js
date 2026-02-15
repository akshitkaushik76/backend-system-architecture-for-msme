const mongoose = require('mongoose');

const ProductSaleTransactionSchema = new mongoose.Schema({

    // identity
    productCode: { type: String, required: true, index: true },
    BuisnessCode: { type: String, required: true, index: true },
    OrganisationCode: { type: String, required: true, index: true },

    // sale details
    quantitySold: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalSaleAmount: { type: Number, required: true },

    // stock behaviour
    stockBeforeSale: { type: Number },
    stockAfterSale: { type: Number },

    // timing (VERY IMPORTANT FOR DEMAND FORECASTING)
    saleDate: { type: Date, default: Date.now, index: true },
    dayOfWeek: { type: Number },   // 0–6
    weekOfMonth: { type: Number }, // 1–5
    month: { type: Number },       // 1–12
    season: {
        type: String,
        enum: ['WINTER', 'SUMMER', 'MONSOON']
    },

    // context intelligence
    isWeekend: { type: Boolean },
    festivalPeriod: { type: Boolean, default: false },
    salaryWeek: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('ProductSaleTransaction', ProductSaleTransactionSchema);
