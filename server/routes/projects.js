var promise = require('promise'),
    db = require('../models/database'),
    filterString = require('../modules/filterString');


var projects = {

    getAll: function(req, res) {
        var filter = filterString.create(req);
        db.query('SELECT ' + filter + ' FROM project WHERE active = true')
            .then(function (data) {
                return res.json(data);
            }, function (err) {
                console.log(err);
                return res.status(500).send(err);
            })
    },

    getOne: function(req, res) {
        db.one('SELECT * FROM project WHERE "projectName" = $1', [req.params.projectName])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    getArchivedProjects : function(req, res) {
        db.query("SELECT * FROM project where active = false")
            .then(function (data) {
                return res.json(data);
            }, function (err) {
                console.log(err);
                return res.status(500).send(err);
            })
    },

    create: function(req, res) {
        db.tx(function(t) {
            var sequence_name = req.body.projectName;
            sequence_name = (sequence_name.replace(/\s/g, '')) + '_seq';

            var q1 = t.one("INSERT INTO project VALUES($1, $2, $3, $4, $5, $6, $7) returning 'projectName'",
                [req.body.projectName, req.body.description, req.body.budget,
                    req.body.startDate, req.body.estimatedEndDate, true, req.body.projectManager]);
            var q2 = t.none("CREATE SEQUENCE " + sequence_name + " START 1");
            var q3 = t.none("INSERT INTO functionPoint VALUES($1, null, null, null, false)", [req.body.projectName]);
            var q4 = t.none("INSERT INTO cocomoScore VALUES($1, null, null, false)", [req.body.projectName]);

            return promise.all([q1, q2, q3, q4]);
        }).then(function(data) {
            res.json(data);
        }, function(err) {
            console.error(err);
            return res.status(500).send(err);
        });
    },

    /* update, every field except for primary key must be updated */

    update: function(req, res) {
        db.one("UPDATE project SET description=($2), budget=($3), " +
            "startDate=($4), estimatedEndDate=($5), projectManager=($6) WHERE projectName = $1 returning projectName",
            [req.params.projectName, req.body.description, req.body.budget,
                req.body.startDate, req.body.estimatedEndDate, req.body.projectManager])
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
    },

    archive: function(req, res) {
        db.tx(function(t) {
            var q1 = t.query("UPDATE project SET active = $1, archive_reason = $2 WHERE project_name = $3 returning project_name",
                [req.body.active, req.body.reason, req.params.projectName]);
            var q2 = t.query("UPDATE task SET active = $1 WHERE project_name = $2 returning project_name",
                [req.body.active, req.params.projectName]);
            var q3 = t.query("UPDATE task_role set active = $1 WHERE task_id IN " +
            "(select task_id from task where project_name = $2);", [req.body.active, req.params.projectName]);
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

/*var archiveProject = {
    put: function(req, res) {
        db.tx(function(t) {
            var q1 = t.query("UPDATE project SET active = $1 WHERE project_name = $2 returning project_name",
                [req.body.active, req.params.projectName]);
            var q2 = t.query("UPDATE task SET active = $1 WHERE project_name = $2 returning project_name",
                [req.body.active, req.params.projectName]);
            return promise.all([q1, q2]);
        }).then(function(data) {
            res.json(data);
        }, function(err) {
            console.log(err);
            return res.status(500).send(err);
        });
    }
};

module.exports = archiveProject;*/