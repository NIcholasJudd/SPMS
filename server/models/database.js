/**
 * Created by scottmackenzie on 3/05/2015.
 */

var pg = require('pg');
var path = require('path');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();

var query = client.query("DROP TABLE IF EXISTS test_user");
var query = client.query("CREATE TABLE test_user(username varchar(100) PRIMARY KEY, password varchar(100) NOT NULL, userrole varchar(100) NOT NULL)");
var query = client.query("INSERT INTO test_user VALUES ('admin', 'admin', 'admin')");
/*var query = client.query("DROP TABLE IF EXISTS employee");
var query = client.query("CREATE TABLE employee(" +
    "username varchar(100) PRIMARY KEY," +
    "first_name varchar(100) NOT NULL," +
    "last_name varchar(100) NOT NULL," +
    "password varchar(100) NOT NULL," +
    "email varchar(100) NOT NULL," +
    "phone int," +
    "user_type varchar(20) CHECK (user_type = 'administrator' OR user_type = 'team member') NOT NULL," +
    "performance_index real DEFAULT 0" +
    ")"
);*/
query.on('end', function() { client.end(); });