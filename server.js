const   express = require('express'),
        bodyParser = require('body-parser'),
        db = require('./database/mysqlDB'),
        expressValidator = require('express-validator'),
        Users = require('./database/models/Users'),
        bcrypt = require('bcrypt');
const queryString = require('querystring'),
        multer = require('multer'),
        path = require('path'),
        validate = require('./database/controllers/validation.server').checkInput,
        AsyncEmailMiddleware = require('./database/controllers/validation.server').AsyncEmailMiddleware,
        session = require('express-session'),
        cookieParser = require('cookie-parser');

const app = express();
const upload = multer({ dest: 'uploads/'})
const saltRounds = process.env.SALTROUNDS || 10;

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
    key: 'user_sid',
    secret: 'Pheramor_how_does_my_backend_code_look?',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: 60000
    }
}))

app.get('/', (req, res) => {
    var msg;

    if(req.query.errors) {
        msg = JSON.stringify({errors: req.query.errors});
    }

    if(req.query.message) { 
        msg = JSON.stringify({message: req.query.message});
    }
    // res.sendFile(path.join(__dirname, 'index.html'));
    res.send(msg)
});

// USER REGISTRATION - GET ROUTE
app.get('/register', (req, res) => {
    var msg;
   
    if(req.query.errors) {
        msg = JSON.stringify({errors: req.query.errors})
    }

    res.send(msg);
})


// USER REGISTRATION - POST ROUTE
app.post('/register', validate, AsyncEmailMiddleware, (req, res) => {
    
    // handle
        var testUser = new Users(req.body)

    // hash password
    bcrypt.hash( testUser.password, saltRounds, function(err, hash) {

        if(err) throw Error("Hash Error:", err)
        testUser.updatePassword(hash); // replace password string with new hash

        db.query(testUser.insertQuery(), testUser.getValues(), (err, results, field) => {
      
            // On Error
            if(err) {
                let errMsg = queryString.stringify({error: err});
 
                res.redirect('/register?' + errMsg);
            }

            // On Success
            if(results) {
                results.message = 'Registration Success!';
                let payload = queryString.stringify(results);
             
                res.redirect('/?' + payload);
            }
        })
    }) 
});

// verify use is logged in
app.use((req, res, next) => {
    if(req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');
    }
    next();
})

const isLoggedIn = (req, res, next) => {
    if(req.session.user && req.cookies.user_sid) {
        res.redirect('/');
    } else {
        next();
    }
}

// Profile Picture Post Route
app.post('/uploadProfile', upload.single('profilePic'), (req, res, next) => {
    res.redirect('/');
})


const port =3000;
app.listen(port, () => {
    console.log("Server connected to port:", port);
});
