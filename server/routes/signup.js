/**
 * Created by scottmackenzie on 20/07/15.
 */

var promise = require('promise'),
    db = require('../models/database');

var signup = {

    /*
        createAccount
        Inserts user signing up (account holder) and account row in transactional query.
        Once these 2 queries are complete, the accountId returned from q2 is used to set the account holders accountId,
        i.e. which account they are signed up to.
     */

    createAccount : function(req, res) {
        db.tx(function(t) {
            var q1 = t.one('INSERT INTO employee(email, "firstName", "lastName", password, "userType")  VALUES ' +
                '($1, $2, $3, $4, $5) returning email',
                [req.body.user.email, req.body.user.firstName, req.body.user.lastName, req.body.user.password, "administrator"]);
            var q2 = t.one('INSERT INTO account VALUES (nextval(\'"account_accountId_seq"\'), $1, $2, $3) returning "accountId"',
                [ req.body.account.accountName, req.body.user.email, req.body.account.signUpDate]);
            return promise.all([q1, q2]);
        }).then(function(data) {
            db.one('UPDATE employee SET "accountId" = $1 WHERE email = $2 returning email',
                [data.accountId, req.body.user.email])
                .then(function (data) {
                    return res.json(data);
                }, function (err) {
                    console.error(err);
                    return res.status(500).send(err);
                })
            res.json(data);
        }, function(err) {
            console.log(err);
            return res.status(500).send(err);
        });
    }
};

module.exports = signup;
