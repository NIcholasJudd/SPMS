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
        password : 'root'//'admin'
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
                expect(res.body.email).to.eql(testUser.email);
                done();
            });
    });

    it('should retrieve the employee without error', function(done) {
        superagent
            .get(server + '/api/auth/user/' + testUser.email)
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                email: testUser.email
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body.email).to.eql(testUser.email);
                done();
            });
    })

    it('should archive an employee without error', function(done) {
        superagent
            .put(server + '/api/auth/admin/user/' + testUser.email + '/archive')
            .set('X-Access-Token', token)
            .set('X-Key', 'admin@admin')
            .send({
                active : true
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body.email).to.eql(testUser.email);
                expect(res.body.active).to.eql(true);
                done();
            });
    })

    it('should retrieve all employees without error', function(done) {
        superagent
            .get(server + '/api/auth/users/')
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


