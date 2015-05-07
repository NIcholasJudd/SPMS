/**
 * Created by scottmackenzie on 3/05/2015.
 */

var pg = require('pg');
var path = require('path');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client(connectionString);
client.connect();

//var query = client.query("CREATE TABLE test_user(username varchar(100) PRIMARY KEY, password varchar(100) NOT NULL, userrole varchar(100) NOT NULL)");
//var query = client.query("INSERT INTO test_user VALUES ('admin', 'admin', 'admin')");
var query = client.query("DROP TABLE IF EXISTS project");
var query = client.query("DROP TABLE IF EXISTS employee");
var query = client.query("CREATE TABLE employee(" +
    "email varchar(100) PRIMARY KEY," +
    "first_name varchar(100) NOT NULL," +
    "last_name varchar(100) NOT NULL," +
    "password varchar(100) NOT NULL," +
    "phone varchar(20)," +
    "user_type varchar(20) CHECK (user_type = 'administrator' OR user_type = 'team member') NOT NULL," +
    "performance_index real DEFAULT 0, " +
    "previous_roles varchar(100)[]" +
    ")"
);
var query = client.query("INSERT INTO employee VALUES('admin@admin','Adam', 'Minty', 'admin', '0123456789', 'administrator', 0, ARRAY['tester', 'developer'])");
var query = client.query("CREATE TABLE project(" +
    "project_name varchar(100) PRIMARY KEY, " +
    "description text NOT NULL, " +
        "budget real NOT NULL, " +
        "duration interval NOT NULL, " +
        "start_date date NOT NULL, " +
        "estimated_end_date date NOT NULL, " +
        "progress real NOT NULL DEFAULT 0, " +
        "project_manager varchar(100) REFERENCES employee(email) " +
        ")"
);
query.on('end', function() { client.end(); });