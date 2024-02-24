const express = require('express');
const router = express.Router();
const coacheslist = require('../controllers/coacheslist');
const{ detailsCoachlist } = require("../controllers/coacheslist");

// Routes
router.route("/detailsCoachlist").post(detailsCoachlist);
router.get('/coacheslist', coacheslist.getAllCoacheslist);

module.exports = router;
