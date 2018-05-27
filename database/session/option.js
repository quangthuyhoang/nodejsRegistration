require('dotenv').config()

module.exports = {
    key: process.env.keyid,
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 60000
    }
}