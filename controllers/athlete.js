const Athlete = require('../models/athlete');

// @TODO: Only be accessible to the user whose session/access_token is of admin role...
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
    res.status(201).json({ message: "Athlete created successfully", athlete_id: athlete._id, athlete: athlete });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
      res.status(400).json({ error: error.message });
    }
  }
};
exports.detailAthlete = async (req, res) => {
  try {
    const { athlete_id,email, name, phone, dob, address,alternative_contact,health_height_desc,user_type } = req.body;

    // Check if an athlete with the provided email already exists
    const existingAthlete = await Athlete.findOne({ email });

    if (existingAthlete) {
      // Update the athlete details
      existingAthlete.athlete_id = athlete_id; // Include athlete ID
      existingAthlete.name = name;
      existingAthlete.phone = phone;
      existingAthlete.dob = dob;
      existingAthlete.address = address;
      existingAthlete.health_height_desc = health_height_desc;
      existingAthlete. alternative_contact=  alternative_contact;
      existingAthlete.user_type = user_type;

      // Save the updated athlete details
      await existingAthlete.save();

      res.status(200).json({ message: "Athlete details updated successfully", athlete_id: existingAthlete._id, athlete: existingAthlete });
    } else {
      res.status(404).json({ error: "Athlete with the provided email does not exist" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Controller function to get all athletes
exports.getAllAthletes = async (req, res) => {
  try {
    // Retrieve all athletes from the database
    const athletes = await Athlete.find();

    if (athletes.length === 0) {
      return res.status(404).json({ msg: "No records found" });
    }

    res.status(200).json({ athletes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAthleteDetails = async (req, res) => {
  try {
      const { email, phone, name, dob, address, alternative_contact, health_height_desc, } = req.body;
      let existingAthlete = await Athlete.findOne({ email });

      if (existingAthlete) {
          existingAthlete = await Athlete.findOneAndUpdate(
              { email },
              {
                  phone,
                  name,
                  dob,
                  address,
                  alternative_contact,
                  health_height_desc,
                  updated_at: Date.now() 
              },
              { new: true }
          );

          res.status(200).json({ message: "Athlete details updated successfully", athlete: existingAthlete });
      } else {
          res.status(404).json({ error: "Athlete with this email does not exist" });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

