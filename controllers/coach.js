const mongoose = require('mongoose');
const Coach = require('../models/coach');
const Review = require('../models/review');
const Sport = require('../models/sport');
const Session = require('../models/session');

exports.detailsCoach = async (req, res) => {
    try {
        const { email, password } = req.session;
        const session = await Session.findOne({ email, password });
        if (!session) {
            throw new Error("Invalid session");
        }
        const coach = await Coach.findOne({ email: session.email }, 'email');
        if (!coach) {
            throw new Error("Coach not found");
        }
        res.status(200).json({ coach });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.signupDetailsCoach = async (req, res) => {
    try {
        const { email, coach_name, coach_phone, coach_dob, coach_address, domains, detail_experience } = req.body;
        let existingCoach1 = await Coach.findOne({ email });
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
            res.status(200).json({ message: "Coach details updated successfully", coach: existingCoach1 });
        } else {
            res.status(404).json({ error: "Coach with this email does not exist" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.detailsCoaches = async (req, res) => {
    try {
        const { email, coach_name, domains, coach_rating, coach_languages, coach_charges, coach_currency, coach_available, sport_name } = req.body;
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
                    sport_name
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

exports.getCoachesBySport = async (req, res) => {
    try {
        const sport_id = req.params.sport_id;
        const sport = await Sport.findOne({ sport_id });
        if (!sport) {
            return res.status(404).json({ message: "Sport not found" });
        }
        const coaches = await Coach.find({ domains: sport.sport_name });
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
        const coaches = await Coach.find({ coach_available: true }, 'coach_name coach_rating domains coach_languages coach_charges coach_currency coach_available');
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
