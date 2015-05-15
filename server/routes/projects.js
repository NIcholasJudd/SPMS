var promise = require('promise'),
    db = require('../models/database');


var projects = {

    getAll: function(req, res) {
        db.query("SELECT * FROM project")
            .then(function (data) {
                return res.json(data);
            }, function (err) {
                console.log(err);
                return res.status(500).send(err);
            })
    },

    getOne: function(req, res) {
        db.one("SELECT * FROM project WHERE project_name = $1", [req.body.projectName])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    create: function(req, res) {
        db.tx(function(t) {
            var sequence_name = req.body.projectName;
            sequence_name = (sequence_name.replace(/\s/g, '')) + '_seq';

            var q1 = t.one("INSERT INTO project VALUES($1, $2, $3, $4, $5, $6, $7, $8) returning project_name",
                [req.body.projectName, req.body.description, req.body.budget, req.body.duration,
                    req.body.startDate, req.body.estimatedEndDate, req.body.progress, req.body.projectManager]);
            var q2 = t.none("CREATE SEQUENCE " + sequence_name + " START 1");

            return promise.all([q1, q2]);
        }).then(function(data) {
            res.json(data);
        }, function(err) {
            console.error(err);
            return res.status(500).send(err);
        });
    },

    /* update, every field except for primary key must be updated */

    update: function(req, res) {
        db.none("UPDATE project SET description=($2), budget=($3), duration=($4), " +
            "start_date=($5), estimated_end_date=($6), progress=($7), project_manager=($8) WHERE project_name = $1",
            [req.body.projectName, req.body.description, req.body.budget, req.body.duration,
                req.body.startDate, req.body.estimatedEndDate, req.body.progress, req.body.projectManager])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            })
    },

    delete: function(req, res) {
        db.tx(function(t) {
            var sequence_name = req.body.projectName;
            sequence_name = (sequence_name.replace(/\s/g, '')) + '_seq';
            var q1 = t.query("DROP SEQUENCE IF EXISTS " + sequence_name);
            var q2 = t.one("DELETE FROM project WHERE project_name = $1 returning project_name", [req.body.projectName]);
            return promise.all([q1, q2]);
        }).then(function(data) {
            res.json(data);
        }, function(err) {
            console.log(err);
            return res.status(500).send(err);
        });
    }
};

module.exports = projects;

