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
        db.one('SELECT * FROM cocomoscore WHERE "projectName" = $1',
            [req.params.projectName])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    update : function(req, res) {
        db.query('UPDATE cocomoscore SET "cocomoScores" = $1, "personMonths" = $2, "calculated" = $3 ' +
            'WHERE "projectName" = $4',
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

