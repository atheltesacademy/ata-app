const Athlete = require('../models/athlete');

exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, user_type } = req.body;
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const newAthlete = await Athlete.create({ name, email, password, phone, user_type });
    res.status(201).json({ message: "Registration successful", athlete_id: newAthlete._id.toString() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const athlete = await Athlete.findOne({ email });
    if (!athlete) throw new Error('Invalid email or password');
    if (athlete.password !== password) throw new Error('Invalid email or password');
    athlete.loggedIn = true;
    await athlete.save();
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
exports.details = async (req, res) => {
  try {
    const { athlete_id, name, phone, dob, address, alternative_contact, health_height_desc, user_type } = req.body;
    
    let athlete;

    // If athlete_id is provided, find the athlete by ID
    if (athlete_id) {
      athlete = await Athlete.findById(athlete_id);
      if (!athlete) {
        throw new Error("Athlete not found");
      }
    } else {
      // If athlete_id is not provided, create a new athlete
      athlete = new Athlete();
      user_type
      // athlete.user_type = user_type;
    }

    // Update athlete details
    athlete.name = name;
    athlete.phone = phone;
    athlete.dob = dob;
    athlete.address = address;
    athlete.alternative_contact = alternative_contact;
    athlete.health_height_desc = health_height_desc;
    // Provide dummy values for password and email
    athlete.password = 'dummyPassword';
    athlete.email = 'dummy@example.com';

    // Save the athlete
    await athlete.save();

    // Send response with athlete details
    res.status(201).json({ message: "Athlete details updated successfully", athlete });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



exports.logout = async (req, res) => {
  try {
    req.athlete.loggedIn = false;
    await req.athlete.save();
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    if (oldPassword === newPassword) throw new Error('New password must be different from the old one');
    const athlete = req.athlete;
    if (athlete.password !== oldPassword) throw new Error('Old password is incorrect');
    athlete.password = newPassword;
    await athlete.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAthleteId = async (req, res) => {
  try {
    const { email, athlete_id } = req.body;
    
    // Validate athlete_id
    if (!mongoose.Types.ObjectId.isValid(athlete_id)) {
      throw new Error('Invalid Athlete ID');
    }

    // Update the user document with the athlete_id
    await chatHistoryModel.updateOne(
      { email: email },
      { $push: { athlete: athlete_id } }
    );

    res.send('Athlete ID added successfully to the user document');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};