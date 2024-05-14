const mongoose = require('mongoose');

const athleteSchema = new mongoose.Schema({
  athlete_id:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'athlete', 
    type:String,
  },
  email: { type: String, required: true,unique:true},
  password:{type:String,},
  phone: { type: String,},
  name: { type: String, },
  dob: { type: String, },
  address: { type: String },
  alternative_contact: { type: String },
  health_height_desc: { type: String },
  image_url: { type: String,required:true }, 
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  
});

athleteSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Athlete', athleteSchema);