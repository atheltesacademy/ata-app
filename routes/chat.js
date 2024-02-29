const express = require('express');
const router = express.Router();
const chat = require('../controllers/chat');

router.post('/chats', chat.createChat);
router.get('/coachChat', chat.getCoachChats);
router.get('/athleteChat', chat.getAthleteChats);
router.get('chats', chat.getAllChats);
router.get('/:id', chat.getChatById);
router.delete('/:id', chat.deleteChatById);

module.exports = router;