const express = require('express');
const router = express.Router();
const session = require('../controllers/session');
// const auth = require('../middlewares/auth'); 

router.post('/login', session.login);
router.put('/updatePassword',checkTokenValidity, session.updatePassword);

// Routes for sessions
router.post('/signup', session.signup);
router.post('/logout', checkTokenValidity, session.logout);
router.put('/signupDetails', session.signupDetails);

// Route to invalidate a token
app.post('/invalidate-token', (req, res) => {
    const tokenToInvalidate = req.body.token;
    // Add the token to the blacklist (pseudo code)
    blacklist.push(tokenToInvalidate);
    res.json({ message: 'Token invalidated successfully' });
});

module.exports = router;