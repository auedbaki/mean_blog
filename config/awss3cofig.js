const keys = require('./database');
module.exports = {
    
        secretAccessKey: process.env.s3accesskeysecret || keys.s3accesskeysecret,
        accessKeyId: process.env.s3accesskeyId || keys.s3accesskeyId,
        region: 'us-east-1'
    
}