const express = require('express');
const router = express.Router();
const athlete = require('../controllers/athlete');

router.post("/detailSignup", athlete.details); // Corrected route definition

module.exports = router;
