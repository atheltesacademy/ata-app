const express = require('express');
const router = express.Router();
const sport = require('../controllers/sport');
const upload = require('../middlewares/multer');

router.post('/sport',upload.single('image'),sport.createSport);
router.get('/sports', sport.getAllSports);
router.get('/sports/:sportName', sport.getSportsByName);
router.get('/sports/:id', sport.getSportById);
router.put('/sports/:id', sport.updateSportById);
router.delete('/sports/:id', sport.deleteSportById);

module.exports = router;
