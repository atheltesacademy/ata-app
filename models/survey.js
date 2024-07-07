const mongoose = require("mongoose");
const surveySchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  budget: {
    type: String,
    required: true,
  },
  chargeMethod: {
    type: String,
    required: true,
  },
  communicationMethod: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Survey", surveySchema);
