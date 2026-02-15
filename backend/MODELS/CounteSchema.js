// const mongoose = require('mongoose');
// const code = new mongoose.Schema({
//     key:{
//         type:String,
//         unique:true
//     },
//     value:{
//         type:Number,
//         default:0
//     }
// })

// module.exports = mongoose.model('Code',code);

// models/creditCounter.js

const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    OrganisationCode: String,
    date: String, // "130226"
    seq: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('CreditCounter', counterSchema);
