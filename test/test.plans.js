/**
 * Created by nicholasjudd on 22/07/15.
 */
var assert = require("assert"),
    superagent = require('superagent'),
    expect = require('expect.js'),
    promise = require('promise'),
    db = require('../server/models/database');

describe.skip('Plans', function() {
    var server = 'http://localhost:3000';

    it('should retrieve all plans', function (done) {
        superagent
            .get(server + '/plans')
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.status).to.eql(200);
                done();
            })
    })
});