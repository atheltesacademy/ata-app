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

// Middleware to check token validity
function checkTokenValidity(req, res, next) {
    // Get the token from the request headers or cookies
    const token = req.headers.authorization.split(' ')[1];
    // Check if the token is in the blacklist (pseudo code)
    if (blacklist.includes(token)) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    // Verify the token (if needed) and proceed
    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded; // Set user information for subsequent middleware or routes
        next();
    });
}

module.exports = {
    auth,
    checkTokenValidity
};