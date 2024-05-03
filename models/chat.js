// chatModel.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    athlete_id: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Athlete',
        required: true 
    },
    coach_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach',
        required: true 
    },
    messages: [{
        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        text: {
            type: String
        },
        timestamp: {
            type: Date,
            default: Date.now().toString()
        }
    }],
    timestamp: {
        type: Date,
        default: Date.now().toString()
    }
});

module.exports = mongoose.model('Chat', chatSchema);
