const mysql = require('mysql');

const db = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password: '',
    database: 'sampleDB'
});

export default db;