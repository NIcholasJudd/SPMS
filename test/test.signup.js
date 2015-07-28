/**
 * Created by scottmackenzie on 27/07/15.
 */


var assert = require("assert"),
    superagent = require('superagent'),
    expect = require('expect.js'),
    promise = require('promise'),
    db = require('../server/models/db-connect');

describe('Signup Account Route', function(){
    var server = 'http://localhost:3000';

    var testUser = {
        email : 'test@test',
        firstName : 'scott',
        lastName : 'mackenzie',
        password : 'password'
    };

    var testAccount = {
        accountName : 'SPMS',
        signUpDate : new Date
    }

    var planId;

    /*
        before hook - insert a plan into the, so that an account can be created
     */

    before(function(done) {
        db.one('INSERT INTO plan VALUES(DEFAULT, \'plan 1\', 10, 10) returning "planId"')
            .then(function(res) {
                planId = res.planId;
                done();
            }, function(err) {
                console.error(err);
                done();
            });
    });

    /*
        test the signup api route.  We are expecting the following behaviour of the result:
         - no errors
         - response header status code 200 - OK
         - users email and account name in response
     */

    it('should signup account holder and account without error', function(done) {
        superagent
            .post(server + '/signup')
            .send({
                user : testUser,
                account : testAccount,
                planId : planId
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[0].email).to.eql(testUser.email);
                expect(res.body[1].accountName).to.eql(testAccount.accountName);
                done();
            });
    });

    /*
        test the user is in the db
     */

    it('should have an employee in the database', function(done) {
        db.one('SELECT exists(SELECT email FROM employee where email = $1)', testUser.email)
            .then(function(res) {
                expect(res.exists).to.eql(true);
                done();
            }, function(err) {
                console.error(err);
                expect(err).to.eql(null);
                done();
            });
    });

    /*
     test the account is in the db
     */

    it('should have an account in the database', function(done) {
        db.one('SELECT exists(SELECT "accountName" FROM account where "accountName" = $1)', testAccount.accountName)
            .then(function(res) {
                expect(res.exists).to.eql(true);
                done();
            }, function(err) {
                console.error(err);
                expect(err).to.eql(null);
                done();
            });
    });

    /*
        test a subscription is in db.  this is a bit lazy - instead of finding the subscription id with an embedded
        query, just checking the count is 1
     */

    it('should have a subscription in the database', function(done) {
        db.one('SELECT COUNT(*) FROM membership')
            .then(function(res) {
                expect(res.count).to.eql(1);
                done();
            }, function(err) {
                console.error(err);
                expect(err).to.eql(null);
                done();
            });
    });

    /*
        after hook - tear down db data
     */

    after(function(done) {
        db.tx(function(t) {
            var q1 = t.query('DELETE FROM membership');
            var q2 = t.query('DELETE FROM account');
            var q3 = t.query('DELETE FROM plan');
            var q4 = t.query('DELETE FROM employee');
            return promise.all([q1, q2, q3, q4, done]);
        }).then(function(res) {
            done();
        }, function(err) {
            done();
        });
    });

})