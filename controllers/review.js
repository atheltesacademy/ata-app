const Review = require('../models/review');
const { v4: uuidv4 } = require('uuid'); // Import UUID generator

// Create a new review
exports.createReview = async (req, res) => {
    try {
        const reviewId = uuidv4(); // Generate a UUID for the review
        const review = await Review.create({ ...req.body, review_id: reviewId }); // Include review ID in the review object
        res.status(201).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get review by ID
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findOne({ review_id: req.params.id }); // Find review by review ID
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update review by ID
exports.updateReviewById = async (req, res) => {
    try {
        const review = await Review.findOneAndUpdate({ review_id: req.params.id }, req.body, { new: true }); // Update review by review ID
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete review by ID
exports.deleteReviewById = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({ review_id: req.params.id }); // Delete review by review ID
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};