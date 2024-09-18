const mongoose = require("mongoose");

const passwordSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter email"],
  },
  webName: {
    type: String,
    required: [true, "Please enter website name"],
  },
  webEmail: {
    type: String,
    required: [true, "Please enter website email"],
  },
  webPassword: {
    type: String,
    required: [true, "Please enter website password"],
  },
});

module.exports = mongoose.model("Password", passwordSchema);
