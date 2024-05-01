const mongoose = require('mongoose');
const Coach = require('../models/coach');
const Review = require('../models/review');
const Sport = require('../models/sport');
const Session = require('../models/session');

exports.updateCoachDetails = async (req, res) => {
    try {
        const { email, coach_name, domains, coach_rating, coach_charges, coach_currency, coach_available,  } = req.body;
        let existingCoach = await Coach.findOne({ email });
        if (existingCoach) {
            existingCoach = await Coach.findOneAndUpdate(
                { email },
                {
                    coach_name,
                    domains,
                    coach_rating,
                    coach_charges,
                    coach_currency,
                    coach_available,  
                },
                { new: true }
            );
            res.status(200).json({ message: "Coach details updated successfully", coach: existingCoach });
        } else {
            res.status(404).json({ error: "Coach with this email does not exist" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find({}, '_id coach_name coach_rating domains coach_languages coach_charges coach_currency coach_available');
        res.status(200).json({ coaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCoachesBySportId = async (req, res) => {
    try {
        const sportId = req.params.sport_id;
        const sport = await Sport.findById(sportId);
       
        if (!sport) {
            return res.status(404).json({ message: "Sport not found" });
        }
        const coaches = await Coach.find({ domains: { $in: sportId } }).select('-password'); // Assuming `domains` refers to the sport `_id`
        res.status(200).json({ coaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCoachesBySportName = async (req, res) => {
    
    try {
        const sportName = req.params.sport_name; 
        const sport = await Sport.find({ sport_name: sportName });
       
        if (!sport) {
            return res.status(404).json({ message: "Sport not found" });
        }

        const coaches = await Coach.find({ domains: { $in: [sport[0]._id] } });// Assuming `domains` refers to the sport `_id`
        res.status(200).json({ coaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCoachDetailsBycoachId = async (req, res) => {
    try {
        const coach_id = req.params.coach_id;
        const coach = await Coach.findById(coach_id).select('-password');
        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }
        res.status(200).json({ coach });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCoachReview = async (req, res) => {
    try {
        const coach_id = req.params.coach_id;
        if (!coach_id) {
            return res.status(400).json({ message: "Coach ID is required" });
        }
        const reviews = await Review.find({ coach_id });
        res.status(200).json({ reviews });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.toggleAvailability = async (req, res) => {
    try {
        const { coach_id } = req.params;
        const { available} = req.body;

        // Validate the coach_id parameter
        if (!coach_id) {
            return res.status(400).json({ error: "Coach ID is required" });
        }
        // Validate the availability payload
        if (typeof available !== 'boolean') {
            return res.status(400).json({ error: "Invalid availability value. It should be a boolean." });
        }
        // Find the coach by coach_id
        const coach = await Coach.findById(coach_id);

        if (!coach) {
            return res.status(404).json({ error: "Coach not found" });
        }

        // Update the availability of the coach
        coach.coach_available = available;
        await coach.save();

        return res.status(200).json({ message: "Coach availability toggled successfully", coach_id, new_availability: available });
    } catch (error) {
        console.error("Error toggling coach availability:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

exports.getAvailableCoaches = async (req, res) => {
    try {
    
        const coaches = await Coach.find({coach_available:true} ,'_id coach_name coach_rating domains coach_languages coach_charges coach_currency coach_available');
        res.status(200).json({ coaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRecommendedCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find().sort({ coach_rating: -1 });
        res.status(200).json({ coaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateCoachRates= async (req, res)=> {
  
    const {coach_id} = req.params;
    const { currency, charges,email} = req.body;
    try {
        // Find the coach by ID
        let coach = await Coach.findById(coach_id);

        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }

        // Update coach currency and charges
        coach.coach_currency = currency;
        coach.coach_charges = charges;

        // Save the updated coach
        await coach.save();

        // Respond with success message and updated coach details
        res.json({
            message: "Coach rates updated successfully",
            coach_id: coach._id,
            email:email,
            currency: coach.coach_currency,
            charges: coach.coach_charges
        });
    } catch (error) {
        res.status(500).json({ error:error.message });
    }
};
