const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema(
  {
    sport_name: {
      type: String,
      required: true,
      unique: true,
    },
    image_url: { type: String ,},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Sport", sportSchema);
