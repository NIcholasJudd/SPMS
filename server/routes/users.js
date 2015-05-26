var promise = require('promise'),
    db = require('../models/database'),
    bcrypt = require('bcrypt');

var users = {

  getAll: function(req, res) {
      db.query("SELECT * FROM employee")
          .then(function (data) {
              return res.json(data);
          }, function (err) {
              console.error(err);
              return res.status(500).send(err);
          })
    },

    getOne: function(req, res) {
        db.one("SELECT * FROM employee WHERE email = $1", [req.body.email])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    create: function(req, res) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                if (err)
                    return res.status(500).send(err);
                db.one("INSERT INTO employee VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning email", [req.body.email, req.body.firstName,
                    req.body.lastName, hash, req.body.phone, req.body.role, req.body.performanceIndex,
                    req.body.previousRoles, true])
                    .then(function (data) {
                        return res.json(data);
                    }, function (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    })
            })
        })

    },

    /* update, every field except for primary key must be updated */

    update: function(req, res) {
        db.none("UPDATE employee SET first_name=($2), last_name=($3), " +
            "phone=($4), user_type=($5), performance_index=($6), previous_roles=($7) WHERE email=$1",
            [req.body.email, req.body.firstName, req.body.lastName, req.body.phone, req.body.role,
                req.body.performanceIndex, req.body.previousRoles])
            .then(function (data) {
                return res.json(data);
            }, function (err) {
                console.error(err.stack);
                return res.status(500).send(err);
            })
    },

    delete: function(req, res) {
        db.tx(function(t) {
            var q1 = t.query("DELETE FROM task_role WHERE email = $1", [req.body.email]);
            var q2 = t.query("DELETE FROM skill WHERE email = $1", [req.body.email]);
            var q3 = t.one("DELETE FROM employee WHERE email = $1 returning email", [req.body.email]);
            return promise.all([q1, q2, q3]);
        }).then(function(data) {
            res.json(data);
        }, function(err) {
            console.log(err);
            return res.status(500).send(err);
        });
    },

    archive: function(req, res) {
        db.one("update employee set active = $1 where email = $2 returning email, active", [req.body.active, req.params.email])
            .then(function(data) {
                res.json(data);
            }, function(err) {
                console.log(err);
                return res.status(500).send(err);
            });
    },

    updatePassword: function(req, res) {
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
                if (err)
                    return res.status(500).send(err);
                db.one('update employee set password = ($2) where email = ($1) returning email', [req.params.email, hash])
                    .then(function (data) {
                        res.json(data);
                    }, function (err) {
                        console.log(err);
                        return res.status(500).send(err);
                    });
            })
        })
    }
};

module.exports = users;
