const express = require('express');
const Post = require('../models/post');
const multer = require('multer');
const checkAuth = require('../middlewares/check-auth');

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
};
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid mime type");
        if(isValid){
            error = null;
        }
        cb(error,"backend/images")
    },
    filename: (req,file,cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null,name + '-'+ Date.now() +'.'+ ext);
    }
})
const router = express.Router();

router.post('',checkAuth,multer({ storage: storage }).single("image"),(req,res,next) => {
    const url = req.protocol+ '://' + req.get("host");
    const post = new Post({
        postTitle: req.body.postTitle,
        postContent: req.body.postContent,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then((createdPost) => {
        res.status(201).json({
            message: "Post successfully added!",
            post: {
                postId: createdPost._id,
                postTitle:createdPost.postTitle,
                postContent:createdPost.postContent,
                imagePath: createdPost.imagePath
            }
        });
    });
    
});
router.get('',(req,res,next) => {
    let posts = [];
    Post.find()
      .then((allPosts) => {
        posts = allPosts;
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: posts
        });
    }).catch(err => {
        console.log(err)
    });
});

router.get('/:id', (req,res,next) =>{
    Post.findOne({ _id: req.params.id }).then((post) =>{
        if(post){
            res.status(200).json(post);
        }else{
            res.status(404).json({ message: "Post not found!" });
        }
    });
});
router.put('/:id',checkAuth,multer({ storage: storage }).single("image"),(req,res,next) => {
        let imagePath = req.body.imagePath;
        if(req.file){
            const url = req.protocol + "://" + req.get("host");
            imagePath = url + "/images/" + req.file.filename;
        }
        const post = new Post({
        _id: req.params.id,
        postTitle: req.body.postTitle,
        postContent: req.body.postContent,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
        .then((result) => {
            if(result.nModified > 0){
                res.status(200).json({ message: 'Post updated!' });
            }
            else{
                res.status(401).json({ message: 'Authorization faild.' })
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

router.delete('/:id',checkAuth,(req,res,next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then((result) => {
        if(result.deletedCount > 0){
            res.status(200).json({
                message: 'Post deleted!'
            });
        }else{
            res.status(401).json({
                message: 'Authorization failed'
            })
        }
        
    });
});

module.exports = router;