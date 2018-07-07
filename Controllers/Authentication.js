const config = require('../config/database');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.auth_login = (req, res, next)=>{
    if(!req.body.username){
        res.json({success:false,message:'No Username was Provided'});
    }else{
        if(!req.body.password){
          res.json({success:false,message:'No Password was Provided'});
        }else{
            User.findOne({username:req.body.username.toLowerCase()},(err,user)=>{
                if(err){
                    res.json({success:false,message:err});
                }
                else{
                    if(!user){
                        res.json({success:false,message:'Username Not Found'});
                    }
                    else{
                      const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
                      // Check if password is a match
                      if (!validPassword) {
                        res.json({ success: false, message: 'Password invalid' }); // Return error
                      } else {
                          //res.json({success:true,message:'Login Success!'});
                        const token = jwt.sign({ userId: user._id, username:user.username, role:user.role }, config.secret, { expiresIn: '2h' }); // Create a token for client
                        
                        res.json({
                          success: true,
                          message: 'Success!',
                          token: token
                        }); 
                      }
                    }
                }
            })
        }
    }
}

exports.auth_register = (req, res, next)=>{
    
    if(!req.body.email)
    res.status(200).json({success:false, message:'You must provide an email'});
    else if(!req.body.username)
    res.status(200).json({success:false, message:'You must provide an username'});
    else if(!req.body.password)
    res.status(200).json({success:false, message:'You must provide password'});
    else
    {
        const user = new User({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            role:'admin'
        })
        user.save().then((result=>{
           
                 res.json({success:true,message:'Your Account Created Succesfully'});
        
        })).catch(err=>{
            res.json({
                success: false,
                message: err.message
            });
        
        })
    }
}

exports.check_email = (req,res,next)=>{
    if(!req.params.email)
    res.json({success:false,message:'Email is not Provided.'});
    else{
        User.findOne({email:req.params.email},(err,user)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else
            if(user)
                res.json({success:false,message:'Email is Already taken'});
            else
            res.json({success:true,message:'Email is Available'});
            
        });
    }
}

exports.check_username = (req,res,next)=>{
    if(!req.params.username)
    res.json({success:false,message:'Username is not Provided.'});
    else{
        User.findOne({username:req.params.username},(err,user)=>{
            if(err){
                res.json({success:false,message:err});
            }
            else
            if(user)
                res.json({success:false,message:'Username is Already taken'});
            else
            res.json({success:true,message:'Username is Available'});
            
        });
    }
}

exports.get_self_profile = (req,res,next)=>{
    User.findOne({_id:req.decoded.userId}).select('username email role')
    .exec()
    .then(user=>{
        if(!user)
             res.json({success:false,message:'User not found'});
         else{
             res.json({success:true,user:user});
         }
    })
    .catch(err=>{
        res.json({success:false,message:err})
    })
 }