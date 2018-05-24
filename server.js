const   express = require('express'),
        bodyParser = require('body-parser'),
        db = require('./database/mysqlDB'),
        Users = require('./database/models/Users');

const app = express();


app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());

// db.connect((err) => {
//     if(err) {
//         console.log(err)
//     }
// });

app.get('/', (req, res) => {
    // do stuff with mysql
    res.end("hello world")
});




const dbHandler = (err) => {
    if(err) throw Error(err.stack);
    console.log('connected as id ' + db.threadId);
}




app.post('/register', (req, res) => {
    // console.log(req.body)
    var newUser = new Users({
        email: "name@email.com", // var char
        firstName: '123', // varchar
        lastName: 'quang', //varchar
        password: '123', //varchar
        gender: 'male', //text
        dob: '1-30-1989', //varchar
        height: '5.2', //varchar
        genderPreference: 'female', //varchar 
        AgeMinPref: 25, //int
        AgeMaxPref: 35, //int
        // Race: null, //option
        // Religion: null //option
    })


    // do stuff with mysql
    db.connect(dbHandler);
    db.query(newUser.insertQuery(Object.keys(newUser)), newUser.getValues(), (err, results, field) => {
        if(err) throw Error(err);
        console.log("successful insert data...")
        res.redirect('/')
    })
    // db.query('INSERT INTO Users (email, firstname, lastname, password) VALUES (?, ?, ?, ?)',[email, first, last, password],(err, result, fields) => {
    //     if(err) throw Error(err);
    //     console.log("successful insert data...")
    //     res.redirect('/')
    // })
  
});

app.post('/uploadProfile', (req, res) => {
    // upload profile picture
})


const port =3000;
app.listen(port, () => {
    console.log("Server connected to port:", port)
});
