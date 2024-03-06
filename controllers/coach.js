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
exports.detailsCoachlist = async (req, res) => {
    try {
        const { coach_name, coach_phone, coach_dob, coach_address, domains, coach_rating, coach_languages, coach_charges, coach_currency, coach_available, sport_name } = req.body;

         // Check if coach email already exists
         const existingCoach = await Coach.findOne({ coach_phone });

         if (existingCoach) {
             throw new Error("Coach with this phone number already exists");
         }
        // Create new coach details list entry
        const newCoach = await Coach.create({ coach_phone, coach_address, coach_dob, coach_name, domains,coach_rating, coach_languages, coach_charges, coach_currency, coach_available, sport_name });

        res.status(201).json({
            message: "Coach details list is here",
            coach_id: newCoach._id.toString(),
            coach_phone,
            coach_address,
            coach_dob,
            coach_name,
            domains,
            coach_rating,
            coach_languages,
            coach_charges,
            coach_currency,
            coach_available,
            sport_name

        });
    } catch (error){
    (error.code === 11000 && error.keyPattern && error.keyPattern.email)
     {
        res.status(400).json({ message: error.message });
    }}
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
            rating: coach.rating,
            domains: coach.domains,
            languages: coach.languages,
            charges: coach.charges,
            currency: coach.currency,
            available: coach.available
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
                phone: coach.phone,
                dob: coach.dob,
                address: coach.address,
                detail_experience: coach.detail_experience,
                rating: coach.rating,
                domains: coach.domains,
                languages: coach.languages,
                charges: coach.charges,
                currency: coach.currency,
                available: coach.available
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
            rating: coach.rating,
            domains: coach.domains,
            languages: coach.languages,
            charges: coach.charges,
            currency: coach.currency,
            available: coach.available
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