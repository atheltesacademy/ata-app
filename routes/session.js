const express = require('express');
const router = express.Router();
const session = require('../controllers/session');

// Routes for sessions
router.post('/signup', session.register);
router.post('/login', session.login);


module.exports = router;
