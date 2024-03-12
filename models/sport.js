const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
    sport_id: {
        type: String, 
        unique: true
    },
    sport_name: {
        type: String,
        required: true,
        unique:true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Sport', sportSchema);