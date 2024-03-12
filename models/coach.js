const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  coach_id: { type: mongoose.Schema.Types.ObjectId, 
    ref: 'coach', 
    type:String,},
  coach_name: { type: String },
  coach_phone: { type: String },
  coach_dob: { type: Date },
  coach_address: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  domains: { type: [String] },
  detail_experience: { type: String },
  coach_rating: { type: Number, default: 0 },
  coach_languages: [{ type: String }],
  coach_charges: [{ type: Number }],
  coach_currency: { type: String },
  coach_available: { type: Boolean, default: false,},
  sport_name: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  user_type: {
    type: String,
    default: 'coach',
  },
});

// Define index for email and coach_id
coachSchema.index({ email: 1 }, { unique: true });
coachSchema.index({ coach_id: 1 }, { unique: true });

module.exports = mongoose.model('Coach', coachSchema);
