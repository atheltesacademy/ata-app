const Session = require('../models/session');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Adjust expiry time as needed
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone, user_type } = req.body;

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

        // Create a new session with the hashed password
        const newSession = await Session.create({ name, email, password: hashedPassword, phone, user_type });

        // Generate JWT token
        const token = generateToken(newSession._id);

        // If user_type is athlete or coach, redirect to respective pages
        if (user_type === 'athlete') {
            // Redirect to athlete page
            res.status(201).json({ message: "Registration successful", redirect: "/athlete", token });
        } else if (user_type === 'coach') {
            // Redirect to coach page
            res.status(201).json({ message: "Registration successful", redirect: "/coach", token });
        } 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const session = await Session.findOne({ email });
        if (!session) throw new Error('Requested user does not exist.');

        // Compare hashed password using bcrypt
        const isPasswordMatch = await bcrypt.compare(password, session.password);
        if (!isPasswordMatch) throw new Error('Invalid password');

        // Generate JWT token
        const token = generateToken(session._id);

        // Assuming you want to set loggedIn to true in session
        session.loggedIn = true;
        await session.save();

        res.status(200).json({ message: 'Login successful', token });
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
