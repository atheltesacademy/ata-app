const express = require('express');
const router = express.Router();
const athlete = require('../controllers/athlete');
const authenticate = require('../middlewares/auth');


router.post("/detailSignup",athlete.details);
router.post('/signup', athlete.register);
router.post('/login', athlete.login);
router.post('/logout', athlete.logout);
router.patch('/updatePassword', authenticate, athlete.updatePassword);

module.exports = router;
