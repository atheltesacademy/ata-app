const mongoose = require('mongoose');

const coacheslistSchema = new mongoose.Schema({
  coach_id: {
    type: String,
    required: true
  },
  coach_name: {
    type: String,
    required: true
  },
  coach_rating: {
    type: Number,
    required: true
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
    type: String,
    required: true
  }
});

 module.exports = mongoose.model('Coacheslist', coacheslistSchema);
