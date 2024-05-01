const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
    coach_id: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Coach', 
        },
    athlete_id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'athlete', 
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