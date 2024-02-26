
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
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
   
    chats: [chatSchema]
});

module.exports = mongoose.model('Chat', chatHistorySchema);

