const   express = require('express'),
        bodyParser = require('body-parser');

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

const payload = {
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
    Race: null, //option
    Religion: null //option
}

app.post('/register', (req, res) => {
    console.log(req.body)
    
    // do stuff with mysql
    res.send("post request successfull...")
});

const port =3000;
app.listen(port, () => {
    console.log("Server connected to port:", port)
});