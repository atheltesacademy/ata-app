const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    athlete_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Athlete', // Reference to Athlete model
        required: true
    },
    coach_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coach', // Reference to Coach model
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatHistorySchema = new mongoose.Schema({
    chats: [chatSchema]
});

module.exports = mongoose.model('Chat', chatHistorySchema);
