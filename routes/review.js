const express = require('express');
const router = express.Router();
const Review = require('../controllers/review');

// Routes
router.post('/review', Review.createReview);
router.get('/reviews', Review.getAllReviews);

router.get('/reviews/:id', Review.getReviewById);
router.put('/reviews/:id', Review.updateReviewById);
router.delete('/reviews/:id', Review.deleteReviewById);

module.exports = router;
