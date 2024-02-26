const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  try {
    // Extract athlete ID or any token from the request (e.g., from headers, cookies, etc.)
    const athleteId = req.headers['authorization']; 
    if (!athleteId) {
      throw new Error('Unauthorized');
    }

    // Find the athlete based on the athleteId
    const athlete = await Athlete.findById(athleteId);
    if (!athlete) {
      throw new Error('Athlete not found');
    }

    // Attach the athlete object to the request object
    req.athlete = athlete;

    next(); 
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = authenticate;