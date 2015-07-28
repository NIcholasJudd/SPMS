/**
 * Created by nicholasjudd on 22/07/15.
 */
var assert = require("assert"),
    superagent = require('superagent'),
    expect = require('expect.js'),
    promise = require('promise'),
    db = require('../server/models/db-connect');

describe('Plans', function() {
    var server = 'http://localhost:3000';
    var numPlans = 5;

    /*
        'before hook' test setup - insert some test plans directly into the database.
     */

    before(function(done) {
        db.tx(function(t) {
            var queries = [];
            //insert plans with names 'plan 0', 'plan 1', etc...
            for(var i = 0; i < numPlans; i++) {
                queries.push(t.none('INSERT INTO plan VALUES(DEFAULT, $1, 10, 10)', "plan " + i));
            }
            queries.push(done);
            return promise.all(queries);
        }).then(function(res) {
            done();//once all queries complete (all plans added), continue with the test
        }, function(err) {
            done(err);
        });
    });

    /*
        actual test of the plan api. We are testing that:
         - no error messages are returned
         - the response header status code is 200 - OK
         - the number of plans retrieved matches the number of plans in the database
     */

    it('should retrieve all plans', function (done) {
        superagent
            .get(server + '/plan')
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                expect(res.body.length).to.eql(numPlans);//we inserted 5 plans, we should get 5 plans back
                done();
            })
    });

    /*
        tear down - remove all the plans inserted in before hook
     */

    after(function(done) {
        db.none('DELETE FROM plan')
            .then(function(res) {
                done();
            }, function(err) {
                console.error(err);
                done(err);
            });
    });
});