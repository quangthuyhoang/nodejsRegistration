const expressValidator = require('express-validator');
const queryString = require('query-string');

module.exports = function(req, res, next) {
        // check dob is correct format
        req.checkBody('email')
        .notEmpty().withMessage('Email must be entered.')
        .isLength({max:90, min: 1}).withMessage("Email length must be between 1 and 80 characters.")
        .isEmail().withMessage('Must be a valid email')
        .trim()
        .normalizeEmail()
    // verify if email already exists, unless i handle it while trying to add it
        // .custom(value => {
        //     // return findUserByEmail(value).then(user => {
        //     //   throw new Error('this email is already in use');
        //     // })
        //   })

    // first name
    req.checkBody('firstname', 'First name must be between 1 to 25 characters').isLength({max: 25, min: 1})

    // last name
    req.checkBody('lastname', 'Last name must between 1 to 25 characters').isLength({max: 25, min: 1})

    // password
    const pwregx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])")
    req.checkBody('password')
        .matches(pwregx).withMessage('Passwords must be at least 5 chars long, contain at least one upper case, one lower case, and one number')
        .isLength({ min: 5 })
        .withMessage('Passwords must be at least 5 chars long, contain at least one upper case, one lower case, and one number');
    
    // gender - assumes input is 'male' or 'female' for gender and gender preference
    req.checkBody('gender').isLength({min: 1, max: 6})
    
    // zipcode - assumes an input zipcode 77777 or 77777-0000
    req.checkBody('zipcode').isLength({min: 5, max: 10}).withMessage('Zipcode must be between 5 to 10 characters long');

    // height - assumes unit length in feet, decimal, e.g. 5.11
    req.checkBody('height').isNumeric().withMessage('Height must be a number')
        .isLength({min: 1, max: 5}).withMessage("Height input must be between 1 and 5 characters"); 
        // if input is entered as 5' 11" string then invoke conversion function to decimal number before storing into sql db.

    // date of birth - assumes a standard input of MM-DD-YYY format, else invoke conversion to required date format before storing
    req.checkBody('date_of_birth')
        .isLength({max: 10}).withMessage('Date must be written in MM-DD-YYYY')
    
    // gender preference -  assumes input is 'male' or 'female'
    req.checkBody('genderpref').isLength({max: 20, min: 1}).withMessage("Input must be between 1 and 20 characters");

    // minimum age preference
    req.checkBody('ageminpref').isNumeric().withMessage('Age preference must be a number.')
        .isLength({min: 1, max: 5}).withMessage("Age preference must be between 1 and 5 characters");
    
    // maximum age preference
    req.checkBody('agemaxpref').isNumeric().withMessage('Age preference must enter a number.')
    .isLength({min: 1, max: 5}).withMessage("Age preference must be between 1 and 5 characters");

    // race
    if(req.body.race) {
        req.checkBody('race').isLength({max: 25}).withMessage('Race cannot exceed 25 characters');
    }

    // religion
    if(req.body.religion) {
        req.checkBody('religion').isLength({max: 50}).withMessage('Religion cannot exceed 50 characters');
    }

    const errors = req.validationErrors();
    if(errors) {
        let msgArr = errors.map( el => el.msg )
        let errMsg = queryString.stringify({error: msgArr}, {arrayFormat: 'bracket'})
     
        return res.redirect('/?' + errMsg)
    }
  
    return next();

    // const errors = req.validationErrors();
    
}