const mongoose = require('mongoose');

const userProfileSchema = mongoose.Schema({
    profileImagePath: { type: String, required: true }
});

module.exports = mongoose.model("UserProfile", userProfileSchema);