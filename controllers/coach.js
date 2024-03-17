const mongoose = require('mongoose');
const Coach = require('../models/coach');
const Review = require('../models/review');
const Sport = require('../models/sport');

exports.detailsCoaches = async (req, res) => {
    try {
        const { email, coach_name, domains, coach_rating, coach_languages, coach_charges, coach_currency, coach_available,  } = req.body;
        let existingCoach = await Coach.findOne({ email });
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
                    
                },
                { new: true }
            );
            res.status(200).json({ message: "Coach details updated successfully", coach: existingCoach });
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
        res.status(200).json({ coaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//write a controllers for getting a sport by sport _id
exports.getCoachesBySportId = async (req, res) => {
    try {
        const sportId = req.params.sport_id;
        const sport = await Sport.findById(sportId);
       
        if (!sport) {
            return res.status(404).json({ message: "Sport not found" });
        }
        const coaches = await Coach.find({ domains: { $in: sportId } }); // Assuming `domains` refers to the sport `_id`
        res.status(200).json({ coaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCoachesBySportName = async (req, res) => {
    
    try {
        const sportName = req.params.sport_name; // assuming this is the correct property name
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
        const coach = await Coach.findById(coach_id);
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

exports.getAllCoacheslist = async (req, res) => {
    try {
        const coaches = await Coach.find();
        res.status(200).json({ coaches });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};













// exports.toggleCoachAvailability = async (req, res) => {
//     const coachId = req.params.coach_id;
//     const { available } = req.body;

//     try {
//         // Find the coach by ID
//         const coach = await Coach.findById(coachId);

//         if (!coach) {
//             return res.status(404).json({ message: "Coach not found" });
//         }

//         // Update the availability status
//         coach.available = available;
//         await coach.save();

//         res.status(200).json({
//             message: "Coach availability toggled successfully",
//             coach_id: coachId,
//             new_availability: available
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
