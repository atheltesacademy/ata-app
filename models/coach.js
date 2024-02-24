const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
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
      }
    // rating: {
    //     type: Number,
    //     required: true
    // },
    // languages: {
    //     type: [String],
    //     required: true
    // },
    // charges: {
    //     type: Number,
    //     required: true
    // },
    // currency: {
    //     type: String,
    //     required: true
    // },
    // available: {
    //     type: Boolean,
    //     required: true
    // },
    // sports: {
    //     type: [String],
    //     required: true
    // }
}, { timestamps: true });

module.exports = mongoose.model('Coach', coachSchema);
