var chai = require('chai');
var expect = chai.expect; 


const User = require('../database/models/Users');

var testUser = { 
    email: "name@email.com", // var char
    firstName: '123', // varchar
    lastName: 'quang',
    password: '123', //varchar
    gender: 'male', //text
    date_of_birth: '1-30-1989', //varchar
    height: '5.2', //varchar
    genderpref: 'female', //varchar 
    ageminpref: 25, //int
    agemaxpref: 35, //int
    // race: null, //option
    // religion: null //option
}
var newUser = new User(testUser)

// Test password hash
newUser.genHash('password', '123')

var sqlStr = newUser.insertQuery(Object.keys(newUser));
var compareSqlStr = `INSERT INTO Users (${Object.keys(testUser).join(", ")}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
const vals = newUser.getValues();
// console.log('vals', vals)
const compareVals = Object.values(testUser);
// console.log('compvals', compareVals, vals)
for(let i = 0; i < vals.length; i++) {
    if(compareVals[i] !== vals[i]) {
        console.log("NO MATCH",compareVals[i], vals[i])
    }
}
describe('User Model', function() {
    describe('INSERT SQL function', function() {
        it('should return INSERT SQL command string', function() {
            expect(sqlStr).to.equal(compareSqlStr);
          });
    })
    describe('get values', function() {
        it('should return array of vals', function() {
            expect(vals).to.eql(compareVals);
          });
    })
  });