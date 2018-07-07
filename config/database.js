const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: "mongodb+srv://auedbaki:8941891594@auedbaki-4omtl.mongodb.net/test?retryWrites=truee",
    secret : crypto,
    db : 'blog'
}