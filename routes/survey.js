const express = require('express');
const router = express.Router();
const Survey = require('../controllers/survey');

router.post("/survey", Survey.submitSurvey);
router.get("/survey/athlete/", Survey.getSurveyByEmail);
router.get("/survey/", Survey.getAllSurveys);

module.exports = router;