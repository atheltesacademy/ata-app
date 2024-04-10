const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  coach_name: { type: String },
  coach_phone: { type: String },
  coach_dob: { type: Date },
  coach_address: { type: String },
  email: { type: String, unique: true, required:true },
  password: { type: String },
  domains: { type: [String] },
  detail_experience: { type: String },
  coach_rating: { type: Number, default: 0 },
  coach_languages: [{ type: String }],
  coach_charges: { type: Number },
  coach_currency: { type: String },
  coach_available: { type: Boolean, default: false,},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  
});

// Define index for email 
coachSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Coach', coachSchema);
