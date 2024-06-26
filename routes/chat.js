const express = require('express');
const router = express.Router();
const chat = require('../controllers/chat');

router.post('/chats', chat.createChat);
router.get('/chats/athlete/:athlete_id', chat.getAthleteChats);
router.get('/chats/coach/:coach_id', chat.getCoachChats);
// router.get('/chats', chat.getAllChats);
// router.get('/chats//:id', chat.getChatById);
// router.delete('/chats/:id', chat.deleteChatById);

module.exports = router;