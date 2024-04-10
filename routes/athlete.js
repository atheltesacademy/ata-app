const express = require('express');
const router = express.Router();
const Athlete = require('../controllers/athlete');

router.put("/Athletets", Athlete.updateAthleteDetails);
router.get("/Athletes/details", Athlete.getAllAthletes);

module.exports = router;