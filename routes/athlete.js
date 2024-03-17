const express = require('express');
const router = express.Router();
const Athlete = require('../controllers/athlete');

router.get("/Athletes/details", Athlete.getAllAthletes);

module.exports = router;