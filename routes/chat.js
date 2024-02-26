// routes/chatHistory.js

const express = require('express');
const router = express.Router();
const chat = require('../controllers/chat');

router.post('/chats', chat.createChat);
// Routes for coach chat history
router.get('/coachChat', chat.getCoachChats);

// Routes for athlete chat history
router.get('/athleteChat', chat.getAthleteChats);

// Get all chats
router.get('chats', chat.getAllChats);

// Get chat by ID
router.get('/:id', chat.getChatById);

// Update chat by ID
router.put('/:id', chat.updateChatById);

 // Delete chat by ID
router.delete('/:id', chat.deleteChatById);

module.exports = router;