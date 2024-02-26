const express = require('express');
const router = express.Router();
const coach = require('../controllers/coach');

router.post('/signup',coach.signup);
router.post("/detailsCoach",coach.detailsCoach);
router.post('/coach', coach.createCoach);
router.get('/coaches', coach.getAllCoaches);
router.get('/coach/:id', coach.getCoachById);
router.put('/coach/:id', coach.updateCoachById);
router.delete('/coach/:id', coach.deleteCoachById);
// coachlist routes here 
router.post("/detailsCoachlist", coach.detailsCoachlist);
router.get('/coacheslist', coach.getAllCoacheslist);

module.exports = router;
