/**
 * Created by scottmackenzie on 21/07/15.
 */

var assert = require("assert"),
    superagent = require('superagent'),
    expect = require('expect.js'),
    promise = require('promise'),
    db = require('../server/models/db-connect');

describe.skip('Signup Team Members Route', function(){
    var server = 'http://localhost:3000';

    var accountHolder = {
        email : 'test@test',
        firstName : 'scott',
        lastName : 'mackenzie',
        password : 'password'
    };

    var account = {
        accountName : 'SPMS',
        signUpDate : new Date
    };

    var names = ["scott", "paul", "nick", "jim", "mary", "joe", "steve", "phil", "matilda", "barry"];

    var teamMembers = [];
    for(var i = 0; i < 10; i++) {
        teamMembers.push({
            email : names[i] + "@test",
            firstName : names[i],
            lastName : names[i],
            password : names[i]
        })
    }

    before(function(done) {
        superagent
            .post(server + '/signup/account')
            .send({
                user : accountHolder,
                account : account
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body[0].email).to.eql(accountHolder.email);
                done();
            });
    });

    it('should signup team members without error', function(done) {
        superagent
            .post(server + '/signup/teamMembers')
            .send({
                accountHolder : accountHolder.email,
                teamMembers : teamMembers
            })
            .end(function(err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body.length).to.eql(teamMembers.length);//should get all team members added
                res.body.forEach(function(email) {
                    expect(email).to.not.be(undefined);//each member of array should be an email
                })
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