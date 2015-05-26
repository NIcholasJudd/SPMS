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
        password: 'root'
    }
    var testProject = {
        projectName: 'Project1',
        description: 'Description of project',
        budget: '500000',
        startDate: "2015-03-01",
        estimatedEndDate: "2015-03-22",
        projectManager: "admin@admin"
    };

    var testTasks = [{
        taskNumber: 1,
        taskName: 'Test task 1',
        startDate: "2015-03-03",
        likelyDuration: "14 days",
        optimisticDuration: "10 days",
        pessimisticDuration: "21 days",
        comfortZone : "5 days",
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
        comfortZone : "5 days",
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
                startDate: testProject.startDate,
                estimatedEndDate: testProject.estimatedEndDate,
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
                comfortZone : testTasks[0].comfortZone,
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

    it('should archive a task', function(done) {
        superagent
            .put(server + '/api/auth/task/' + testLinks[0].source + '/archive')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                active : false
            })
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[0].active).to.eql(false);
                done();
            });
    });

    it('should restore a task', function(done) {
        superagent
            .put(server + '/api/auth/task/' + testLinks[0].source + '/archive')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                active : true
            })
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[0].active).to.eql(true);
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
                comfortZone : testTasks[1].comfortZone,
                description: testTasks[1].description,
                progressPercentage: testTasks[1].progressPercentage,
                taskRoles : testTaskRoles,
                links : testLinks
            })
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[4].source).to.eql(testLinks[0].source);
                link_id = res.body[4].link_id;
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
                var counter = 0;
                res.body.forEach(function (task) {
                    retrievedTask.push({taskNumber: task.task_number, taskId: task.task_id});
                    testTasks[counter].taskId = task.task_id;
                    counter++;
                })
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
                done();
            })
    });

    it('should update progress of a task without error', function(done) {
        superagent
            .put(server + '/api/auth/task/' + retrievedTask[0].taskId + '/progress')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .send({progressPercentage : 0.7})
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body.progress_percentage).to.eql(0.7);
                done();
            })
    });

    it('should add a comment to a task without error', function(done) {
        superagent
            .post(server + '/api/auth/task/' + retrievedTask[0].taskId + '/comment')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .send({
                commentText : 'This is a comment',
                commentDate : '2015-05-22',
                email : 'admin@admin'
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            })
    });

    it('should retrieve comments associated with a task without error', function(done) {
        superagent
            .get(server + '/api/auth/task/' + retrievedTask[0].taskId + '/comments')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[0].comment_text).to.eql('This is a comment');
                done();
            })
    });

    it('should update status of a task without error', function(done) {
        superagent
            .put(server + '/api/auth/task/' + retrievedTask[0].taskId + '/status')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .send({status : 'complete'})
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body.status).to.eql('complete');
                done();
            })
    })

    it('should retrieve all tasks associated with a user', function (done) {
        superagent
            .get(server + '/api/auth/user/' + adminUser.email + '/tasks/')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            })
    });

    it('should retrieve all users assigned to a task', function(done) {
        superagent
            .get(server + '/api/auth/task/' + testTasks[0].taskId + '/users')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            })
    })



    it('should delete a link from project by link id without error', function (done) {
        superagent
            .del(server + '/api/auth/project/' + testProject.projectName + '/link/' + link_id)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
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
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                //expect(res.body.rowCount).to.eql(1);
                done();
            });
    });

    it('should delete the other test task from project', function (done) {
        superagent
            .del(server + '/api/auth/project/' + testProject.projectName + '/task/' + retrievedTask[1].taskNumber)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function (err, res) {
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
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[1].project_name).to.eql(testProject.projectName);
                done();
            });
    });

    testEmployees.forEach(function(testEmployee) {
        after(function(done) {
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