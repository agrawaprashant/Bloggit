const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, required: true },
    posts: [{
    postTitle: { type: String, required: true },
    postContent: { type: String, required: true },
    imagePath: { type:String, required: true },
    creator: { type: String, required: true },
    createdAt: { type: String, required: true }
    }]
});

mongoose.plugin(uniqueValidator)
module.exports = mongoose.model("User", userSchema);