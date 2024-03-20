const mongoose = require('mongoose');

const chats = new mongoose.Schema({
    participant_id: {
        type: mongoose.Schema.Types.ObjectId,
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
    chat_id: {
        type: String,
        required: true
    },
    chats: [chats]
});

module.exports = mongoose.model('Chat', chatHistorySchema);

