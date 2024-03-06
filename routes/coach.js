const express = require('express');
const router = express.Router();
const coach = require('../controllers/coach');

router.put("/detailsCoach", coach.detailsCoach);
router.put("/detailsCoachlist", coach.detailsCoachlist);
router.get('/getallcoaches', coach.getAllCoacheslist); 
router.get('/getcoaches', coach.getCoaches); 
router.get('/getcoachesBySport', coach.getCoachesBySport); 
router.get('/getCoachDetails', coach.getCoachDetailsBycoachId); 
module.exports = router;
