const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  
const router = express.Router();
const User = require('../models/user');
const nodemailer = require('nodemailer');

router.post("/signup", (req,res,next) => {
    bcrypt.hash(req.body.password,10)
        .then((hash => {
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash,
                profileImage: 'http://localhost:3000/images/user-profile-images/defaultProfileImage.png',
                posts:[]
            });
            user.save()
                .then(result => {
                    res.status(200).json({
                        message: "User created!",
                        result: result
                    });
                    let transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false, // true for 465, false for other ports
                        auth: {
                          user: 'bloggitapp@gmail.com', // generated ethereal user
                          pass: 'bloggit@123' // generated ethereal password
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                      });
                    
                      // send mail with defined transport object
                      let mailoptions = {
                        from: '"Bloggit" <bloggitapp@gmail.com>', // sender address
                        to: result.email, // list of receivers
                        subject: "Welcome to Bloggit", // Subject line
                        text: "Hello" + ' ' + result.firstName + ' ' + result.lastName + " ,you are welcome to a node.js application - Bloggit, Enjoy!!", // plain text body 
                      };

                      transporter.sendMail(mailoptions, (error, info) => {
                          if(error){
                              return console.log(error)
                          }
                          console.log("Message sent: %s", info.messageId);
                          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                        
                          // Preview only available when sending through an Ethereal account
                          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                      })  
                    }
                )
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