/**
 * Created by scottmackenzie on 3/05/2015.
 */

var path = require('path');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var promise = require('promise');
var pgpLib = require('pg-promise');
var bcrypt = require('bcrypt');

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

var db = pgp(connectionString);

var rootPwd = 'root';

bcrypt.hash(rootPwd, 10, function(err, hash) {
//tests
    db.tx(function(t) {
        var queries = [];
        queries.push(t.none('DROP SEQUENCE IF EXISTS myproject1seq'));
        queries.push(t.none('DROP SEQUENCE IF EXISTS myproject2seq'));
        queries.push(t.none('DROP SEQUENCE IF EXISTS myproject3seq'));
        queries.push(t.none('DROP SEQUENCE IF EXISTS projectflappybirdseq'));
        queries.push(t.none('DROP TABLE IF EXISTS cocomoscore'));
        queries.push(t.none('DROP TABLE IF EXISTS functionpoint'));
        queries.push(t.none('DROP TABLE IF EXISTS taskcomment'));
        queries.push(t.none('DROP TABLE IF EXISTS taskrole'));
        queries.push(t.none('DROP TABLE IF EXISTS link'));
        queries.push(t.none('DROP TABLE IF EXISTS task'));
        queries.push(t.none('DROP TABLE IF EXISTS project'));
        queries.push(t.none('DROP TABLE IF EXISTS skill'));
        queries.push(t.none('DROP TABLE IF EXISTS account'));
        queries.push(t.none('DROP TABLE IF EXISTS plans CASCADE'));
        queries.push(t.none('DROP TABLE IF EXISTS employee'));
//
        queries.push(t.none('CREATE TABLE employee(' +
            'email varchar(100) PRIMARY KEY,' +
            '"firstName" varchar(100) NOT NULL,' +
            '"lastName" varchar(100) NOT NULL,' +
            'password varchar(200) NOT NULL,' +
            'phone varchar(20),' +
            '"userType" varchar(20) CHECK ("userType" = \'administrator\' OR "userType" = \'team member\') NOT NULL,' +
            '"performanceIndex" real DEFAULT 0, ' +
            '"skills" varchar(100)[], ' +
            'active boolean ' +
        ')'));

        queries.push(t.none('CREATE TABLE plans(' +
            '"planId" int NOT NULL, ' +
            '"planName" varchar(100) NOT NULL, ' +
            '"userLimit" int NOT NULL, ' +
            'price money NOT NULL ' +
            ')' ));

        queries.push(t.none('CREATE TABLE account(' +
            '"accountId" serial PRIMARY KEY, ' +
            '"accountName" varchar(100) NOT NULL,' +
            '"accountHolder" varchar(100) REFERENCES employee(email) ON DELETE CASCADE,' +
            '"planId" int NOT NULL,' +
            '"signUpDate" date NOT NULL,' +
            'active boolean ' +
            ')'));

        queries.push(t.none('CREATE TABLE skill(' +
            '"skillName" varchar(100) NOT NULL, ' +
            'email varchar(100) references employee ON DELETE CASCADE' +
        ')'));

        queries.push(t.none('CREATE TABLE project(' +
            '"projectName" varchar(100) PRIMARY KEY, ' +
            'description text NOT NULL, ' +
            'budget real NOT NULL, ' +
            '"startDate" date NOT NULL, ' +
            '"estimatedEndDate" date NOT NULL, ' +
            'active boolean NOT NULL, ' +
            '"projectManager" varchar(100) REFERENCES employee(email) ON DELETE CASCADE,' +
            '"archiveReason" text NULL ' +
            ')'
        ));



        queries.push(t.none('CREATE TABLE task(' +
            '"taskId" serial UNIQUE NOT NULL,' +
            '"taskNumber" int NOT NULL,' +
            '"projectName" varchar(100) REFERENCES project ON DELETE CASCADE,' +
            '"taskName" varchar(100) NOT NULL,' +
            'description text,' +
            '"startDate" date NOT NULL, ' +
            '"likelyDuration" interval NOT NULL,' +
            '"optimisticDuration" interval NOT NULL,' +
            '"pessimisticDuration" interval NOT NULL,' +
            '"comfortZone" interval NOT NULL, ' +
            '"progressPercentage" real DEFAULT 0 NOT NULL,' +
            'status varchar(20) CHECK(status = \'unassigned\' OR status = \'on-the-go\' OR status = \'finalised\' OR ' +
            'status = \'complete\') DEFAULT \'unassigned\' NOT NULL, ' +
            'priority varchar(20) CHECK(priority = \'critical\' OR priority = \'high\' OR priority = \'medium\' OR ' +
            'priority = \'low\') NOT NULL, ' +
                //'parentid integer REFERENCES task("taskId"),' +
            'active boolean, ' +
            'PRIMARY KEY("taskNumber", "projectName")' +
            ')'
        ));

        queries.push(t.none('CREATE TABLE link(' +
            '"linkId" serial PRIMARY KEY, ' +
            '"projectName" varchar(100) REFERENCES project ON DELETE CASCADE, ' +
            'source integer REFERENCES task("taskId") NOT NULL, ' +
            'target integer REFERENCES task("taskId") NOT NULL, ' +
            'type varchar(20) CHECK(type = \'finish to start\' OR ' +
            'type = \'start to start\' OR type = \'finish to finish\' OR type = \'start to finish\'));'
        ));

        queries.push(t.none('CREATE TABLE taskrole(' +
            'email varchar(100) REFERENCES employee(email), ' +
            '"taskId" integer REFERENCES task("taskId") ON DELETE CASCADE, ' +
            '"roleName" varchar(100), ' +
            'active boolean, ' +
            'PRIMARY KEY(email, "taskId", "roleName")' +
            ');'
        ));

        queries.push(t.none('CREATE TABLE taskcomment(' +
            '"commentId" serial PRIMARY KEY, ' +
            '"taskId" int REFERENCES task("taskId") ON DELETE CASCADE, ' +
            '"commentDate" date NOT NULL, ' +
            '"commentText" text NOT NULL, ' +
            'email varchar(100) REFERENCES employee(email) ON DELETE CASCADE NOT NULL' +
            ');'
        ));

        queries.push(t.none('CREATE TABLE functionpoint(' +
            '"projectName" varchar(100) REFERENCES project ON DELETE CASCADE UNIQUE NOT NULL, ' +
            '"adjustedFunctionPointCount" REAL, ' +
            '"adjustmentFactor" REAL[], ' +
            '"functionCounts" REAL[][], ' +
            'calculated BOOLEAN NOT NULL ' +
            ');'
        ));

        queries.push(t.none('CREATE TABLE cocomoscore(' +
            '"projectName" varchar(100) REFERENCES project ON DELETE CASCADE UNIQUE NOT NULL, ' +
            '"cocomoScores" REAL[], ' +
            '"personMonths" REAL, ' +
            'calculated BOOLEAN NOT NULL ' +
            ');'
        ));

// TEST SETUP DATA


// The O.G. Admin will always exist, as an initial entry point into the application

        queries.push(t.none("INSERT INTO employee VALUES('admin@admin','Adam', 'Minty', $1, '0123456789', 'administrator', 0, ARRAY['tester', 'developer'], true)", [hash]));


        // test team members

        queries.push(t.none("INSERT INTO employee VALUES('scott@tm','Scott', 'Mackenzie', $1, '0123456789', 'team member', 0.5, ARRAY['developer', 'tester', 'operations'], true)", hash));
        queries.push(t.none("INSERT INTO employee VALUES('paul@tm','Paul', 'Beavis', $1, '0123456789', 'team member', 0.5, ARRAY['developer', 'designer'], true)", hash));
        queries.push(t.none("INSERT INTO employee VALUES('nick@tm','Nick', 'Judd', $1, '0123456789', 'team member', 0.5, ARRAY['designer', 'tester', 'analyst'], true)", hash));
        queries.push(t.none("INSERT INTO employee VALUES('jim@tm','Jim', 'Gollop', $1, '0123456789', 'team member', 0.5, ARRAY['developer', 'tester', 'analyst' ], true)", hash));

        queries.push(t.none("INSERT INTO account VALUES(nextval('\"account_accountId_seq\"'), 'UOW', 'nick@tm', 41, '2015-11-20', true)"));

// A test project - 'My Project 1', with 5 tasks, 4 dependencies between tasks

        queries.push(t.none("INSERT INTO project VALUES(" +
        "'My Project 1', 'Description of project', 500000, '2016-03-13', '2017-03-13', true, 'admin@admin')"));

        queries.push(t.none("INSERT INTO functionpoint VALUES(" +
        "'My Project 1', null, null, null, false)"));

        queries.push(t.none("INSERT INTO cocomoscore VALUES(" +
        "'My Project 1', null, null, false)"));

        /*queries.push(t.none('CREATE TABLE plan(' +
            '"planId" serial UNIQUE PRIMARY KEY, ' +
            '"planName" varchar(100), ' +
            '"userLimit" int NOT NULL, ' +
            'price money NOT NULL ' +
            ')' ));*/


        queries.push(t.none("INSERT INTO plans VALUES(1, 'testPlan1','1', '0.0')"));
        queries.push(t.none("INSERT INTO plans VALUES(2, 'testPlan2','10', '0.0')"));
        queries.push(t.none("INSERT INTO plans VALUES(3, 'testPlan3','100', '0.0')"));
        queries.push(t.none("INSERT INTO plans VALUES(4, 'testPlan4','1000', '0.0')"));

        queries.push(t.none("CREATE SEQUENCE myproject1seq START 1"));

        /*queries.push(t.none("INSERT INTO task(tasknumber, 'projectName', 'taskName', description, 'startDate', " +
         "'likelyDuration', 'optimisticDuration', 'pessimisticDuration', 'progressPercentage', status, priority, active) VALUES(" +
         "nextval('myproject1seq'), 'My Project 1', 'Task 1', 'Task 1 Description', '2016-04-04', '2 days', '1 days', " +
         "'3 days', 0.4, 'on-the-go', 'critical', true)"));*/

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), nextval('myproject1seq'), 'My Project 1', " +
        "'Task 1', 'Task 1 Description', '2016-04-04', '2 days', '1 days', '3 days', '1 days', 40, 'on-the-go', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), nextval('myproject1seq'), 'My Project 1', " +
        "'Task 2', 'Task 2 Description', '2016-04-7', '3 days', '4 days', '6 days', '2 days', 70, 'on-the-go', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), nextval('myproject1seq'), 'My Project 1', " +
        "'Task 3', 'Task 3 Description', '2016-04-10', '4 days', '4 days', '6 days', '2 days', 70, 'on-the-go', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), nextval('myproject1seq'), 'My Project 1', " +
        "'Task 4', 'Task 4 Description', '2016-04-15', '3 days', '2 days', '6 days', '3 days', 70, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), nextval('myproject1seq'), 'My Project 1', " +
        "'Task 5', 'Task 5 Description', '2016-04-08', '4 days', '1 days', " +
        "'6 days', '4 days', 70, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO taskrole VALUES('admin@admin'," +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 1' AND \"taskName\" = 'Task 1'), " +
        "'developer', true)"));

        queries.push(t.none("INSERT INTO taskrole VALUES('scott@tm'," +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 1' AND \"taskName\" = 'Task 2'), " +
        "'tester', true)"));

        queries.push(t.none("INSERT INTO taskrole VALUES('nick@tm'," +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 1' AND \"taskName\" = 'Task 3'), " +
        "'developer', true)"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'My Project 1', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 1' AND \"taskName\" = 'Task 1'), " +
        "(SELECT \"taskId\" from task where \"taskName\" = 'Task 2'), 'finish to start')"));
        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'My Project 1', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 1' AND \"taskName\" = 'Task 2'), " +
        "(SELECT \"taskId\" from task where \"taskName\" = 'Task 3'), 'finish to start')"));
        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'My Project 1', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 1' AND \"taskName\" = 'Task 3'), " +
        "(SELECT \"taskId\" from task where \"taskName\" = 'Task 4'), 'finish to start')"));
        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'My Project 1', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 1' AND \"taskName\" = 'Task 1'), " +
        "(SELECT \"taskId\" from task where \"taskName\" = 'Task 5'), 'finish to start')"));
        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'My Project 1', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 1' AND \"taskName\" = 'Task 5'), " +
        "(SELECT \"taskId\" from task where \"taskName\" = 'Task 4'), 'finish to start')"));

// My Project 2 - 3 tasks, 2 dependencies

        queries.push(t.none("INSERT INTO project VALUES(" +
        "'My Project 2', 'Description of project 2', 1000000, '2015-06-06', '2015-12-06', true, 'admin@admin')"));

        queries.push(t.none("CREATE SEQUENCE myproject2seq START 1"));

        queries.push(t.none("INSERT INTO functionpoint VALUES(" +
        "'My Project 2', null, null, null, false)"));

        queries.push(t.none("INSERT INTO cocomoscore VALUES(" +
        "'My Project 2', null, null, false)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('myproject2seq'), 'My Project 2', 'Task 1', 'Task 1 Description', '2015-06-06', '3 days', '2 days', " +
        "'4 days', '1 days', 40, 'on-the-go', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('myproject2seq'), 'My Project 2', 'Task 2', 'Task 2 Description', '2015-06-10', '3 days', '2 days', " +
        "'4 days', '1 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('myproject2seq'), 'My Project 2', 'Task 3', 'Task 3 Description', '2015-06-14', '3 days', '2 days', " +
        "'4 days', '1 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO taskrole VALUES('paul@tm'," +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 2' AND \"taskName\" = 'Task 1'), " +
        "'developer', true)"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'My Project 2', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 2' AND \"taskName\" = 'Task 1'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 2' AND \"taskName\" = 'Task 2'), 'finish to start')"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'My Project 2', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 2' AND \"taskName\" = 'Task 2'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 2' AND \"taskName\" = 'Task 3'), 'finish to start')"));

// My Project 3 - 3 tasks, 2 dependencies, assigned to Scott

        queries.push(t.none("INSERT INTO project VALUES(" +
        "'My Project 3', 'Description of project 3', 1000000, '2015-04-01', '2015-05-01', true, 'scott@tm')"));

        queries.push(t.none("CREATE SEQUENCE myproject3seq START 1"));

        queries.push(t.none("INSERT INTO functionpoint VALUES(" +
        "'My Project 3', null, null, null, false)"));

        queries.push(t.none("INSERT INTO cocomoscore VALUES(" +
        "'My Project 3', null, null, false)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('myproject3seq'), 'My Project 3', 'Design', 'Design application', '2015-04-01', '10 days', '7 days', " +
        "'18 days', '4 days', 40, 'on-the-go', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('myproject3seq'), 'My Project 3', 'Develop', 'Develop application', '2015-04-11', '8 days', '5 days', " +
        "'10 days', '3 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('myproject3seq'), 'My Project 3', 'Test', 'Task 3 Description', '2015-04-19', '10 days', '8 days', " +
        "'13 days', '4 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO taskrole VALUES('paul@tm'," +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 3' AND \"taskName\" = 'Design'), " +
        "'designer', true)"));

        queries.push(t.none("INSERT INTO taskrole VALUES('nick@tm'," +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 3' AND \"taskName\" = 'Design'), " +
        "'analyst', true)"));

        queries.push(t.none("INSERT INTO taskrole VALUES('nick@tm'," +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 3' AND \"taskName\" = 'Develop'), " +
        "'analyst', true)"));

        queries.push(t.none("INSERT INTO taskrole VALUES('jim@tm'," +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 3' AND \"taskName\" = 'Test'), " +
        "'tester', true)"));


        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'My Project 3', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 3' AND \"taskName\" = 'Design'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 3' AND \"taskName\" = 'Develop'), 'finish to start')"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'My Project 3', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 3' AND \"taskName\" = 'Develop'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'My Project 3' AND \"taskName\" = 'Test'), 'finish to start')"));

        // Project Flappy Bird

        queries.push(t.none("INSERT INTO project VALUES(" +
        "'Project Flappy Bird', 'Develop Flappy Bird application', 1000000, '2015-05-10', '2015-07-01', true, 'scott@tm')"));

        queries.push(t.none("CREATE SEQUENCE projectflappybirdseq START 1"));

        queries.push(t.none("INSERT INTO functionpoint VALUES(" +
        "'Project Flappy Bird', null, null, null, false)"));

        queries.push(t.none("INSERT INTO cocomoscore VALUES(" +
        "'Project Flappy Bird', null, null, false)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('projectflappybirdseq'), 'Project Flappy Bird', 'Recruit Staff', 'Recruit staff members', '2015-05-10', '10 days', '7 days', " +
        "'18 days', '4 days', 40, 'on-the-go', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('projectflappybirdseq'), 'Project Flappy Bird', 'Design UI', 'Design User Interface', '2015-05-20', '5 days', '3 days', " +
        "'9 days', '3 days', 40, 'on-the-go', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('projectflappybirdseq'), 'Project Flappy Bird', 'Develop UI', 'Develop User Interface', '2015-05-25', '3 days', '2 days', " +
        "'6 days', '2 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Recruit Staff'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Design UI'), 'finish to start')"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Design UI'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Develop UI'), 'finish to start')"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('projectflappybirdseq'), 'Project Flappy Bird', 'Design Game', 'Design Game Functionality', '2015-05-20', '7 days', '3 days', " +
        "'14 days', '3 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('projectflappybirdseq'), 'Project Flappy Bird', 'Develop Game', 'Develop Game Functionality', '2015-05-27', '5 days', '2 days', " +
        "'6 days', '2 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('projectflappybirdseq'), 'Project Flappy Bird', 'Functionality Unit Testing', 'Unit testing of game functionality', '2015-06-01', '7 days', '5 days', " +
        "'10 days', '2 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Recruit Staff'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Design Game'), 'finish to start')"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Design Game'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Develop Game'), 'finish to start')"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Develop Game'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Functionality Unit Testing'), 'finish to start')"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('projectflappybirdseq'), 'Project Flappy Bird', 'Integrate Application', 'Integrate application', '2015-06-08', '7 days', '5 days', " +
        "'10 days', '2 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Functionality Unit Testing'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Integrate Application'), 'finish to start')"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Develop UI'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Integrate Application'), 'finish to start')"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('projectflappybirdseq'), 'Project Flappy Bird', 'End to end testing', 'e2e testing', '2015-06-15', '7 days', '5 days', " +
        "'10 days', '2 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Integrate Application'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'End to end testing'), 'finish to start')"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('projectflappybirdseq'), 'Project Flappy Bird', 'Beta testing', 'Beta testing', '2015-06-22', '3 days', '2 days', " +
        "'5 days', '2 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'End to end testing'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Beta testing'), 'finish to start')"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('projectflappybirdseq'), 'Project Flappy Bird', 'Documentation', 'Document application', '2015-06-18', '3 days', '2 days', " +
        "'5 days', '2 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Develop Game'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Documentation'), 'finish to start')"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Develop UI'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Documentation'), 'finish to start')"));

        queries.push(t.none("INSERT INTO task VALUES(nextval('\"task_taskId_seq\"'), " +
        "nextval('projectflappybirdseq'), 'Project Flappy Bird', 'Deploy', 'Deploy application', '2015-06-25', '3 days', '2 days', " +
        "'5 days', '2 days', 40, 'unassigned', 'critical', true)"));

        queries.push(t.none("INSERT INTO link VALUES(nextval('\"link_linkId_seq\"'), 'Project Flappy Bird', " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Beta testing'), " +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Deploy'), 'finish to start')"));

        queries.push(t.none("INSERT INTO taskrole VALUES('paul@tm'," +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Design UI'), " +
        "'designer', true)"));

        queries.push(t.none("INSERT INTO taskrole VALUES('nick@tm'," +
        "(SELECT \"taskId\" from task where \"projectName\" = 'Project Flappy Bird' AND \"taskName\" = 'Recruit Staff'), " +
        "'analyst', true)"));


        return promise.all([queries]);

    }).then(function(data) {
        console.log('Tables and initial data successfully loaded into database');
    }, function(reason) {
        console.log(reason);//error reason
    });

});

module.exports = db;

