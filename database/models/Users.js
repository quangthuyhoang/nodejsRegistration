const bcrypt = require('bcrypt');

const saltRounds = process.env.SALTROUNDS || 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

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

function UserModel(user) {
    var self = this;
    self.email = user.email || '1';
    self.firstName = user.firstName || '1';
    self.lastName = user.lastName || '1';
    self.password = user.password || '1';
    self.gender = user.gender || '1';
    self.date_of_birth = user.date_of_birth || '1';
    self.height = user.height || '1';
    self.genderpref = user.genderpref || '1';
    self.ageminpref = user.ageminpref || '1';
    self.agemaxpref = user.agemaxpref || '1';
    // self.race = user.race || null;
    // self.religion = user.religion || null;
}

// VALIDATION

// add password
UserModel.prototype.genHash = async function(props, value) {
    var self = this;
    if(props === 'password') {
        // update/add password
        const hash = await bcrypt.hash(value, saltRounds)
        self[props] = hash;
    }
}

// returns model values
UserModel.prototype.getValues = function(){
    var vals = [], self = this;
    var arr = Object.keys(this)
    for(let i = 0; i < arr.length; i++) {
        let k = arr[i]
        vals.push(self[k])
    }
    return vals;
}

// email syntax
UserModel.isValidEmail = function (email) {

}
// check character limit
UserModel.isWithinLimit = function(props, limit) {

}

// check valid type
UserModel.isCorrectType = function() {

}

// Create SQL commands here

// INSERT/CREATE
UserModel.prototype.insertQuery = function(){
    var rowStr = "?", columns, obj = Object.keys(this);

    columns = obj.join(", ")
    rowStr = rowStr + ", ?".repeat(obj.length - 1)
 
    var sql = `INSERT INTO Users (${columns}) VALUES (${rowStr})`
    return sql
}

module.exports = UserModel;