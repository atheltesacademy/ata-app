const Coach = require('../models/coach');
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
        const {  email,coach_name,coach_phone, coach_dob, coach_address, domains,detail_experience} = req.body;

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
                email: existingCoach1.email,
                coach_name: existingCoach1.coach_name,
                coach_phone:existingCoach1.coach_phone,
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
exports.detailsCoachlist = async (req, res) => {
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
exports.getCoachesBySport = async (req, res) => {
    try {
        const sport_id = req.params.sport_id;

        // Find coaches for the specified sport
        const coaches = await Coach.find({ sport_id });

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
                coach_phone: coach.coach_phone,
                coach_dob: coach.coach_dob,
                coach_address: coach.coach_address,
                detail_experience: coach.detail_experience,
                coach_rating: coach.coach_rating,
                domains: coach.domains,
                coach_languages: coach.coach_languages,
                coach_charges: coach.coach_charges,
                coach_currency: coach.coach_currency,
                coach_available: coach.coach_available
            }
        };

        res.status(200).json(coachDetails);
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
exports.getCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find({}, '_id coach_name rating domains languages charges currency available');
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

        res.status(200).json({ coaches: formattedCoaches });
    } catch (error) {
        res.status(500).json({ message: error.message });
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