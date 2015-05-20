/**
 * Created by scottmackenzie on 12/05/2015.
 */

var promise = require('promise'),
    db = require('../models/database');

var projectTask = {

    getAll: function(req, res) {
        db.query("SELECT * FROM task WHERE project_name = $1 AND active = true", [req.params.projectName])
            .then(function (data) {
                return res.json(data);
            }, function (err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    getOne: function(req, res) {
        db.query("SELECT * FROM task WHERE project_name = $1 AND task_number = $2",
            [req.body.projectName, req.params.taskNumber])
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
        if(!req.body.status) req.body.status = 'unassigned';
        if(!req.body.priority) req.body.priority = 'critical';
        db.one("SELECT nextval('" + sequence_name +"')")
            .then(function(data) {
                return db.one("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
                    "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, " +
                    "parent_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning task_id",
                    [data.nextval, req.params.projectName, req.body.taskName, req.body.description, req.body.startDate,
                        req.body.likelyDuration, req.body.optimisticDuration, req.body.pessimisticDuration,
                        0, req.body.status, req.body.priority, req.body.parentId, true])
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
                                    queries.push(t.one("INSERT INTO link(project_name, source, target, type) VALUES ($1, $2, $3, $4) returning link_id, source",
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

