
const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    dob: {
        type: Date, // Consider using Date type for date fields
        required: [true, 'Date of birth is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    domains: {
        type: [String],
        // required: [true, 'At least one domain is required']
    },
    // detail_experience: {
    //     type: String,
    //     required: [true, 'Detail experience is required']
    // },
    // user_type: {
    //     type: String,
    //     enum: ['athlete', 'coach'],
    //     required: [true, 'User type is required']
    // },

    }, {
    timestamps: true // Add timestamps option
});
module.exports = mongoose.model('Athlete', athleteSchema);
