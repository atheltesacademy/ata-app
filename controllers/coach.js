const mongoose = require('mongoose');
const Coach = require('../models/coach');
const Review = require('../models/review');
const Sport = require('../models/sport');
const Session = require('../models/session');

exports.detailsCoach = async (req, res) => {
    try {
        // Retrieve session data for authentication
        const { email, password } = req.session;
        // Find the coach by email
        const session = await Session.findOne({ email, password });
        if (!session) {
            throw new Error("Invalid session");
        }
        // Fetch coach's details by email
        coach = await Coach.findOne({ email: session.email }, 'email'); // Only retrieve email

        if (!coach) {
            throw new Error("coach not found");
        }

    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            res.status(400).json({ error: "Email already exists" });
        } else {
            res.status(400).json({ error: error.message });
        }
    }
};
exports.signupDetailsCoach = async (req, res) => {
    try {
        const { email, coach_name, coach_phone, coach_dob, coach_address, domains, detail_experience } = req.body;

        // Find the existing coach by email
        let existingCoach1 = await Coach.findOne({ email });

        // If coach exists, update the details; otherwise, return an error
        if (existingCoach1) {
            existingCoach1 = await Coach.findOneAndUpdate(
                { email },
                {
                    coach_name,
                    coach_phone,
                    coach_dob,
                    coach_address,
                    domains,
                    detail_experience
                },
                { new: true }
            );

            res.status(200).json({
                message: "Coach details updated successfully",
                coach_id: existingCoach1._id, // Include coach ID
                email: existingCoach1.email,
                coach_name: existingCoach1.coach_name,
                coach_phone: existingCoach1.coach_phone,
                coach_dob: existingCoach1.coach_dob,
                domains: existingCoach1.domains,
                coach_address: existingCoach1.coach_address,
                detail_experience: existingCoach1.detail_experience,
            });
        } else {
            res.status(404).json({ error: "Coach with this email does not exist" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.detailsCoaches= async (req, res) => {
    try {
        const { coach_name, email, domains, coach_rating, coach_languages, coach_charges, coach_currency, coach_available, sport_name } = req.body;

        // Find the existing coach by email
        let existingCoach = await Coach.findOne({ email });

        // If coach exists, update the details; otherwise, return an error
        if (existingCoach) {
            existingCoach = await Coach.findOneAndUpdate(
                { email },
                {
                    coach_name,
                    domains,
                    coach_rating,
                    coach_languages,
                    coach_charges,
                    coach_currency,
                    coach_available,
                    sport_name
                },
                { new: true }
            );

            res.status(200).json({
                message: "Coach details updated successfully",
                coach_id: existingCoach._id, // Include coach ID
                email: existingCoach.email,
                coach_name: existingCoach.coach_name,
                domains: existingCoach.domains,
                coach_rating: existingCoach.coach_rating,
                coach_languages: existingCoach.coach_languages,
                coach_charges: existingCoach.coach_charges,
                coach_currency: existingCoach.coach_currency,
                coach_available: existingCoach.coach_available,
                sport_name: existingCoach.sport_name
            });
        } else {
            res.status(400).json({ error: "Coach with this email does not exist" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find({}, '_id coach_name coach_rating domains coach_languages coach_charges coach_currency coach_available');
        const formattedCoaches = coaches.map(coach => ({
            coach_id: coach._id.toString(),
            coach_name: coach.coach_name,
            rating: coach.coach_rating, // Corrected field name
            domains: coach.domains,
            languages: coach.coach_languages, // Corrected field name
            charges: coach.coach_charges, // Corrected field name
            currency: coach.coach_currency,
            available: coach.coach_available
        }));

        res.status(200).json({ coaches: formattedCoaches });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCoachesBySport = async (req, res) => {
    try {
        const sport_id = req.params.sport_id;

        // Check if the sport_id is in the correct format
        if (!mongoose.Types.ObjectId.isValid(sport_id)) {
            return res.status(400).json({ error: "Invalid sport_id format" });
        }

        // Convert the string sport_id to ObjectId
        const sportObjectId = new mongoose.Types.ObjectId(sport_id);

        // Find the sport based on the sport_id
        const sport = await Sport.findById(sportObjectId);

        // Check if the sport exists
        if (!sport) {
            return res.status(404).json({ message: "Sport not found" });
        }

        // Find coaches for the specified sport
        const coaches = await Coach.find({ domains: sport.sport_name });
       

        // Format the response
        const formattedCoaches = coaches.map(coach => ({
            
            coach_id: coach._id.toString(),
            coach_name: coach.coach_name,
            coach_rating: coach.coach_rating,
            domains: coach.domains,
            coach_languages: coach.coach_languages,
            coach_charges: coach.coach_charges,
            coach_currency: coach.coach_currency,
            coach_available: coach.coach_available
        }));
        console.log("fruhnojcnre" )
        res.status(200).json({ coaches: formattedCoaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCoachDetailsBycoachId = async (req, res) => {
    try {
        const coach_id = req.params.coach_id;

        // Find coach by coach_id
        const coach = await Coach.findById(coach_id);

        // Check if coach exists
        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }
        // Format the response
        const coachDetails = {
            coach_id: coach._id.toString(),
            coach_name: coach.coach_name,
            coach_details: {
                email: coach.email,
                phone: coach.coach_phone, 
                dob: coach.coach_dob,
                address: coach.coach_address,
                detail_experience: coach.detail_experience,
                rating: coach.coach_rating,
                domains: coach.domains,
                languages: coach.coach_languages,
                charges: coach.coach_charges,
                currency: coach.coach_currency,
                available: coach.coach_available
            }
        };

        res.status(200).json(coachDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCoachReview = async (req, res) => {
    try {
        const coach_id = req.params.coach_id;

        // Check if coach_id is valid
        if (!coach_id) {
            return res.status(400).json({ message: "Coach ID is required" });
        }

        // Find coach by coach_id
        const coach = await Coach.findById(coach_id);

        // Check if coach exists
        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }

        // Retrieve reviews for the coach
        const reviews = await Review.find({ coach_id });

        // Format the response
        const formattedReviews = reviews.map(review => ({
            review_id: review._id.toString(),
            rating: review.rating,
            comment: review.comment,
            timestamp: review.timestamp
        }));

        res.status(200).json({ reviews: formattedReviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAvailableCoaches = async (req, res) => {
    try {
        // Find coaches where available is true
        const coaches = await Coach.find({ available: true });

        // Format the response
        const formattedCoaches = coaches.map(coach => ({
            coach_id: coach._id.toString(),
            coach_name: coach.coach_name,
            rating: coach.coach_rating,
            domains: coach.domains,
            languages: coach.coach_languages,
            charges: coach.coach_charges,
            currency: coach.coach_currency,
            available: coach.available
        }));

        res.status(200).json({ coaches: formattedCoaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getRecommendedCoaches = async (req, res) => {
    try {
        // Find coaches sorted by rating in descending order (higher ratings first)
        const coaches = await Coach.find().sort({ coach_rating: -1 });

        // Format the response
        const formattedCoaches = coaches.map(coach => ({
            coach_id: coach._id.toString(),
            coach_name: coach.coach_name,
            rating: coach.coach_rating,
            domains: coach.domains,
            languages: coach.coach_languages,
            charges: coach.coach_charges,
            currency: coach.coach_currency,
            available: coach.available
        }));

        res.status(200).json({ coaches: formattedCoaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllCoacheslist = async (req, res) => {
    try {
        const coaches = await Coach.find();
        res.status(200).json({ success: true, coaches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
