/**
 * Created by scottmackenzie on 15/05/2015.
 */


/**
 * Testing Project API
 */

var assert = require("assert"),
    superagent = require('superagent'),
    expect = require('expect.js');

describe('Project', function() {
    var server = 'http://localhost:3000';

    var token = null;
    var adminUser = {
        email: 'admin@admin',
        password: 'admin'
    }
    var testProject = {
        projectName: 'Project1',
        description: 'Description of project',
        budget: '500000',
        duration: '365 days',
        startDate: "2015-03-01",
        estimatedEndDate: "2015-03-22",
        progress: 0,
        projectManager: "admin@admin"
    };

    var testTasks = [{
        taskNumber: 1,
        taskName: 'Test task 1',
        startDate: "2015-03-03",
        likelyDuration: "14 days",
        optimisticDuration: "10 days",
        pessimisticDuration: "21 days",
        description: "Description of task 1",
        progressPercentage: 0,
        status: "unassigned",
        priority: "critical"
    }, {
        taskNumber: 2,
        taskName: 'Test task 2',
        startDate: "2015-03-03",
        likelyDuration: "14 days",
        optimisticDuration: "10 days",
        pessimisticDuration: "21 days",
        description: "Description of task 2",
        progressPercentage: 0
    }];

    var testLinks = [{
        source: 1,
        target: 2,
        type: 'finish to start'
    }]

    var testEmployees = [{
        email : 'emp1@test',
        firstName : 'don',
        lastName : 'draper',
        password : 'password',
        phone : '0123456789',
        role : 'team member',
        performanceIndex : 0,
        previousRoles : ['tester', 'developer']
    }, {
        email : 'emp2@test',
        firstName : 'peggy',
        lastName : 'olsen',
        password : 'password',
        phone : '0123456789',
        role : 'team member',
        performanceIndex : 0,
        previousRoles : ['tester', 'developer']
    }, {
        email : 'emp3@test',
        firstName : 'roger',
        lastName : 'sterling',
        password : 'password',
        phone : '0123456789',
        role : 'administrator',
        performanceIndex : 0,
        previousRoles : ['tester', 'developer']
    }];

    var testTaskRoles = [{
        email: 'emp1@test',
        roleName: 'developer'
    }, {
        email: 'emp1@test',
        roleName: 'tester'
    }, {
        email: 'emp2@test',
        roleName: 'developer'
    }, {
        email: 'emp3@test',
        roleName: 'developer'
    }
    ]

    var link_id;

    var retrievedTask = [];

    before(function (done) {
        superagent
            .post(server + '/login')
            .send({
                email: adminUser.email,
                password: adminUser.password
            })
            .end(function (err, res) {
                if (err) console.log(err);
                token = res.body.token; // Keep the token for authenticating test API calls
                done();
            });
    })

    testEmployees.forEach(function(testEmployee) {
        before(function(done) {
            superagent
                .post(server + '/api/auth/admin/user/')
                .set('X-Access-Token', token)
                .set('X-Key', 'admin@admin')
                .send({
                    email: testEmployee.email,
                    firstName : testEmployee.firstName,
                    lastName : testEmployee.lastName,
                    password: testEmployee.password,
                    phone : testEmployee.phone,
                    role : testEmployee.role,
                    performanceIndex : testEmployee.performanceIndex,
                    previousRoles : testEmployee.previousRoles
                })
                .end(function(err, res) {
                    expect(err).to.eql(null);
                    expect(res.status).to.eql(200);
                    done();
                });
        });
    })


    it('should add project without error', function (done) {
        superagent
            .post(server + '/api/auth/admin/project/')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                projectName: testProject.projectName,
                description: testProject.description,
                budget: testProject.budget,
                duration: testProject.duration,
                startDate: testProject.startDate,
                estimatedEndDate: testProject.estimatedEndDate,
                progress: testProject.progress,
                projectManager: testProject.projectManager
            })
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[0].project_name).to.eql(testProject.projectName);
                done();
            });
    });

    it('should retrieve all projects', function (done) {
        superagent
            .get(server + '/api/auth/projects/')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            })
    })

    it('should add a task to the project without error', function (done) {
        superagent
            .post(server + '/api/auth/project/' + testProject.projectName + '/task')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                taskNumber: testTasks[0].taskNumber,
                taskName: testTasks[0].taskName,
                startDate: testTasks[0].startDate,
                likelyDuration: testTasks[0].likelyDuration,
                optimisticDuration: testTasks[0].optimisticDuration,
                pessimisticDuration: testTasks[0].pessimisticDuration,
                description: testTasks[0].description,
                progressPercentage: testTasks[0].progressPercentage,
                status: testTasks[0].status,
                priority: testTasks[0].priority,
                taskRoles : [testTaskRoles[0], testTaskRoles[2]]
            })
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                testLinks[0].source = res.body[0].task_id;
                done();
            });
    });

    it('should add a task to the project that depends on first task without error', function (done) {
        superagent
            .post(server + '/api/auth/project/' + testProject.projectName + '/task')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                taskNumber: testTasks[1].taskNumber,
                taskName: testTasks[1].taskName,
                startDate: testTasks[1].startDate,
                likelyDuration: testTasks[1].likelyDuration,
                optimisticDuration: testTasks[1].optimisticDuration,
                pessimisticDuration: testTasks[1].pessimisticDuration,
                description: testTasks[1].description,
                progressPercentage: testTasks[1].progressPercentage,
                taskRoles : testTaskRoles,
                links : testLinks
            })
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[5].source).to.eql(testLinks[0].source);
                link_id = res.body[5].link_id;
                done();
            });
    });

    it('should retrieve all tasks associated with a project', function (done) {
        superagent
            .get(server + '/api/auth/project/' + testProject.projectName + '/tasks')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                //console.log(res.body);
                var counter = 0;
                res.body.forEach(function (task) {
                    //console.log(task);
                    retrievedTask.push({taskNumber: task.task_number, taskId: task.task_id});
                    testTasks[counter].taskId = task.task_id;
                    counter++;
                })
                //console.log(retrievedTask);
                done();
            })
    })

    it('should retrieve a task associated with a project by task number ', function (done) {
        superagent
            .get(server + '/api/auth/project/' + testProject.projectName + '/task/' + retrievedTask[0].taskNumber)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                //console.log(res.body.rows);
                done();
            })
    });

    it('should retrieve all tasks associated with a user', function (done) {
        superagent
            .get(server + '/api/auth/user/' + adminUser.email + '/tasks/')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                //console.log(res.body);
                done();
            })
    });

    /*it('should add a link to the project without error', function (done) {
        superagent
            .post(server + '/api/auth/admin/project/' + testProject.projectName + '/link')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                source: testTasks[0].taskId,
                target: testTasks[1].taskId,
                type: testLinks[0].type
            })
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                //console.log("LINK", res);
                done();
            });
    });*/

    /*it('should retrieve a link associated with a project by source task id', function (done) {
        //console.log('here: ', retrievedTask[0].taskId);
        superagent
            .get(server + '/api/auth/admin/project/' + testProject.projectName + '/link/' + testTasks[0].taskId)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                //console.log(res.body);
                done();
            })
    });*/

    it('should delete a link from project by link id without error', function (done) {
        superagent
            .del(server + '/api/auth/project/' + testProject.projectName + '/link/' + link_id)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                //console.log(res.body);
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                //expect(res.body.rowCount).to.eql(1);
                done();
            });
    });

    it('should delete a task from project by task number without error', function (done) {
        superagent
            .del(server + '/api/auth/project/' + testProject.projectName + '/task/' + retrievedTask[0].taskNumber)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                //console.log(res.body);
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                //expect(res.body.rowCount).to.eql(1);
                done();
            });
    });

    it('should delete the other test task from project - change this to delete tasks when project deleted', function (done) {
        superagent
            .del(server + '/api/auth/project/' + testProject.projectName + '/task/' + retrievedTask[1].taskNumber)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                //console.log(res.body);
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                //expect(res.body.rowCount).to.eql(1);
                done();
            });
    });

    it('should delete project without error', function (done) {
        superagent
            .del(server + '/api/auth/admin/project/')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .send({
                projectName: testProject.projectName
            })
            .end(function (err, res) {
                //console.log(res.body);
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[1].project_name).to.eql(testProject.projectName);
                done();
            });
    });

    testEmployees.forEach(function(testEmployee) {
        after(function(done) {
            //console.log('TOKEN', token);
            superagent
                .del(server + '/api/auth/admin/user/' + adminUser.email)
                .set('X-Access-Token', token)
                .set('X-Key', 'admin@admin')
                .set('Accept', 'application/json')
                .send({
                    email: testEmployee.email
                })
                .end(function(err, res) {
                    expect(err).to.eql(null);
                    expect(res.status).to.eql(200);
                    done();
                });
        });
    })


});