const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sessionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'user_type' // specify the refPath instead of ref
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    user_type: {
        type: String,
        enum: ['athlete', 'coach'],
        default: 'athlete', // Setting a default value
    },
    access_token: {
        type: String,
        required:true,
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

// Method to compare passwords
sessionSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    }
    catch (error) {
        throw new Error(error.message);
    }
};
sessionSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};

// Hash password after saving to database
sessionSchema.post('save', function (doc, next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

// Populate user_id field with the corresponding Athlete or Coach document
sessionSchema.pre('findOne', function () {
    this.populate('user_id', '-_id name');
});
module.exports = mongoose.model('Session', sessionSchema);

