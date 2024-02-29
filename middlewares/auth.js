// const jwt = require('jsonwebtoken');
const Session = require('../models/session');
const bcrypt = require('bcrypt');

const auth = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Find the session based on email
    const session = await Session.findOne({ email });
    if (!session) {
      throw new Error('Invalid credentials');
    }
    // Compare password using bcrypt
    const isPasswordMatch = await bcrypt.compare(password, session.password);
    if (!isPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    // Attach the session object to the request object
    req.session = session;

    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = auth;
