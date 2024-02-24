const express = require("express");
const router = express.Router();

// const { authenticateUser } = require('../middlewares/auth'); // Corrected import path

const { register, login, logout, updatePassword } = require("../controllers/user");
router.post('/register', register);
router.post('/login', login);
router.post('/logout',  logout); // Protect route with authentication middleware
// router.put('/updatePassword', authenticateUser, updatePassword); // Protect route with authentication middleware

module.exports = router;
