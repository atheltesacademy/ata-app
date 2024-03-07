const Sport = require('../models/sport');

// Create Sport
exports.createSport = async (req, res) => {
    try {
        const { sport_name } = req.body;

        // Check if the sport name already exists
        const existingSport = await Sport.findOne({ sport_name });
        if (existingSport) {
            throw new Error('This sport already exists.');
        }

        // Create the new sport with the provided details
        const sport = await Sport.create({ sport_name });

        // Return the newly created sport with success status
        res.status(201).json({ success: true, sport });
    } catch (error) {
        // If there's an error, return an error message with the appropriate status code
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all sports
exports.getAllSports = async (req, res) => {
    try {
        const sports = await Sport.find();
        res.status(200).json({ success: true, sports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get sport by ID
exports.getSportById = async (req, res) => {
    try {
        const sport = await Sport.findById(req.params.id);
        if (!sport) {
            return res.status(404).json({ success: false, message: 'Sport not found' });
        }
        res.status(200).json({ success: true, sport });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update sport by ID
exports.updateSportById = async (req, res) => {
    try {
        const sport = await Sport.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!sport) {
            return res.status(404).json({ success: false, message: 'Sport not found' });
        }
        res.status(200).json({ success: true, sport });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete sport by ID
exports.deleteSportById = async (req, res) => {
    try {
        const sport = await Sport.findByIdAndDelete(req.params.id);
        if (!sport) {
            return res.status(404).json({ success: false, message: 'Sport not found' });
        }
        res.status(200).json({ success: true, message: 'Sport deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
