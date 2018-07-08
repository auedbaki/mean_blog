const Blog = require('../models/blog');
const User = require('../models/user');
const mongoose = require('mongoose');
const awsconfig = require('../config/awss3cofig');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

aws.config.update(awsconfig);

const s3 = new aws.S3();

exports.post_new_blog = (req,res,next)=>{
    if(!req.body.title)
    {
        //deletefile(req.file.key);
        res.json({success:false,message:"Blog Title is Required"});
    }
    else{
        if(!req.body.body)
        {
           // deletefile(req.file.key);
            res.json({success:false,message:"Blog Body is required"});
        }
        else
        {
           if(!req.body.createdBy)
           {
                //deletefile(req.file.key);
                res.json({success:false,message:"Author Id Name is Required"});
           }
           else{
            
            const blog = new Blog({
                title:req.body.title,
                body:req.body.body,
                createdBy:req.body.createdBy,
                url:req.body.url,
                thumbnail:req.file.location,
                tags:req.body.tags.split(','),
                description:req.body.description,
                status:req.body.status,
                category:req.body.category
            }).save().then(result=>{
                res.json({success:true,message:"Blog Saved"});
            })
            .catch(err=>{
                //deletefile(req.file.key);
                if(err.errors)
                {
                    if(err.errors.title)
                    {
                        res.json({success:false,message:err.errors.title.message});
                    }else {
                        if(err.errors.body)
                        {
                            res.json({success:false,message:err.errors.body.message});
                        }
                        else
                        {
                           
                                res.json({success:false,message:err.errmsg});
                            
                        }
                    }
                }
                else
                {
                    res.json({success:false,message:err});
                }
                
            })
           }
        }
    }
}

exports.get_recent_articles = (req,res,next)=>{
    Blog.find({}).populate('createdBy','username')
    .select('title description thumbnail createdAt createdBy views category')
    .sort({_id:-1})
    .limit(10)
    .exec()
    .then(articles=>{
        if(!articles){
            res.json({success:false, message:'No Article Found'})
        }
        else{
            res.json({success:true, message:`${articles.length } Articles Found`,articles:articles});
        }
       
    })
    .catch(err=>{
        res.json({success:false, message:err});
    })
   
}

exports.get_article_by_id = (req,res,next)=>{
    if(!req.params.id)
    {
        res.json({success:false,message:'No Article Id is Provided'});
    }
    else
    {
        Blog.findOneAndUpdate({_id:req.params.id},{$inc:{'views':1}}).populate('createdBy','username role')
        .exec()
        .then(article=>{
            if(!article)
            {
                res.json({success:false,message:'Article Not Found'});
            }
            else{
                res.json({success:true,message:'Article Found',article:article});
            }
        })
        .catch(err=>{
            res.json({success:false,message:'Not the valid Article Id'});
        })
    }
    
}

exports.get_article_by_author = (req,res,next)=>{
    Blog.find({})
    .select('title createdAt')
    .sort({_id:-1})
    .exec()
    .then(articles=>{
        if(!articles)
        {
            res.json({success:false,message:'No Article Found'});
        }
        else
        {
            res.json({success:true,message:`${articles.length} Articles Found`, articles:articles});
        }
    })
    .catch(err=>{
        res.json({success:false,message:err});
    })
}

exports.edit_article = (req,res,next)=>{
    if(!req.params.id)
    {
        res.json({success:false,message:'No Article Id is Provided'});
    }
    else
    {
        if(!req.body.title)
        {
            res.json({success:false,message:'Title is Required'});
        }
        else{
            if(!req.body.description)
            {
                res.json({success:false,message:'Description is Requried'});
            }
            else
            {
                if(!req.body.body)
                {
                    res.json({success:false,message:'Body is Required'});
                }
                else
                {
                    Blog.findOne({_id:req.params.id}).exec()
                    .then(article=>{
                        if(!article)
                        {
                            res.json({success:false,message:'Article not found for this id.'});
                        }
                        else
                        {
                            if(req.decoded.userid!=article.createdBy)
                            {
                                res.json({success:false,message:'You are not Authorized to edit this article'});
                            }
                            else
                            {
                                article.title = req.body.title;
                                article.description = req.body.description;
                                article.body = req.body.body;
                                article.save(err=>{
                                    if(err)
                                    {
                                        res.json({success:false,message:err});
                                    }
                                    else{
                                        res.json({success:true,message:'Article Updated Succesfully'});
                                    }
                                })
                            }
                        }
                    })
                    .catch(err=>{
                        res.json({success:false,message:'Not a valid Article Id'});
                    })
                }
            }

        }
    }
}

exports.delete_article = (req,res,next)=>{
    if(!req.params.id)
    {
        res.json({success:false,message:'Article Id is not Provided'});
    }
    else
    {
        Blog.findOne({_id:req.params.id}).exec()
        .then(article=>{
            if(!article)
            {
                res.json({success:fasle,message:'Id not Found'});
            }
            else
            {
                if(article.createdBy != req.decoded.userId)
                {
                   
                    res.json({success:false,message:'You are not allowed to delete this article.'});
                }
                else
                {
                    article.remove(err=>{
                        if(err)
                        {
                            res.json({success:false,message:err});
                        }
                        else
                        {
                            res.json({success:true,message:'Article Deleted Succesfully'});
                        }
                    })
                }
            }
        })
        .catch(err=>{
            res.json({success:false,message:'Invalid Article Id'});
        })
    }
}

exports.like_article = (req,res,next)=>{
    if(!req.params.id)
    {
        res.json({success:false,message:'No Id was provided'});
    }
    else
    {
        Blog.findOne({_id:req.params.id}).exec()
        .then(article=>{
            if(!article)
            {
                res.json({success:false,message:'Article Not Found'});
            }
            else
            {
                if(article.createdBy==req.decoded.userId)
                {
                    res.json({success:false,message:'Cannot like your own post.'});
                }
                else
                {
                    if(article.likedBy.includes(req.decoded.username))
                    {
                        res.json({success:false,message:'You already liked this article'});
                    }
                    else
                    {
                        if(article.dislikedBy.includes(req.decoded.username))
                        {
                            article.dislikes--;
                            const index = blog.dislikedBy.indexOf(req.decoded.username);
                            article.dislikedBy.splice(index,1);
                           
                        }
                            article.likes++;
                            article.likedBy.push(req.decoded.username);
                            article.save(err=>{
                                if(err)
                                {
                                    res.json({success:false,message:'Something Went Wrong'});
                                }
                                else
                                {
                                    res.json({success:true,message:'Article Liked',likes:article.likes, dislikes:article.dislikes});
                                }
                            });
                    }
                }
            }
        })
        .catch(err=>{
            res.json({success:false,message:'Invalid Article Id'});
        })
    }
}

exports.dislike_article = (req,res,next)=>{
    if(!req.params.id)
    {
        res.json({success:false,message:'No Id was provided'});
    }
    else
    {
        Blog.findOne({_id:req.params.id}).exec()
        .then(article=>{
            if(!article)
            {
                res.json({success:false,message:'Article Not Found'});
            }
            else
            {
                if(article.createdBy==req.decoded.userId)
                {
                    res.json({success:false,message:'Cannot like your own post.'});
                }
                else
                {
                    if(article.dislikedBy.includes(req.decoded.username))
                    {
                        res.json({success:false,message:'You already disliked this article'});
                    }
                    else
                    {
                        if(article.likedBy.includes(req.decoded.username))
                        {
                            article.likes--;
                            const index = blog.likedBy.indexOf(req.decoded.username);
                            article.likedBy.splice(index,1);
                           
                        }
                            article.dislikes++;
                            article.dislikedBy.push(req.decoded.username);
                            article.save(err=>{
                                if(err)
                                {
                                    res.json({success:false,message:'Something Went Wrong'});
                                }
                                else
                                {
                                    res.json({success:true,message:'Article disliked',likes:article.likes, dislikes:article.dislikes});
                                }
                            });
                    }
                }
            }
        })
        .catch(err=>{
            res.json({success:false,message:'Invalid Article Id'});
        })
    }
}

exports.popular_articles = (req,res,next)=>{
    Blog.find({}).select('title decription thumbnail').sort({views:-1})
    .limit(5)
    .exec().then(articles=>{
        if(!articles)
        {
            res.json({success:false,message:'No Article Found'});
        }
        else
        {
            res.json({success:true,message:`${articles.length} Articles Found`, articles:articles});
        }
    })
    .catch(err=>{
        console.log({success:false,message:err})
    })
}

deletefile = (key)=>{
    const deleteparams = {
        Bucket:'bucketauedbaki/thumbnails',
        Key:key        
    }
    s3.deleteObject(deleteparams, function(err,data){
        if(err)
        {
            console.log('File is not Deleted');
        }
        else
        {
            console.log('File is Deleted');
        }
        
    })
}