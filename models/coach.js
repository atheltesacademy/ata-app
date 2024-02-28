const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
    coach_id: {
        type: String,
        required: true
      },
    coach_name: {
        type: String,
        required: true
    },
    coach_phone: {
        type: String,
        required: true
    },
    coach_dob: {
        type: String,
        required: true
    },
    coach_address: {
        type: String,
        required: true
    },
    coach_detail_experience: {
        type: String,
        required: [true, 'Detail experience is required']
    },
    coach_domains: {
        type: [String],
        required: true
      },
    coach_rating: {
        type: Number, 
    },
    coach_languages: {
        type: [String],
        required: true
    },
    coach_charges: {
        type: Number,
        required: true
    },
    coach_currency: {
        type: String,
        required: true
    },
    coach_available: {
        type: Boolean,
        required: true
    },
    sport_name: {
        type: [String],
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Coach', coachSchema);
