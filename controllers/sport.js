const mongoose = require('mongoose');
const Sport = require('../models/sport');

exports.createSport = async (req, res) => {
    try {
        const { sport_name } = req.body;
        // Check if a sport with the same name already exists (case-insensitive)
        const existingSport = await Sport.findOne({ sport_name: { $regex: new RegExp(`^${sport_name}$`, 'i') } });

        if (existingSport) {
            return res.status(400).json({ success: false, message: 'Sport already exists' });
        }
        // Create the new sport with the provided details
        const sport = await Sport.create({ sport_name });

        // Return the newly created sport with success status and sport ID
        res.status(201).json({ success: true, sport });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSportsByName = async (req, res) => {
    try {
        const { sportName } = req.params;

        // Find sports by name (case-insensitive)
        const sports = await Sport.find({ sport_name: { $regex: new RegExp(`^${sportName}$`, 'i') } });

        if (sports.length === 0) {
            return res.status(404).json({ success: false, message: 'No sports found with the provided name' });
        }

        res.status(200).json({ success: true, sports });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllSports = async (req, res) => {
    try {
        const sports = await Sport.find();

        if (sports.length === 0) {
            return res.status(404).json({ success: false, message: 'No sports found' });
        }

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
        res.status(200).json({ success: true, message: 'Sport deleted successfully', sport});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
