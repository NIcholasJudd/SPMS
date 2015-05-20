/**
 * Created by scottmackenzie on 14/05/2015.
 */

var promise = require('promise'),
    db = require('../models/database');

var userTask = {
    getAll: function(req, res) {
        db.query("select * from task where task_id IN (select task_id from task_role where email = $1) AND active = true",
            [req.params.email])
            .then(function(data) {
                //console.log(data);
                return res.json(data);
            }, function(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            })
    },


    archive: function(req, res) {
    db.tx(function(t) {
        var q1 = t.query("UPDATE task SET active = $1 WHERE task_id = $2",
            [req.body.active, req.params.projectName]);
        var q2 = t.query("UPDATE task_role set active = $1 WHERE task_id IN " +
        "(select task_id from task where project_name = $2);", [req.body.active, req.params.projectName]);
        return promise.all([q1, q2]);
    }).then(function(data) {
        res.json(data);
    }, function(err) {
        console.log(err);
        return res.status(500).send(err);
    });
}
}

module.exports = userTask;
