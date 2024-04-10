const express = require('express');
const router = express.Router();
const Review = require('../controllers/review');

// Routes
router.post('/review', checkTokenValidity, Review.createReview);
router.get('/reviews', checkTokenValidity. Review.getAllReviews);

router.get('/reviews/:id', checkTokenValidity, Review.getReviewById);
router.put('/reviews/:id', checkTokenValidity, Review.updateReviewById);
router.delete('/reviews/:id', checkTokenValidity, Review.deleteReviewById);

module.exports = router;
