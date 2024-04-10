const express = require('express');
const router = express.Router();
const sport = require('../controllers/sport');

router.post('/sport', checkTokenValidity, sport.createSport);
router.get('/sports', checkTokenValidity, sport.getAllSports);
router.get('/sports/:id', checkTokenValidity, sport.getSportById);
router.put('/sports/:id', checkTokenValidity, sport.updateSportById);
router.delete('/sports/:id',  checkTokenValidity, sport.deleteSportById);

module.exports = router;
