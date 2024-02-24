const Coach = require('../models/coach');

exports.detailsCoach = async (req, res) => {
    try {
        const { coach_name, coach_phone, coach_dob, coach_address, coach_domains, coach_detail_experience, user_type } = req.body;
        const newCoach = await Coach({ coach_name, coach_phone, coach_dob, coach_address, coach_domains, coach_detail_experience, user_type });
        res.status(201).json({
            message: "Coach details registered successfully",
            coach_id: newCoach._id.toString(),
            user_type: newCoach.user_type
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
