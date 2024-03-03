const Athlete = require('../models/athlete');
const Session = require('../models/session');

// Controller function to create a new athlete
exports.createAthlete = async (req, res) => {
  try {
    const { name, phone, dob, address, alternative_contact, health_height_desc } = req.body;
    // Retrieve session data for authentication
    const { email, password } = req.session;
    // Find the athlete by email if the user is an athlete
    const session = await Session.findOne({ email, password }); // Find session by email and password
    if (!session) {
      throw new Error("Invalid session"); // Unauthorized access
    }

    // Fetch athlete's details
    athlete = await Athlete.findOne({ email: session.email }, 'email'); // Only retrieve email

    if (!athlete) {
      throw new Error("Athlete not found");
    }

    // Create new athlete instance
    const athlete = new Athlete({
      phone,
      name,
      dob,
      address,
      alternative_contact,
      health_height_desc
    });

    // Save the athlete to the database
    await athlete.save();

    res.status(201).json({ message: "Athlete created successfully", athlete });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      res.status(400).json({ error: error.message });
    }
  }
};
exports.detailAthlete = async (req, res) => {
  try {
    const { email, name, phone, dob, address, domains, detail_experience, user_type } = req.body;

    // Create new athlete instance
    const athlete = new Athlete({
      email,
      name,
      phone,
      dob,
      address,
      domains,
      detail_experience,
      user_type
    });

    // Save the athlete to the database
    await athlete.save();

    res.status(201).json({ message: "Athlete created successfully", athlete });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

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