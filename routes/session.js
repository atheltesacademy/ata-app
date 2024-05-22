const express = require('express');
const router = express.Router();
const session = require('../controllers/session');
// const auth = require('../middlewares/auth'); 

router.post('/login', session.login);
router.put('/update-password', session.updatePassword);
router.post('/forgot-password', session.forgotPassword);

// Routes for sessions
router.post('/signup', session.signup);
router.post('/logout', session.logout);
router.put('/signupDetails', session.signupDetails);

module.exports = router;