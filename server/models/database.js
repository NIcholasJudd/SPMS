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
//var query = client.query("DROP SEQUENCE IF EXISTS project_sequence");
//var query = client.query("DROP SEQUENCE IF EXISTS project1_seq");
var query = client.query("DROP TABLE IF EXISTS link");
var query = client.query("DROP TABLE IF EXISTS task");
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

var query = client.query("CREATE TABLE task(" +
    "task_id serial UNIQUE NOT NULL," +
    "task_number int NOT NULL," +
    "project_name varchar(100) REFERENCES project ON DELETE CASCADE," +
    "task_name varchar(100) NOT NULL," +
    "description text," +
    "start_date date NOT NULL, " +
    "likely_duration interval NOT NULL," +
    "optimistic_duration interval NOT NULL," +
    "pessimistic_duration interval NOT NULL," +
    "progress_percentage real DEFAULT 0 NOT NULL," +
    "status varchar(20) CHECK(status = 'unassigned' OR status = 'on-the-go' OR status = 'finalised' OR " +
    "status = 'complete') DEFAULT 'unassigned' NOT NULL, " +
    "priority varchar(20) CHECK(priority = 'critical' OR priority = 'high' OR priority = 'medium' OR " +
    "priority = 'low') NOT NULL, " +
    "parent_id integer REFERENCES task(task_id)," +
    "PRIMARY KEY(task_number, project_name)" +
    ")"
);

var query = client.query("CREATE TABLE link(" +
    "link_id serial PRIMARY KEY, " +
    "project_name varchar(100) REFERENCES project ON DELETE CASCADE, " +
    "source integer REFERENCES task(task_id) NOT NULL, " +
    "target integer REFERENCES task(task_id) NOT NULL, " +
    "type varchar(20) CHECK(type = 'finish to start' OR " +
    "type = 'start to start' OR type = 'finish to finish' OR type = 'start to finish')" +
    ");"
);

query.on('end', function() { client.end(); });