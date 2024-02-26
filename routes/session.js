const express = require('express');
const router = express.Router();
const session = require('../controllers/session');

// Routes for sessions
router.post('sessionCreate', session.createSession);
router.get('sessionGet', session.getAllSessions);
router.get('sessionGetId', session.getSessionById);
router.put('sessionPutId', session.updateSession);
router.delete('sessionDeleteId', session.deleteSession);

module.exports = router;
