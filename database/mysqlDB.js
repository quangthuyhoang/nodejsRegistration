const mysql = require('mysql');

const db = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'sampleDB'
});

// db.connect();
// Tests
// db.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
//     if(err) throw Error(err);
//     console.log("rsults",results)
//     console.log("solution is:", results[0].solution)
// })

module.exports = db;