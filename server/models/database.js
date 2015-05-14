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
var query = client.query("DROP SEQUENCE IF EXISTS project_sequence");
var query = client.query("DROP SEQUENCE IF EXISTS project_sequence_2");
//var query = client.query("DROP SEQUENCE IF EXISTS project1_seq");
var query = client.query("DROP TABLE IF EXISTS task_role");
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

var query = client.query("CREATE TABLE task_role(" +
    "email varchar(100) REFERENCES employee(email), " +
    "task_id integer REFERENCES task(task_id), " +
    "role_name varchar(100), " +
    "PRIMARY KEY(email, task_id, role_name)" +
    ");"
);

/* TEST SETUP DATA
 */

/* The O.G. Admin will always exist, as an initial entry point into the application */

var query = client.query("INSERT INTO employee VALUES('admin@admin','Adam', 'Minty', 'admin', '0123456789', 'administrator', 0, ARRAY['tester', 'developer'])");


/* A test project - 'My Project 1', with 5 tasks, 4 dependencies between tasks */

var query = client.query("INSERT INTO project VALUES(" +
"'My Project 1', 'Description of project', 500000, '365 days', '2016-03-13', '2017-03-13', 0.4, 'admin@admin')");

var query = client.query("CREATE SEQUENCE project_sequence START 1");

var query = client.query("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
"likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority) VALUES(" +
"nextval('project_sequence'), 'My Project 1', 'Task 1', 'Task 1 Description', '2016-04-04', '2 days', '1 days', " +
"'3 days', 0.4, 'on-the-go', 'critical')");

var query = client.query("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
"likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority) VALUES(" +
"nextval('project_sequence'), 'My Project 1', 'Task 2', 'Task 2 Description', '2016-04-7', '3 days', '4 days', " +
"'6 days', 0.7, 'on-the-go', 'critical')");

var query = client.query("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
"likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority) VALUES(" +
"nextval('project_sequence'), 'My Project 1', 'Task 3', 'Task 3 Description', '2016-04-10', '4 days', '4 days', " +
"'6 days', 0.7, 'on-the-go', 'critical')");

var query = client.query("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
"likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority) VALUES(" +
"nextval('project_sequence'), 'My Project 1', 'Task 4', 'Task 4 Description', '2016-04-15', '3 days', '2 days', " +
"'6 days', 0.7, 'unassigned', 'critical')");

var query = client.query("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
"likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority) VALUES(" +
"nextval('project_sequence'), 'My Project 1', 'Task 5', 'Task 5 Description', '2016-04-05', '10 days', '7 days', " +
"'15 days', 0.7, 'unassigned', 'critical')");

var query = client.query("INSERT INTO task_role VALUES('admin@admin'," +
"(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 1'), " +
"'developer')");

var query = client.query("INSERT INTO task_role VALUES('admin@admin'," +
"(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 2'), " +
"'tester')");

var query = client.query("INSERT INTO task_role VALUES('admin@admin'," +
"(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 3'), " +
"'developer')");

var query = client.query("INSERT INTO link(project_name, source, target, type) VALUES('My Project 1', " +
    "(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 1'), " + "" +
"(SELECT task_id from task where task_name = 'Task 2'), 'finish to start')");
var query = client.query("INSERT INTO link(project_name, source, target, type) VALUES('My Project 1', " +
"(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 2'), " + "" +
"(SELECT task_id from task where task_name = 'Task 3'), 'finish to start')");
var query = client.query("INSERT INTO link(project_name, source, target, type) VALUES('My Project 1', " +
"(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 3'), " + "" +
"(SELECT task_id from task where task_name = 'Task 4'), 'finish to start')");
var query = client.query("INSERT INTO link(project_name, source, target, type) VALUES('My Project 1', " +
"(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 1'), " + "" +
"(SELECT task_id from task where task_name = 'Task 5'), 'finish to start')");

/* My Project 2 - 3 tasks, 2 dependencies */

var query = client.query("INSERT INTO project VALUES(" +
"'My Project 2', 'Description of project 2', 1000000, '180 days', '2015-06-06', '2015-12-06', 0.3, 'admin@admin')");

var query = client.query("CREATE SEQUENCE project_sequence_2 START 1");

var query = client.query("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
"likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority) VALUES(" +
"nextval('project_sequence_2'), 'My Project 2', 'Task 1', 'Task 1 Description', '2015-06-06', '3 days', '2 days', " +
"'4 days', 0.4, 'on-the-go', 'critical')");

var query = client.query("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
"likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority) VALUES(" +
"nextval('project_sequence_2'), 'My Project 2', 'Task 2', 'Task 2 Description', '2015-06-10', '3 days', '2 days', " +
"'4 days', 0.4, 'unassigned', 'critical')");

var query = client.query("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
"likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority) VALUES(" +
"nextval('project_sequence_2'), 'My Project 2', 'Task 3', 'Task 3 Description', '2015-06-14', '3 days', '2 days', " +
"'4 days', 0.4, 'unassigned', 'critical')");

var query = client.query("INSERT INTO task_role VALUES('admin@admin'," +
"(SELECT task_id from task where project_name = 'My Project 2' AND task_name = 'Task 1'), " +
"'developer')");

var query = client.query("INSERT INTO link(project_name, source, target, type) VALUES('My Project 2', " +
"(SELECT task_id from task where project_name = 'My Project 2' AND task_name = 'Task 1'), " +
"(SELECT task_id from task where project_name = 'My Project 2' AND task_name = 'Task 2'), 'finish to start')");

var query = client.query("INSERT INTO link(project_name, source, target, type) VALUES('My Project 2', " +
"(SELECT task_id from task where project_name = 'My Project 2' AND task_name = 'Task 2'), " +
"(SELECT task_id from task where project_name = 'My Project 2' AND task_name = 'Task 3'), 'finish to start')");

query.on('end', function() { client.end(); });