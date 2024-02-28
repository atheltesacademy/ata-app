const Athlete = require('../models/athlete');
const Session = require('../models/session'); // Assuming you have a Session model for authentication

exports.details = async (req, res) => {
  try {
    const { name, phone, dob, address, alternative_contact, health_height_desc } = req.body;

    // Retrieve session data for authentication
    const { email, user_type } = req.session;

    let athlete;

    // Find the athlete by email if the user is an athlete
    if (user_type === 'athlete') {
      athlete = await Athlete.findOne({ email });
      if (!athlete) {
        // Create a new athlete if not found
        athlete = new Athlete();
        athlete.email = email; // Set athlete email from session
      }
    } else {
      throw new Error("Unauthorized access"); // Only athletes are allowed to update their details
    }

    // Update athlete details
    athlete.name = name;
    athlete.phone = phone;
    athlete.dob = dob;
    athlete.address = address;
    athlete.alternative_contact = alternative_contact;
    athlete.health_height_desc = health_height_desc;

    // Save the athlete
    await athlete.save();
    // Send response with athlete details
    res.status(201).json({ message: "Athlete details updated successfully", athlete });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAthleteId = async (req, res) => {
  try {
    // Retrieve session data for authentication
    const { email, user_type } = req.session;

    // Validate user access
    if (user_type !== 'coach') {
      throw new Error("Unauthorized access"); // Only coaches are allowed to update athlete IDs
    }

    const { athlete_id } = req.body;

    // Validate athlete_id
    if (!mongoose.Types.ObjectId.isValid(athlete_id)) {
      throw new Error('Invalid Athlete ID');
    }
    // Update the user document with the athlete_id
    await Session.updateOne(
      { email: email }, // Assuming email uniquely identifies the coach
      { $push: { athlete: athlete_id } }
    );
    res.send('Athlete ID added successfully to the document');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
