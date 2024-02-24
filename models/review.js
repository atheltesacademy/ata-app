// models/review.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

    coach_id: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Coach', 
         required: true 
        },
    rating: { 
        type: Number, 
        required: true 
    },
    comment: {
         type: String
         },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Review', reviewSchema);