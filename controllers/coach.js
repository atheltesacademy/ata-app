const Coach = require('../models/coach');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, dob, address, rating, languages, charges, currency, available, sports } = req.body;
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        const newCoach = await Coach.create({ name, email, password, phone, dob, address, rating, languages, charges, currency, available, sports });
        res.status(201).json({ message: "Registration successful", coach_id: newCoach._id.toString() });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.detailsCoach = async (req, res) => {
    try {
        const { coach_id, name, phone, dob, address, rating, languages, charges, currency, available, sports } = req.body;

        let coach;

        // If coach_id is provided, find the coach by ID
        if (coach_id) {
            coach = await Coach.findById(coach_id);
            if (!coach) {
                throw new Error("Coach not found");
            }
        } else {
            // If coach_id is not provided, create a new coach
            coach = new Coach();
        }

        // Update coach details
        coach.name = name;
        coach.phone = phone;
        coach.dob = dob;
        coach.address = address;
        coach.rating = rating;
        coach.languages = languages;
        coach.charges = charges;
        coach.currency = currency;
        coach.available = available;
        coach.sports = sports;

        // Provide dummy values for password and email
        coach.password = 'dummyPassword';
        coach.email = 'dummy@example.com';

        // Save the coach
        await coach.save();

        // Send response with coach details
        res.status(201).json({ message: "Coach details updated successfully", coach });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.detailsCoachlist = async (req, res) => {
    try {
        const { coach_id, name, rating, languages, charges, currency, available, sports } = req.body;
        const newCoach = await Coach.create({ coach_id, name, rating, languages, charges, currency, available, sports });
        res.status(201).json({
            message: "Coach details list is here",
            coach_id: newCoach._id.toString(),
            name: newCoach.name,
            rating: newCoach.rating,
            languages: newCoach.languages,
            charges: newCoach.charges,
            currency: newCoach.currency,
            available: newCoach.available,
            sports: newCoach.sports
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all coaches
exports.getAllCoacheslist = async (req, res) => {
    try {
        const coaches = await Coach.find();
        res.status(200).json({ success: true, coaches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new coach
exports.createCoach = async (req, res) => {
    try {
        const coach = await Coach.create(req.body);
        res.status(201).json({ success: true, coach });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all coaches
exports.getAllCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find();
        res.status(200).json({ success: true, coaches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get coach by ID
exports.getCoachById = async (req, res) => {
    try {
        const coach = await Coach.findById(req.params.id);
        if (!coach) {
            return res.status(404).json({ success: false, message: 'Coach not found' });
        }
        res.status(200).json({ success: true, coach });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update coach by ID
exports.updateCoachById = async (req, res) => {
    try {
        const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!coach) {
            return res.status(404).json({ success: false, message: 'Coach not found' });
        }
        res.status(200).json({ success: true, coach });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete coach by ID
exports.deleteCoachById = async (req, res) => {
    try {
        const coach = await Coach.findByIdAndDelete(req.params.id);
        if (!coach) {
            return res.status(404).json({ success: false, message: 'Coach not found' });
        }
        res.status(200).json({ success: true, message: 'Coach deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
