/**
 * Created by scottmackenzie on 6/05/15.
 */

var assert = require("assert"),
    superagent = require('superagent'),
    expect = require('expect.js');

describe('Employee', function(){
    var server = 'http://localhost:3000';

    var token = null;
    var adminUser = {
        email : 'admin@admin',
        password : 'admin'
    }
    var testUser = {
        email : 'test@test',
        firstName : 'scott',
        lastName : 'mackenzie',
        password : 'password',
        phone : '0123456789',
        role : 'administrator',
        performanceIndex : 0,
        previousRoles : ['tester', 'developer']
    };
    var updateFieldArray1 = ['lastname'],
        updateValueArray1 = ['beavis'];

    before(function(done) {
        superagent
            .post(server + '/login')
            .send({
                email : adminUser.email,
                password : adminUser.password
            })
            .end(function(err, res) {
                if(err) console.log(err);
                token = res.body.token; // Keep the token for authenticating test API calls
                //console.log('res: ', res);//console.log('email/username: ',res.body.user.email);
                done();
            });
    })

    it('should add employee without error', function(done) {
        superagent
            .post(server + '/api/auth/admin/user/')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                email: testUser.email,
                firstName : testUser.firstName,
                lastName : testUser.lastName,
                password: testUser.password,
                phone : testUser.phone,
                role : testUser.role,
                performanceIndex : testUser.performanceIndex,
                previousRoles : testUser.previousRoles
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            });
    });

    it('should retrieve the employee without error', function(done) {
        superagent
            .get(server + '/api/auth/admin/user/' + testUser.email)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                email: testUser.email
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[0].email).to.eql(testUser.email);
                done();
            });
    })

    it('should retrieve all employees without error', function(done) {
        superagent
            .get(server + '/api/auth/admin/users/')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                email: testUser.email
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            });
    })

    it('should update employee without error', function(done) {
        superagent
            .put(server + '/api/auth/admin/user/' + testUser.email)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                email: testUser.email,
                firstName : 'newfirstname',
                lastName : 'newlastname',
                password : testUser.password,
                phone : '0987654321',
                role : testUser.role,
                performanceIndex : 30,
                previousRoles : ['tester', 'documenter']
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            });
    });


    it('should delete employee without error', function(done) {
        //console.log('TOKEN', token);
        superagent
            .del(server + '/api/auth/admin/user/' + testUser.email)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .send({
                email: testUser.email
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            });
    });



})

/**
 * Testing Project API
 */

describe('Project', function(){
    var server = 'http://localhost:3000';

    var token = null;
    var adminUser = {
        email : 'admin@admin',
        password : 'admin'
    }
    var testProject = {
        projectName : 'Project1',
        description : 'Description of project',
        budget : '500000',
        duration : '365 days',
        startDate : "2015-03-01",
        estimatedEndDate : "2015-03-22",
        progress : 0,
        projectManager : "admin@admin"
    };

    var testTasks = [{
        taskNumber : 1,
        taskName : 'Test task 1',
        startDate : "2015-03-03",
        likelyDuration : "14 days",
        optimisticDuration : "10 days",
        pessimisticDuration : "21 days",
        description : "Description of task 1",
        progressPercentage : 0,
        status : "unassigned",
        priority : "critical"
    }, {
        taskNumber : 2,
        taskName : 'Test task 2',
        startDate : "2015-03-03",
        likelyDuration : "14 days",
        optimisticDuration : "10 days",
        pessimisticDuration : "21 days",
        description : "Description of task 2",
        progressPercentage : 0
    }];

    var retrievedTaskNumbers = [];

    before(function(done) {
        superagent
            .post(server + '/login')
            .send({
                email : adminUser.email,
                password : adminUser.password
            })
            .end(function(err, res) {
                if(err) console.log(err);
                token = res.body.token; // Keep the token for authenticating test API calls
                done();
            });
    })

    it('should add project without error', function(done) {
        superagent
            .post(server + '/api/auth/admin/project/')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                projectName : testProject.projectName,
                description : testProject.description,
                budget : testProject.budget,
                duration : testProject.duration,
                startDate : testProject.startDate,
                estimatedEndDate : testProject.estimatedEndDate,
                progress : testProject.progress,
                projectManager : testProject.projectManager
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            });
    });

    it('should add a task to the project without error', function(done) {
        superagent
            .post(server + '/api/auth/admin/task/' + testProject.projectName)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                taskNumber : testTasks[0].taskNumber,
                taskName : testTasks[0].taskName,
                startDate : testTasks[0].startDate,
                likelyDuration : testTasks[0].likelyDuration,
                optimisticDuration : testTasks[0].optimisticDuration,
                pessimisticDuration : testTasks[0].pessimisticDuration,
                description : testTasks[0].description,
                progressPercentage : testTasks[0].progressPercentage,
                status : testTasks[0].status,
                priority : testTasks[0].priority
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            });
    });

    it('should add a task to the project that does not specify status and priority without error', function(done) {
        superagent
            .post(server + '/api/auth/admin/task/' + testProject.projectName)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                taskNumber : testTasks[1].taskNumber,
                taskName : testTasks[1].taskName,
                startDate : testTasks[1].startDate,
                likelyDuration : testTasks[1].likelyDuration,
                optimisticDuration : testTasks[1].optimisticDuration,
                pessimisticDuration : testTasks[1].pessimisticDuration,
                description : testTasks[1].description,
                progressPercentage : testTasks[1].progressPercentage
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            });
    });

    it('should retrieve all tasks associated with a project', function(done) {
        superagent
            .get(server + '/api/auth/admin/project/' + testProject.projectName + '/tasks')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                //console.log(res.body);
                res.body.forEach(function(task) {
                    retrievedTaskNumbers.push(task.task_number);
                })
                //console.log(retrievedTaskNumbers);
                done();
            })
    })

    it('should retrieve a task associated with a project by task number ', function(done) {
        superagent
            .get(server + '/api/auth/admin/project/' + testProject.projectName + '/task/' + retrievedTaskNumbers[0])
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                //console.log(res.body.rows);
                done();
            })
    })

    it('should delete a task from project by task number without error', function(done) {
        superagent
            .del(server + '/api/auth/admin/project/' + testProject.projectName + '/task/' + retrievedTaskNumbers[0])
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                //console.log(res.body);
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body.rowCount).to.eql(1);
                done();
            });
    });

    it('should delete the other test task from project - change this to delete tasks when project deleted', function(done) {
        superagent
            .del(server + '/api/auth/admin/project/' + testProject.projectName + '/task/' + retrievedTaskNumbers[1])
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .end(function(err, res) {
                //console.log(res.body);
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body.rowCount).to.eql(1);
                done();
            });
    });

    /*it('should delete project without error', function(done) {
        superagent
            .del(server + '/api/auth/admin/project/')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .set('Accept', 'application/json')
            .send({
                projectName: testProject.projectName
            })
            .end(function(err, res) {
                //console.log(res.body);
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body.rowCount).to.eql(1);
                done();
            });
    });*/

    /*it('should retrieve the employee without error', function(done) {
        superagent
            .get(server + '/api/auth/admin/user/' + testUser.email)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                email: testUser.email
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[0].email).to.eql(testUser.email);
                done();
            });
    })

    it('should retrieve all employees without error', function(done) {
        superagent
            .get(server + '/api/auth/admin/users/')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                email: testUser.email
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            });
    })

    it('should update employee without error', function(done) {
        superagent
            .put(server + '/api/auth/admin/user/' + testUser.email)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                email: testUser.email,
                firstname : 'newfirstname',
                lastname : 'newlastname',
                password : testUser.password,
                phone : '0987654321',
                role : testUser.role,
                performanceIndex : 30,
                previousRoles : ['tester', 'documenter']
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            });
    });

*/




})