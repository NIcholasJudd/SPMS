/**
 * Created by nicholasjudd on 20/07/15.
 */
var promise = require('promise'),
    db = require('../models/database'),
    filterString = require('../modules/filterString');

var plan = {
    getAll: function(req, res) {
        var filter = filterString.create(req);
        db.query('SELECT * FROM plan;')
            .then(function (data) {
                return res.json(data);
            }, function (err) {
                console.log(err);
                return res.status(500).send(err);
            })
    }
};

module.exports = plan;