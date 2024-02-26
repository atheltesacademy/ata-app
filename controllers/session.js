const Athlete = require('../models/athlete');
const Session = require('../models/session');


exports.createSession = async (req, res) => {
    try {
        const { user_id, user_type, access_token } = req.body;
        
        // Assuming you want to find the athlete based on some criteria like email
        const athlete = await Athlete.findOne({ email: req.body.email });

        if (!athlete) {
            return res.status(404).json({ error: 'Athlete not found' });
        }

        const newSession = await Session.create({ user_id, user_type, access_token });

        res.status(201).json({ newSession, athlete });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getAllSessions = async (req, res) => {
    try {
        const sessions = await Session.find();
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSession = async (req, res) => {
    try {
        const updatedSession = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedSession);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        await Session.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Athlete.findOne({ title: 'athlete' })
//     .populate('athlete_id') // Assuming 'athlete_id' is the field referencing the Athlete collection
//     .exec() 
//     .then(athlete => {
//         console.log('Athlete:', athlete);
//         // Handle the athlete object here
//     })
//     .catch(error => {
//         console.error(error);
//         // Handle errors here
//     });