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
exports.updateAthleteDetails = async (req, res) => {
  try {
      const { email, phone, name, dob, address, alternative_contact, health_height_desc } = req.body;
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
                  updated_at: Date.now() // Update the updated_at field
              },
              { new: true }
          );

          res.status(200).json({ message: "Athlete details updated successfully", athlete: existingAthlete });
      } else {
          res.status(400).json({ error: "Athlete with this email does not exist" });
      }
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

