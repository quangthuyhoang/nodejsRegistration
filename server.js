const   express             = require('express'),
        bodyParser          = require('body-parser'),
        expressValidator    = require('express-validator'),
        Users               = require('./database/models/Users'),
        bcrypt              = require('bcrypt'),
        queryString         = require('querystring'),
        multer              = require('multer'),
        path                = require('path'),
        db                  = require('./database/mysqlDB'),
        session             = require('express-session'),
        cookieParser        = require('cookie-parser');
const   validate            = require('./database/controllers/validation.server').checkInput,
        AsyncEmailMiddleware = require('./database/controllers/validation.server').AsyncEmailMiddleware,
        isLoggedInMiddleWare = require('./database/controllers/validation.server').isLoggedIn,
        sessionOption       = require('./database/session/option');
        

require('dotenv').config();

// Declare Variables
const app = express();
const upload = multer({ dest: 'uploads/'})
const saltRounds = Number(process.env.SALTROUNDS);

// SETUP 
app.set('view engine', 'ejs'); // testing purposes only
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());
app.use(cookieParser());
app.use(session(sessionOption));

// INDEX ROUTE
app.get('/', (req, res) => {

    var msg;
    if(req.query.errors) {
        msg = JSON.stringify({errors: req.query.errors});
    }
    if(req.query.message) { 
        msg = JSON.stringify({message: req.query.message});
    }

    res.send(msg)
    // console.log(msg)
    // res.render('index', {msg: msg}) //--> testing purporses only
});

// USER REGISTRATION - GET ROUTE
app.get('/register', (req, res) => {
    var msg;
   
    if(req.query.errors) {
        msg = JSON.stringify({errors: JSON.parse(req.query.errors)})
    }

    res.json({errors: JSON.parse(req.query.errors)});
})


// USER REGISTRATION - POST ROUTE
app.post('/register',
    validate, // input validation
    AsyncEmailMiddleware, // validate if email already exist in db
    (req, res) => {
    // create User model
    var newUser = new Users(req.body)

    bcrypt.hash( newUser.password, saltRounds, function(err, hash) {
   
        if(err) throw Error('Hash Error:', err)
        newUser.updatePassword(hash); 
    
    // Add new User to user table
        db.query(
            newUser.insertQuery(), // inject Insert SQL command
            newUser.getValues(), // insert values into SQL command
            (err, results, field) => {
      
            // On Error
            if(err) {
                let errMsg = queryString.stringify({error: err});
                res.redirect('/register?' + errMsg);
            }

            // On Success
            if(results) {
                req.session.useremail = newUser.email;
                results.message = 'Registration Success!';
                let payload = queryString.stringify(results);
                res.redirect('/?' + payload);
            }
        })
    }) 
});

// Profile Picture Post Route
app.post('/uploadProfile', 
    isLoggedInMiddleWare, // verify if user is logged in
    upload.single('profilePic'),  // uploads profilePic file to /upload folder
    (req, res, next) => {
    res.redirect('/'); // if all successfull redirect to index page
})


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server connected to port:', port);
});
