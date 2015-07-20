/**
 * Created by scottmackenzie on 20/07/15.
 */

var assert = require("assert"),
    superagent = require('superagent'),
    expect = require('expect.js'),
    promise = require('promise'),
    db = require('../server/models/database');

describe('Signup Route', function(){
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

    it('should signup account holder and account without error', function(done) {
        superagent
            .post(server + '/signup/account')
            .send({
                user : testUser,
                account : testAccount
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[0].email).to.eql(testUser.email);
                done();
            });
    });

    after(function(done) {
        db.tx(function(t) {
            var q1 = t.query('DELETE FROM account');
            var q2 = t.query('DELETE FROM employee');
            return promise.all([q1, q2, done]);
        }).then(function(res) {
            done();
        }, function(err) {
            done();
        });
    });

})