/**
 * Created by scottmackenzie on 25/05/2015.
 */

/**
 * Created by scottmackenzie on 25/05/2015.
 */

var promise = require('promise'),
    db = require('../models/database');

var cocomoScores = {

    getOne: function(req, res) {
        db.one("SELECT * FROM cocomo_score WHERE project_name = $1",
            [req.params.projectName])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    update : function(req, res) {
        db.query("UPDATE cocomo_score SET cocomo_scores = $1, person_months = $2, calculated = $3 " +
            "WHERE project_name = $4",
            [req.body.cocomoScores, req.body.personMonths, req.body.calculated, req.params.projectName])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    }


};

module.exports = cocomoScores;

