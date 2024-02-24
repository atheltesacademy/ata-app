
const Athlete = require("../models/athlete");

exports.details = async (req, res) => {
    try {
        const { name, phone, dob, address, domains, detail_experience, user_type } = req.body;
        const newAthlete = await Athlete.create({ name, phone, dob, address, domains, detail_experience, user_type });
        res.status(201).json({
            message: "Athlete details registered successfully",
            athlete_id: newAthlete._id.toString(),
            user_type: newAthlete.user_type
        });
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
