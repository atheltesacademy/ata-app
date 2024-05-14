const express = require('express');
const router = express.Router();
const session = require('../controllers/session');
const upload = require('../middlewares/multer');

router.post('/login', session.login);
router.put('/updatePassword', session.updatePassword);

// Routes for sessions
router.post('/signup', session.signup);
router.post('/logout', session.logout);
router.put('/signupDetails', upload.single('image'),session.signupDetails);

module.exports = router;