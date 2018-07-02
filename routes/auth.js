var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
const sparkPostTransport = require('nodemailer-sparkpost-transport')
const User = require('../models/user');
const api = require('../config/api');
const config = require('../config/database');
const jwt = require('jsonwebtoken');


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'yashdeep.rajput019@gmail.com',
           pass: '8941891594@hp'
       }
   });
// const transporter = nodemailer.createTransport(sparkPostTransport({
// 'sparkPostApiKey': api.sparkpostAPI
// }))

/* GET home page. */

router.post('/login', function(req, res, next) {
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
                      const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '2h' }); // Create a token for client
                      res.json({
                        success: true,
                        message: 'Success!',
                        token: token,
                        user: {
                          username: user.username
                        }
                      }); 
                    }
                  }
              }
          })
      }
  }
});

router.post('/register', function(req, res, next) {
   if(!req.body.email)
   res.status(200).json({success:false, message:'You must provide an email'});
   else if(!req.body.username)
   res.status(200).json({success:false, message:'You must provide an username'});
   else if(!req.body.password)
   res.status(200).json({success:false, message:'You must provide password'});
   else
   {
       let user = new User({
        email : req.body.email.toLowerCase(),
        username : req.body.username.toLowerCase(),
        password : req.body.password
       });
       user.save().then((result=>{
           
        //    const mailOptions = {
        //     from: 'admin@auedbaki.000webhostapp.com', // sender address
        //     to: result.email, // list of receivers
        //     subject: 'Welcome '+result.username+'EMail from Spoarkpost  App', // Subject line
        //     html: '<p>We are happy to see you here welcome to this fucking world.</p>'// plain text body
        //   };
        //   transporter.sendMail(mailOptions, function (err, info) {
        //     if(err){
        //         console.log(err)
        //         res.status(200).json({status:false,message:err});
        //     }
              
        //     else{
                // console.log(info);
                res.status(200).json({status:true,message:'Your Account Created Succesfully'});
        //     }
              
        //  });
       })).catch(err=>{
           if(err.code===11000)
           res.status(200).json({status:false,message:'Email / Username Already Exist'});
           else{
           if(err.errors){
            if(err.errors.email)
            res.status(200).json({status:false,message:err.errors.email.message});
            else if(err.errors.username)
            res.status(200).json({status:false,message:err.errors.username.message});
            } else
           res.status(200).json({status:false,message:err.message});
           
        }
       })
   }
  });





router.get('/checkEmail/:email',(req,res,next)=>{
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
});

router.get('/checkUsername/:username',(req,res,next)=>{
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
});

// #############################################
// #######Authentication Verification###########
// #############################################
router.use((req,res,next)=>{
    const token  = req.headers['authorization'];
    if(!token){
        res.json({success:false,message:'NO Token Provided'});
    }
    else{
        
        jwt.verify(token, config.secret, (err,decoded)=>{
            if(err){
                res.json({success:false,message:'Token Invalid : '+err});
            } else{
                req.decoded = decoded;
                next();
            }
        })
    }
});

router.get('/profile',(req,res,next)=>{
   User.findOne({_id:req.decoded.userId}).select('username email')
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
});

module.exports = router;
