// chatModel.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    athlete_id: {
        type: String,
        ref: 'Athlete'
    },
    coach_id: {
        type: String,
        ref: 'Coach'
    },
    messages: [{
        sender_id: {
            type: String,
            ref: 'User' // Assuming there's a User model containing both Athlete and Coach
        },
        text: {
            type: String
        },
        timestamp: {
            type: String,
            default: Date.now().toString()
        }
    }],
    timestamp: {
        type: String,
        default: Date.now().toString()
    }
});

module.exports = mongoose.model('Chat', chatSchema);
