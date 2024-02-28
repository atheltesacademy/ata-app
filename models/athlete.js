const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({
  email:{ type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  dob: { type: String, },
  address: { type: String },
  alternative_contact: { type: String },
  health_height_desc: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  user_type: {
            type: String,
            enum: ['athlete', 'coach'],
            default: 'athlete', // Setting a default value
        },
 
});

const Athlete = mongoose.model('Athlete', athleteSchema);

module.exports = Athlete;
