const express = require('express');
const router = express.Router();
const coach = require('../controllers/coach');

router.put("/coaches", coach.detailsCoaches); 
router.get('/coaches', coach.getCoaches); 
router.get('/coaches/available', coach.getAvailableCoaches);
router.get('/coaches/:coach_id/reviews', coach.getCoachReview);
router.get('/coaches/sport/:sport_name', coach.getCoachesBySportName); 
router.get('/coaches/sport/id/:sport_id', coach.getCoachesBySportId); 
router.get('/coaches/:coach_id', coach.getCoachDetailsBycoachId); 
router.get('/coaches/recommended', coach.getRecommendedCoaches);

module.exports = router;
