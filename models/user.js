const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
let emailLengthChecker = (email)=>{
    if(!email)
    return false;
    else
    if(email.length < 5 || email.length > 30)
    return false;
    else
    return true;
}
let usernameLengthChecker = (username)=>{
    if(!username)
    return false;
    else
    if(username.length < 3 || username.length > 15)
    return false;
    else
    return true;
}
let passwordLengthChecker = (password)=>{
    if(!password)
    return false;
    else
    if(password.length < 8 || password.length > 35)
    return false;
    else
    return true;
}
let validatePasswordChecker = (password)=>{
    if(!password)
    return false;
    else
    {
        const regExp = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password);
    }
};
let validateUsernameChecker = (username)=>{
    if(!username)
    return false;
    else
    {
        const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};
let validateEmailChecker = (email)=>{
    if(!email)
    return false;
    else
    {
        const regExp = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};
const emailValidators = [
    {
        validator:emailLengthChecker,message:'Email must be at least 5 characters and at most 30 characters'
    },{
        validator:validateEmailChecker,message:'Invalid Email Address'
    }
];
const usernameValidators = [
    {
        validator:usernameLengthChecker,message:'Username must be at least 3 characters and at most 15 characters'
    }//,{
    //     validator:validateEmailChecker,message:'Invalid Username'
    // }
];
const passwordValidators = [
    {
        validator:passwordLengthChecker, message:'Password must be at least 8 characters and at most 35 characters'
    }
    // ,{
    //     validator:validatePasswordChecker ,message:'Password must have Minimum eight characters, at least one uppercase letter, one lowercase letter and one number'
    // }
];
const UserSchema = new Schema({
    email:{type:String,required:true,unique:true,lowercase:true,validate:emailValidators},
    username:{type:String,required:true,unique:true,lowercase:true,validate:usernameValidators},
    password:{type:String, required:true,validate:passwordValidators}
});
UserSchema.pre('save',function(next){
    if(! this.isModified('password'))
    return next();
    bcrypt.hash(this.password,null,null,(err,hash)=>{
        if(err) return next(err);
        this.password = hash;
        next();
    });
});
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password,this.password);
}
module.exports = mongoose.model('User',UserSchema);