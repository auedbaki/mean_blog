var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const BlogController = require('../Controllers/Blog');
const awsconfig = require('../config/awss3cofig');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update(awsconfig);

const s3 = new aws.S3();

const thumbnails = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: 'bucketauedbaki/thumbnails',
        key: function (req, file, cb) {
           
            const random = Math.round((new Date()).getTime() / 1000);
            cb(null, random+file.originalname); //use Date.now() for unique file keys
            console.log('File is uploaded');
        }
    })
})
//thumbnails.array('thumbnail',1)
router.post('/newBlog', checkAuth,thumbnails.single('thumbnail'), BlogController.post_new_blog);

router.get('/articles', BlogController.get_recent_articles);

router.get('/popular',BlogController.popular_articles);

router.get('/id/:id', BlogController.get_article_by_id);

router.get('/author/:username',BlogController.get_article_by_author);

router.put('/edit/:id',checkAuth,BlogController.edit_article);

router.delete('/delete/:id',checkAuth,BlogController.delete_article);

router.put('/like/:id',checkAuth, BlogController.like_article);

router.put('/dislike/:id',checkAuth, BlogController.dislike_article);



router.post('/uploadimage',thumbnails.single('thumbnail'),  (req,res,next)=>{
    // deletefile(req.file.key);
        res.json({success:false,message:'Something Happen',file:req.file});
   
  
})


module.exports = router;

