const express = require('express');
const router = express.Router();
const chat = require('../controllers/chat');

router.post('/chat/create', (req, res) => { chat.createChat(req,res);});
router.get('/chats/athlete/:athlete_id', chat.getAthleteChats);
router.get('/chats/coach/:coach_id', chat.getCoachChats);
router.get('/:id', chat.getChatById);
router.get('/chats', chat.getAllChats);
router.delete('/:id', chat.deleteChatById);

module.exports = router;
