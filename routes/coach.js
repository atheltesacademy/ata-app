const express = require('express');
const router = express.Router();
const coach = require('../controllers/coach');

router.put("/coaches", checkTokenValidity, coach.updateCoachDetails); 
router.get('/coaches', checkTokenValidity, coach.getCoaches); 
router.put('/coaches/:coach_id/availability', checkTokenValidity, coach.toggleAvailability);
router.get('/coaches/available', checkTokenValidity, coach.getAvailableCoaches);
router.get('/coaches/:coach_id/reviews',checkTokenValidity, coach.getCoachReview);
router.get('/coaches/sport/:sport_name',checkTokenValidity, coach.getCoachesBySportName);
router.get('/coaches/sport/id/:sport_id',checkTokenValidity, coach.getCoachesBySportId); 
router.get('/coaches/:coach_id', checkTokenValidity, coach.getCoachDetailsBycoachId); 
router.get('/coaches/recommended', checkTokenValidity, coach.getRecommendedCoaches);
router.put('/coaches/rates/:coach_id', checkTokenValidity, coach.updateCoachRates);

module.exports = router;
