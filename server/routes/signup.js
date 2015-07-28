/**
 * Created by scottmackenzie on 20/07/15.
 */

var promise = require('promise'),
    db = require('../models/db-connect'),
    users = require('./users.js')
    bcrypt = require('bcrypt');

var signup = {

    /*
        create

         hash password, then create user, create account, add accountHolder membership asynchronously
     */


    create : function(req, res) {

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.user.password, salt, function (err, hash) {
                if (err) {
                    console.log("Error: ", err);
                    return res.status(500).send(err);
                }
                else {
                    db.tx(function (t) {
                        var q1 = t.one('INSERT INTO employee(email, "firstName", "lastName", password, active)  VALUES ' +
                            '($1, $2, $3, $4, true) returning email',
                            [
                                req.body.user.email,
                                req.body.user.firstName,
                                req.body.user.lastName,
                                hash
                            ]);
                        var q2 = t.one('INSERT INTO account VALUES (DEFAULT, $1, $2, $3, true) returning "accountName"',
                            [
                                req.body.account.accountName,
                                req.body.planId,
                                req.body.account.signUpDate
                            ]);
                        var q3 = t.none('INSERT INTO membership VALUES ($1, ' +
                            '(SELECT "accountId" FROM account WHERE "accountName" = $2), ' +
                            '$3)',
                            [
                                req.body.user.email,
                                req.body.account.accountName,
                                "account holder"
                            ])
                        return promise.all([q1, q2, q3]);
                    }).then(function (data) {
                        res.json(data);
                    }, function (err) {
                        console.log("Error in /signup route: ", err);
                        return res.status(500).send(err);
                    });
                }
            })
        })
    },

    /*
        createTeamMembers
        gets the accountId according to accountHolder details, then adds all the team members in a transactional
        update.
        At this stage, the team members are 'all or nothing' - if we want to succeed on some and fail on others,
        we need to define the appropriate behaviour on fail (return status, etc)
        TODO: passwords need to be hashed
     */

    createTeamMembers : function(req, res) {
        db.one('SELECT "accountId" FROM account WHERE "accountHolder" = $1',
        [req.body.accountHolder])
            .then(function(data) {
                db.tx(function(t) {
                    var queries = [];
                    req.body.teamMembers.forEach(function(teamMember) {
                        queries.push(t.one('INSERT INTO employee(email, "firstName", "lastName", password, "userType", "accountId") ' +
                            'VALUES ($1, $2, $3, $4, $5, $6) returning email',
                            [
                                teamMember.email,
                                teamMember.firstName,
                                teamMember.lastName,
                                teamMember.password, //needs to be hashed
                                "team member",
                                data.accountId
                            ]));
                    });
                    return promise.all(queries);
                })
                    .then(function(data) {
                        res.json(data);
                    }, function(err) {
                        console.log(err);
                        return res.status(500).send(err);
                    });


            }, function (err) {
            console.error(err);
            return res.status(500).send(err);
            }
        );
    }
};

module.exports = signup;
