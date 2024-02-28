const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sessionSchema = new mongoose.Schema({
    name: {
         type: String,
         required: true 
        },
    email:{ 
        type: String,
         required: true,
          unique: true
     },
  phone: {
     type: String,
      required: true, 
      unique: true
     },
  password: {
     type: String,
      required: true
     },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Athlete', // Reference to the Athlete collection
        // required: true
    },
    user_type: {
        type: String,
        enum: ['athlete', 'coach'],
        default: 'athlete', // Setting a default value
    },
    access_token: {
        type: String,
        // required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: null
    },
    loggedIn: { 
        type: Boolean, default: false 
      },
});

sessionSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
sessionSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

sessionSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};
module.exports = mongoose.model('Session', sessionSchema);
