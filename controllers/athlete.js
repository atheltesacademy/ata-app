const Athlete = require('../models/athlete');

//ToDo only be accessible to the user whose session/access_token is of admin role...
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

