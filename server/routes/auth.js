/**
 * Created by scottmackenzie on 2/05/2015.
 */

var jwt = require('jwt-simple'),
    path = require('path'),
    connectionString = require(path.join(__dirname, '../', '../', 'config')),
    pg = require('pg');

var auth = {

    login: function(req, res) {
        console.log('username: ', req.body.username, ' password: ', req.body.password);
        var username = req.body.username;// || '';
        var password = req.body.password;// || '';
        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        // Fire a query to your DB and check if the credentials are valid
        auth.validate(username, password, retrievedCredentials)

        function retrievedCredentials(error, dbUserObj) {
            if(error) return console.error(error);
            if (!dbUserObj) { // If authentication fails, we send a 401 back
                res.status(401);
                console.log('LINE 32');
                res.json({
                    "status": 401,
                    "message": "Invalid credentials"
                });
                return;
            }

            if (dbUserObj) {

                // If authentication is success, we will generate a token
                // and dispatch it to the client

                res.json(genToken(dbUserObj));
            }
        }

    },

    validate: function(username, password, callback) {
        var results = [];
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool: ', err);
            }
            console.log('deets passed to query: ', username, password);
            var query = client.query("SELECT * FROM test_user WHERE username = $1 AND password = $2", [username, password]);
            query.on('row', function(row) {
                results.push(row);
            })
            query.on('end', function() {
                client.end();
                console.log('results: ', results[0]);
                callback(null, results[0]);
            })
            /*client.query("SELECT * FROM test_user WHERE username = $1 AND password = $2", [username, password], function(err, result) {
                done();
                if(err) {
                    client.end();
                    return console.error('error running query: ', err);
                }
                client.end();
                console.log('result of validate function: ', result.rows[0]);
                callback(null, result.rows[0]);
            });*/
        })
    },

    validateUser: function(username, callback) {
        var results = [];
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool: ', err);
            }
            var query = client.query("SELECT * FROM test_user WHERE username = $1", [username]);
            query.on('row', function(row) {
                results.push(row);
            })
            query.on('end', function() {
                client.end();
                callback(null, results[0]);
            })
            /*client.query("SELECT * FROM test_user WHERE username = $1", [username], function(err, result) {
                done();
                if(err) {
                    client.end();
                    return console.error('error running query: ', err);
                }
                client.end();
                console.log('result of validateUser function: ', result.rows[0]);
                callback(null, result.rows[0]);
            });*/
        })
    }
}

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret')());

    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;