var express = require('express');
var router = express.Router();
const Blog = require('../models/blog');
const config = require('../config/database');

router.post('/newBlog',(req,res,next)=>{
    
    if(!req.body.title)
    {
        res.json({success:false,message:"Blog Title is Required"});
    }
    else{
        if(!req.body.body)
        {
            res.json({success:false,message:"Blog Body is required"});
        }
        else
        {
           if(!req.body.createdBy)
           {
                res.json({success:false,message:"Author Name is Required"});
           }
           else{
            
            const blog = new Blog({
                title:req.body.title,
                body:req.body.body,
                createdBy:req.body.createdBy
            }).save().then(result=>{
                res.json({success:true,message:"Blog Saved"});
            })
            .catch(err=>{
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
});

module.exports = router;
