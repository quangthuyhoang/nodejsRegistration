const   express = require('express'),
        bodyParser = require('body-parser'),
        db = require('./database/mysqlDB'),
        expressValidator = require('express-validator'),
        Users = require('./database/models/Users'),
        bcrypt = require('bcrypt');
const queryString = require('query-string'),
        multer = require('multer'),
        path = require('path'),
        validate = require('./database/controllers/validation.server');

const app = express();
const upload = multer({ dest: 'uploads/'})
const saltRounds = process.env.SALTROUNDS || 10;

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressValidator());
// app.use(bodyParser.json());

app.get('/', (req, res) => {
    var msg;
    console.log("query",req.query)
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
    res.sendFile(path.join(__dirname, 'index.html'))
});




const dbHandler = (err) => {
    if(err) throw Error(err.stack);
    console.log('connected as id ' + db.threadId);
}

app.get('/register', (req, res) => {
    res.end("register page")
})


app.post('/register', validate, (req, res) => {
        var testUser = new Users(req.body)

     // connect to sersver
        db.connect(dbHandler);

    // hash password
        bcrypt.hash( testUser.password, saltRounds, function(err, hash) {
            if(err) throw Error("Hash Error:", err)
            testUser.updatePassword(hash) // replace password string with new hash

            db.query(testUser.insertQuery(), testUser.getValues(), (err, results, field) => {

                // Error handling
                if(err) {
                    let errMsg = queryString.stringify({error: err})
                    res.redirect('/?' + errMsg)
                }

                // On Success
                results.message = 'Registration Success!';
                let payload = queryString.stringify(results);
                res.redirect('/?' + payload);
            })
        })   
    // }  
});

// Profile Picture Post Route
app.post('/uploadProfile', upload.single('profilePic'), (req, res, next) => {
    res.redirect('/')
})


const port =3000;
app.listen(port, () => {
    console.log("Server connected to port:", port)
});
