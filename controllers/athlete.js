const Athlete = require('../models/athlete');
const Session = require('../models/session');

// Controller function to get all athletes
exports.getAllAthletes = async (req, res) => {
  try {
    // Retrieve all athletes from the database
    const athletes = await Athlete.find();

    res.status(200).json({ athletes });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

