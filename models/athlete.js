const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const athleteSchema = new mongoose.Schema({
  email:{ type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
  loggedIn: { 
    type: Boolean, default: false 
  },
});

athleteSchema.pre("save", async function (next) {
      if (this.isModified("password")) {
          this.password = await bcrypt.hash(this.password, 10);
      }
      next();
  });
  
  athleteSchema.methods.matchPassword = async function (password) {
      return await bcrypt.compare(password, this.password);
  };
  
  athleteSchema.methods.generateToken = function () {
      return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  };
  
const Athlete = mongoose.model('Athlete', athleteSchema);

module.exports = Athlete;
