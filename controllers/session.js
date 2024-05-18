const Athlete = require("../models/athlete");
const Coach = require("../models/coach");
const Wallet = require("../models/wallet");
const Session = require("../models/session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Adjust expiry time as needed
};
exports.signup = async (req, res) => {
  try {
    // Ensure email, password, and confirmPassword are valid strings
    if (
      typeof req.body.email !== "string" ||
      typeof req.body.password !== "string" ||
      typeof req.body.confirmPassword !== "string"
    ) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    // Check if password and confirmPassword match
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    // Check if a session with the same email already exists
    const existingSession = await Session.findOne({ email: req.body.email });
    if (existingSession) {
      // throw new Error("This email already exists");
      return res.status(400).json({ error: "This email already exists" });
    }
    // Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let newUser;
    if (req.body.userType === "athlete") {
      // Create a new entry in the Athlete table with default ObjectId as _id
      newUser = new Athlete({
        email: req.body.email,
        password: hashedPassword,
      });

      // Create a new wallet entry for the athlete with an initial amount of $100
      const wallet = new Wallet({ athlete_id: newUser._id, amount: 100 });
      await wallet.save();
    } else if (req.body.userType === "coach") {
      // Create a new entry in the Coach table, letting MongoDB generate _id automatically
      newUser = new Coach({ email: req.body.email, password: hashedPassword });
    } else {
      throw new Error("Invalid user type");
    }

    // Save the new athlete or coach entry
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Create a new session
    const newSession = await Session.create({
      email: req.body.email,
      user_id: newUser._id,
      access_token: token,
      user_type: req.body.userType,
    });
    // Save the new session to the database
    await newSession.save();

    // Send the response with the token and user ID
    return res
      .status(201)
      .json({
        message: "Registration successful",
        user_type: req.body.userType,
        access_token: token,
        user_id: newUser._id,
        email: newUser.email,
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the session based on email
    const session = await Session.findOne({ email });
    if (!session) {
      return res
        .status(404)
        .json({ error: "No account registered with this email" });
    }

    let user;
    // Query the athlete or coach database based only on the user_type from the session
    if (session.user_type === "athlete") {
      user = await Athlete.findOne({ email: session.email });
    } else if (session.user_type === "coach") {
      user = await Coach.findOne({ email: session.email });
    }
    if (!user) {
      return res
        .status(404)
        .json({ error: "No account registered with this email" });
    }

    // Compare password using bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new Error("Wrong password");
    }

    // Check for existing session and update or create accordingly
    let existingSession = await Session.findOne({ email: user.email });

    if (!existingSession) {
      // Generate JWT token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_SECRET
      );

      // Create a new session
      const newSession = new Session({
        email: user.email,
        user_type: session.user_type,
        access_token: token,
        user_id: user._id,
      });
      await newSession.save();
      existingSession = newSession;
    }

    res.status(200).json({
      message: "User logged in successfully",
      user_id: user._id.toString(),
      access_token: existingSession.access_token,
      user_type: session.user_type,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.logout = async (req, res) => {
  try {
    const { email, user_type } = req.body;

    // Check if all required parameters are provided
    if (!email || !user_type) {
        return res.status(400).json({ error: "All fields (email, user_type) are required"})
    }

    // Invalidate the session by updating the 'invalidated' field
    await Session.updateOne({ email, user_type }, { invalidated: true });

    res
      .status(200)
      .json({ message: "User logged out successfully", user_id: "string" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { email, old_password, new_password } = req.body;
  try {
    // Check if all required parameters are provided
    if (!email || !old_password || !new_password) {
      return res.status(400).json({error: "All fields (email, old_password, new_password) are required"})
    }

    let user;

    // Find the user based on email
    const athlete = await Athlete.findOne({ email });
    const coach = await Coach.findOne({ email });

    // Check if the user is an athlete or a coach
    if (athlete) {
      user = athlete;
    } else if (coach) {
      user = coach;
    } else {
      return res.status(404).json({error: "No account registered with this email"})
    }

    // Compare old password
    const isPasswordMatch = await bcrypt.compare(old_password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({error: "Old password entered was incorrect!"})
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.signupDetails = async (req, res) => {
  try {
    const { email, user_type } = req.body;

    // Check if the email exists in the session database
    const existingSession = await Session.findOne({ email });

    if (!existingSession) {
      return res
        .status(400)
        .json({ error: "Email not found in session database" });
    }

    // Check if the provided user_type matches the one in the session
    if (existingSession.user_type !== user_type) {
      return res
        .status(400)
        .json({
          error: "Provided user type does not match the one in session",
        });
    }

    // Check if the user type is athlete
    if (user_type === "athlete") {
      const {
        name,
        phone,
        dob,
        address,
        alternative_contact,
        health_height_desc,
      } = req.body;

      // Check if the email exists in the Athlete database
      let existingAthlete = await Athlete.findOne({ email });

      if (existingAthlete) {
        // Update the existing athlete's details
        existingAthlete = await Athlete.findOneAndUpdate(
          { email },
          {
            name,
            phone,
            dob,
            address,
            alternative_contact,
            health_height_desc,
          },
          { new: true }
        );
        return res
          .status(200)
          .json({
            message: "Athlete details updated successfully",
            user_id: existingAthlete._id,
            user_type,
          });
      } else {
        return res.status(401).json({ error: "Unauthorized user" });
      }
    } else if (user_type === "coach") {
      const {
        coach_name,
        coach_phone,
        coach_dob,
        coach_address,
        domains,
        coach_languages,
        detail_experience,
      } = req.body;

      // Check if the email exists in the Coach database
      let existingCoach = await Coach.findOne({ email });

      if (existingCoach) {
        // Update the existing coach's details
        existingCoach = await Coach.findOneAndUpdate(
          { email },
          {
            coach_name,
            coach_phone,
            coach_dob,
            coach_address,
            domains,
            coach_languages,
            detail_experience,
          },
          { new: true }
        );
        return res
          .status(200)
          .json({
            message: "Coach details updated successfully",
            user_id: existingCoach._id,
            user_type,
          });
      } else {
        return res.status(401).json({ error: "Unauthorized user" });
      }
    } else {
      return res.status(400).json({ error: "Invalid user type" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
