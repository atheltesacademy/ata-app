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
        const { coach_name, coach_phone, coach_dob, coach_address, email, coach_rating, coach_languages, coach_charges, coach_currency, coach_available, sport_name } = req.body;

        // Create new coach details list entry
        const newCoach = await Coach.create({ coach_phone, coach_address, coach_dob, coach_name, email, coach_rating, coach_languages, coach_charges, coach_currency, coach_available, sport_name });

        res.status(201).json({
            message: "Coach details list is here",
            coach_id: newCoach._id.toString(),
            coach_phone,
            coach_address,
            coach_dob,
            coach_name,
            email,
            coach_rating,
            coach_languages,
            coach_charges,
            coach_currency,
            coach_available,
            sport_name

        });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
