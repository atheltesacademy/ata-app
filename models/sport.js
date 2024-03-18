const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
   
    sport_name: {
        type: mongoose.Schema.Types.ObjectId, 
        type: String,
        required: true,
        unique:true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Sport', sportSchema);
