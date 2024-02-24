// // models/wallet.js
// const mongoose = require('mongoose');

// const walletSchema = new mongoose.Schema({
//     athlete_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Athlete',
//         required: true
//     },
//     amount: {
//         type: Number,
//         default: 0
//     },
//     transactions: [
//         {
//             transaction_id: {
//                 type: mongoose.Schema.Types.ObjectId,
//                 required: true
//             },
//             amount: {
//                 type: Number,
//                 required: true
//             },
//             type: {
//                 type: String,
//                 enum: ['credit', 'debit'],
//                 required: true
//             },
//             timestamp: {
//                 type: Date,
//                 default: Date.now
//             }
//         }
//     ]
// });

// module.exports = mongoose.model('Wallet', walletSchema);


const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    athlete_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Athlete',
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    transactions: [
        {
            transaction_id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            amount: {
                type: Number,
                required: true
            },
            type: {
                type: String,
                enum: ['credit', 'debit'],
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

module.exports = mongoose.model('Wallet', walletSchema);
