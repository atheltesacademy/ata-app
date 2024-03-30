const Chat = require('../models/chat');

// Create a new chat
exports.createChat = async (req, res) => {
    try {
        const { chat_id, participant_id, message } = req.body;
        const chat = await Chat.create({ chat_id, participant_id, message });
      
        res.status(201).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Get all history chats for coaches
exports.getCoachChats = async (req, res) => {
    try {
        const coach_id = req.params.coach_id;
        const chat = await Chat.find({ participant_id: coach_id }); // Use ChatHistory instead of chatHistory
        res.status(200).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Get all history chats for an athlete
exports.getAthleteChats = async (req, res) => {
    try {
        const athlete_id = req.params.athlete_id;
        const chat = await Chat.find({ participant_id: athlete_id }); // Use ChatHistory instead of chatHistory
        res.status(200).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all chats
exports.getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find();
        res.status(200).json({ success: true, chats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get chat by ID
exports.getChatById = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }
        res.status(200).json({ success: true, chat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Delete chat by ID
exports.deleteChatById = async (req, res) => {
    try {
        const chat = await Chat.findByIdAndDelete(req.params.id);
        if (!chat) {
            return res.status(404).json({ success: false, message: 'Chat not found' });
        }
        res.status(200).json({ success: true, message: 'Chat deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
