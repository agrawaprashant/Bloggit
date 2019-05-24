const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const checkAuth = require('../middlewares/check-auth');

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
};

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let err = new Error('Invalid mime type');
        if(isValid){
            err = null;
        }
        cb(err, "backend/images/user-profile-images")
    },
    filename: (req,file,cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+ '-'+ Date.now() + '.' + ext);
    }
});

const router = express.Router();

router.put('/image/:id',checkAuth, multer({ storage: storage }).single("image"), (req,res,next) => {
    const url = req.protocol+ '://' + req.get("host");
    const userId = req.params.id;
    console.log(userId)
    User.updateOne({ _id: userId }, { profileImage: url + "/images/user-profile-images/" + req.file.filename })
        .then(result => {
            res.status(201).json({ message: 'Profile picture updated' })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/:id',(req,res,next) => {
    User.findOne({ _id: req.params.id })
        .then(user => {
            if(user){
                res.status(201).json({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profileImage: user.profileImage
                });
            }
        })
        .catch(err => {
            console.log(err)
        });
});

module.exports = router;