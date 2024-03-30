const mongoose = require('mongoose');

const chats = new mongoose.Schema({
    participant_id: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true
    },
    message: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const chatHistorySchema = new mongoose.Schema({
   
    chats: [chats]
});

module.exports = mongoose.model('Chat', chatHistorySchema);

