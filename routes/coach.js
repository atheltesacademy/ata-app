// const express = require('express');
// const router = express.Router();
// const coach = require('../controllers/coach');
// const coacheslist = require('../models/coacheslist');

// router.post("/detailsCoach", coach.detailsCoach);
// router.post('/coach', coach.createCoach); 
// router.get('/coaches', coach.getAllCoaches); 
// router.get('/coach/:id', coach.getCoachById);
// router.put('/coach/:id', coach.updateCoachById);
// router.delete('/coach/:id', coach.deleteCoachById);

// router.post('/coacheslist',coacheslist);

const express = require('express');
const router = express.Router();
const coach = require('../controllers/coach');

router.post("/detailsCoach", coach.detailsCoach);
router.post("/detailsCoachlist", coach.detailsCoachlist);
router.get('/getAllCoach', coach.getAllCoacheslist); 

module.exports = router;

