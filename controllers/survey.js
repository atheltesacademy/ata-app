const Survey = require('../models/survey');
const Athlete = require('../models/athlete');

// Submit a new survey
exports.submitSurvey = async (req, res) => {
    try {
        const { email, budget, chargeMethod, communicationMethod } = req.body;

        // Check if the email exists
        const athleteExists = await Athlete.exists({ email });
        if (!athleteExists) {
            return res.status(404).json({ success: false, message: 'Athlete not found' });
        }

        const survey = await Survey.create({ email, budget, chargeMethod, communicationMethod });
        res.status(201).json({ success: true, survey });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get survey by email
exports.getSurveyByEmail = async (req, res) => {
    try {
        const survey = await Survey.findOne({ email: req.body.email });
        if (!survey) {
            return res.status(404).json({ success: false, message: 'Survey not found' });
        }
        res.status(200).json({ success: true, survey });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all surveys
exports.getAllSurveys = async (req, res) => {
    try {
        const surveys = await Survey.find();
        res.status(200).json({ success: true, surveys });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
