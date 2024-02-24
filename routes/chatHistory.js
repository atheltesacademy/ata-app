// routes/chatHistory.js

const express = require('express');
const router = express.Router();
const chatHistory = require('../controllers/chatHistory');


router.post('/chats', chatHistory.createChat);
// Routes for coach chat history
router.get('/coach_chat', chatHistory.getCoachChats);

// Routes for athlete chat history
router.get('/athlete_chat', chatHistory.getAthleteChats);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const chat = require('../controllers/chatHistory');

// // Create a new chat
// router.post('chat', chat.createChat);

// // Get all chats
// router.get('chats', chat.getAllChats);

// // Get chat by ID
// router.get('/:id', chat.getChatById);

// // Update chat by ID
// router.put('/:id', chat.updateChatById);

// // Delete chat by ID
// router.delete('/:id', chat.deleteChatById);

// module.exports = router;
