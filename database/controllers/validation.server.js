const   expressValidator    = require('express-validator'),
        querystring         = require('querystring'),
        findUserByEmail     = require('./crud').findUserByEmail,
        _conf               = require('../../config/constants');


const validation = {};

// verify if user is currently logged in
validation.isLoggedIn = async function(req, res, next) {
    if(!req.cookies.user_sid || !req.session.useremail) {
        return res.send(_conf.errorMessages.notLoggedIn);
    }

    const email = req.session.useremail;
    
    try {
        const checkEmail = await findUserByEmail(email);
        req.emailExist = checkEmail.results === email;

    } catch(error) {

        let errMsg = querystring.stringify({
            errors: JSON.stringify({
                param: 'error',
                message: _conf.errorMessages.dbQueryError})
            });

        return res.redirect('/register?' + errMsg);
    };

    if(!req.emailExist) {
        return res.send(_conf.errorMessages.notLoggedIn)
    }

    next();
}

// verify if Email already exist in database
validation.AsyncEmailMiddleware = async function(req, res, next) {
    
    const email = req.body.email;

    try {
        const checkEmail = await findUserByEmail(email);
        req.emailExist = checkEmail.results === email;
        // error handling
    } catch(error) {
        let errMsg = querystring.stringify({
            errors: JSON.stringify({
                param: 'error',
                message: _conf.errorMessages.dbQueryError
            })
        });
        return res.redirect('/register?' + errMsg);
    }
        // if exist then redirect and send msg
    if(req.emailExist) {
        let errMsg = querystring.stringify({
            errors: JSON.stringify({
                param: 'email',
                message: _conf.errorMessages.emailExist
            })
        });
        return res.redirect('/register?' + errMsg);
    }
    // if no errors or no emails found...
    return next()
}

// Verify User Input
validation.checkInput = function(req, res, next) {
   
        // check email
    req.checkBody('email')
        .notEmpty().withMessage(_conf.email.notEmptyMessage)
        .isLength(_conf.email.char_limit)
        .withMessage(_conf.email.char_limit_message)
        .isEmail().withMessage(_conf.email.invalid_message)
        .trim()
        .normalizeEmail()

    // first name
    req.checkBody('firstname', _conf.name.char_limit_message)
        .isLength(_conf.name.char_limit)

    // last name
    req.checkBody('lastname', _conf.name.char_limit_message)
    .isLength(_conf.name.char_limit)

    // password
    const pwregx = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')
    req.checkBody('password')
        .matches(pwregx).withMessage(_conf.password.message)
        .isLength(_conf.password.char_limit)
        .withMessage(_conf.password.message);
    
    // gender - assumes input is 'male' or 'female' for gender and gender preference
    req.checkBody('gender')
        .isLength(_conf.gender.char_limit)
        .withMessage(_conf.gender.char_limit_message)
    
    // zipcode - assumes an input zipcode 77777 or 77777-0000
    req.checkBody('zipcode')
        .isLength(_conf.zipcode.char_limit)
        .withMessage(_conf.zipcode.char_limit_message);

    // height - assumes unit length in feet, decimal, e.g. 5.11
    req.checkBody('height')
        .isNumeric()
        .withMessage('Height must be a number')
        .isLength(_conf.height.char_limit)
        .withMessage(_conf.height.char_limit_message); 
        // if input is entered as 5' 11' string then invoke
        // conversion function to decimal number before storing into sql db.

    // date of birth - assumes a standard input of MM/DD/YYY format,
    req.checkBody('date_of_birth')
        .isLength(_conf.dob.char_limit)
        .withMessage(_conf.dob.char_limit_message)
    
    // gender preference -  assumes input is 'male' or 'female'
    req.checkBody('genderpref')
        .isLength(_conf.gender.char_limit)
        .withMessage(_conf.gender.message);

    // minimum age preference
    req.checkBody('ageminpref')
        .isNumeric()
        .withMessage('Age preference must be a number.')
        .isInt({lt: req.body.agemaxpref})
        .withMessage('Max age preference must be greater than min age preference.')
        .isLength(_conf.agepref.char_limit)
        .withMessage(_conf.agepref.char_limit_message);
    
    // maximum age preference
    req.checkBody('agemaxpref')
        .isNumeric()
        .withMessage('Age preference must enter a number.')
        .isInt({gt: req.body.ageminpref})
        .withMessage('Max age preference must be greater than min age preference.')
        .isLength(_conf.agepref.char_limit)
        .withMessage(_conf.agepref.char_limit_message)

    // race
    if(req.body.race) {
        req.checkBody('race')
        .isLength(_conf.race.char_limit)
        .withMessage(_conf.race.char_limit_message);
    }

    // religion
    if(req.body.religion) {
        req.checkBody('religion')
        .isLength(_conf.religion.char_limit)
        .withMessage(_conf.religion.char_limit_message);
    }
    
    const errors = req.validationErrors();
   
    if(errors) {
        let msgArr = errors.map( el => { 
            return {
                param: el.param,
                message: el.msg
            }
        } )
        let errMsg = querystring.stringify(
            {errors: JSON.stringify(msgArr)},
            {arrayFormat: 'bracket'})
       
        return res.redirect('/register?' + errMsg)
    }
    
    return next();
}

module.exports = validation;