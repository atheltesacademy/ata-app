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
    const { email, password } = req.body;
    try {
        // Ensure email and password are valid strings
        if (typeof email !== 'string' || typeof password !== 'string') {
            throw new Error('Invalid email or password');
        }

        // Find the session based on email
        const session = await Session.findOne({ email });
        if (!session) {
            throw new Error('no account registered with this email ');
        }
        // Compare password using bcrypt
        const isPasswordMatch = await bcrypt.compare(password, session.password);
        if (!isPasswordMatch) {
            throw new Error('Invalid password');
        }
        //@TODO: check for expiry tokens
        // Generate JWT token
        const token = jwt.sign({ user_id: session._id, email }, process.env.JWT_SECRET);
        
        const newSession = await Session.create({ email: req.body.email, user_id:newUser._id,access_token:token,user_type: req.body.user_type });
        // Save the new session to the database
        await newSession.save();

        res.status(200).json({
            message: 'User logged in successfully',
            user_id: session._id.toString(),
            user_type: session.user_type, // Set user_type based on the session
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
        if (!session) throw new Error('unauthorized user!');

        // Logging the newPassword and session.password
        console.log('newPassword:', newPassword);
        console.log('session.password:', session.password);

        // // Saving the logs in the database
        // await Log.create({
        //     message: `New password: ${newPassword}, Session password: ${session.password}`,
        //     createdAt: new Date()
        // });

        if (!oldPassword || !newPassword) {
            throw new Error('Both old and new passwords are required');
        }
        // Ensure oldPassword and session.password are valid strings
        //check with parsing as well-sql injection
        if (typeof oldPassword !== 'string' || typeof session.password !== 'string') {
            throw new Error('Invalid password data');
        }
        // Compare old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, session.password);
        if (!isPasswordMatch) throw new Error('Old password is incorrect');

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};