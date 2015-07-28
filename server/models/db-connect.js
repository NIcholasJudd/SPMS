/**
 * Created by scottmackenzie on 28/07/15.
 */

var path = require('path');
var dbConfig = require(path.join(__dirname, '../', '../', 'config'));
var pgpLib = require('pg-promise');


var options = {
    error : function(err, e) {
        console.log("Error: " + err);
        if (e.query) {
            console.log("Query: " + e.query);
            if (e.params) {
                console.log("Parameters: " + e.params);
            }
        }
    }
}

var pgp = pgpLib(options);

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

var db = pgp(dbConfig[process.env.NODE_ENV].connectionString);
console.log("Connection made to " + process.env.NODE_ENV + " database");

module.exports = db;