const Athlete = require('../models/athlete');
const Coach = require('../models/coach');
const Wallet = require('../models/wallet');
const Session = require('../models/session');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploadOnCloudinary } = require( '../utils/cloudinary');

// Function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.signup = async (req, res) => {
    try {
        const { email, password, confirmPassword, userType } = req.body;

        // Ensure email, password, and confirmPassword are valid strings
        if (typeof email !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string') {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if a session with the same email already exists
        const existingSession = await Session.findOne({ email });
        if (existingSession) {
            return res.status(400).json({ error: 'This email already exists' });
        }

        // Hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;
        if (userType === 'athlete') {
            // Create a new entry in the Athlete table with default ObjectId as _id
            newUser = new Athlete({ email, password: hashedPassword });

            // Create a new wallet entry for the athlete with an initial amount of $100
            const wallet = new Wallet({ athlete_id: newUser._id, amount: 100 });
            await wallet.save();
        } else if (userType === 'coach') {
            // Create a new entry in the Coach table, letting MongoDB generate _id automatically
            newUser = new Coach({ email, password: hashedPassword });
        } else {
            return res.status(400).json({ error: "Invalid user type" });
        }

        // Save the new athlete or coach entry
        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser._id);
        
        // Create and save the new session
        const newSession = new Session({ email, user_id: newUser._id, access_token: token, user_type: userType });
        await newSession.save();

        // Send the response with the token and user ID
        res.status(201).json({ message: "Registration successful", user_type: userType, token, user_id: newUser._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.signupDetails = async (req, res) => {
    try {
        const { email, user_type } = req.body;
        let image_url = null;

        // Check if the email exists in the session database
        const existingSession = await Session.findOne({ email });

        if (!existingSession) {
            return res.status(400).json({ error: "Email not found in session database" });
        }

        // Check if the provided user_type matches the one in the session
        if (existingSession.user_type !== user_type) {
            return res.status(400).json({ error: "Provided user type does not match the one in session" });
        }

        // Upload image to Cloudinary if file is present
        if (req.file) {
            const uploadResult = await uploadOnCloudinary(req.file.path);
            if (uploadResult) {
                image_url = uploadResult.url; // Get the URL of the uploaded image
            } else {
                return res.status(500).json({ error: "Image upload failed" });
            }
        }

        // Define user details object to be updated
        let userDetailsToUpdate;

        if (user_type === 'athlete') {
            const { name, phone, dob, address, alternative_contact, health_height_desc } = req.body;

            userDetailsToUpdate = {
                name,
                phone,
                dob,
                address,
                alternative_contact,
                health_height_desc,
                image_url // Include image URL in the update if available
            };
        } else if (user_type === 'coach') {
            const { coach_name, coach_phone, coach_dob, coach_address, domains, coach_languages, detail_experience } = req.body;

            userDetailsToUpdate = {
                coach_name,
                coach_phone,
                coach_dob,
                coach_address,
                domains,
                coach_languages,
                detail_experience,
                image_url // Include image URL in the update if available
            };
        } else {
            return res.status(400).json({ error: "Invalid user type" });
        }

        // Find the user based on email and update the details
        let updatedUser;
        if (user_type === 'athlete') {
            updatedUser = await Athlete.findOneAndUpdate(
                { email },
                userDetailsToUpdate,
                { new: true }
            );
        } else if (user_type === 'coach') {
            updatedUser = await Coach.findOneAndUpdate(
                { email },
                userDetailsToUpdate,
                { new: true }
            );
        }

        // Check if user exists and send response
        if (!updatedUser) {
            return res.status(401).json({ error: "Unauthorized user" });
        }

        // Send response with updated user details and image URL
        res.status(200).json({ message: `${user_type} details updated successfully`, user_id: updatedUser._id, user_type, image_url: updatedUser.image_url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find the session based on email
        const session = await Session.findOne({ email });
        if (!session) {
            return res.status(404).json({ error: 'No account registered with this email' });
        }

        let user;
        // Query the athlete or coach database based only on the user_type from the session
        if (session.user_type === 'athlete') {
            user = await Athlete.findOne({ email: session.email });
        } else if (session.user_type === 'coach') {
            user = await Coach.findOne({ email: session.email });
        }
        if (!user) {
            return res.status(404).json({ error: 'No account registered with this email' });
        }

        // Compare password using bcrypt
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new Error('Invalid password');
        }

        // Generate JWT token
        const token = generateToken(user._id);
        
        // Update existing session or create a new one
        let existingSession = await Session.findOneAndUpdate(
            { email: user.email },
            { access_token: token },
            { new: true }
        );

        if (!existingSession) {
            existingSession = new Session({
                email: user.email,
                user_type: session.user_type,
                access_token: token,
                user_id: user._id
            });
            await existingSession.save();
        }

        res.status(200).json({
            message: 'User logged in successfully',
            user_id: user._id.toString(),
            access_token: existingSession.access_token
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
            throw new Error('All fields (email, user_type) are required');
        }

        // Invalidate the session by updating the 'invalidated' field
        await Session.updateOne({ email, user_type }, { invalidated: true });

        res.status(200).json({ message: 'User logged out successfully', user_id: 'string' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    const { email, old_password, new_password } = req.body;
    try {
        // Check if all required parameters are provided
        if (!email || !old_password || !new_password) {
            throw new Error('All fields (email, old_password, new_password) are required');
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
            throw new Error('No account registered with this email');
        }

        // Compare old password
        const isPasswordMatch = await bcrypt.compare(old_password, user.password);
        if (!isPasswordMatch) {
            throw new Error('Old password is incorrect');
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(new_password, 10);

        // Update the user's password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
