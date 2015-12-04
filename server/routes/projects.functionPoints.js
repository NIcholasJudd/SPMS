/**
 * Created by scottmackenzie on 25/05/2015.
 */

var promise = require('promise'),
    db = require('../models/database');

var projectFunctionPoints = {

    getOne: function(req, res) {
        db.one('SELECT * FROM functionpoint WHERE "projectName" = $1',
            [req.params.projectName])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    update : function(req, res) {
    db.query('UPDATE functionpoint SET "adjustedFunctionPointCount" = $1, "adjustmentFactor" = $2, calculated = $3, "functionCounts" = $4 ' +
        'WHERE "projectName" = $5',
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

