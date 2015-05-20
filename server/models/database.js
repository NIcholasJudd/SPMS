/**
 * Created by scottmackenzie on 3/05/2015.
 */

var path = require('path');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var promise = require('promise');
var pgpLib = require('pg-promise');

var options = {
    /*connect : function(client) {
        var cp = client.connectionParameters;
        console.log("Connected to database '" + cp.database + "'");
    },*/
    error : function(err, e) {
        console.log("Error: " + err);
        if (e.query) {
            console.log("Query: " + e.query);
            if (e.params) {
                console.log("Parameters: " + e.params);
            }
        }
    }/*,
    disconnect : function(client) {
        var cp = client.connectionParameters;
        console.log("Disconnecting from database '" + cp.database + "'");
    }*/
}

var pgp = pgpLib(options);

var db = pgp(connectionString);

db.tx(function(t) {
    var queries = [];
    queries.push(t.none("DROP SEQUENCE IF EXISTS myproject1_seq"));
    queries.push(t.none("DROP SEQUENCE IF EXISTS myproject2_seq"));
    queries.push(t.none("DROP SEQUENCE IF EXISTS myproject3_seq"));
    queries.push(t.none("DROP TABLE IF EXISTS task_role"));
    queries.push(t.none("DROP TABLE IF EXISTS link"));
    queries.push(t.none("DROP TABLE IF EXISTS task"));
    queries.push(t.none("DROP TABLE IF EXISTS project"));
    queries.push(t.none("DROP TABLE IF EXISTS skill"));
    queries.push(t.none("DROP TABLE IF EXISTS employee"));
    queries.push(t.none("CREATE TABLE employee(" +
    "email varchar(100) PRIMARY KEY," +
    "first_name varchar(100) NOT NULL," +
    "last_name varchar(100) NOT NULL," +
    "password varchar(100) NOT NULL," +
    "phone varchar(20)," +
    "user_type varchar(20) CHECK (user_type = 'administrator' OR user_type = 'team member') NOT NULL," +
    "performance_index real DEFAULT 0, " +
    "previous_roles varchar(100)[]" +
    ")"));

    queries.push(t.none("CREATE TABLE skill(skill_name varchar(100) NOT NULL, email varchar(100) references employee)"));

    queries.push(t.none("CREATE TABLE project(" +
        "project_name varchar(100) PRIMARY KEY, " +
        "description text NOT NULL, " +
        "budget real NOT NULL, " +
        "duration interval NOT NULL, " +
        "start_date date NOT NULL, " +
        "estimated_end_date date NOT NULL, " +
        "progress real NOT NULL DEFAULT 0, " +
        "active boolean, " +
        "project_manager varchar(100) REFERENCES employee(email) " +
        ")"
    ));



    queries.push(t.none("CREATE TABLE task(" +
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
        "active boolean, " +
        "PRIMARY KEY(task_number, project_name)" +
        ")"
    ));

    queries.push(t.none("CREATE TABLE link(" +
        "link_id serial PRIMARY KEY, " +
        "project_name varchar(100) REFERENCES project ON DELETE CASCADE, " +
        "source integer REFERENCES task(task_id) NOT NULL, " +
        "target integer REFERENCES task(task_id) NOT NULL, " +
        "type varchar(20) CHECK(type = 'finish to start' OR " +
        "type = 'start to start' OR type = 'finish to finish' OR type = 'start to finish'));"
    ));

    queries.push(t.none("CREATE TABLE task_role(" +
        "email varchar(100) REFERENCES employee(email), " +
        "task_id integer REFERENCES task(task_id) ON DELETE CASCADE, " +
        "role_name varchar(100), " +
        "active boolean, " +
        "PRIMARY KEY(email, task_id, role_name)" +
        ");"
    ));

// TEST SETUP DATA


// The O.G. Admin will always exist, as an initial entry point into the application

    queries.push(t.none("INSERT INTO employee VALUES('admin@admin','Adam', 'Minty', 'admin', '0123456789', 'administrator', 0, ARRAY['tester', 'developer'])"));


    // test team members

    queries.push(t.none("INSERT INTO employee VALUES('scott@tm','Scott', 'Mackenzie', 'pass', '0123456789', 'team member', 0.5, ARRAY['developer', 'tester', 'operations'])"));
    queries.push(t.none("INSERT INTO employee VALUES('paul@tm','Paul', 'Beavis', 'pass', '0123456789', 'team member', 0.5, ARRAY['developer', 'designer'])"));
    queries.push(t.none("INSERT INTO employee VALUES('nick@tm','Nick', 'Judd', 'pass', '0123456789', 'team member', 0.5, ARRAY['designer', 'tester', 'analyst'])"));
    queries.push(t.none("INSERT INTO employee VALUES('jim@tm','Jim', 'Gollop', 'pass', '0123456789', 'team member', 0.5, ARRAY['developer', 'tester', 'analyst' ])"));



// A test project - 'My Project 1', with 5 tasks, 4 dependencies between tasks

    queries.push(t.none("INSERT INTO project VALUES(" +
    "'My Project 1', 'Description of project', 500000, '365 days', '2016-03-13', '2017-03-13', 0.4, true, 'admin@admin')"));

    queries.push(t.none("CREATE SEQUENCE myproject1_seq START 1"));

    queries.push(t.none("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, active) VALUES(" +
    "nextval('myproject1_seq'), 'My Project 1', 'Task 1', 'Task 1 Description', '2016-04-04', '2 days', '1 days', " +
    "'3 days', 0.4, 'on-the-go', 'critical', true)"));

    queries.push(t.none("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, active) VALUES(" +
    "nextval('myproject1_seq'), 'My Project 1', 'Task 2', 'Task 2 Description', '2016-04-7', '3 days', '4 days', " +
    "'6 days', 0.7, 'on-the-go', 'critical', true)"));

    queries.push(t.none("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, active) VALUES(" +
    "nextval('myproject1_seq'), 'My Project 1', 'Task 3', 'Task 3 Description', '2016-04-10', '4 days', '4 days', " +
    "'6 days', 0.7, 'on-the-go', 'critical', true)"));

    queries.push(t.none("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, active) VALUES(" +
    "nextval('myproject1_seq'), 'My Project 1', 'Task 4', 'Task 4 Description', '2016-04-15', '3 days', '2 days', " +
    "'6 days', 0.7, 'unassigned', 'critical', true)"));

    queries.push(t.none("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, active) VALUES(" +
    "nextval('myproject1_seq'), 'My Project 1', 'Task 5', 'Task 5 Description', '2016-04-05', '10 days', '7 days', " +
    "'15 days', 0.7, 'unassigned', 'critical', true)"));

    queries.push(t.none("INSERT INTO task_role VALUES('admin@admin'," +
    "(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 1'), " +
    "'developer', true)"));

    queries.push(t.none("INSERT INTO task_role VALUES('scott@tm'," +
    "(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 2'), " +
    "'tester', true)"));

    queries.push(t.none("INSERT INTO task_role VALUES('nick@tm'," +
    "(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 3'), " +
    "'developer', true)"));

    queries.push(t.none("INSERT INTO link(project_name, source, target, type) VALUES('My Project 1', " +
    "(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 1'), " + "" +
    "(SELECT task_id from task where task_name = 'Task 2'), 'finish to start')"));
    queries.push(t.none("INSERT INTO link(project_name, source, target, type) VALUES('My Project 1', " +
    "(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 2'), " + "" +
    "(SELECT task_id from task where task_name = 'Task 3'), 'finish to start')"));
    queries.push(t.none("INSERT INTO link(project_name, source, target, type) VALUES('My Project 1', " +
    "(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 3'), " + "" +
    "(SELECT task_id from task where task_name = 'Task 4'), 'finish to start')"));
    queries.push(t.none("INSERT INTO link(project_name, source, target, type) VALUES('My Project 1', " +
    "(SELECT task_id from task where project_name = 'My Project 1' AND task_name = 'Task 1'), " + "" +
    "(SELECT task_id from task where task_name = 'Task 5'), 'finish to start')"));

// My Project 2 - 3 tasks, 2 dependencies

    queries.push(t.none("INSERT INTO project VALUES(" +
    "'My Project 2', 'Description of project 2', 1000000, '180 days', '2015-06-06', '2015-12-06', 0.3, true, 'admin@admin')"));

    queries.push(t.none("CREATE SEQUENCE myproject2_seq START 1"));

    queries.push(t.none("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, active) VALUES(" +
    "nextval('myproject2_seq'), 'My Project 2', 'Task 1', 'Task 1 Description', '2015-06-06', '3 days', '2 days', " +
    "'4 days', 0.4, 'on-the-go', 'critical', true)"));

    queries.push(t.none("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, active) VALUES(" +
    "nextval('myproject2_seq'), 'My Project 2', 'Task 2', 'Task 2 Description', '2015-06-10', '3 days', '2 days', " +
    "'4 days', 0.4, 'unassigned', 'critical', true)"));

    queries.push(t.none("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, active) VALUES(" +
    "nextval('myproject2_seq'), 'My Project 2', 'Task 3', 'Task 3 Description', '2015-06-14', '3 days', '2 days', " +
    "'4 days', 0.4, 'unassigned', 'critical', true)"));

    queries.push(t.none("INSERT INTO task_role VALUES('paul@tm'," +
    "(SELECT task_id from task where project_name = 'My Project 2' AND task_name = 'Task 1'), " +
    "'developer', true)"));

    queries.push(t.none("INSERT INTO link(project_name, source, target, type) VALUES('My Project 2', " +
    "(SELECT task_id from task where project_name = 'My Project 2' AND task_name = 'Task 1'), " +
    "(SELECT task_id from task where project_name = 'My Project 2' AND task_name = 'Task 2'), 'finish to start')"));

    queries.push(t.none("INSERT INTO link(project_name, source, target, type) VALUES('My Project 2', " +
    "(SELECT task_id from task where project_name = 'My Project 2' AND task_name = 'Task 2'), " +
    "(SELECT task_id from task where project_name = 'My Project 2' AND task_name = 'Task 3'), 'finish to start')"));

// My Project 3 - 3 tasks, 2 dependencies, assigned to Scott

    queries.push(t.none("INSERT INTO project VALUES(" +
    "'My Project 3', 'Description of project 3', 1000000, '90 days', '2015-04-01', '2015-07-01', 0.3, true, 'scott@tm')"));

    queries.push(t.none("CREATE SEQUENCE myproject3_seq START 1"));

    queries.push(t.none("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, active) VALUES(" +
    "nextval('myproject3_seq'), 'My Project 3', 'Design', 'Design application', '2015-06-06', '5 days', '2 days', " +
    "'7 days', 0.4, 'on-the-go', 'critical', true)"));

    queries.push(t.none("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, active) VALUES(" +
    "nextval('myproject3_seq'), 'My Project 3', 'Develop', 'Develop application', '2015-06-10', '4 days', '2 days', " +
    "'10 days', 0.4, 'unassigned', 'critical', true)"));

    queries.push(t.none("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, active) VALUES(" +
    "nextval('myproject3_seq'), 'My Project 3', 'Test', 'Task 3 Description', '2015-06-18', '5 days', '3 days', " +
    "'6 days', 0.4, 'unassigned', 'critical', true)"));

    queries.push(t.none("INSERT INTO task_role VALUES('paul@tm'," +
    "(SELECT task_id from task where project_name = 'My Project 3' AND task_name = 'Design'), " +
    "'designer', true)"));

    queries.push(t.none("INSERT INTO task_role VALUES('nick@tm'," +
    "(SELECT task_id from task where project_name = 'My Project 3' AND task_name = 'Design'), " +
    "'analyst', true)"));

    queries.push(t.none("INSERT INTO task_role VALUES('nick@tm'," +
    "(SELECT task_id from task where project_name = 'My Project 3' AND task_name = 'Develop'), " +
    "'analyst', true)"));

    queries.push(t.none("INSERT INTO task_role VALUES('jim@tm'," +
    "(SELECT task_id from task where project_name = 'My Project 3' AND task_name = 'Test'), " +
    "'tester', true)"));


    queries.push(t.none("INSERT INTO link(project_name, source, target, type) VALUES('My Project 3', " +
    "(SELECT task_id from task where project_name = 'My Project 3' AND task_name = 'Design'), " +
    "(SELECT task_id from task where project_name = 'My Project 3' AND task_name = 'Develop'), 'finish to start')"));

    queries.push(t.none("INSERT INTO link(project_name, source, target, type) VALUES('My Project 3', " +
    "(SELECT task_id from task where project_name = 'My Project 3' AND task_name = 'Develop'), " +
    "(SELECT task_id from task where project_name = 'My Project 3' AND task_name = 'Test'), 'finish to start')"));

    return promise.all([queries]);
}).then(function(data) {
    console.log("Tables and initial data successfully loaded into database");
}, function(reason) {
    console.log(reason);//error reason
});

module.exports = db;
