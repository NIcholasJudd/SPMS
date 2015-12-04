/**
 * Created by scottmackenzie on 16/05/2015.
 */

var promise = require('promise'),
    db = require('../models/database');

var userProject = {
    getAll: function(req, res) {
        db.query("select * from project where project_manager = $1 and active = true", [req.params.email])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            })
    }
}

module.exports = userProject;