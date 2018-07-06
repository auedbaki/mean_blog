const jwt = require('jsonwebtoken');
const keys = require('../config/database')

module.exports = (req,res,next)=>{
    
    const token  = req.headers['authorization'].split(" ")[1];
    
    if(!token){
        res.json({success:false,message:'NO Token Provided'});
        console.log('Token Not Provided');
    }
    else{
        jwt.verify(token, keys.secret, (err,decoded)=>{
            if(err){
                res.json({success:false,message:'Token Invalid : '+err});
                console.log('Token invalid');
            } else{
                req.decoded = decoded;
                console.log('Next Method is called');
                next();
            }
        })
    }
};
