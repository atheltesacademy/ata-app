const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  coach_name: { type: String, },
  coach_phone: { type: String },
  coach_dob: { type: Date },
  coach_address: { type: String },
  email: { type: String, required: true, unique: true },
  coach_rating: { type: Number },
  coach_languages: [{ type: String }],
  coach_charges: { type: Number },
  coach_currency: { type: String },
  coach_available: { type: Boolean },
  sport_name: { type: String },
});

module.exports = mongoose.model('Coach', coachSchema);
