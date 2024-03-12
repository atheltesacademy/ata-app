const express = require('express');
const router = express.Router();
const coach = require('../controllers/coach');

router.put("/detailsCoach", coach.detailsCoach);
router.put("/signup/details/coach", coach.signupDetailsCoach);
router.put("/coaches", coach.detailsCoaches); 
router.get('/coaches', coach.getCoaches); 
router.get('/coaches/:coach_id/reviews', coach.getCoachReview);
router.get('/coaches/sport/:sport_id', coach.getCoachesBySport); 
router.get('/coaches/:coach_id', coach.getCoachDetailsBycoachId); 
router.get('/coaches/available', coach.getAvailableCoaches);
router.get('/coaches/recommended', coach.getRecommendedCoaches);




module.exports = router;
