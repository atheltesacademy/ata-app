const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
    coach_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String },
    phone: {
        type: String,
    },
    coach_dob: {
        type: String,
    },
    coach_address: {
        type: String,
    },
    coach_detail_experience: {
        type: String,
    },
    coach_domains: {
        type: [String],
    },
    coach_rating: {
        type: Number,
    },
    coach_languages: {
        type: [String],
    },
    coach_charges: {
        type: Number,
    },
    coach_currency: {
        type: String,
    },
    coach_available: {
        type: Boolean,
    },
    sport_name: {
        type: [String],
    }
}, { timestamps: true });


coachSchema.index({ email: 1 }, { unique: true }); // Unique index on email field

module.exports = mongoose.model('Coach', coachSchema);
