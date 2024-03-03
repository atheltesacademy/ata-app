const express = require('express');
const router = express.Router();
const session = require('../controllers/session');
const auth = require('../middlewares/auth'); 

router.post('/login', auth, session.login);
router.put('/updatePassword',auth, session.updatePassword);

// Routes for sessions
router.post('/signup', session.signup);
router.post('/logout',auth, session.logout);

module.exports = router;