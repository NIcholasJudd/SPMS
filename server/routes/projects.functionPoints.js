/**
 * Created by scottmackenzie on 25/05/2015.
 */

var promise = require('promise'),
    db = require('../models/database');

var projectFunctionPoints = {

    getOne: function(req, res) {
        db.one("SELECT * FROM function_point WHERE project_name = $1",
            [req.params.projectName])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    update : function(req, res) {
    db.query("UPDATE function_point SET adjusted_function_point_count = $1, adjustment_factor = $2, calculated = $3, function_counts = $4 " +
        "WHERE project_name = $5",
        [req.body.adjustedFP, req.body.valueArray, req.body.calculated, req.body.functionCounts, req.params.projectName])
        .then(function(data) {
            return res.json(data);
        }, function(err) {
            console.error(err);
            return res.status(500).send(err);
        })
    }


};

module.exports = projectFunctionPoints;

