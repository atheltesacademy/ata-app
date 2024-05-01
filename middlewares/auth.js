const jwt = require('jsonwebtoken');
const Session = require('../models/session');
const bcrypt = require('bcrypt');

const generateToken = (session) => {
    return jwt.sign({ id: session._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
const auth = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // Find the session based on email
        const session = await Session.findOne({ email }).lean().populate('user_id');
        if (!session) {
            throw new Error('Email is not registered');
        }
        // Compare password using bcrypt
        const isPasswordMatch = await bcrypt.compare(password, session.password);
        if (!isPasswordMatch) {
            throw new Error('Invalid password');
        }
        // Generate and attach the JWT token to the request object
        req.session = session;
        req.token = generateToken(session);

        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = auth;