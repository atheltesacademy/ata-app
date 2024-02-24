const Coacheslist = require('../models/coacheslist'); // Assuming the model name is 'Coach'

exports.detailsCoachlist = async (req, res) => {
    try {
        const { coach_id,coach_name, coach_rating, coach_languages,coach_charges,coach_currency,coach_available,sport_name, user_type } = req.body;
        const newCoach = await Coacheslist.create({coach_id, coach_name, coach_rating,   coach_languages,coach_charges,coach_currency,coach_available,sport_name, user_type });
        res.status(201).json({
            message: "Coach details list is here",
            coach_id: newCoach._id.toString(),
            user_type: newCoach.user_type
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Get all coaches
exports.getAllCoacheslist = async (req, res) => {
    try {
        const coaches = await Coacheslist.find(); // Corrected model name to 'Coach'
        res.status(200).json({ success: true, coaches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
