const express = require('express');
const router = express.Router();
const coach = require('../controllers/coach');

router.post("/detailsCoach", coach.detailsCoach);
router.post("/detailsCoachlist", coach.detailsCoachlist);
router.get('/coaches', coach.getAllCoacheslist); 

module.exports = router;

