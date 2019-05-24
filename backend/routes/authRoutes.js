const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  
const router = express.Router();
const User = require('../models/user');

router.post("/signup", (req,res,next) => {
    bcrypt.hash(req.body.password,10)
        .then((hash => {
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash,
                profileImage: 'http://localhost:3000/images/user-profile-images/defaultProfileImage.png'
            });
            user.save()
                .then(result => {
                    res.status(200).json({
                        message: "User created!",
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
            }));
    });

    router.post("/login",(req,res,next) => {
        let fetchedUser;
        User.findOne({ email: req.body.email })
            .then(user => {
                if(!user){
                    return res.status(401).json({
                        message: 'Auth faild'
                    })
                }
                fetchedUser = user;
                bcrypt.compare(req.body.password, fetchedUser.password)
                    .then(result => {
                        if(!result){
                            return res.status(401).json({
                                message: 'Auth faild'
                            });
                        }
                        const token = jwt.sign(
                            { email: fetchedUser.email, userId: fetchedUser._id },
                            "secret_this_shoud_be_longer",
                            { expiresIn: "1h" }
                            );
                        res.status(200).json({
                            token: token,
                            expiresIn: 3600,
                            userId: fetchedUser._id,
                            firstName: fetchedUser.firstName,
                            lastName: fetchedUser.lastName
                        });
                    })
                    .catch(err => {
                        res.status(401).json({
                            message: "Auth faild"
                        });
                    })
            })
    })
module.exports = router;