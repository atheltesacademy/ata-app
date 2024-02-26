const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const sessionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Athlete', // Reference to the Athlete collection
        required: true
    },
    user_type: {
        type: String,
        enum: ['coach', 'athlete'],
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Session', sessionSchema);
