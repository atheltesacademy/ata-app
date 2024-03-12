const express = require('express');
const router = express.Router();
const Athlete = require('../controllers/athlete');

router.put("/signupdetails", Athlete.createAthlete);
router.put("/details/signup/athlete", Athlete.detailAthlete);
router.post("/getAllAthletesdetails", Athlete.getAllAthletes);

module.exports = router;