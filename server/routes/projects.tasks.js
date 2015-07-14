/**
 * Created by scottmackenzie on 12/05/2015.
 */

var promise = require('promise'),
    db = require('../models/database'),
    filterString = require('../modules/filterString');

var projectTask = {

    getAll: function(req, res) {
        console.log(req.query.fields);
        var filter = filterString.create(req);
        db.query('SELECT ' + filter + ' FROM task WHERE "projectName" = $1 AND active = true', [req.params.projectName])
            .then(function (data) {
                //If fields provided in query, only return selected fields
                //data = myFilter.runFilter(req, data);

                return res.json(data);
            }, function (err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    getTaskNamesAndNumbers : function(req, res) {
        db.query('SELECT "taskId", "taskName" FROM task WHERE "projectName" = $1 AND active = true', [req.params.projectName])
            .then(function (data) {
                return res.json(data);
            }, function (err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    getOne: function(req, res) {
        db.query('SELECT * FROM task WHERE "projectName" = $1 AND "taskNumber" = $2',
            [req.params.projectName, req.params.taskNumber])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    create: function(req, res) {
        /* get sequence name - coding convention has that spaces in name removed, then '_seq' appended */
        var sequence_name = req.params.projectName;
        sequence_name = (sequence_name.replace(/\s/g, '')) + '_seq';
        console.log('sequence name: ', sequence_name);
        if(!req.body.status) req.body.status = 'unassigned';
        if(!req.body.priority) req.body.priority = 'critical';
        db.one("SELECT nextval('" + sequence_name +"')")
            .then(function(data) {
                return db.one("INSERT INTO task VALUES (nextval('task_task_id_seq'), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning task_id",
                    [data.nextval, req.params.projectName, req.body.taskName, req.body.description, req.body.startDate,
                        req.body.likelyDuration, req.body.optimisticDuration, req.body.pessimisticDuration, req.body.comfortZone,
                        0, req.body.status, req.body.priority, true])
                    .then(function(data) {
                        return db.tx(function(t) {
                            console.log('task_id: ', data.task_id);
                            /* insert task */
                            var queries = [];
                            console.log('taskRoles:, ', req.body.taskRoles);
                            /* add users assigned to task */
                            if (req.body.taskRoles) {
                                req.body.taskRoles.forEach(function (taskRole) {
                                    queries.push(t.one("INSERT INTO task_role VALUES($1, $2, $3, $4) returning task_id", [taskRole.email, data.task_id, taskRole.roleName, true]));
                                })
                            }
                            /* add every dependency link */
                            if (req.body.links) {
                                req.body.links.forEach(function (link) {
                                    queries.push(t.one("INSERT INTO link VALUES (nextval('link_link_id_seq'), $1, $2, $3, $4) returning link_id, source",
                                        [req.params.projectName, link.source, data.task_id, link.type]));
                                })
                            }
                            return promise.all(queries);
                        })
                    }).then(function(data) {
                        res.json(data);
                    }, function(err) {
                        console.error(err);
                        return res.status(500).send(err);
                    });

            })
            .then(function(data) {
                res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            });
    },

    delete: function(req, res) {
        db.one("DELETE FROM task WHERE project_name = $1 AND task_number = $2 returning task_number",
            [req.params.projectName, req.params.taskNumber])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.log(err);
                return res.status(500).send(err);
            })
    }
};

module.exports = projectTask;

