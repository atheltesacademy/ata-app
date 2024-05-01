const express = require('express');
const router = express.Router();
const Athlete = require('../controllers/athlete');

router.put("/athletes/update", Athlete.updateAthleteDetails);
router.get("/athletes/details", Athlete.getAllAthletes);

module.exports = router;