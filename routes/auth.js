var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
// const sparkPostTransport = require('nodemailer-sparkpost-transport')
const checkAuth = require('../middleware/check-auth');

const AuthController = require('../Controllers/Authentication');


// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//            user: 'yashdeep.rajput019@gmail.com',
//            pass: '8941891594@hp'
//        }
//    });
// const transporter = nodemailer.createTransport(sparkPostTransport({
// 'sparkPostApiKey': api.sparkpostAPI
// }))

/* GET home page. */

router.post('/login', AuthController.auth_login);

router.post('/register', AuthController.auth_register);

router.get('/checkEmail/:email', AuthController.check_email);

router.get('/checkUsername/:username', AuthController.check_username);

router.get('/profile', checkAuth , AuthController.get_self_profile);

module.exports = router;
