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
        const { email, password, confirmPassword, user_type } = req.body;
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        // Check if a session with the same email already exists
        const existingSession = await Session.findOne({ email });
        if (existingSession) {
            throw new Error("Email already exists");
        }
        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        const newSession = await Session.create({ email, password: hashedPassword, user_type });
        // Save the new session to the database
        await newSession.save();

        // Generate JWT token
        const token = generateToken(newSession._id);

        let newUser;
        if (user_type === 'athlete') {
            // Create a new entry in the Athlete table
            newUser = new Athlete({ email, password: hashedPassword });
            // Save the new athlete entry
            await newUser.save();

            res.status(201).json({ message: "Registration successful", user_type: "athlete", token, _id: newUser._id });
        } else if (user_type === 'coach') {
            // Create a new entry in the Coach table
            newUser = new Coach({ email, password: hashedPassword });

            // Save the new coach entry
            await newUser.save();
            res.status(201).json({ message: "Registration successful", user_type: "coach", token, _id: newUser._id });
        } else {
            throw new Error("Invalid user type");
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the session based on email
        const session = await Session.findOne({ email });
        if (!session) {
            throw new Error('User not found');
        }

        // Compare password using bcrypt
        const isPasswordMatch = await bcrypt.compare(password, session.password);
        if (!isPasswordMatch) {
            throw new Error('Invalid password');
        }

        // Generate JWT token
        const token = jwt.sign({ user_id: session.user_id, email }, process.env.JWT_SECRET);

        res.status(200).json({
            message: 'User logged in successfully',
            user_id: session.user_id.toString(),
            user_type: session.user_type,
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
        await session.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const { session } = req;
        if (!session) throw new Error('Session not found');

        console.log('oldPassword:', oldPassword);
        console.log('session.password:', session.password);

        if (!oldPassword || !newPassword) {
            throw new Error('Both old and new passwords are required');
        }
        // Ensure oldPassword and session.password are valid strings
        if (typeof oldPassword !== 'string' || typeof session.password !== 'string') {
            throw new Error('Invalid password data');
        }
        // Compare old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, session.password);
        if (!isPasswordMatch) throw new Error('Old password is incorrect');

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password field
        session.password = hashedNewPassword;
        await session.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

