const express = require('express');
const router = express.Router();
const sport = require('../controllers/sport');

router.post('/sport', sport.createSport);
router.get('/sports', sport.getAllSports);
router.get('/sports/:sportName', sport.getSportsByName);
router.get('/sports/:id', sport.getSportById);
router.put('/sports/:id', sport.updateSportById);
router.delete('/sports/:id', sport.deleteSportById);

module.exports = router;
