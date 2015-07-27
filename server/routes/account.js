/**
 * Created by nicholasjudd on 24/07/15.
 */
var promise = require('promise'),
    db = require('../models/database'),
    filterString = require('../modules/filterString');

var account = {

    create: function(req, res) {
        db.one("INSERT INTO account (accountName, planId, signUpDate, active) VALUES ($1, $2, 'today', true) returning accountId",
            [req.body.accountName, req.body.planId, true])
            .then(function (data) {
                db.one("INSERT INTO accountRole VALUES ($1, $2, 'team member') returning email",
                    [req.body.email, data.accountId])
                    .then(function (data) {
                        return res.json(data);
                    }, function (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    });
                res.json(data);
            }, function (err) {
                return res.status(500).send(err);
            })
    },
    addUser: function(req, res) {
        db.one("INSERT INTO AccountRole VALUES($1, $2, $3) returning email",
            [req.body.email, req.body.accountId, 'team member'])
            .then(function (data) {
                return res.json(data);
            }, function (err) {
                return res.status(500).send(err);
            })
    }
};

module.exports = account;