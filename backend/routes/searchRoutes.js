const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get("/:name", (req,res,next) => {
    const name = req.params.name;
    User.find({ firstName: name })
        .then(user => {
            if(user){
                console.log(user)
                res.status(200).json({ user: user })
            }else{
                res.status(401).json({ message: "User not found!" })
            }
        });
});

module.exports = router;