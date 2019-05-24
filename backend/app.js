const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/postsRoutes');
const authRoutes = require('./routes/authRoutes');
const searchRoutes = require('./routes/searchRoutes');
const userprofileRoutes = require('./routes/userProfileRoutes');

const app = express();

mongoose.connect('mongodb://localhost/posts');
app.use("/images", express.static(path.join("backend/images")));
// app.use("/images/user-profile-images", express.static(path.join("backend/images/user-profile-images")));
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
                  "Origin, X-Requested-With,Authorization,Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods",
                  "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api/posts",postsRoutes);
app.use("/api/user",authRoutes);
app.use("/api/search",searchRoutes);
app.use("/api/user/profile",userprofileRoutes);

module.exports = app;

