const   express = require('express'),
        bodyParser = require('body-parser'),
        db = require('./database/mysqlDB'),
        expressValidator = require('express-validator'),
        Users = require('./database/models/Users'),
        bcrypt = require('bcrypt');
const queryString = require('query-string');

const app = express();
const saltRounds = process.env.SALTROUNDS || 10;

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());
// app.use(bodyParser.json());

// db.connect((err) => {
//     if(err) {
//         console.log(err)
//     }
// });

app.get('/', (req, res) => {
    var msg;
    console.log(req.query)
    if(req.query.error) {
        // errorMsg = queryString.parse(req.query.error , {arrayFormat: 'index'})
        // errorMsg = req.query.error;
        // console.log("/", errorMsg)
        msg = JSON.stringify({errors: req.query.error})
    }
    // check message
    if(req.query.message) {
        msg = req.query.message;
    }
    // do stuff with mysql

    res.end(msg)
});




const dbHandler = (err) => {
    if(err) throw Error(err.stack);
    console.log('connected as id ' + db.threadId);
}

app.get('/register', (req, res) => {
    res.end("register page")
})


app.post('/register', (req, res) => {
    // validation
    
    // email
    // correct length for each items

    // password meets criteria
    
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
    req.checkBody('firstname', 'First name must be between 1 to 25 characters').isLength({max: 25, min: 1})
    req.checkBody('lastname', 'Last name must between 1 to 25 characters').isLength({max: 25, min: 1})

    const pwregx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])")
    req.checkBody('password')
        .matches(pwregx).withMessage('Passwords must be at least 5 chars long, contain at least one upper case, one lower case, and one number')
        .isLength({ min: 5 })
        .withMessage('Passwords must be at least 5 chars long, contain at least one upper case, one lower case, and one number');
    
    // assumes input is 'male' or 'female'
    // req.checkBody('gender')

    req.checkBody('height').isNumeric().withMessage('Height must be a number')
        .isLength({min: 1, max: 5}).withMessage("Height input must be between 1 and 5 characters"); // assumes unit length in feet, decimal, e.g. 5.11
    req.checkBody('date_of_birth')
    // .isAlphanumeric().withMessage('Must be letters and numbers')
        .isLength({max: 10}).withMessage('Date must be written in MM-DD-YYYY') //assumes a standard input of MM-DD-YYY format
    req.checkBody('genderpref').isLength({max: 20, min: 1}).withMessage("Input must be between 1 and 20 characters");
    req.checkBody('ageminpref').isNumeric().withMessage('Age preference must be a number.')
        .isLength({min: 1, max: 5}).withMessage("Age preference must be between 1 and 5 characters");
    req.checkBody('agemaxpref').isNumeric().withMessage('Age preference must enter a number.')
    .isLength({min: 1, max: 5}).withMessage("Age preference must be between 1 and 5 characters");
    if(req.body.race) {
        req.checkBody('race').isLength({max: 25}).withMessage('Race cannot exceed 25 characters');
    }
    if(req.body.religion) {
        req.checkBody('religion').isLength({max: 50}).withMessage('Religion cannot exceed 50 characters');
    }
  

    const errors = req.validationErrors();
    

    

    if(errors) {
        console.log("Errors:", errors)
        let msgArr = errors.map( el => el.msg )
        let errMsg = queryString.stringify({error: msgArr}, {arrayFormat: 'bracket'})
        console.log(errMsg)
        res.redirect('/?' + errMsg)
        // res.send(JSON.stringify(errors))
    } else {
        // Create new User
        var testUser = new Users(req.body)
        db.connect(dbHandler);
        // hash password
        bcrypt.hash( testUser.password, saltRounds, function(err, hash) {

            if(err) throw Error("Hash Error:", err)

                testUser.updatePassword(hash) // replace password string with new hash

                db.query(testUser.insertQuery(), testUser.getValues(), (err, results, field) => {
                    // Error handling
                    if(err) {
                        console.log(err)
                        let errMsg = queryString.stringify({error: err})
                        res.redirect('/?' + errMsg)
                    }
                    // On Success

                    results.message = 'Registration Success!';
                    let payload = queryString.stringify(results);

                    res.redirect('/?' + payload);
            })
        })   
    }  
});

app.post('/uploadProfile', (req, res) => {
    // upload profile picture
})


const port =3000;
app.listen(port, () => {
    console.log("Server connected to port:", port)
});
