/**
 * Created by nicholasjudd on 19/11/2015.
 */
var promise = require('promise'),
    db = require('../models/database'),
    filterString = require('../modules/filterString');
var plans = {
    getAll: function(req, res) {
        var filter = filterString.create(req);
        db.query('SELECT ' + filter + ' FROM plans')
            .then(function (data) {
                return res.json(data);
            }, function (err) {
                console.error(err);
                return res.status(500).send(err);
            })
    }
};

module.exports = plans;