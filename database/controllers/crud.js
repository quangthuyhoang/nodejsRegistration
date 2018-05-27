const db = require('../mysqlDB');

module.exports = {
    // Find User By Email
    findUserByEmail: function(email) {
        return new Promise( (resolve, reject) => {
  
            db.query(
                "SELECT * FROM users WHERE email = ?",
                [email],
                function(err, results, fields)
                {
                    if(err) {
                        reject({error: err});
                    }
                    if(results.length === 0) {
                        resolve({results: null})
                    }
                    if(results.length > 0 && results[0].email === email) {
                        resolve({results: results[0].email})
                    }
                }
            )
        })
    }
}
