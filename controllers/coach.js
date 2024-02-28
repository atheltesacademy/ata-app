const Coach = require('../models/coach');
const Coacheslist = require('../models/coacheslist'); // Assuming you have a model for storing coach details list


exports.detailsCoach = async (req, res) => {
    try {
        const { coach_id, name, phone, dob, address, languages, charges, currency, available, sports } = req.body;

        // Retrieve session data for authentication
        const { email, user_type } = req.session;

        let coach;

        // Ensure that only coaches can access coach details page
        if (user_type !== 'coach') {
            throw new Error("Unauthorized access"); // Only coaches are allowed to access coach details
        }

        // Find the coach by ID
        if (coach_id) {
            coach = await Coach.findById(coach_id);
            if (!coach) {
                throw new Error("Coach not found");
            }
        } else {
            // Create a new coach if coach_id is not provided
            coach = new Coach();
            coach.email = email; // Set coach email from session
        }

        // Update coach details
        coach.name = name;
        coach.phone = phone;
        coach.dob = dob;
        coach.address = address;
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
        const { coach_id, coach_name, coach_rating, coach_languages, coach_charges, coach_currency, coach_available, sport_name } = req.body;
        
        // Retrieve session data for authentication
        const {  user_type } = req.session;

        // Ensure that only coaches or athletes can access coach details list page
        if (user_type !== 'coach' && user_type !== 'athlete') {
            throw new Error("Unauthorized access"); // Only coaches or athletes are allowed to access coach details list
        }

        // Create new coach details list entry
        const newCoach = await Coacheslist.create({ coach_id, coach_name, coach_rating, coach_languages, coach_charges, coach_currency, coach_available, sport_name, user_type });

        res.status(201).json({
            message: "Coach details list is here",
            coach_id: newCoach._id.toString(),
            user_type: newCoach.user_type
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllCoacheslist = async (req, res) => {
    try {
        const coaches = await Coacheslist.find();
        res.status(200).json({ success: true, coaches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
