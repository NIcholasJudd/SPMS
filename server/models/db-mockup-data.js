/**
 * Created by scottmackenzie on 3/05/2015.
 */
var db = require('./db-connect.js');
var bcrypt = require('bcrypt');
var promise = require('promise');

var dbData = function(done) {

    var rootPwd = 'root';

    bcrypt.hash(rootPwd, 10, function(err, hash) {

        db.tx(function(t) {
            var queries = [];

            queries.push(t.none("INSERT INTO employee VALUES('admin@admin','Adam', 'Minty', $1, '0123456789', ARRAY['tester', 'developer'], true)", [hash]));
            queries.push(t.none("INSERT INTO employee VALUES('scott@tm','Scott', 'Mackenzie', $1, '0123456789', ARRAY['developer', 'tester', 'operations'], true)", hash));
            queries.push(t.none("INSERT INTO employee VALUES('paul@tm','Paul', 'Beavis', $1, '0123456789', ARRAY['developer', 'designer'], true)", hash));
            queries.push(t.none("INSERT INTO employee VALUES('nick@tm','Nick', 'Judd', $1, '0123456789', ARRAY['designer', 'tester', 'analyst'], true)", hash));
            queries.push(t.none("INSERT INTO employee VALUES('jim@tm','Jim', 'Gollop', $1, '0123456789', ARRAY['developer', 'tester', 'analyst' ], true)", hash));
            /*


             // A test project - 'My Project 1', with 5 tasks, 4 dependencies between tasks

             queries.push(t.none("INSERT INTO project VALUES(" +
             "'My Project 1', 'Description of project', 500000, '2016-03-13', '2017-03-13', true, 'admin@admin')"));

             queries.push(t.none("INSERT INTO functionpoint VALUES(" +
             "'My Project 1', null, null, null, false)"));

             queries.push(t.none("INSERT INTO cocomoscore VALUES(" +
             "'My Project 1', null, null, false)"));

             queries.push(t.none("CREATE SEQUENCE myproject1seq START 1"));

             //queries.push(t.none("INSERT INTO task(tasknumber, 'projectName', 'taskName', description, 'startDate', " +
             //"'likelyDuration', 'optimisticDuration', 'pessimisticDuration', 'progressPercentage', status, priority, active) VALUES(" +
             //"nextval('myproject1seq'), 'My Project 1', 'Task 1', 'Task 1 Description', '2016-04-04', '2 days', '1 days', " +
             //"'3 days', 0.4, 'on-the-go', 'critical', true)"));

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
             "'analyst', true)"));*/

            queries.push(t.none("INSERT INTO plan VALUES(nextval('\"plan_planId_seq\"'), " +
                "'micro', 10, 10)"));
            queries.push(t.none("INSERT INTO plan VALUES(nextval('\"plan_planId_seq\"'), " +
                "'mini', 15, 50)"));
            queries.push(t.none("INSERT INTO plan VALUES(nextval('\"plan_planId_seq\"'), " +
                "'medium', 25, 100)"));
            queries.push(t.none("INSERT INTO plan VALUES(nextval('\"plan_planId_seq\"'), " +
                "'large', 50, 200)"));

            return promise.all([queries]);

        }).then(function(data) {
            /*
             TODO: handle errors properly?  difficult to do, but at least its obvious if something fucks up
             */
            done(null, 'Initial data successfully loaded into database');
        }, function(reason) {
            done(reason, null);
        });

    });
};

module.exports = dbData;

