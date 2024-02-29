const express = require('express');
const router = express.Router();
const athlete = require('../controllers/athlete');

router.put("/detailignup", athlete.createAthlete);
router.put("/detailSignup", athlete.detailAthlete);
router.post("/getAllAthletesdetails", athlete.getAllAthletes);

module.exports = router;
