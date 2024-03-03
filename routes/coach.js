const express = require('express');
const router = express.Router();
const coach = require('../controllers/coach');

router.put("/detailsCoach", coach.detailsCoach);
router.put("/detailsCoachlist", coach.detailsCoachlist);
router.get('/coaches', coach.getAllCoacheslist); 

module.exports = router;
