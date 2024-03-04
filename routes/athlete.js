const express = require('express');
const router = express.Router();
const Athlete = require('../controllers/athlete');

router.put("/detailignup", Athlete.createAthlete);
router.put("/detailSignup", Athlete.detailAthlete);
router.post("/getAllAthletesdetails", Athlete.getAllAthletes);

module.exports = router;