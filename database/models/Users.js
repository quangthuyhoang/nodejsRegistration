const bcrypt = require('bcrypt');

const saltRounds = process.env.SALTROUNDS || 10;

// const payload = {
//     email: "name@email.com", // var char
//     firstName: '123', // varchar
//     lastName: 'quang', //varchar
//     password: '123', //varchar
//     gender: 'male', //text
//     dob: '1-30-1989', //varchar
//     height: '5.2', //varchar
//     genderPreference: 'female', //varchar 
//     AgeMinPref: 25, //int
//     AgeMaxPref: 35, //int
//     Race: null, //option
//     Religion: null //option
// }

function UserModel(user) {

    var self = this;
    self.email = user.email || null;
    self.firstname = user.firstname || null;
    self.lastname = user.lastname || null;
    self.password = user.password || null;
    self.gender = user.gender || null;
    self.date_of_birth = user.date_of_birth || null;
    self.zipcode = user.zipcode || null;
    self.height = user.height || null;
    self.genderpref = user.genderpref || null;
    self.ageminpref = user.ageminpref || null;
    self.agemaxpref = user.agemaxpref || null;
    self.race = user.race || null;
    self.religion = user.religion || null;
}



// VALIDATION
// update password
UserModel.prototype.updatePassword = function(value) {
    var self = this;
    self['password'] = value;
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