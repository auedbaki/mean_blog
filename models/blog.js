const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let titleLengthChecker = (title)=>{
    if(!title)
    return false;
    else
    if(title.length < 5 || title.length > 100)
    return false;
    else
    return true;
}
let commentLengthChecker = (comment)=>{
    if(!comment)
    return false;
    else
    if(comment[0].length < 5 || comment[0].length > 300)
    return false;
    else
    return true;
}
let bodyLengthChecker = (body)=>{
    if(!body)
    return false;
    else
    if(body.length < 100 )
    return false;
    else
    return true;
}

let alphaNumericChecker = (title)=>{
    if(!title)
    return false;
    else
    {
        const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
        return regExp.test(title);
    }
};
const titleValidators = [
    {
        validator:titleLengthChecker,message:'Title must be at least 5 characters and at most 100 characters'
    },{
        validator:alphaNumericChecker,message:'Title must be alpha Numeric'
    }
];
const bodyValidators = [
    {
        validator:bodyLengthChecker,message:'Body must be at least 100 characters '
    }
];
const commentValidators = [
    {
        validator:commentLengthChecker,message:'Comment must be at least 5 characters and at most 300 characters'
    }
];
const blogSchema = new Schema({
    title:{type:String,required:true,validate:titleValidators},
    body:{type:String, required:true,validate:bodyValidators},
    createdBy:{type:String },
    createdAt:{type:Date,default:Date.now()},
    likes:{type:Number, default:0},
    likedBy:{type:Array},
    dislikes:{type:Number, default:0},
    dislikedBy:{type:Array},
    comments:[
        {
            comment:{type:String,validate:commentValidators},
            commentator:{type:String}
        }
    ]
});

module.exports = mongoose.model('blog',blogSchema);