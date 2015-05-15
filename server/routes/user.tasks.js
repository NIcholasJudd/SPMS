/**
 * Created by scottmackenzie on 14/05/2015.
 */

var promise = require('promise'),
    db = require('../models/database');

var userTask = {
    getAll: function(req, res) {
        db.query("select * from task where task_id IN (select task_id from task_role where email = $1);", [req.params.email])
            .then(function(data) {
                //console.log(data);
                return res.json(data);
            }, function(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            })
    }
}

module.exports = userTask;

