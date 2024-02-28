const express = require('express');
const router = express.Router();
const session = require('../controllers/session');

// Routes for sessions
router.post('/signup', session.signup);
router.post('/login', session.login);


module.exports = router;
