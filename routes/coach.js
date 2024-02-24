const express = require('express');
const router = express.Router();
const coach = require('../controllers/coach');
const{ detailsCoach } = require("../controllers/coach");

// Routes
router.route("/detailsCoach").post(detailsCoach);
router.post('/coach', coach.createCoach);
router.get('/coaches', coach.getAllCoaches);
router.get('/coach/:id', coach.getCoachById);
router.put('/coach/:id', coach.updateCoachById);
router.delete('/coach/:id', coach.deleteCoachById);

module.exports = router;
