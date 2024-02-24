const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
    sport_name: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Sport', sportSchema);
