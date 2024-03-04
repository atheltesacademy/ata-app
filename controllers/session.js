const Session = require('../models/session');
const Athlete = require('../models/athlete');
const Coach = require('../models/coach');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjust expiry time as needed
};
exports.signup = async (req, res) => {
    try {
        // Ensure email, password, and confirmPassword are valid strings
        if (typeof req.body.email !== 'string' || typeof req.body.password !== 'string' || typeof req.body.confirmPassword !== 'string') {
            throw new Error('Invalid email or password');
        }

        // Check if password and confirmPassword match
        if (req.body.password !== req.body.confirmPassword) {
            throw new Error("Passwords do not match");
        }
        // Check if a session with the same email already exists
        const existingSession = await Session.findOne({ email: req.body.email });
        if (existingSession) {
            throw new Error("Email already exists");
        }
        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let newUser;
        if (req.body.userType === 'athlete') {
            // Create a new entry in the Athlete table
            newUser = new Athlete({ email: req.body.email, password: hashedPassword });
           
        } else if (req.body.userType === 'coach') {
            // Create a new entry in the Coach table
            newUser = new Coach({ email: req.body.email, password: hashedPassword });

        } else {
            throw new Error("Invalid user type");
        }
         // Save the new athlete or coach entry
         await newUser.save();
        // Generate JWT token
        const token = generateToken(newUser._id);

        const newSession = await Session.create({ email: req.body.email, user_id:newUser._id,access_token:token,user_type: req.body.user_type });
        // Save the new session to the database
        await newSession.save();
        res.status(201).json({ message: "Registration successful", user_type: req.body.userType, token, _id: newUser._id });
       
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.login = async (req, res) => {
    const { email, password, user_type } = req.body;
    try {
        // Find the session based on email
        const session = await Session.findOne({ email });
        if (!session) {
            throw new Error('No account registered with this email');
        }
        // Check if the user type in the session matches the request
        if (session.user_type !== user_type) {
            throw new Error('Invalid user type');
        }
        let user;
        // Query the athlete or coach database based only on the user_type from the session
        if (user_type === 'athlete') {
            user = await Athlete.findOne({ email: session.email });
        } else if (user_type === 'coach') {
            user = await Coach.findOne({ email: session.email });
        }
        if (!user) {
            throw new Error(`No ${user_type} account registered with this email`);
        }
        // Compare password using bcrypt
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error('Invalid password');
        }
        // Generate JWT token
        const token = jwt.sign({ user_id: user._id, email }, process.env.JWT_SECRET);

        res.status(200).json({
            message: 'User logged in successfully',
            user_id: user._id.toString(),
            user_type, // Set user_type based on the session
            access_token: token
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
exports.logout = async (req, res) => {
    try {
        const { session } = req;
        if (!session) throw new Error('Session not found');

        // Set loggedIn to false
        session.loggedIn = false;
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const { session } = req;
        if (!session) throw new Error('Unauthorized user!');

        // Query the athlete or coach database based on user_type from the session
        let user;
        if (session.user_type === 'athlete') {
            user = await Athlete.findById(session.user_id);
        } else if (session.user_type === 'coach') {
            user = await Coach.findById(session.user_id);
        }

        if (!user) {
            throw new Error('User not found');
        }

        if (!oldPassword || !newPassword) {
            throw new Error('Both old and new passwords are required');
        }

        // Compare old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordMatch) throw new Error('Old password is incorrect');

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
