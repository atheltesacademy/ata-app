
// const User = require("../model/User");
// const jwt = require("jsonwebtoken");

// exports.isAuthenticated = async (req,res,next) => {

//   const{token} = req.cookies;
//   if(!token){
//     return res.status(401).json({
//         message:"Please login first",
//     });
//   }  
//   const decoded = await jwt.verify(token,process.env.SECRET);
//   req.user = await User.findById(decoded._id);
//   next();
// };
// // authMiddleware.js

// const authenticateUser = async (req, res, next) => {
//     try {
//         // Extract token from request headers or cookies
//         const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in Authorization header

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Fetch user from database using decoded token
//         const user = await User.findById(decoded._id);

//         if (!user) {
//             throw new Error('User not found');
//         }

//         // Set authenticated user in request object
//         req.user = user;

//         // Call next middleware
//         next();
//     } catch (error) {
//         return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
// };

// module.exports = { authenticateUser };
// authMiddleware.js

// const jwt = require("jsonwebtoken");
// const User = require("../model/User");

// const authenticateUser = async (req, res, next) => {
//     try {
//         // Extract token from request headers or cookies
//         const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in Authorization header

//         if (!token) {
//             throw new Error('Token not provided');
//         }

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Fetch user from database using decoded token
//         const user = await User.findById(decoded._id);

//         if (!user) {
//             throw new Error('User not found');
//         }

//         // Set authenticated user in request object
//         req.user = user;

//         // Call next middleware
//         next();
//     } catch (error) {
//         return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }
// };

// module.exports = { authenticateUser };


const jwt = require('jsonwebtoken');
const User = require('../models/user');


const authenticateUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Token not provided');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            throw new Error('User not found');
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
};

module.exports = { authenticateUser };
