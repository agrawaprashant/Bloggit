const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    postTitle: { type: String, required: true },
    postContent: { type: String, required: true },
    imagePath: { type:String, required: true },
    creator: { type: String, required: true }
});

module.exports = postSchema;